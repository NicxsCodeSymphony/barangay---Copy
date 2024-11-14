import React from 'react';
import { FaTimes } from 'react-icons/fa';

const HouseholdModal = ({ selectedHousehold, closeModal }) => {
  if (!selectedHousehold) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-12 rounded-lg w-11/12 sm:w-9/12 md:w-3/4 lg:w-2/3 xl:w-7/12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Household Details</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Family Member Section */}
        <div className="flex gap-10 overflow-x-auto mt-5">
          {selectedHousehold.map((member, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              {/* Picture Frame Design */}
              <div className="relative">
                <img
                  src={`http://localhost/barangay/backend/resident/${member.image }`|| "https://via.placeholder.com/200"}
                  alt={`${member.first_name} ${member.last_name}`}
                  className="w-48 h-48 object-cover rounded-xl shadow-lg border-8 border-gray-300"
                />
                {/* Picture Frame Border */}
                <div className="absolute top-0 left-0 right-0 bottom-0 border-8 border-yellow-500 rounded-xl shadow-2xl"></div>
              </div>

              <span className="font-medium text-xl text-center">
                {member.first_name} {member.last_name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={closeModal}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseholdModal;
