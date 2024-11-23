import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const EditOfficialModal = ({ isModalOpen, setIsModalOpen, officialData, officialId }) => {

  console.log(officialData?.first_name)

  const [formData, setFormData] = useState({
    id: 0,
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "None",
    email: "",
    password: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    age: "",
    civil_status: "",
    nationality: "",
    religion: "",
    occupation: "",
    contact: "",
    pwd: 0,
    education: "",
    purok: "",
    senior_citizen: 0,
    image: "",
  });

  useEffect(() => {
    if (officialData) {
      setFormData({
        id: officialData.official_id,
        first_name: officialData.first_name,
        middle_name: officialData.middle_name,
        last_name: officialData.last_name,
        suffix: officialData.suffix,
        email: officialData.email,
        password: officialData.password,
        gender: officialData.gender,
        birth_date: officialData.birth_date,
        birth_place: officialData.birth_place,
        age: officialData.age,
        civil_status: officialData.civil_status,
        nationality: officialData.nationality,
        religion: officialData.religion,
        occupation: officialData.occupation,
        contact: officialData.contact,
        pwd: officialData.pwd,
        education: officialData.education,
        purok: officialData.purok,
        senior_citizen: officialData.senior_citizen,
        image: officialData.image,
      });
    }
  }, [officialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost/barangay/backend/official/updateOfficial.php', formDataToSend);
      if (response.data.status === "success") {
        toast.success(response.data);
        const audit = await axios.post('http://localhost/barangay/backend/audit/add.php', {
          actor: officialId,
          action: "Updated Official",
          details: `${officialData?.first_name} ${officialData?.last_name} was updated`,
        })
        setIsModalOpen(false);
        window.location.href = "/admin/officials"
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating official: ", error);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12 max-w-5xl">
          <h2 className="text-xl font-semibold mb-6 text-center">Edit Official</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Image Upload */}
            <div className="col-span-1 flex flex-col items-center justify-start">
              <img
                src={`http://localhost/barangay/backend/official/${formData.image}` || "https://randomuser.me/api/portraits/men/1.jpg"}
                alt="Official Image"
                className="w-40 h-40 object-cover rounded-md mb-6"
              />
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="text-xs rounded-lg cursor-pointer"
              />
              <span className="mt-2 text-xs text-gray-500">Choose a new image (optional)</span>
            </div>

            {/* Columns 2, 3, and 4: Form Inputs Inline */}
            <div className="col-span-3 grid grid-cols-3 gap-6">
              {/* Column 2: First Name */}
              <div className="mb-6">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 3: Middle Name */}
              <div className="mb-6">
                <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 4: Last Name */}
              <div className="mb-6">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 2: Suffix */}
              <div className="mb-6">
                <label htmlFor="suffix" className="block text-sm font-medium text-gray-700">Suffix</label>
                <select
                  id="suffix"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="None">None</option>
                  <option value="IV">IV</option>
                  <option value="Jr">Jr</option>
                  <option value="Sr">Sr</option>
                  <option value="III">III</option>
                  <option value="II">II</option>
                </select>
              </div>

              {/* Column 3: Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 4: Password */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 2: Gender */}
              <div className="mb-6">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Column 3: Birth Date */}
              <div className="mb-6">
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 4: Birth Place */}
              <div className="mb-6">
                <label htmlFor="birth_place" className="block text-sm font-medium text-gray-700">Birth Place</label>
                <input
                  type="text"
                  id="birth_place"
                  name="birth_place"
                  value={formData.birth_place}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 2: Age */}
              <div className="mb-6">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 3: Civil Status */}
              <div className="mb-6">
                <label htmlFor="civil_status" className="block text-sm font-medium text-gray-700">Civil Status</label>
                <select
                  id="civil_status"
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>

              {/* Column 4: Nationality */}
              <div className="mb-6">
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Filipino">Filipino</option>
                  <option value="American">American</option>
                  <option value="Canadian">Canadian</option>
                  <option value="British">British</option>
                  <option value="Australian">Australian</option>
                </select>
              </div>

              {/* Column 2: Occupation */}
              <div className="mb-6">
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 3: Contact */}
              <div className="mb-6">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 4: Education */}
              <div className="mb-6">
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="College Graduate">College Graduate</option>
                  <option value="High School">High School</option>
                  <option value="Vocational">Vocational</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>

              {/* Column 2: Purok */}
              <div className="mb-6">
                <label htmlFor="purok" className="block text-sm font-medium text-gray-700">Purok</label>
                <input
                  type="text"
                  id="purok"
                  name="purok"
                  value={formData.purok}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Column 3: Senior Citizen */}
              <div className="mb-6">
                <label htmlFor="senior_citizen" className="block text-sm font-medium text-gray-700">Senior Citizen</label>
                <select
                  id="senior_citizen"
                  name="senior_citizen"
                  value={formData.senior_citizen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-4 flex justify-end gap-6 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditOfficialModal;
