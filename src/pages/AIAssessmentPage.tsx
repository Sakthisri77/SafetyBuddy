import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Compass,
  FileText,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

export const AIAssessmentPage: React.FC = () => {
  const { aiAssessment, watchTelemetry, isRouteDeviated, triggerEmergency } = useSafety();
  const [detailsOpen, setDetailsOpen] = useState<boolean>(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg border border-[#DDD6FE]">
                MULTI-SIGNAL FUSION ENGINE
              </span>
              <span className="text-xs text-[#6B7280]">Probabilistic Confidence Model</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              AI Safety Assessment & Explainability
            </h1>
          </div>
        </div>

        {/* Disclaimer badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs text-[#6B7280]">
          <Info className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>AI-assisted risk assessment (Probabilistic)</span>
        </div>
      </div>

      {/* Main Confidence Meter Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular / Meter Confidence Visual */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={
                    aiAssessment.emergencyConfidence >= 75
                      ? '#DC2626'
                      : aiAssessment.emergencyConfidence >= 50
                      ? '#D97706'
                      : '#7C3AED'
                  }
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * aiAssessment.emergencyConfidence) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[#1E1B4B] font-mono">
                  {aiAssessment.emergencyConfidence}%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-bold mt-0.5">
                  Emergency Confidence
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`text-sm font-extrabold px-3.5 py-1 rounded-xl border ${
                  aiAssessment.riskLevel === 'CRITICAL' || aiAssessment.riskLevel === 'HIGH'
                    ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                    : aiAssessment.riskLevel === 'MODERATE'
                    ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                    : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                }`}
              >
                {aiAssessment.riskLevel} RISK
              </span>
            </div>
          </div>

          {/* Section 22: WHY IS RISK HIGH / AI EXPLAINABILITY */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase">
                EXPLAINABILITY AUDIT
              </span>
              <h2 className="text-xl font-bold text-[#1E1B4B] mt-0.5">
                WHY IS RISK {aiAssessment.riskLevel}?
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Transparency guarantee: Every risk evaluation is grounded in traceable, verifiable sensor and environmental signals.
              </p>
            </div>

            <div className="space-y-2 mt-3">
              {aiAssessment.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-start gap-2.5 text-xs text-[#1E1B4B]"
                >
                  <span
                    className={`mt-0.5 font-bold ${
                      aiAssessment.riskLevel === 'HIGH' || aiAssessment.riskLevel === 'CRITICAL'
                        ? 'text-[#DC2626]'
                        : 'text-[#059669]'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="leading-relaxed font-medium">{reason}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs">
              <span className="text-[#7C3AED] font-bold">Engine Recommendation:</span>
              <p className="text-[#1E1B4B] mt-0.5 font-medium">{aiAssessment.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Signal Input Vector Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold">
            MULTI-SIGNAL INPUT MATRIX (8 LIVE VECTORS)
          </h3>
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>{detailsOpen ? 'Hide Signal Weights' : '[View Detailed Analysis]'}</span>
            {detailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {detailsOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* 1. Location Risk */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">1. Location Risk</div>
              <div className="text-base font-bold text-[#1E1B4B] mt-1">{aiAssessment.locationRisk}</div>
              <div className="text-[10px] text-[#6B7280] mt-1">Geo-fenced cluster match</div>
            </div>

            {/* 2. Route Deviation */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">2. Route Deviation</div>
              <div
                className={`text-base font-bold mt-1 ${
                  isRouteDeviated ? 'text-[#D97706]' : 'text-[#059669]'
                }`}
              >
                {isRouteDeviated ? 'YES (Diverged)' : 'NO (On Path)'}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Routine corridor model</div>
            </div>

            {/* 3. Previous Reports */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">3. Previous Reports</div>
              <div className="text-base font-bold text-[#1E1B4B] mt-1">
                {aiAssessment.previousReportsLevel}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Crowdsourced alerts</div>
            </div>

            {/* 4. User Response */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">4. User Response</div>
              <div
                className={`text-base font-bold mt-1 ${
                  aiAssessment.userResponseStatus === 'NO_RESPONSE'
                    ? 'text-[#DC2626]'
                    : aiAssessment.userResponseStatus === 'WAITING'
                    ? 'text-[#D97706]'
                    : 'text-[#059669]'
                }`}
              >
                {aiAssessment.userResponseStatus.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">5-min check status</div>
            </div>

            {/* 5. Heart Rate */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">5. Heart Rate</div>
              <div
                className={`text-base font-bold mt-1 ${
                  aiAssessment.heartRateStatus !== 'NORMAL' ? 'text-[#DC2626]' : 'text-[#059669]'
                }`}
              >
                {aiAssessment.heartRateStatus} ({watchTelemetry.heartRate} BPM)
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Baselines evaluated</div>
            </div>

            {/* 6. Stress Telemetry */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">6. Stress Index</div>
              <div className="text-base font-bold text-[#1E1B4B] mt-1">
                {aiAssessment.stressStatus}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Galvanic/HRV tone</div>
            </div>

            {/* 7. Time Risk */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">7. Time of Day</div>
              <div className="text-base font-bold text-[#1E1B4B] mt-1">{aiAssessment.timeRisk}</div>
              <div className="text-[10px] text-[#6B7280] mt-1">Lighting heuristics</div>
            </div>

            {/* 8. Crowd Density */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDE9FE] shadow-2xs">
              <div className="text-[10px] text-[#6B7280] uppercase font-mono">8. Crowd Density</div>
              <div className="text-base font-bold text-[#1E1B4B] mt-1">
                {aiAssessment.crowdRisk}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Pedestrian presence</div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Escalation Override if High */}
      {aiAssessment.emergencyConfidence >= 65 && (
        <div className="p-5 rounded-3xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="font-bold text-sm text-[#DC2626] block">
              Confidence threshold exceeded for automated escalation.
            </span>
            <span className="text-xs text-[#6B7280]">
              You can trigger manual SOS immediately or verify status.
            </span>
          </div>

          <button
            onClick={() => triggerEmergency('Manual trigger from AI Assessment page')}
            className="px-5 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-xs transition cursor-pointer shadow-md shadow-[#DC2626]/20"
          >
            ENGAGE EMERGENCY ESCALATION
          </button>
        </div>
      )}
    </div>
  );
};
