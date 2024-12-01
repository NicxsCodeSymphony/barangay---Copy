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
import AuditLogs from "./admin/audit";

// import Home from "./LandingPage";

const App = () => {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        <Route path="/login" element={<Login />} />
        
        <Route path="/qr" element={<QrCodeScanner />} />

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="officials" element={<Officials />} />
          <Route path="residents" element={<Residents />} />
          <Route path="households" element={<Households />} />
          <Route path="transaction" element={<TransactionHistory />} />
          <Route path="logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
