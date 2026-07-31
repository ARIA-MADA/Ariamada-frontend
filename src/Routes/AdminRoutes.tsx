// routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminLogin from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AdminLayout>
            <AdminLogin />
          </AdminLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AdminLayout>
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;