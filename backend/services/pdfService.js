// services/pdfService.js
// PDF generation service for prescriptions
// Note: This is a basic implementation. For production, use a proper PDF library like pdfkit or puppeteer

const fs = require('fs');
const path = require('path');

/**
 * Generate prescription PDF
 * @param {Object} prescription - Prescription object with patient, doctor, and medications
 * @returns {Promise<string>} - URL/path to generated PDF
 */
async function generatePrescriptionPDF(prescription) {
  try {
    // Parse medications
    const medications = typeof prescription.medications === 'string' 
      ? JSON.parse(prescription.medications) 
      : prescription.medications;

    // Create PDF content (HTML format - can be converted to PDF using puppeteer or similar)
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Prescription - ${prescription.patient.firstName} ${prescription.patient.lastName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #004aad;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #004aad;
      margin: 0;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-label {
      font-weight: bold;
      color: #666;
    }
    .medications-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .medications-table th,
    .medications-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    .medications-table th {
      background-color: #004aad;
      color: white;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #004aad;
      text-align: center;
    }
    .signature {
      margin-top: 40px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>HOPE PHYSICIANS</h1>
    <p>Medical Prescription</p>
  </div>

  <div class="info-section">
    <div class="info-row">
      <span class="info-label">Patient Name:</span>
      <span>${prescription.patient.firstName} ${prescription.patient.lastName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Date of Birth:</span>
      <span>${prescription.patient.dateOfBirth ? new Date(prescription.patient.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Prescription Date:</span>
      <span>${new Date(prescription.issuedDate).toLocaleDateString()}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Doctor:</span>
      <span>Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Specialization:</span>
      <span>${prescription.doctor.specialization}</span>
    </div>
    ${prescription.doctor.licenseNumber ? `
    <div class="info-row">
      <span class="info-label">License Number:</span>
      <span>${prescription.doctor.licenseNumber}</span>
    </div>
    ` : ''}
  </div>

  ${prescription.diagnosis ? `
  <div class="info-section">
    <h3>Diagnosis:</h3>
    <p>${prescription.diagnosis}</p>
  </div>
  ` : ''}

  <div class="info-section">
    <h3>Medications:</h3>
    <table class="medications-table">
      <thead>
        <tr>
          <th>Medication</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
          <th>Instructions</th>
        </tr>
      </thead>
      <tbody>
        ${medications.map(med => `
          <tr>
            <td>${med.name || 'N/A'}</td>
            <td>${med.dosage || 'N/A'}</td>
            <td>${med.frequency || 'N/A'}</td>
            <td>${med.duration || 'N/A'}</td>
            <td>${med.instructions || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${prescription.instructions ? `
  <div class="info-section">
    <h3>General Instructions:</h3>
    <p>${prescription.instructions}</p>
  </div>
  ` : ''}

  ${prescription.notes ? `
  <div class="info-section">
    <h3>Additional Notes:</h3>
    <p>${prescription.notes}</p>
  </div>
  ` : ''}

  <div class="signature">
    <p><strong>Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}</strong></p>
    <p>${prescription.doctor.specialization}</p>
    <p>License: ${prescription.doctor.licenseNumber || 'N/A'}</p>
  </div>

  <div class="footer">
    <p>This is a computer-generated prescription. Please consult your doctor for any questions.</p>
    <p>Hope Physicians - ${new Date().getFullYear()}</p>
  </div>
</body>
</html>
    `;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads/prescriptions');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save HTML file (in production, convert to PDF using puppeteer or similar)
    const fileName = `prescription-${prescription.id}-${Date.now()}.html`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, htmlContent);

    // Return URL (adjust based on your file serving setup)
    const pdfUrl = `/uploads/prescriptions/${fileName}`;

    return pdfUrl;
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    throw error;
  }
}

module.exports = { generatePrescriptionPDF };

