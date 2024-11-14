import React, { useEffect, useState } from "react";
import axios from "axios";
import {FaEye} from "react-icons/fa";
import HouseholdModal from "../components/household/family"; 

const Households = () => {
  const [households, setHouseholds] = useState([]);
  const [filteredHouseholds, setFilteredHouseholds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastNames, setLastNames] = useState([]); // New state for storing unique last names

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost/barangay/backend/household/houseDetails.php');
      const allHouseholds = Object.values(res.data).flat(); 

      const groupedHouseholds = allHouseholds.reduce((acc, household) => {
        if (!acc[household.household_number]) {
          acc[household.household_number] = [];
        }
        acc[household.household_number].push(household);
        return acc;
      }, {});

      setHouseholds(groupedHouseholds);
      setFilteredHouseholds(groupedHouseholds);

      // Get unique last names
      const uniqueLastNames = [
        ...new Set(allHouseholds.map(household => household.last_name).filter(Boolean)),
      ];
      setLastNames(uniqueLastNames); // Set the unique last names

      setLoading(false);
    } catch (err) {
      console.error("Error fetching households:", err);
      setError("Error fetching households data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  // Handle filtering by last_name
  const handleFilterByLastName = (lastName) => {
    if (lastName === "") {
      setFilteredHouseholds(households);
    } else {
      const filtered = Object.fromEntries(
        Object.entries(households).filter(([key, members]) => 
          members.some(member => member.last_name === lastName)
        )
      );
      setFilteredHouseholds(filtered);
    }
  };

  // Handle clicking a household number to open the modal
  const handleHouseholdClick = (householdNumber) => {
    const householdMembers = households[householdNumber];
    setSelectedHousehold(householdMembers);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHousehold(null);
  };

  // If data is still loading, show loading spinner/message
  if (loading) {
    return <div className="text-center py-5">Loading households...</div>;
  }

  // If there was an error fetching the data, show an error message
  if (error) {
    return <div className="text-center py-5 text-red-500">{error}</div>;
  }

  // Filtered household list (ensure household_number is unique)
  const uniqueHouseholds = Object.keys(filteredHouseholds);

  return (
    <div className="h-screen py-7 bg-[#F4F1EC]">
      <div className="px-6 sm:px-8 md:px-16 xl:px-10 2xl:px-32">
        <h1 className="text-3xl font-bold mb-4 text-teal-600">Manage Households</h1>
        <p className="text-sm text-gray-500">Let's manage your barangay households today</p>

        {/* Filter Section */}
        <div className="flex gap-4 mt-7">
          <select 
            onChange={(e) => handleFilterByLastName(e.target.value)}
            className="p-3 rounded-md bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Filter by Last Name</option>
            {lastNames.map((lastName, index) => (
              <option key={index} value={lastName}>
                {lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Household List Section */}
        <div className="w-full h-auto mt-10 flex flex-col sm:flex-row justify-between gap-10">
          <div className="bg-white rounded-2xl p-6 w-full sm:w-8/12 h-full overflow-y-auto shadow-lg transition-all duration-300 hover:scale-105">
            <h3 className="font-semibold text-lg text-gray-700">Household List</h3>
            <div className="space-y-5 mt-5">
              {uniqueHouseholds.map((householdNumber) => (
                <div
                  key={householdNumber}
                  className="flex items-center gap-4 bg-[#F7F3EF] p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-teal-100"
                  onClick={() => handleHouseholdClick(householdNumber)} 
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base text-teal-600">{householdNumber}</span>
                  </div>

                  <div className="ml-auto flex items-center justify-center w-72">
                    <span className="font-medium text-sm sm:text-base text-gray-600">
                      {households && households[householdNumber] && households[householdNumber][0].last_name 
                        ? `${households[householdNumber][0].last_name} Family` 
                        : 'No household yet'}
                    </span>
                  </div>

                  <div className="ml-auto flex gap-3">
                    <button
                      onClick={() => handleHouseholdClick(householdNumber)} 
                      className="text-teal-600 hover:text-teal-800 transition-all duration-200"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <HouseholdModal selectedHousehold={selectedHousehold} closeModal={closeModal} />}
    </div>
  );
};

export default Households;
