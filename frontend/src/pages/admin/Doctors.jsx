import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/portal/DashboardLayout";
import Card from "../../components/shared/Card";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import {
  FaUserMd,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import * as adminService from "../../services/adminService";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view | edit
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await adminService.getDoctors();
      const list = data.data || data || [];
      // Normalize doctor data to have consistent display fields
      const normalized = list.map((doc) => ({
        id: doc.id,
        name:
          doc.name ||
          [doc.firstName, doc.lastName].filter(Boolean).join(" ").trim() ||
          "Unknown",
        specialization: doc.specialization || doc.department || "General",
        email: doc.email || doc.portalUser?.email || "N/A",
        phone: doc.phone || doc.mobile || "N/A",
        createdAt: doc.createdAt,
        isActive: doc.portalUser?.isActive ?? doc.isActive ?? true,
        raw: doc,
      }));
      setDoctors(normalized);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (doctor) => {
    const raw = doctor.raw || {};
    setFormData({
      firstName: raw.firstName || doctor.name?.split(" ")[0] || "",
      lastName:
        raw.lastName || doctor.name?.split(" ").slice(1).join(" ") || "",
      email: raw.email || doctor.email || "",
      phone: raw.phone || doctor.phone || "",
      specialization: raw.specialization || doctor.specialization || "",
      licenseNumber: raw.licenseNumber || "",
      yearsOfExperience: raw.yearsOfExperience || "",
      bio: raw.bio || "",
      isAvailable: raw.isAvailable ?? true,
    });
    setSelectedDoctor(doctor);
    setModalMode("edit");
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber || null,
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience)
          : null,
        bio: formData.bio || null,
        isAvailable: formData.isAvailable,
      };

      const response = await adminService.updateDoctor(
        selectedDoctor.id,
        updateData
      );

      if (response.success) {
        setSuccess("Doctor updated successfully!");
        // Refresh the doctors list
        await fetchDoctors();
        // Close modal after a short delay
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(null);
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update doctor"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Doctor Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all doctor profiles and information
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </Card>

        {/* Doctors List */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <FaUserMd className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No doctors found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">
                        {doctor.name}
                      </p>
                      <Badge variant="primary">{doctor.specialization}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{doctor.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setModalMode("view");
                        setIsModalOpen(true);
                      }}>
                      <FaEye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(doctor)}>
                      <FaEdit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {modalMode === "edit" ? "Edit Doctor" : "Doctor Details"}
                </p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedDoctor.name}
                </h3>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}>
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalMode === "view" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        Specialization
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        Email
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedDoctor.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        Phone
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedDoctor.phone}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs uppercase text-gray-500 font-semibold">
                        Status
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedDoctor.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {selectedDoctor.raw?.bio && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                        Bio
                      </p>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedDoctor.raw.bio}
                      </p>
                    </div>
                  )}

                  {selectedDoctor.createdAt && (
                    <div className="text-sm text-gray-500">
                      Joined:{" "}
                      {new Date(selectedDoctor.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience || ""}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable ?? true}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Available for appointments
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Doctor's biography..."
                    />
                  </div>

                  <div className="px-6 py-4 border-t flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsModalOpen(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {modalMode === "view" && (
              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Doctors;
