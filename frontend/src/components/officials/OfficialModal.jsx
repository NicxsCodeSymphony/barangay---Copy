import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import QRCode from "qrcode";
import { saveAs } from "file-saver";

const AddOfficialModal = ({ isModalOpen, setIsModalOpen }) => {
  const [newOfficials, setNewOfficials] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
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
    pwd: false,
    education: "",
    purok: "",
    senior_citizen: false,
    position: "",
    status: "Available",
    image: null,
    qr_code: "",  // Store the generated QR code number
  });

  const [imagePreview, setImagePreview] = useState("");
  const [purokList, setPurokList] = useState([]);
  const [positions, setPositions] = useState([]);
  const [officialList, setOfficialList] = useState(null);
  const [official_id, setOfficial_id] = useState(null);

  // Fetch Purok and Officials data
  const fetchPurok = async () => {
    try {
      const res = await axios.get("http://localhost/barangay/backend/barangay/fetchPurok.php");
      const resOfficial = await axios.get("http://localhost/barangay/backend/barangay/fetchListOfficials.php");
      setOfficialList(resOfficial.data);

      const availablePositions = resOfficial.data.filter(official => official.status === "Available");
      setPositions(availablePositions);

      setPurokList(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchPurok();
    }
  }, [isModalOpen]);

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
      setNewOfficials((prevState) => ({
        ...prevState,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBirthDateChange = (e) => {
    const newBirthDate = e.target.value;
    const calculatedAge = calculateAge(newBirthDate);
    setNewOfficials((prevState) => ({
      ...prevState,
      birth_date: newBirthDate,
      age: calculatedAge,
    }));
  };

  const handlePositionChange = async (e) => {
    const positionId = e.target.value;
    setOfficial_id(positionId);
    const updatedStatus = positionId ? "Assigned" : "Available";
    setNewOfficials((prevState) => ({
      ...prevState,
      position: positionId,
      status: updatedStatus,
    }));
  };

    
  
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  

  const handleAddOfficials = async (e) => {
    e.preventDefault();

    const qrCodeNumber = Math.floor(1000000000 + Math.random() * 9000000000); 
    
    try {
      const formData = new FormData();
      formData.append("first_name", newOfficials.first_name);
      formData.append("middle_name", newOfficials.middle_name);
      formData.append("last_name", newOfficials.last_name);
      formData.append("suffix", newOfficials.suffix);
      formData.append("email", newOfficials.email);
      formData.append("password", newOfficials.password);
      formData.append("gender", newOfficials.gender);
      formData.append("birth_date", newOfficials.birth_date);
      formData.append("birth_place", newOfficials.birth_place);
      formData.append("age", newOfficials.age);
      formData.append("civil_status", newOfficials.civil_status);
      formData.append("nationality", newOfficials.nationality);
      formData.append("religion", newOfficials.religion);
      formData.append("occupation", newOfficials.occupation);
      formData.append("contact", newOfficials.contact);
      formData.append("pwd", newOfficials.pwd);
      formData.append("education", newOfficials.education);
      formData.append("purok", newOfficials.purok);
      formData.append("senior_citizen", newOfficials.senior_citizen);
      formData.append("position", newOfficials.position);
      formData.append("status", newOfficials.status);
  
      if (newOfficials.image) {
        formData.append("image", newOfficials.image);
      }
  
      formData.append("qr_code", qrCodeNumber);
  
      const res = await axios.post(
        "http://localhost/barangay/backend/official/addOfficial.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      if (res.data.status === "success") {
        setNewOfficials((prevState) => ({
          ...prevState,
          qr_code: qrCodeNumber.toString(),
        }));
  
        QRCode.toDataURL(qrCodeNumber.toString(), { errorCorrectionLevel: 'H' }, async (err, url) => {
          if (err) throw err;
  
          const qrCodeBlob = dataURItoBlob(url);
          saveAs(qrCodeBlob, `${qrCodeNumber}.png`); 
  
          try {
            const response = await axios.post(
              "http://localhost/barangay/backend/barangay/updateOfficialList.php?id=" + official_id,
              { status: "Assigned" }
            );
          
          } catch (err) {
            console.error("Error updating official QR code:", err);
            toast.error("Error updating official QR Code.");
          }
        });
  
        toast.success("Official added successfully!");
        setIsModalOpen(false);
        window.location.reload();  
      } else {
        toast.error("Failed to add official!");
      }
    } catch (err) {
      console.error("Error adding official:", err);
      toast.error("Failed to add official!");
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-4/12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Add New Official</h3>

          <div className="mb-6 flex justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Resident Preview"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <FaPlus />
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-6 px-4 py-2 border rounded-md w-full"
          />

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="First Name"
                value={newOfficials.first_name}
                onChange={(e) => setNewOfficials({ ...newOfficials, first_name: e.target.value })}
              />
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Middle Name"
                value={newOfficials.middle_name}
                onChange={(e) => setNewOfficials({ ...newOfficials, middle_name: e.target.value })}
              />
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Last Name"
                value={newOfficials.last_name}
                onChange={(e) => setNewOfficials({ ...newOfficials, last_name: e.target.value })}
              />
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Suffix (optional)"
                value={newOfficials.suffix}
                onChange={(e) => setNewOfficials({ ...newOfficials, suffix: e.target.value })}
              />
            </div>

            <input
              type="text"
              className="px-4 py-2 border rounded-md w-full"
              placeholder="Email"
              value={newOfficials.email}
              onChange={(e) => setNewOfficials({ ...newOfficials, email: e.target.value })}
            />
            <input
              type="password"
              className="px-4 py-2 border rounded-md w-full"
              placeholder="Password"
              value={newOfficials.password}
              onChange={(e) => setNewOfficials({ ...newOfficials, password: e.target.value })}
            />
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newOfficials.gender}
                onChange={(e) => setNewOfficials({ ...newOfficials, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border rounded-md w-full"
                value={newOfficials.birth_date}
                onChange={handleBirthDateChange}
              />
            </div>

            <input
              type="text"
              className="px-4 py-2 border rounded-md w-full"
              placeholder="Birth Place"
              value={newOfficials.birth_place}
              onChange={(e) => setNewOfficials({ ...newOfficials, birth_place: e.target.value })}
            />
            <input
              type="number"
              className="px-4 py-2 border rounded-md w-full"
              placeholder="Age"
              value={newOfficials.age}
              disabled
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newOfficials.civil_status}
                onChange={(e) => setNewOfficials({ ...newOfficials, civil_status: e.target.value })}
              >
                <option value="">Select Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Nationality"
                value={newOfficials.nationality}
                onChange={(e) => setNewOfficials({ ...newOfficials, nationality: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Religion"
                value={newOfficials.religion}
                onChange={(e) => setNewOfficials({ ...newOfficials, religion: e.target.value })}
              />
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Occupation"
                value={newOfficials.occupation}
                onChange={(e) => setNewOfficials({ ...newOfficials, occupation: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Contact Number"
                value={newOfficials.contact}
                onChange={(e) => setNewOfficials({ ...newOfficials, contact: e.target.value })}
              />
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newOfficials.purok}
                onChange={(e) => setNewOfficials({ ...newOfficials, purok: e.target.value })}
              >
                <option value="">Select Purok</option>
                {purokList.map((purok, index) => (
                  <option key={index} value={purok.purok_name}>
                    {purok.purok_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="px-4 py-2 border rounded-md w-full"
                placeholder="Education"
                value={newOfficials.education}
                onChange={(e) => setNewOfficials({ ...newOfficials, education: e.target.value })}
              />
              <select
                className="px-4 py-2 border rounded-md w-full"
                value={newOfficials.position}
                onChange={handlePositionChange}
              >
                <option value="">Select Position</option>
                {positions.map((official, index) => (
                  <option key={index} value={official.official_list_id}>
                    {official.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newOfficials.senior_citizen}
                  onChange={(e) => setNewOfficials({ ...newOfficials, senior_citizen: e.target.checked })}
                />
                <label className="ml-2">Senior Citizen</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newOfficials.pwd}
                  onChange={(e) => setNewOfficials({ ...newOfficials, pwd: e.target.checked })}
                />
                <label className="ml-2">PWD</label>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
                onClick={handleAddOfficials}
              >
                Add Official
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddOfficialModal;
