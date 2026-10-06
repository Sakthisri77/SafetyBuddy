import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import {
  Shield,
  ShieldAlert,
  Navigation,
  FileText,
  Users,
  AlertOctagon,
  Watch,
  Cpu,
  Compass,
  History,
  Lock,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    safetyStatus,
    currentUser,
    loginAs,
    logout,
    emergencyState,
    triggerEmergency,
  } = useSafety();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Shield },
    { id: 'safe-route', label: 'Safe Route', icon: Navigation },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'network', label: 'Safety Network', icon: Users },
    { id: 'watch', label: 'Watch', icon: Watch },
    { id: 'ai-analysis', label: 'AI Safety', icon: Cpu },
    { id: 'pattern', label: 'My Pattern', icon: Compass },
    { id: 'history', label: 'History', icon: History },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'admin', label: 'Admin', icon: User },
  ];

  const isEmergency = safetyStatus === 'emergency' || emergencyState.isActive;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#EDE9FE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-md shadow-[#7C3AED]/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1E1B4B] group-hover:text-[#7C3AED] transition">
                SafetyBuddy
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-[#7C3AED] uppercase font-bold">
                Privacy-Preserving
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Status Indicator & Actions */}
        <div className="flex items-center gap-3">
          {/* Global Safety State Pill */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              isEmergency
                ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626] animate-pulse'
                : safetyStatus === 'warning' || safetyStatus === 'monitoring'
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
                : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isEmergency
                  ? 'bg-[#DC2626] animate-ping'
                  : safetyStatus === 'warning'
                  ? 'bg-[#D97706]'
                  : 'bg-[#059669]'
              }`}
            />
            <span>
              {isEmergency
                ? 'EMERGENCY ACTIVE'
                : safetyStatus === 'warning'
                ? 'SAFETY CHECK PENDING'
                : safetyStatus === 'monitoring'
                ? 'MONITORING AREA'
                : 'YOU ARE SAFE'}
            </span>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={() => triggerEmergency('Manual SOS button pressed in top navigation')}
            className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#DC2626]/20 transition cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EMERGENCY SOS</span>
            <span className="sm:hidden">SOS</span>
          </button>

          {/* User Profile / Demo Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-xs transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name[0]}
              </div>
              <span className="text-[#1E1B4B] font-semibold hidden md:inline truncate max-w-[90px]">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3 h-3 text-[#7C3AED]" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xl p-2 z-50 text-xs animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#F3F4F6]">
                  <div className="font-bold text-[#1E1B4B]">{currentUser.name}</div>
                  <div className="text-[11px] text-[#6B7280]">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-[#059669] mt-0.5 uppercase font-semibold">
                    Role: {currentUser.role}
                  </div>
                </div>

                <div className="p-1 space-y-1">
                  <div className="px-2 py-1 text-[10px] text-[#6B7280] font-semibold">
                    SWITCH DEMO PERSONA:
                  </div>
                  <button
                    onClick={() => {
                      loginAs('student');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                      currentUser.role === 'student'
                        ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold'
                        : 'text-[#4B5563] hover:bg-[#F5F3FF] hover:text-[#1E1B4B]'
                    }`}
                  >
                    Maya Lin (Student User)
                  </button>
                  <button
                    onClick={() => {
                      loginAs('parent');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                      currentUser.role === 'parent'
                        ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold'
                        : 'text-[#4B5563] hover:bg-[#F5F3FF] hover:text-[#1E1B4B]'
                    }`}
                  >
                    Sarah Chen (Parent)
                  </button>
                  <button
                    onClick={() => {
                      loginAs('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                      currentUser.role === 'admin'
                        ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold'
                        : 'text-[#4B5563] hover:bg-[#F5F3FF] hover:text-[#1E1B4B]'
                    }`}
                  >
                    Campus Admin
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-[#F3F4F6]">
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] transition flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#6D28D9] hover:bg-[#EDE9FE]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#EDE9FE] bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold'
                    : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
