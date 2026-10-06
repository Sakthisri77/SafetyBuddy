import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import {
  Shield,
  Navigation,
  FileText,
  Users,
  User,
  AlertOctagon,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, triggerEmergency, emergencyState } = useSafety();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Shield },
    { id: 'safe-route', label: 'Route', icon: Navigation },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-[#EDE9FE] backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 p-1.5 transition cursor-pointer ${
              isActive ? 'text-[#7C3AED] font-bold' : 'text-[#6B7280] hover:text-[#1E1B4B]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
