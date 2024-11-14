import React, { useState, useEffect } from "react";
import axios from "axios";

const EditResidentModal = ({ isModalOpen, setIsModalOpen, resident, setResidents }) => {
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    email: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    age: "",
    civil_status: "",
    nationality: "",
    religion: "",
    occupation: "",
    contact: "",
    pwd: false,
    education: "",
    purok: "",
    senior_citizen: false,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (resident) {
      setFormData({
        id: resident.resident_id,
        first_name: resident.first_name,
        last_name: resident.last_name,
        middle_name: resident.middle_name,
        suffix: resident.suffix,
        email: resident.email,
        gender: resident.gender,
        birth_date: resident.birth_date,
        birth_place: resident.birth_place,
        age: resident.age,
        civil_status: resident.civil_status,
        nationality: resident.nationality,
        religion: resident.religion,
        occupation: resident.occupation,
        contact: resident.contact,
        pwd: resident.pwd === 1,
        education: resident.education,
        purok: resident.purok,
        senior_citizen: resident.senior_citizen === 1,
        image: resident.image,
      });
      setImagePreview(resident.image);  // Set initial image preview from the resident data
    }
  }, [resident]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setFormData({
        ...formData,
        image: files[0],
      });
      setImagePreview(URL.createObjectURL(files[0]));  // Preview the selected image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        // Only append the image if it has been updated
        if (key === "image" && formData[key] === null) {
          // Don't append image if it's not updated
          continue;
        }
        dataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost/barangay/backend/resident/update.php",
        dataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        window.location.reload();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating resident:", error);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Edit Resident Information
          </h2>

          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 mb-4 overflow-hidden rounded-full border-2 border-gray-300 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={`http://localhost/barangay/backend/resident/${imagePreview}`}
                  alt="Resident Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Upload New Image */}
          <div className="text-center mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          {/* Resident Information Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="first_name">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="middle_name">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  id="middle_name"
                  placeholder="Middle Name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="suffix">
                  Suffix
                </label>
                <input
                  type="text"
                  name="suffix"
                  id="suffix"
                  placeholder="Suffix (e.g., Jr, Sr)"
                  value={formData.suffix}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="birth_date">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birth_date"
                  id="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="birth_place">
                  Birth Place
                </label>
                <input
                  type="text"
                  name="birth_place"
                  id="birth_place"
                  placeholder="Birth Place"
                  value={formData.birth_place}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Special Status */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                name="pwd"
                id="pwd"
                checked={formData.pwd}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="pwd" className="text-sm">Person with Disability</label>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                name="senior_citizen"
                id="senior_citizen"
                checked={formData.senior_citizen}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="senior_citizen" className="text-sm">Senior Citizen</label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
              >
                Update Resident
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400 mt-4"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditResidentModal;
