// layouts/AdminLayout.tsx
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <div className="min-h-screen">{children}</div>;
};

export default AdminLayout;