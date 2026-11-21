// VillageVerse AI: Spatial Aurora Master Application Layout (Protected Routes)
import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovernmentBanner } from './GovernmentBanner';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { FloatingChatbot } from '../common/FloatingChatbot';

export const AppLayout: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-white">
      {/* 1. Animated Ambient Aurora Light Mesh */}
      <div className="aurora-bg">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
      </div>

      {/* 2. Cybernetic Spatial Grid Overlay */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* 3. Official Government Banner */}
      <div className="relative z-30">
        <GovernmentBanner />
      </div>

      <div className="flex flex-1 relative z-10">
        {/* 4. Arc-Style Floating Translucent Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* 5. Main Content Deck */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
          <Navbar
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            mobileSidebarOpen={mobileSidebarOpen}
          />

          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 relative z-10 animate-in fade-in duration-300">
            <Outlet />
          </main>
        </div>
      </div>

      {/* 6. Floating AI Chatbot Assistant */}
      <FloatingChatbot />
    </div>
  );
};
