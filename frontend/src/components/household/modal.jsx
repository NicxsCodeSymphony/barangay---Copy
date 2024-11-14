import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AddHouseholdModal = ({ isOpen, onClose }) => {
  const [householdNumber, setHouseholdNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await axios.post('http://localhost/barangay/backend/household/addHousehold.php', {household_number: householdNumber})
        if(res.data.status === "success"){
            toast.success(res.data.message)
            onClose()
        }else{
            toast.error(res.data.message)
        }
    }
    catch(err){
        toast.error(err.message)
        console.error(err)
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h4 className="text-xl font-semibold mb-4">Add Household</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="household_number" className="block text-sm font-medium text-gray-700">Household Number</label>
            <input
              type="text"
              id="household_number"
              value={householdNumber}
              onChange={(e) => setHouseholdNumber(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Add Household
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHouseholdModal;
