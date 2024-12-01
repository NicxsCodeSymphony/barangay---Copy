import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { toast } from 'sonner'; 
import EditBarangayModal from "../components/barangay/editModal";
import AddPurokModal from "../components/barangay/addPurok";
import AddHouseholdModal from "../components/household/modal";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [location, setLocation] = useState([14.5995, 120.9842]);
  const [barangayInfo, setBarangayInfo] = useState({});
  const [residentData, setResidentData] = useState({ residents: 100, totalResidents: 500 });
  const [officialsData, setOfficialsData] = useState({ active: 7, total: 10 });
  const [residents, setResidents] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [purokData, setPurokData] = useState({ "Purok 1": 2, "Purok 2": 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  
  const [isAddPurokModalOpen, setIsAddPurokModalOpen] = useState(false); 
  const [isHouseHold, setIsHouseHold] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);

  const [totalPopulation, setTotalPopulation] = useState(null)

  
  const fetchToken = () => {
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login'
    }
}

useEffect(() => {
    fetchToken();
}, [totalPopulation]);


  const fetchOfficials = async () => {
    try{
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost/barangay/backend/official/fetchOfficial.php')
      const resident = await axios.get('http://localhost/barangay/backend/resident/fetch.php')
<<<<<<< HEAD

      const totalPop = await axios.get('http://localhost/barangay/backend/barangay/totalPopulation.php')
      setTotalPopulation(totalPop.data?.total)

=======
      const official = await axios.get('http://localhost/barangay/backend/official/fetchOfficialById.php/?official_id=' + token)
      setLoggedIn(official?.data)
>>>>>>> 140ef3a258009c0fe90cb4cd7d39ff4b7801ee0a
      setResidentData(resident.data)
      setResidents(resident.data)
      setOfficials(res.data)
    }
    catch(err){
      console.error("Error fetching officials: ", err);
    }
  }

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchBarangayInfo = async () => {
    try{
      const res = await axios.get('http://localhost/barangay/backend/barangay/fetch.php');
      setBarangayInfo(res.data[0]);
    }
    catch(err){
      console.error("Error fetching barangay info: ", err);
    }
  };

  useEffect(() => {
    fetchBarangayInfo();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location: ", error);
        }
      );
    }
  }, []);

  // Calculate the number of residents in each Purok
  const calculatePurokData = (residents) => {
    let purokCounts = {};

    residents.forEach(resident => {
      const purokName = resident.purok_name;
      if (purokCounts[purokName]) {
        purokCounts[purokName]++;
      } else {
        purokCounts[purokName] = 1;
      }
    });

    return purokCounts;
  }

  useEffect(() => {
    if (residents.length > 0) {
      const purokCounts = calculatePurokData(residents);
      setPurokData(purokCounts);
    }
  }, [residents]);

  const purokPieData = {
    labels: Object.keys(purokData),
    datasets: [
      {
        data: Object.values(purokData),
        backgroundColor: ['#4ECDC4', '#FFC107', '#FF6347', '#2E8B57', '#1E90FF'], // Add more colors if you have more Puroks
      },
    ],
  };

  return (
    <div className="h-screen py-7 bg-[#F4F1EC]">
      <div className="px-6 sm:px-8 md:px-16 xl:px-10 2xl:px-32">
<<<<<<< HEAD
        <h1 className="text-2xl font-bold mb-1">Hello there!</h1>
=======
        <h1 className="text-2xl font-bold mb-1">Hi, {loggedIn?.first_name}</h1>
>>>>>>> 140ef3a258009c0fe90cb4cd7d39ff4b7801ee0a
        <p className="text-sm">Let's take a look at your activity today</p>

        <div className="flex flex-col sm:flex-row justify-between w-full gap-10 h-[40vh] mt-7">
          <div className="bg-[#CFC6B5] w-full sm:w-3/4 h-full rounded-2xl py-5 px-8 relative">
            <h3 className="text-xs text-slate-700">Barangay Info</h3>
            <h1 className="text-lg font-bold">Barangay {barangayInfo?.barangay_name}</h1>

            <div className="2xl:h-[28vh] 2xl:w-[14vw] xl:h-[16vw] xl:w-[16vw] border rounded-[50%] absolute 2xl:right-20 xl:right-14">
                <img src={`http://localhost/barangay/backend/barangay/${barangayInfo?.image}` || "https://randomuser.me/api/portraits/men/1.jpg"} alt="" className="w-full h-full rounded-[50%]" />
            </div>

            <div className="absolute bottom-5 left-8 w-full flex items-center gap-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}  
                  className="text-white flex items-center gap-2 text-sm bg-teal-600 p-2 rounded-lg hover:bg-teal-700 transition-all duration-200"
                >
                  <FaEdit />
                  <span>Edit Barangay</span>
                </button>

                <button
                  onClick={() => setIsAddPurokModalOpen(true)}
                  className="text-white flex items-center gap-2 text-sm bg-teal-600 p-2 rounded-lg hover:bg-teal-700 transition-all duration-200"
                >
                  <FaEdit />
                  <span>Add Purok</span>
                </button>

                <button
                  onClick={() => setIsHouseHold(true)}
                  className="text-white flex items-center gap-2 text-sm bg-teal-600 p-2 rounded-lg hover:bg-teal-700 transition-all duration-200"
                >
                  <FaEdit />
                  <span>Add Household #</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-full w-full sm:w-1/2 bg-[#22262C] rounded-2xl z-0">
            <MapContainer center={location} zoom={13} className="h-full w-full rounded-xl">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={location}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <EditBarangayModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          barangayInfo={barangayInfo}
        />

        <AddPurokModal
          isOpen={isAddPurokModalOpen}
          onClose={() => setIsAddPurokModalOpen(false)}
        />

        <div className="w-full h-[40vh] mt-10 flex flex-col sm:flex-row justify-between gap-10">
          <div className="flex flex-col justify-between rounded-2xl gap-5 w-full sm:w-4/12 h-full">
            <div className="bg-white h-1/2 rounded-xl px-4 py-6 relative flex items-center">
              <div className="absolute left-5 text-3xl font-semibold">
                <span>{residentData.length}</span>
              </div>

              <div className="absolute top-5 left-5 text-sm sm:text-lg font-semibold">Residents</div>

              <div className="flex justify-center items-center absolute right-5">
                <Pie
                  data={purokPieData}
                  width={140}
                  height={140}
                />
              </div>

              <div className="absolute bottom-5 left-5 text-xs text-gray-500 italic">
                Total Residents by Purok
              </div>
            </div>

            <div className="bg-white h-1/2 rounded-xl px-4 py-6 relative flex items-center">
              <div className="absolute left-5 text-3xl font-semibold">
                <span>{totalPopulation}</span>
              </div>

              <div className="absolute top-5 left-5 text-sm sm:text-lg font-semibold">Total Population</div>

              <div className="flex justify-center items-center absolute right-5">
                <Pie
                  data={purokPieData}
                  width={140}
                  height={140}
                />
              </div>

              <div className="absolute bottom-5 left-5 text-xs text-gray-500 italic">
                Total Population
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 w-full sm:w-8/12 h-full overflow-y-auto">
            <h3 className="font-bold text-sm sm:text-lg">Barangay Officials</h3>
            <div className="space-y-5 mt-5">
              {officials.map((official, index) => (
                <div key={index} className="flex items-center gap-4 bg-[#F7F3EF] p-3 rounded-lg">
                  <img src={`http://localhost/barangay/backend/official/${official.image}`} alt={official.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base">{official?.first_name} {official?.last_name}</span>
                    <span className="text-xs text-gray-500 sm:text-sm">{official?.email}</span>
                  </div>
                  <div className="ml-auto flex items-center justify-center w-72">
                    <span className="font-medium text-sm sm:text-base">{official?.position_name}</span>
                  </div>

                  <div className="ml-auto flex items-center justify-center">
                    <span className="font-medium text-sm sm:text-base">{}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddHouseholdModal 
        isOpen={isHouseHold}
        onClose={() => setIsHouseHold(false)}
      />
    </div>
  );
};

export default Dashboard;
