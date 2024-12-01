import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';

import Login from "./auth/Login";
import QrCodeScanner from "./auth/Qr";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./admin/dashboard";
import Officials from "./admin/official";
import Residents from "./admin/resident";
import Households from "./admin/household";
import TransactionHistory from "./admin/transaction";
<<<<<<< HEAD
import AuditLogs from "./admin/audit";

// import Home from "./LandingPage";
=======
import Audit from "./admin/audit";
>>>>>>> 140ef3a258009c0fe90cb4cd7d39ff4b7801ee0a

const App = () => {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        
        <Route path="/qr" element={<QrCodeScanner />} />

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="officials" element={<Officials />} />
          <Route path="residents" element={<Residents />} />
          <Route path="households" element={<Households />} />
          <Route path="transaction" element={<TransactionHistory />} />
          <Route path="logs" element={<AuditLogs />} />
=======
        <Route path="/admin/*" element={auth ? <AdminLayout /> : <Navigate to="/" />}>
          <Route path="dashboard" element={auth ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="officials" element={auth ? <Officials /> : <Navigate to="/" />} />
          <Route path="residents" element={auth ? <Residents /> : <Navigate to="/" />} />
          <Route path="households" element={auth ? <Households /> : <Navigate to="/" />} />
          <Route path="transaction" element={auth ? <TransactionHistory /> : <Navigate to="/" />} />
          <Route path="auditTrail" element={auth ? <Audit /> : <Navigate to="/" />} />
>>>>>>> 140ef3a258009c0fe90cb4cd7d39ff4b7801ee0a
        </Route>
      </Routes>
    </>
  );
};

export default App;
