// routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Routes admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/dashboard/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;