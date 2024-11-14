    // AddPurokModal.js
    import React, { useState } from 'react';
    import axios from 'axios';
    import { toast } from 'sonner';

    const AddPurokModal = ({ isOpen, onClose }) => {
    const [purokName, setPurokName] = useState('');

    const handleAddPurok = async () => {
        if (purokName.trim() === '') {
        alert('Purok name cannot be empty');
        return;
        }

        try{
            const res = await axios.post('http://localhost/barangay/backend/barangay/addPurok.php', {
            purok_name: purokName
            });
            if(res.data.status ==='success'){
                toast.success('Purok added successfully');
            }
        }
        catch(err){
            toast.error('Error adding Purok');
            console.error(err);
    
        }
        setPurokName('');
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Purok</h2>

            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Purok Name</label>
                <input
                type="text"
                value={purokName}
                onChange={(e) => setPurokName(e.target.value)}
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
                onClick={handleAddPurok}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
                Add Purok
            </button>
            </div>
        </div>
        </div>
    );
    };

    export default AddPurokModal;
