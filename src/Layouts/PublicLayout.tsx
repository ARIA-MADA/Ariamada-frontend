// layouts/PublicLayout.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const location = useLocation();

  // Scroll automatique vers le haut à chaque changement de route
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]); // Déclenché à chaque changement de route

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <ChatbotButton position="bottom-right" />
      <Footer />
    </div>
  );
};

export default PublicLayout;