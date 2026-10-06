import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Users,
  ShieldCheck,
  Radio,
  Lock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

export const SafetyNetworkPage: React.FC = () => {
  const { nearbyUsers, toggleNearbyAvailability, privacy, updatePrivacy, addToast } = useSafety();
  const [isAvailableToHelp, setIsAvailableToHelp] = useState<boolean>(true);

  const handleHelpToggle = () => {
    const nextVal = !isAvailableToHelp;
    setIsAvailableToHelp(nextVal);
    if (nextVal) {
      addToast('Status Updated', 'You are marked AVAILABLE to assist nearby users in verified emergencies.', 'success');
    } else {
      addToast('Status Updated', 'Nearby helper availability paused.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg border border-[#DDD6FE]">
                PEER-TO-PEER GUARDIANS
              </span>
              <span className="text-xs text-[#6B7280]">Decentralized Mesh</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              Nearby Safety Network
            </h1>
          </div>
        </div>

        {/* Opt-in Community Guard Button */}
        <button
          onClick={handleHelpToggle}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shadow-md ${
            isAvailableToHelp
              ? 'bg-[#7C3AED] text-white shadow-[#7C3AED]/20'
              : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{isAvailableToHelp ? "I'M AVAILABLE TO HELP" : 'STANDBY (PAUSED)'}</span>
        </button>
      </div>

      {/* Simulated Community Alert Banner */}
      <div className="p-5 rounded-3xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#92400E] flex items-center gap-2">
              <span>Community Guardian Broadcast</span>
              <span className="text-[10px] bg-white text-[#B45309] px-2.5 py-0.5 rounded-lg font-mono font-bold border border-[#FDE68A]">
                Standby Channel
              </span>
            </div>
            <p className="text-xs text-[#B45309] mt-0.5">
              “Someone nearby may need assistance.” If an emergency triggers within 500m, opted-in buddies receive non-precise sector alerts to assist or call campus security.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] text-xs text-[#6B7280] flex items-start gap-3 shadow-2xs">
        <Lock className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="text-[#1E1B4B] font-bold">Privacy boundary: </span>
          Nearby users never see your exact identity, real phone number, or precise home address. Peer-to-peer assistance uses pseudonymous temporary codenames (#A21, #B17) and radial approximation.
        </p>
      </div>

      {/* Nearby Active Users Grid */}
      <div className="space-y-3.5">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold">
          VERIFIED SAFETYBUDDY MEMBERS IN PROXIMITY (RADIUS &lt; 800M)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyUsers.map((user) => (
            <div
              key={user.id}
              className="p-5 rounded-3xl bg-white border border-[#EDE9FE] space-y-3 shadow-sm hover:border-[#DDD6FE] transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-xs font-bold font-mono">
                    {user.codename.replace('SafetyBuddy User #', '')}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1E1B4B]">{user.codename}</h3>
                    <span className="text-[10px] text-[#6B7280] flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 text-[#7C3AED]" /> {user.distanceMeters} m away
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                    user.available
                      ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                      : 'bg-[#F3F4F6] text-[#6B7280]'
                  }`}
                >
                  {user.available ? 'Available' : 'Busy'}
                </span>
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                <span>Identity: Pseudonymous</span>
                <span className="text-[#059669] font-medium flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Campus Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
