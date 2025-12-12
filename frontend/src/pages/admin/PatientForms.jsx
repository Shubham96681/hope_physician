import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";
import {
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaSpinner,
  FaDownload,
  FaCalendar,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import toast from "react-hot-toast";

const PatientForms = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSubmissions();
  }, [filterType]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = {};
      if (filterType !== "all") {
        params.formType = filterType;
      }

      const response = await axios.get(`${API_BASE_URL}/patient-forms/all`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmissions(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
      toast.error("Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.patientName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getFormTypeLabel = (formType) => {
    const labels = {
      patient_info: "Patient Information",
      privacy_ack: "Privacy Acknowledgement",
      parental_consent: "Parental Consent",
      release_info: "Release of Information",
    };
    return labels[formType] || formType;
  };

  const getFormTypeBadge = (formType) => {
    const variants = {
      patient_info: "primary",
      privacy_ack: "info",
      parental_consent: "warning",
      release_info: "success",
    };
    return variants[formType] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewFormDetails = (submission) => {
    setSelectedForm(submission);
    setIsModalOpen(true);
  };

  const renderFormDetails = () => {
    if (!selectedForm) return null;

    const formData =
      typeof selectedForm.formData === "string"
        ? JSON.parse(selectedForm.formData)
        : selectedForm.formData || selectedForm;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Form Type
            </label>
            <p className="text-gray-900">
              {getFormTypeLabel(selectedForm.formType)}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Submitted Date
            </label>
            <p className="text-gray-900">
              {formatDate(selectedForm.createdAt)}
            </p>
          </div>
        </div>

        {selectedForm.patientName && (
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Patient Name
            </label>
            <p className="text-gray-900">{selectedForm.patientName}</p>
          </div>
        )}

        {selectedForm.email && (
          <div>
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <p className="text-gray-900">{selectedForm.email}</p>
          </div>
        )}

        {selectedForm.formType === "patient_info" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.patientName && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Patient Name
                  </label>
                  <p className="text-gray-900">{formData.patientName}</p>
                </div>
              )}
              {formData.dob && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">
                    {new Date(formData.dob).toLocaleDateString()}
                  </p>
                </div>
              )}
              {formData.streetAddress && (
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {formData.streetAddress}, {formData.city}, {formData.state}{" "}
                    {formData.zipCode}
                  </p>
                </div>
              )}
              {formData.phoneMobile && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Mobile Phone
                  </label>
                  <p className="text-gray-900">{formData.phoneMobile}</p>
                </div>
              )}
              {formData.phoneHome && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Home Phone
                  </label>
                  <p className="text-gray-900">{formData.phoneHome}</p>
                </div>
              )}
              {formData.gender && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Gender
                  </label>
                  <p className="text-gray-900">{formData.gender}</p>
                </div>
              )}
              {formData.maritalStatus && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Marital Status
                  </label>
                  <p className="text-gray-900">{formData.maritalStatus}</p>
                </div>
              )}
              {formData.race && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Race
                  </label>
                  <p className="text-gray-900">{formData.race}</p>
                </div>
              )}
              {formData.emergencyContact && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Emergency Contact
                  </label>
                  <p className="text-gray-900">
                    {formData.emergencyContact} - {formData.emergencyPhone}
                  </p>
                </div>
              )}
              {formData.pharmacyName && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Pharmacy Name
                  </label>
                  <p className="text-gray-900">{formData.pharmacyName}</p>
                </div>
              )}
              {formData.policyNumber && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Insurance Policy #
                  </label>
                  <p className="text-gray-900">{formData.policyNumber}</p>
                </div>
              )}
              {formData.groupNumber && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Group #
                  </label>
                  <p className="text-gray-900">{formData.groupNumber}</p>
                </div>
              )}
              {formData.patientSignature && (
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">
                    Signature
                  </label>
                  <p className="text-gray-900">{formData.patientSignature}</p>
                </div>
              )}
              {formData.signatureDate && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Signature Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(formData.signatureDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show all form data as JSON for other form types */}
        {selectedForm.formType !== "patient_info" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-lg mb-3">Form Data</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Form Submissions
            </h1>
            <p className="text-gray-600 mt-1">
              View all submitted patient forms
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by patient name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="all">All Forms</option>
                <option value="patient_info">Patient Information</option>
                <option value="privacy_ack">Privacy Acknowledgement</option>
                <option value="parental_consent">Parental Consent</option>
                <option value="release_info">Release of Information</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <FaFileAlt className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patient Information</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    submissions.filter((s) => s.formType === "patient_info")
                      .length
                  }
                </p>
              </div>
              <FaUser className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Privacy Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    submissions.filter((s) => s.formType === "privacy_ack")
                      .length
                  }
                </p>
              </div>
              <FaFileAlt className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Other Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    submissions.filter(
                      (s) =>
                        s.formType !== "patient_info" &&
                        s.formType !== "privacy_ack"
                    ).length
                  }
                </p>
              </div>
              <FaFileAlt className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading form submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No form submissions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getFormTypeBadge(submission.formType)}>
                        {getFormTypeLabel(submission.formType)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        <FaCalendar className="inline mr-1" />
                        {formatDate(submission.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {submission.patientName && (
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          <p className="font-semibold text-gray-900">
                            {submission.patientName}
                          </p>
                        </div>
                      )}
                      {submission.email && (
                        <p className="text-sm text-gray-600">
                          {submission.email}
                        </p>
                      )}
                      {submission.phoneMobile && (
                        <p className="text-sm text-gray-600">
                          {submission.phoneMobile}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewFormDetails(submission)}>
                      <FaEye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Form Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Form Details - ${
            selectedForm ? getFormTypeLabel(selectedForm.formType) : ""
          }`}
          size="lg">
          {renderFormDetails()}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default PatientForms;
