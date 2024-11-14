import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

const AddResidentModal = ({ isModalOpen, setIsModalOpen }) => {
  const [newResident, setNewResident] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    household: "",
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
    pwd: 0, // 0 or 1 for PWD
    education: "",
    purok: "", // Store the purok_id
    senior_citizen: 0, // 0 or 1 for senior citizen
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [purokOptions, setPurokOptions] = useState([]); // state to store purok options
  const [household, setHousehold] = useState([]);
  
  // Fetch Purok Data
  const fetchPurok = async () => {
    try {
      const res = await axios.get("http://localhost/barangay/backend/barangay/fetchPurok.php");
      const household = await axios.get('http://localhost/barangay/backend/household/fetch.php');
      setPurokOptions(res.data);
      setHousehold(household.data);
    } catch (err) {
      console.error("Error fetching purok data", err);
    }
  };

  useEffect(() => {
    fetchPurok();
  }, []);

  const calculateAge = (birth_date) => {
    if (!birth_date) return "";
    const birthDate = new Date(birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewResident((prevState) => ({
        ...prevState,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBirthDateChange = (e) => {
    const newBirthDate = e.target.value;
    const calculatedAge = calculateAge(newBirthDate);
    setNewResident((prevState) => ({
      ...prevState,
      birth_date: newBirthDate,
      age: calculatedAge,
    }));
  };

  const handleSeniorCitizenChange = (e) => {
    const value = e.target.checked ? 1 : 0;
    setNewResident((prevState) => ({
      ...prevState,
      senior_citizen: value,
    }));
  };

  const handlePWDChange = (e) => {
    const value = e.target.checked ? 1 : 0;
    setNewResident((prevState) => ({
      ...prevState,
      pwd: value,
    }));
  };

  const handleAddResident = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("first_name", newResident.first_name);
      formData.append("middle_name", newResident.middle_name);
      formData.append("last_name", newResident.last_name);
      formData.append("suffix", newResident.suffix);
      formData.append("household", newResident.household);
      formData.append("email", newResident.email);
      formData.append("gender", newResident.gender);
      formData.append("birth_date", newResident.birth_date);
      formData.append("birth_place", newResident.birth_place);
      formData.append("age", newResident.age);
      formData.append("civil_status", newResident.civil_status);
      formData.append("nationality", newResident.nationality);
      formData.append("religion", newResident.religion);
      formData.append("occupation", newResident.occupation);
      formData.append("contact", newResident.contact);
      formData.append("pwd", newResident.pwd);
      formData.append("education", newResident.education);
      formData.append("purok", newResident.purok);
      formData.append("senior_citizen", newResident.senior_citizen);

      if (newResident.image) {
        formData.append("image", newResident.image);
      }

      const res = await axios.post(
        "http://localhost/barangay/backend/resident/addResidents.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.status === "success") {
        toast.success('Resident added successfully!');
        setIsModalOpen(false);
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      console.error("Error adding resident:", err);
      toast.error("Failed to add resident.");
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-3/4 lg:w-2/3 h-[80%] 2xl:w-7/12 overflow-auto">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Add New Resident</h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: Image Preview, Image Input & Purok Selection */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Resident Preview"
                    className="w-32 h-32 object-cover rounded-full border border-gray-300"
                  />
                ) : (
                  <FaPlus />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 px-4 py-2 border rounded-md w-full"
              />
              <select
                className="px-4 py-2 border rounded-md mt-2"
                value={newResident.purok}
                onChange={(e) => setNewResident({ ...newResident, purok: e.target.value })}
              >
                <option value="">Select Household (Purok)</option>
                {purokOptions.map((purok) => (
                  <option key={purok.purok_id} value={purok.purok_id}>
                    {purok.purok_name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border rounded-md mt-2"
                value={newResident.household}
                onChange={(e) => setNewResident({ ...newResident, household: e.target.value })}
              >
                <option value="">Select Household</option>
                {household.map((house) => (
                  <option key={house.household_id} value={house.household_id}>
                    {house.household_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Column 2: First Name, Suffix, Gender, Civil Status, Contact, Senior Citizen */}
            <div className="space-y-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="First Name"
                value={newResident.first_name}
                onChange={(e) => setNewResident({ ...newResident, first_name: e.target.value })}
              />
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.suffix}
                onChange={(e) => setNewResident({ ...newResident, suffix: e.target.value })}
              >
                <option value="">Suffix (Optional)</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
              </select>
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.gender}
                onChange={(e) => setNewResident({ ...newResident, gender: e.target.value })}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.civil_status}
                onChange={(e) => setNewResident({ ...newResident, civil_status: e.target.value })}
              >
                <option value="">Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Contact Number"
                value={newResident.contact}
                onChange={(e) => setNewResident({ ...newResident, contact: e.target.value })}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newResident.senior_citizen === 1}
                  onChange={handleSeniorCitizenChange}
                  className="mr-2"
                />
                <label>Senior Citizen</label>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Middle Name"
                value={newResident.middle_name}
                onChange={(e) => setNewResident({ ...newResident, middle_name: e.target.value })}
              />
              <input
                type="email"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Email Address"
                value={newResident.email}
                onChange={(e) => setNewResident({ ...newResident, email: e.target.value })}
              />
              <input
                type="date"
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.birth_date}
                onChange={handleBirthDateChange}
              />
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Occupation"
                value={newResident.occupation}
                onChange={(e) => setNewResident({ ...newResident, occupation: e.target.value })}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newResident.pwd === 1}
                  onChange={handlePWDChange}
                  className="mr-2"
                />
                <label>PWD</label>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Last Name"
                value={newResident.last_name}
                onChange={(e) => setNewResident({ ...newResident, last_name: e.target.value })}
              />
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.religion}
                onChange={(e) => setNewResident({ ...newResident, religion: e.target.value })}
              >
                <option value="">Religion</option>
                <option value="Roman Catholic">Roman Catholic</option>
                <option value="Born Again">Born Again</option>
                <option value="Baptist">Baptist</option>
                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
              </select>
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.education}
                onChange={(e) => setNewResident({ ...newResident, education: e.target.value })}
              >
                <option value="">Education</option>
                <option value="College Graduate">College Graduate</option>
                <option value="High School Graduate">High School Graduate</option>
                <option value="Degree Holder">Degree Holder</option>
                <option value="Undergraduate">Undergraduate</option>
              </select>
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Birth Place"
                value={newResident.birth_place}
                onChange={(e) => setNewResident({ ...newResident, birth_place: e.target.value })}
              />
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newResident.nationality}
                onChange={(e) => setNewResident({ ...newResident, nationality: e.target.value })}
              >
                <option value="">Nationality</option>
                <option value="Filipino">Filipino</option>
                <option value="American">American</option>
                <option value="Chinese">Chinese</option>
                <option value="Korean">Korean</option>
                <option value="Indian">Indian</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-4 col-span-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddResident}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Add Resident
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddResidentModal;
