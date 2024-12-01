// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Audit = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToken = () => {
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login'
    }
}

useEffect(() => {
    fetchToken();
}, [auditLogs]);


  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await axios.get('http://localhost/barangay/backend/audit/fetch.php');
        setData(response.data); // Assuming the API returns an array of audit logs
        setLoading(false);
      } catch (err) {
        setError('Error fetching audit data');
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
        <div className="bg-gray-800 text-white py-4 px-6">
          <h1 className="text-2xl font-bold">Audit Trail</h1>
        </div>
        <div className="overflow-x-auto py-6 px-4">
          <table className="min-w-full table-auto">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100">         
              <tr>
                <th className="py-3 px-6 text-left">Actor</th>
                <th className="py-3 px-6 text-left">Action</th>
                <th className="py-3 px-6 text-left">Details</th>
                <th className="py-3 px-6 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.audit_id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 text-sm text-gray-800">{`${entry.official_name} ${entry.official_last_name}`}</td>
                  <td className="py-3 px-6 text-sm text-gray-800">{entry.action}</td>
                  <td className="py-3 px-6 text-sm text-gray-800">{entry.details}</td>
                  <td className="py-3 px-6 text-sm text-gray-800">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Audit;
