import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const EditBarangayModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        barangay_name: "",
        municipality: "",
        province: "",
        phone: "",
        email: "",
        photo: null,
    });

    useEffect(() => {
        if (isOpen) {
            const fetchBarangayInfo = async () => {
                try {
                    const response = await axios.get(`http://localhost/barangay/backend/barangay/fetch.php`);
                    if (response.data.status === "error") {
                        toast.error("Error fetching barangay info");
                    } else {
                        setFormData({
                            barangay_name: response.data[0].barangay_name || "",
                            municipality: response.data[0].municipality || "",
                            province: response.data[0].province || "",
                            phone: response.data[0].phone || "",
                            email: response.data[0].email || "",
                            photo: null, 
                        });
                    }
                } catch (error) {
                    console.error("Error fetching barangay info:", error);
                    toast.error("Error fetching barangay info");
                }
            };

            fetchBarangayInfo();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                photo: files[0], 
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value, 
            }));
        }
    };

    const handleSave = async () => {
        const dataToSend = new FormData();
        dataToSend.append("barangayName", formData.barangay_name);
        dataToSend.append("municipality", formData.municipality);
        dataToSend.append("province", formData.province);
        dataToSend.append("phone", formData.phone);
        dataToSend.append("email", formData.email);

        if (formData.photo) {
            dataToSend.append("photo", formData.photo);
        }

        try {
            const res = await axios.post("http://localhost/barangay/backend/barangay/edit.php", dataToSend);
            console.log(res.data);
            if (res.data.status === "success") {
                toast.success("Barangay info updated successfully!");
                onClose();
            } else {
                toast.error("Failed to update barangay info.");
            }
        } catch (err) {
            console.error("Error updating barangay info:", err);
            toast.error("Error updating barangay info.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">Edit Barangay Information</h2>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Current Barangay Logo</label>
                    {formData?.photo ? (
                        <img
                            src={formData?.photo ? URL.createObjectURL(formData.photo) : ""}
                            alt="Barangay Logo"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mt-2"
                        />
                    ) : formData?.image ? (
                        <img
                            src={`http://localhost/barangaymanagement/backend/${formData?.image}`}
                            alt="Barangay Logo"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mt-2"
                        />
                    ) : null}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Barangay Name</label>
                        <input
                            type="text"
                            name="barangay_name"
                            value={formData.barangay_name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Municipality</label>
                        <input
                            type="text"
                            name="municipality"
                            value={formData.municipality}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Province</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* New image upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Update Barangay Logo</label>
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBarangayModal;
