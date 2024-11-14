import React, { useState } from "react";

const generateTransactionCode = () => {
  const length = 10; 
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

const TransactionModal = ({ show, transactionDetails, onConfirm, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("Pending");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const randomTransactionCode = generateTransactionCode();

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[450px] max-w-[90%] shadow-lg text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction Details</h3>
        
        <div className="text-left text-sm text-gray-700 mb-6 space-y-4 px-4">
          <div>
            <p><strong>Transaction Code:</strong> {randomTransactionCode}</p>
          </div>
          <div>
            <p><strong>Resident:</strong> {transactionDetails.resident_name}</p>
          </div>
          <div>
            <p><strong>Payment Fee:</strong> ₱{transactionDetails.payment_fee}</p>
          </div>
          <div>
            <p><strong>Payment Status:</strong> {transactionDetails.payment_status || "Pending"}</p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="payment-method" className="block text-sm font-semibold text-gray-600 mb-2">Payment Method:</label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md"
          >
            <option value="Pending" disabled>Choose a Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
            <option value="PayMaya">PayMaya</option>
          </select>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => onConfirm({ ...transactionDetails, payment_method: paymentMethod,  transaction_code: randomTransactionCode })}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
          >
            Confirm and Print
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
