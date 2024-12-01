import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToken = () => {
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/login'
    }
}

useEffect(() => {
    fetchToken();
}, [transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost/barangay/backend/transaction/fetch.php");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (transactionId) => {
    try {
      const response = await axios.post("http://localhost/barangay/backend/transaction/update.php", {
        transaction_id: transactionId,
        payment_status: "Paid"
      });

      if (response.data.status === "success") {
        toast.success("Payment status updated to 'Paid'");
        fetchTransactions(); 
      } else {
        toast.error("Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Error updating payment status.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6">Transaction History</h2>

      {loading ? (
        <div className="text-center text-xl text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-2">Transaction Code</th>
                <th className="px-4 py-2">Resident Name</th>
                <th className="px-4 py-2">Certificate</th>
                <th className="px-4 py-2">Payment Status</th>
                <th className="px-4 py-2">Amount</th>
                {/* <th className="px-4 py-2">Date Issued</th> */}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.transaction_id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{transaction.transaction_code}</td>
                    <td className="px-4 py-2 border">{transaction.resident_id}</td>
                    <td className="px-4 py-2 border">{transaction.certificate}</td>
                    <td className="px-4 py-2 border">{transaction.payment_status}</td>
                    <td className="px-4 py-2 border">{transaction.payment_fee}</td>
                    {/* <td className="px-4 py-2 border">{transaction.date_issued}</td> */}
                    <td className="px-4 py-2 border">
                      {transaction.payment_status !== "Paid" ? (
                        <button
                          onClick={() => handleUpdateStatus(transaction.transaction_id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <span className="text-green-500">Paid</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 border text-center text-gray-500">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
