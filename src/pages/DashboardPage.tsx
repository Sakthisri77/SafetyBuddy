import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { LiveSafetyMap } from '../components/map/LiveSafetyMap';
import { ReportUnsafeModal } from '../components/reports/ReportUnsafeModal';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Navigation,
  FileText,
  AlertOctagon,
  Watch,
  Heart,
  Activity,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Compass,
  CheckCircle2,
  RefreshCw,
  Bell,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    safetyStatus,
    riskLevel,
    routeStatus,
    location,
    accuracy,
    isTracking,
    locationStatus,
    requestLocationPermission,
    currentAreaName,
    currentAreaRisk,
    watchTelemetry,
    isWatchAboveBaseline,
    activeWatchModel,
    aiAssessment,
    privacy,
    setActiveView,
    triggerEmergency,
    selectedRoute,
    promptSafetyCheck,
    isRouteDeviated,
    emergencyState,
    addToast,
  } = useSafety();

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Status mapping for Section 40
  const isEmergency = safetyStatus === 'emergency' || emergencyState.isActive;
  const isWarning = safetyStatus === 'warning' || isRouteDeviated;

  const safetyDisplay = isEmergency ? 'EMERGENCY' : isWarning ? 'WARNING' : 'SAFE';

  const privacyDisplay = emergencyState.locationSharingAuthorized
    ? 'AUTHORIZED EMERGENCY SHARING'
    : isWarning
    ? 'LIMITED SHARING'
    : 'PROTECTED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Section 42 Product Philosophy Statement */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#EDE9FE]/60 via-white to-[#F5F3FF] border border-[#DDD6FE] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#7C3AED] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black tracking-wide text-[#1E1B4B] flex items-center gap-2">
              <span>“Protect the person. Protect their privacy.”</span>
              <span className="hidden sm:inline text-[10px] font-mono font-bold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-lg border border-[#DDD6FE]">
                ZERO-KNOWLEDGE-INSPIRED
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              SafetyBuddy detects unusual situations while minimizing unnecessary exposure of personal location data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs shrink-0 font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] shadow-2xs">
            <span className="text-[#6B7280]">Safety:</span>
            <span
              className={`font-bold ${
                isEmergency
                  ? 'text-[#DC2626]'
                  : isWarning
                  ? 'text-[#D97706]'
                  : 'text-[#059669]'
              }`}
            >
              {safetyDisplay}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] shadow-2xs">
            <span className="text-[#6B7280]">Privacy:</span>
            <span className="text-[#7C3AED] font-bold">{privacyDisplay}</span>
          </div>
        </div>
      </div>

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
            Good morning, {currentUser.name}.
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Current transit monitoring active • Destination:{' '}
            <span className="text-[#1E1B4B] font-semibold">SRM TRP Engineering College</span>
          </p>
        </div>

        {/* GPS Status Check */}
        <div className="flex items-center gap-2 text-xs">
          {locationStatus === 'denied' || locationStatus === 'unavailable' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Calibrated GPS Mode</span>
              <button
                onClick={requestLocationPermission}
                className="underline text-[11px] font-bold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer"
              >
                Retry GPS
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#EDE9FE] text-[#6B7280] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-medium text-[#1E1B4B]">GPS Tracking Active (±{accuracy}m)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Section 34 Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Central Workspace: Large Map + Quick Actions (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Map Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1E1B4B]">LIVE JOURNEY CORRIDOR</h2>
                  <span className="text-[11px] text-[#6B7280]">
                    Protected Client-Side Geofencing
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('safe-route')}
                  className="text-xs text-[#7C3AED] hover:text-[#6D28D9] font-bold flex items-center gap-1 cursor-pointer bg-[#F5F3FF] hover:bg-[#EDE9FE] px-3 py-1.5 rounded-xl transition"
                >
                  <span>Plan Safe Route</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Map Engine */}
            <LiveSafetyMap height="h-[430px]" />

            {/* Route Status Strip */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-[#6B7280]">Current Path:</span>
                <span className="font-semibold text-[#1E1B4B]">
                  Tech Campus → SRM TRP Engineering College
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                    isRouteDeviated
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#DCFCE7] text-[#15803D]'
                  }`}
                >
                  {routeStatus}
                </span>
              </div>

              <div className="font-mono text-[11px] text-[#6B7280]">
                ETA: 18 min • Safety Score: <span className="font-bold text-[#7C3AED]">91/100</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold mb-3.5">
              QUICK ACTIONS
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveView('safe-route')}
                className="p-4 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-left transition group cursor-pointer shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition shadow-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#1E1B4B]">Start Safe Route</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">Find safe corridor</div>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="p-4 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-left transition group cursor-pointer shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#1E1B4B]">Report Hazard</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">Anonymous report</div>
              </button>

              <button
                onClick={() => {
                  promptSafetyCheck();
                }}
                className="p-4 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-left transition group cursor-pointer shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#1E1B4B]">I&apos;m Safe</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5">Confirm status</div>
              </button>

              <button
                onClick={() => triggerEmergency('Emergency SOS button pressed on Dashboard')}
                className="p-4 rounded-2xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-left transition group cursor-pointer shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#DC2626] text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition shadow-xs">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div className="text-xs font-black text-[#DC2626]">Emergency SOS</div>
                <div className="text-[10px] text-[#B91C1C] mt-0.5">Instant alert</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Panels: Safety Status, Risk, Watch, Emergency (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel 1: SAFETY STATUS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C3AED] font-bold">
                SAFETY STATUS
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${
                  isEmergency
                    ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] animate-pulse'
                    : isWarning
                    ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                    : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                }`}
              >
                {safetyDisplay}
              </span>
            </div>

            <div className="mt-3.5 flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isEmergency
                    ? 'bg-[#FEF2F2] text-[#DC2626] animate-bounce'
                    : isWarning
                    ? 'bg-[#FFFBEB] text-[#D97706]'
                    : 'bg-[#ECFDF5] text-[#059669]'
                }`}
              >
                {isEmergency ? (
                  <ShieldAlert className="w-7 h-7" />
                ) : isWarning ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1E1B4B] tracking-tight">
                  {isEmergency
                    ? 'EMERGENCY ALERT'
                    : isWarning
                    ? 'MONITORING DEVIATION'
                    : 'YOU ARE SAFE'}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {isEmergency
                    ? 'Authorized sharing armed.'
                    : isWarning
                    ? 'Movement divergence flagged.'
                    : 'Normal safe corridor detected.'}
                </p>
              </div>
            </div>

            {/* 4 Pillars Status Checklist */}
            <div className="mt-5 space-y-2.5 pt-4 border-t border-[#F3F4F6] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Route:</span>
                <span
                  className={`font-semibold ${
                    isRouteDeviated ? 'text-[#D97706]' : 'text-[#059669]'
                  }`}
                >
                  {routeStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Location:</span>
                <span className="font-semibold text-[#7C3AED] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#7C3AED]" /> PROTECTED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Watch:</span>
                <span className="font-semibold text-[#059669]">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Privacy:</span>
                <span className="font-semibold text-[#059669]">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Panel 2: CURRENT AREA RISK */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C3AED] font-bold">
                CURRENT AREA
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                  currentAreaRisk.riskLevel === 'HIGH' || currentAreaRisk.riskLevel === 'CRITICAL'
                    ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                    : currentAreaRisk.riskLevel === 'MODERATE'
                    ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                    : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                }`}
              >
                {currentAreaRisk.riskLevel} RISK
              </span>
            </div>

            <h4 className="text-base font-bold text-[#1E1B4B]">{currentAreaName}</h4>

            <div className="mt-3 space-y-1.5 text-xs text-[#6B7280]">
              <div className="flex items-center justify-between">
                <span>• Previous reports</span>
                <span className="text-[#1E1B4B] font-semibold">
                  {currentAreaRisk.score > 40 ? '15 reports' : '2 reports'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Crowd density</span>
                <span className="text-[#1E1B4B] font-semibold">Moderate crowd</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Lighting conditions</span>
                <span className="text-[#1E1B4B] font-semibold">
                  {currentAreaRisk.riskLevel === 'HIGH' ? 'Low-light area' : 'Active streetlights'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F3F4F6]">
              <button
                onClick={() => setActiveView('reports')}
                className="w-full py-2.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-xs font-bold text-[#7C3AED] border border-[#DDD6FE] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>View Area Reports</span>
              </button>
            </div>
          </div>

          {/* Panel 3: SMARTWATCH TELEMETRY CARD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C3AED] font-bold flex items-center gap-1.5">
                <Watch className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="truncate max-w-[150px]">
                  {activeWatchModel ? activeWatchModel.name : 'WATCH TELEMETRY'}
                </span>
              </span>
              <span className="text-[9px] font-mono text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                SIMULATED DATA
              </span>
            </div>

            <div className="flex items-center justify-between mt-3.5">
              <div>
                <div className="text-2xl font-black text-[#1E1B4B] font-mono flex items-center gap-1.5">
                  <Heart
                    className={`w-5 h-5 ${
                      isWatchAboveBaseline
                        ? 'text-[#DC2626] animate-ping'
                        : 'text-[#059669]'
                    }`}
                  />
                  <span>{watchTelemetry.heartRate}</span>
                  <span className="text-xs font-normal text-[#6B7280]">BPM</span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  Baseline: {activeWatchModel ? `${activeWatchModel.characteristics.baselineHrMin}–${activeWatchModel.characteristics.baselineHrMax}` : '72–90'} BPM • SpO₂ {watchTelemetry.spo2}%
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                    isWatchAboveBaseline
                      ? 'bg-[#FEF2F2] text-[#DC2626]'
                      : 'bg-[#ECFDF5] text-[#059669]'
                  }`}
                >
                  {isWatchAboveBaseline ? 'ABOVE BASELINE' : 'NORMAL RANGE'}
                </span>
                <div className="text-[11px] text-[#6B7280] mt-1">
                  Stress: <span className="text-[#1E1B4B] font-bold">{watchTelemetry.stressLevel}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F3F4F6]">
              <button
                onClick={() => setActiveView('watch')}
                className="w-full py-2.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-xs font-bold text-[#7C3AED] border border-[#DDD6FE] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Full Telemetry & Biometrics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Panel 4: AI SAFETY CONFIDENCE METER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7C3AED] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>AI SAFETY ASSESSMENT</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#7C3AED]">
                {aiAssessment.emergencyConfidence}% Confidence
              </span>
            </div>

            <div className="w-full bg-[#EDE9FE] h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  aiAssessment.emergencyConfidence >= 75
                    ? 'bg-[#DC2626]'
                    : aiAssessment.emergencyConfidence >= 50
                    ? 'bg-[#D97706]'
                    : 'bg-[#059669]'
                }`}
                style={{ width: `${aiAssessment.emergencyConfidence}%` }}
              />
            </div>

            <div className="mt-3 text-[11px] text-[#6B7280] line-clamp-2">
              {aiAssessment.reasons[0] || 'Normal activity detected along expected transit.'}
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F3F4F6]">
              <button
                onClick={() => setActiveView('ai-analysis')}
                className="w-full py-2.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-xs font-bold text-[#7C3AED] border border-[#DDD6FE] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explainable AI Signals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Unsafe Place Modal */}
      <ReportUnsafeModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
