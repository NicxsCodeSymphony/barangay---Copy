import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddOfficialModal from "../components/officials/OfficialModal"; 
import EditOfficialModal from "../components/officials/updateModal";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const Officials = () => {
  const [location, setLocation] = useState([14.5995, 120.9842]);
  const [officials, setOfficials] = useState([]);
  const [loggedIn, setLoggedIn] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  

  const fetchToken = () => {
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login'
    }
}

useEffect(() => {
    fetchToken();
}, [officials]);
  

  // Fetch officials data from API
  const fetchOfficials = async () => {
    try {
      const token = localStorage.getItem('token')
      setLoggedIn(token)
      const res = await axios.get('http://localhost/barangay/backend/official/fetchOfficial.php');
      const official = await axios.get('http://localhost/barangay/backend/official/fetchOfficialById.php/?official_id=' + token)
      setLoggedIn(official?.data)
      setOfficials(res.data);
    } catch (error) {
      console.error("Error fetching officials data", error);
    }
  };

  // Fetch location
  useEffect(() => {
    fetchOfficials();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
        },
        (error) => console.error("Error fetching location: ", error)
      );
    }
  }, []);

  // Handle adding a new official
  const handleAddOfficial = (newOfficialData) => {
    setOfficials((prevOfficials) => [
      ...prevOfficials,
      { ...newOfficialData, image: newOfficialData.image || "https://randomuser.me/api/portraits/men/1.jpg" }
    ]);
    setIsModalOpen(false);
  };

  // Handle removing an official
  const handleRemoveOfficial = (email) => {
    setOfficials((prevOfficials) => prevOfficials.filter((official) => official.email !== email));
  };

  // Get official positions count
  const officialPositions = {
    "Barangay Captain": officials.filter((official) => official.position === "Barangay Captain").length,
    Councilor: officials.filter((official) => official.position === "Councilor").length,
    "Barangay Secretary": officials.filter((official) => official.position === "Barangay Secretary").length,
  };

  // Pie chart data
  const officialPieData = {
    labels: ['Barangay Captain', 'Councilor', 'Barangay Secretary'],
    datasets: [
      {
        data: [officialPositions["Barangay Captain"], officialPositions.Councilor, officialPositions["Barangay Secretary"]],
        backgroundColor: ['#4ECDC4', '#FFC107', '#FF5722'],
      },
    ],
  };

  // Select an official to edit
  const selectOfficial = (official) => {
    setIsEdit(true);
    setSelectedOfficial(official);
  };

  return (
    <div className="h-screen bg-[#F4F1EC] py-7">
      <div className="px-6 sm:px-8 md:px-16 xl:px-10 2xl:px-32">
        <h1 className="text-2xl font-bold mb-1 text-teal-600">Hello, {loggedIn?.first_name}</h1>
        <p className="text-sm text-gray-500">Let's manage your barangay officials today</p>

        {/* Header & Add Official Button */}
        <div className="flex flex-col sm:flex-row justify-between w-full gap-10 h-[40vh] mt-7">
          <div className="bg-[#CFC6B5] w-full sm:w-3/4 h-full rounded-2xl py-5 px-8 relative shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xs text-slate-700">Manage Barangay Officials</h3>
            <h1 className="text-2xl mt-2 font-bold">Officials Management</h1>

            <div className="2xl:h-[28vh] 2xl:w-[14vw] xl:h-[16vw] xl:w-[16vw] border rounded-[50%] absolute right-14">
              {/* <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Official" className="w-full h-full rounded-[50%]" /> */}
              <img src={`http://localhost/barangay/backend/official/${loggedIn?.image}`} alt="Official" className="w-full h-full rounded-[50%]" />
            </div>

            <div className="absolute bottom-5 left-8 w-full flex items-center gap-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-white flex items-center gap-2 text-sm bg-teal-600 p-2 rounded-lg hover:bg-teal-700 transition-all duration-200"
              >
                <FaPlus />
                <span>Add Official</span>
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="h-full w-full sm:w-1/2 bg-[#22262C] rounded-2xl z-0">
            <MapContainer center={location} zoom={13} className="h-full w-full rounded-xl">
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Marker position={location}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Pie Chart and Official List Section */}
        <div className="w-full h-[40vh] mt-10 flex flex-col sm:flex-row justify-between gap-10">
          {/* Officials Stats */}
          <div className="w-full sm:w-4/12 bg-white rounded-xl p-6 flex justify-between items-center shadow-lg">
            <div>
              <h3 className="font-semibold text-xl text-gray-700">Total Officials</h3>
              <div className="text-3xl font-bold text-teal-600">{officials.length}</div>
            </div>
            <div className="flex justify-center items-center">
              <Pie data={officialPieData} width={140} height={140} />
            </div>
          </div>

          {/* Official List */}
          <div className="w-full sm:w-8/12 bg-white rounded-2xl p-6 overflow-y-auto shadow-lg">
            <h3 className="font-bold text-lg mb-5 text-gray-700">Manage Barangay Officials</h3>
            <div className="space-y-5">
              {officials.map((official, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-[#F7F3EF] p-3 rounded-lg hover:bg-[#E2DFD2] transition-all"
                  onClick={() => selectOfficial(official)}
                >
                  <img src={`http://localhost/barangay/backend/official/${official.image}`} alt={official.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{official.first_name} {official.last_name}</span>
                    <span className="text-xs text-gray-500">{official.email}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="font-medium text-sm text-gray-600">{official.position_name}</span>
                  </div>
                  <div className="ml-auto flex gap-3">
                    <button
                      onClick={() => handleRemoveOfficial(official.email)}
                      className="text-red-600 hover:text-red-800 transition-all"
                    >
                      <FaTrashAlt />
                    </button>
                    <button 
                      onClick={() => selectOfficial(official)} 
                      className="text-teal-600 hover:text-teal-800 transition-all"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Official Modal */}
      <AddOfficialModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAddOfficial={handleAddOfficial}
        officialId={loggedIn?.official_id}
      />

      {/* Edit Official Modal */}
      <EditOfficialModal
        isModalOpen={isEdit}
        setIsModalOpen={setIsEdit}
        officialData={selectedOfficial}
        officialId={loggedIn?.official_id}
      />
    </div>
  );
};

export default Officials;
