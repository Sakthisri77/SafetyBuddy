import React from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Compass,
  MapPin,
  Navigation,
  Lock,
  Pause,
  Play,
  Trash2,
  CheckCircle2,
  Shield,
  Info,
} from 'lucide-react';

export const SafetyPatternPage: React.FC = () => {
  const {
    safeZones,
    frequentRoutes,
    privacy,
    pauseRoutineLearning,
    clearLearnedPatterns,
    isRouteDeviated,
  } = useSafety();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight">
              My Safety Pattern
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Personal safe-zone and routine learning running locally on-device.
            </p>
          </div>
        </div>

        {/* Section 16 Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={pauseRoutineLearning}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              privacy.routineLearningEnabled
                ? 'bg-white hover:bg-[#F5F3FF] text-[#1E1B4B] border-[#EDE9FE] shadow-2xs'
                : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
            }`}
          >
            {privacy.routineLearningEnabled ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Pause Routine Learning</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Resume Learning</span>
              </>
            )}
          </button>

          <button
            onClick={clearLearnedPatterns}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Learned Patterns</span>
          </button>
        </div>
      </div>

      {/* Prominent Core Philosophy Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-start gap-3.5 shadow-2xs">
        <Lock className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <span className="text-[#1E1B4B] font-bold block mb-0.5">
            “SafetyBuddy learns your normal movement patterns to help identify unusual deviations.”
          </span>
          Privacy boundary: Movement history is stored as abstract mathematical vectors inside local encrypted device memory only. The system does not maintain an unrestricted cloud log of past locations.
        </div>
      </div>

      {/* Grid: Frequent Locations & Frequent Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frequent Locations (Safe Zones) */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7C3AED]" />
              <span>Learned Frequent Locations ({safeZones.length})</span>
            </h2>
            <span className="text-[10px] text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg font-mono font-bold border border-[#A7F3D0]">
              Safe Haven Geofences
            </span>
          </div>

          <div className="space-y-3">
            {safeZones.map((zone) => (
              <div
                key={zone.id}
                className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-start justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E1B4B]">{zone.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED] font-semibold">
                      {zone.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1">{zone.address}</div>
                  <div className="text-[10px] text-[#059669] mt-2 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Typical visits: {zone.visitFrequency}</span>
                  </div>
                </div>
              </div>
            ))}

            {safeZones.length === 0 && (
              <div className="p-6 text-center text-xs text-[#6B7280]">
                Learned patterns cleared. New locations will populate as you travel.
              </div>
            )}
          </div>
        </div>

        {/* Frequent Routes */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1E1B4B] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#7C3AED]" />
              <span>Learned Transit Corridors ({frequentRoutes.length})</span>
            </h2>
            <span className="text-[10px] text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg font-mono font-bold">
              Deviation Reference
            </span>
          </div>

          <div className="space-y-3">
            {frequentRoutes.map((route) => (
              <div
                key={route.id}
                className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] space-y-2 shadow-2xs"
              >
                <div className="text-xs font-bold text-[#1E1B4B] flex items-center gap-1.5">
                  <span>{route.fromName}</span>
                  <span className="text-[#7C3AED]">→</span>
                  <span>{route.toName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Typical travel window: {route.timeOfDay}</span>
                  <span className="font-mono text-[#1E1B4B] font-bold">{route.typicalDurationMinutes} min</span>
                </div>
              </div>
            ))}

            {frequentRoutes.length === 0 && (
              <div className="p-6 text-center text-xs text-[#6B7280]">
                Learned routes cleared.
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs text-[#6B7280]">
            <span className="text-[#1E1B4B] font-bold block mb-0.5">
              Deviation Sensitivity
            </span>
            If you stray more than 100 meters off these verified corridors without an explicit pause, SafetyBuddy will initiate a 5-minute safety check.
          </div>
        </div>
      </div>
    </div>
  );
};
