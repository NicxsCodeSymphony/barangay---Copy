import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus, FaPrint } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import EditResidentModal from "../components/residents/UpdateModal";
import PrintModal from "../components/residents/printModal";
import AddResidentModal from "../components/residents/AddModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const Residents = () => {
  const [location, setLocation] = useState([14.5995, 120.9842]);
  const [residents, setResidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [printModal, setPrintModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null)

<<<<<<< HEAD
  const fetchToken = () => {
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login'
    }
}

useEffect(() => {
    fetchToken();
}, [residents]);

=======
>>>>>>> 140ef3a258009c0fe90cb4cd7d39ff4b7801ee0a

  const fetchResidents = async () => {
    setLoading(true);
    const token = localStorage.getItem('token')
    try {
      const token = localStorage.getItem('token')
      setLoggedIn(token)
      const res = await axios.get('http://localhost/barangay/backend/resident/fetch.php');
      const official = await axios.get('http://localhost/barangay/backend/official/fetchOfficialById.php/?official_id=' + token)
<<<<<<< HEAD
      console.log(official?.data)
=======
>>>>>>> 140ef3a258009c0fe90cb4cd7d39ff4b7801ee0a
      setLoggedIn(official?.data)
      setResidents(res.data);
    } catch (err) {
      console.error("Error fetching residents:", err);
      setError("Error fetching residents data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleResidentClick = (residentId) => {
    setSelectedResident(residentId);
  };

  const handleEditClick = (resident) => {
    setSelectedResident(resident);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleRemoveResident = async (email) => {
    // Implement the logic for removing the resident
  };

  const handlePrintClick = (resident) => {
    setSelectedResident(resident);
    setPrintModal(true);
  };

  const residentAgeGroups = {
    young: residents.filter(resident => resident.age < 30).length,
    middle: residents.filter(resident => resident.age >= 30 && resident.age < 60).length,
    senior: residents.filter(resident => resident.age >= 60).length,
  };

  const residentPieData = {
    labels: ['Young', 'Middle-aged', 'Senior'],
    datasets: [
      {
        data: [residentAgeGroups.young, residentAgeGroups.middle, residentAgeGroups.senior],
        backgroundColor: ['#4ECDC4', '#FFC107', '#FF5722'],
      },
    ],
  };

  if (loading) {
    return <div className="text-center py-5">Loading residents...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen py-7 bg-[#F4F1EC]">
      <div className="px-6 sm:px-8 md:px-16 xl:px-10 2xl:px-32">
        <h1 className="text-2xl font-bold mb-1 text-teal-600">Hello, {loggedIn?.first_name}</h1>
        <p className="text-sm text-gray-500">Let's manage your barangay residents today</p>

        <div className="flex flex-col sm:flex-row justify-between w-full gap-10 h-[40vh] mt-7">
          <div className="bg-[#CFC6B5] w-full sm:w-3/4 h-full rounded-2xl py-6 px-8 relative shadow-lg transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xs text-slate-700">Manage Barangay Residents</h3>
            <h1 className="text-2xl mt-2 font-bold">{selectedResident ? `${selectedResident.first_name} ${selectedResident.last_name}` : "Manage Barangay Residents"}</h1>
            <p className="mt-10">{selectedResident ? `Purok: ${selectedResident.purok_name}` : ""}</p>
            <p className="mt-2">{selectedResident ? `Age: ${selectedResident.age} years old` : ""}</p>

            <div className="absolute top-12 right-10 w-[200px] h-[200px] sm:w-[200px] sm:h-[200px] border-4 border-white rounded-full overflow-hidden shadow-lg">
              <img
                src={selectedResident ? `http://localhost/barangay/backend/resident/${selectedResident.image}` : `http://localhost/barangay/backend/official/${loggedIn?.image}`}
                alt="Resident Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-5 left-8 w-full flex items-center gap-6">
              <button
                onClick={() => setAddModal(true)} 
                className="text-white flex items-center gap-2 text-sm sm:text-base bg-teal-600 p-3 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md transform hover:scale-105"
              >
                <FaPlus />
                <span>Add Resident</span>
              </button>
            </div>
          </div>

          <div className="h-full w-full sm:w-1/2 bg-[#22262C] rounded-2xl shadow-lg z-0">
            <MapContainer center={location} zoom={13} className="h-full w-full rounded-xl">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="w-full h-[40vh] mt-10 flex flex-col sm:flex-row justify-between gap-10">
          <div className="w-full sm:w-4/12 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-xl">Resident Demographics</h3>
            <div className="flex justify-center items-center">
              <Pie 
                data={residentPieData} 
                width={210}   
                height={210}   
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="mt-5 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600">Young</div>
                <div className="text-lg font-semibold">{residentAgeGroups.young}</div>
              </div>
              <div className="flex flex-col items-center mx-5">
                <div className="text-sm text-gray-600">Middle-aged</div>
                <div className="text-lg font-semibold">{residentAgeGroups.middle}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600">Senior</div>
                <div className="text-lg font-semibold">{residentAgeGroups.senior}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 w-full sm:w-8/12 h-full overflow-y-auto shadow-lg">
            <h3 className="font-bold text-sm sm:text-lg">Manage Barangay Residents</h3>
            <div className="space-y-5 mt-5">
              {residents.map((resident, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-[#F7F3EF] p-3 rounded-lg cursor-pointer hover:bg-[#E2DFD2] transition-all"
                  onClick={() => handleResidentClick(resident)} 
                >
                  <img src={`http://localhost/barangay/backend/resident/${resident.image}`} alt={resident.name} className="w-12 h-12 rounded-full object-cover" />

                  <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base">{resident.first_name} {resident.last_name}</span>
                    <span className="text-xs text-gray-500 sm:text-sm">{resident.email}</span>
                  </div>

                  <div className="ml-auto flex items-center justify-center w-72">
                    <span className="font-medium text-sm sm:text-base">Age: {resident.age}</span>
                  </div>

                  <div className="ml-auto flex gap-3">
                    <button
                      onClick={() => handleRemoveResident(resident.email)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      onClick={() => handleEditClick(resident)} 
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handlePrintClick(resident)} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaPrint />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrintModal
        isModalOpen={printModal}
        setIsModalOpen={setPrintModal}
        resident={selectedResident}
      />
      
      <EditResidentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        resident={selectedResident}
        isEditing={isEditing}
        setResidents={setResidents}
         officialId={loggedIn?.official_id}
      />

      <AddResidentModal
        isModalOpen={addModal}
        setIsModalOpen={setAddModal}
         officialId={loggedIn?.official_id}
      />
    </div>
  );
};

export default Residents;
