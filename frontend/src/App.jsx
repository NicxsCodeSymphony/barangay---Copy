import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import { useState, useEffect } from "react";

import Login from "./auth/Login";
import QrCodeScanner from "./auth/Qr";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./admin/dashboard";
import Officials from "./admin/official";
import Residents from "./admin/resident";
import Households from "./admin/household";
import TransactionHistory from "./admin/transaction";
import Audit from "./admin/audit";

const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = () => localStorage.getItem("token");
    setAuth(token() !== null);
  }, []);

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={!auth ? <Login /> : <Navigate to="/admin/dashboard" />} />
        
        <Route path="/qr" element={!auth ? <QrCodeScanner /> : <Navigate to="/admin/dashboard" />} />

        <Route path="/admin/*" element={auth ? <AdminLayout /> : <Navigate to="/" />}>
          <Route path="dashboard" element={auth ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="officials" element={auth ? <Officials /> : <Navigate to="/" />} />
          <Route path="residents" element={auth ? <Residents /> : <Navigate to="/" />} />
          <Route path="households" element={auth ? <Households /> : <Navigate to="/" />} />
          <Route path="transaction" element={auth ? <TransactionHistory /> : <Navigate to="/" />} />
          <Route path="auditTrail" element={auth ? <Audit /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
