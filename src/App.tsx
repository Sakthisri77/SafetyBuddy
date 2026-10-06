import React from 'react';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SafeRoutePage } from './pages/SafeRoutePage';
import { SafetyReportsPage } from './pages/SafetyReportsPage';
import { WatchPage } from './pages/WatchPage';
import { AIAssessmentPage } from './pages/AIAssessmentPage';
import { SafetyPatternPage } from './pages/SafetyPatternPage';
import { SafetyNetworkPage } from './pages/SafetyNetworkPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { EmergencyOverlay } from './components/emergency/EmergencyOverlay';
import { SafetyCheckModal } from './components/emergency/SafetyCheckModal';
import { PostIncidentReportModal } from './components/emergency/PostIncidentReportModal';
import { DemoSimulationBar } from './components/demo/DemoSimulationBar';
import { ToastContainer } from './components/common/ToastContainer';

function MainAppContent() {
  const { activeView } = useSafety();

  if (activeView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#171717] flex flex-col pb-24 xl:pb-12">
      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full animate-in fade-in duration-150">
        {activeView === 'dashboard' && <DashboardPage />}
        {activeView === 'safe-route' && <SafeRoutePage />}
        {activeView === 'reports' && <SafetyReportsPage />}
        {activeView === 'network' && <SafetyNetworkPage />}
        {activeView === 'watch' && <WatchPage />}
        {activeView === 'ai-analysis' && <AIAssessmentPage />}
        {activeView === 'pattern' && <SafetyPatternPage />}
        {activeView === 'privacy' && <PrivacyCenterPage />}
        {activeView === 'history' && <HistoryPage />}
        {activeView === 'admin' && <AdminDashboardPage />}
        {activeView === 'profile' && <ProfilePage />}
        {activeView === 'emergency' && <EmergencyOverlay />}
      </main>

      {/* Global Overlays & Modals */}
      <EmergencyOverlay />
      <SafetyCheckModal />
      <PostIncidentReportModal />
      <ToastContainer />
      <DemoSimulationBar />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <SafetyProvider>
      <MainAppContent />
    </SafetyProvider>
  );
}
