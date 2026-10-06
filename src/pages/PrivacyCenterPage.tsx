import React from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Lock,
  Unlock,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  Compass,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Info,
} from 'lucide-react';

export const PrivacyCenterPage: React.FC = () => {
  const { privacy, updatePrivacy, safetyStatus, emergencyState, isRouteDeviated } = useSafety();

  const isEmergency = safetyStatus === 'emergency' || emergencyState.isActive;
  const isWarning = safetyStatus === 'warning' || isRouteDeviated;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner: LOCATION PRIVACY ACTIVE */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg border border-[#DDD6FE]">
                LOCATION PRIVACY ACTIVE
              </span>
              <span className="text-xs text-[#6B7280]">Zero-Knowledge Inspired</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              Privacy-Preserving Location Architecture
            </h1>
          </div>
        </div>

        {/* Dynamic Privacy State Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs">
          <span className="text-[#6B7280]">Current Status:</span>
          <span
            className={`font-bold ${
              isEmergency
                ? 'text-[#DC2626]'
                : isWarning
                ? 'text-[#D97706]'
                : 'text-[#059669]'
            }`}
          >
            {isEmergency
              ? 'Precise location sharing is available only to authorized contacts.'
              : isWarning
              ? 'Area-level safety information is being used.'
              : 'Exact location is protected.'}
          </span>
        </div>
      </div>

      {/* Section 7 Architecture Diagram */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold mb-6 text-center">
          ZERO-KNOWLEDGE-INSPIRED DATA FLOW PIPELINE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center font-mono font-bold text-xs">
              1
            </div>
            <div className="text-xs font-bold text-[#1E1B4B]">LIVE GPS</div>
            <p className="text-[10px] text-[#6B7280]">
              Continuous browser watchPosition maintained strictly in volatile RAM.
            </p>
          </div>

          <div className="flex justify-center text-[#7C3AED] font-bold">
            <ArrowDown className="w-5 h-5 md:-rotate-90" />
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <div className="text-xs font-bold text-[#1E1B4B]">PRIVACY LAYER</div>
            <p className="text-[10px] text-[#6B7280]">
              Spatial hashing & truncation into generalized 500m sector blocks.
            </p>
          </div>

          <div className="flex justify-center text-[#7C3AED] font-bold">
            <ArrowDown className="w-5 h-5 md:-rotate-90" />
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <div className="text-xs font-bold text-[#1E1B4B]">RISK / ZONE ANALYSIS</div>
            <p className="text-[10px] text-[#6B7280]">
              Queries historical crime and community reports for sector without leaking identity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#F3F4F6]">
          <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1B4B]">
              <div className="w-5 h-5 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-[10px] font-mono">
                4
              </div>
              <span>MINIMUM NECESSARY DATA</span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              During standard transit, only an abstract boolean status (e.g. &quot;On Normal Route&quot;) is surfaced. Exact lat/long is never transmitted to servers or peers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#065F46]">
              <div className="w-5 h-5 rounded-lg bg-[#059669] text-white flex items-center justify-center text-[10px] font-mono">
                5
              </div>
              <span>AUTHORIZED EMERGENCY SHARING</span>
            </div>
            <p className="text-[11px] text-[#047857] leading-relaxed">
              When an escalating emergency is confirmed, exact coordinates are released exclusively to authorized parent contacts, with an instant revoke switch.
            </p>
          </div>
        </div>
      </div>

      {/* Section 7 Privacy Controls & Toggles */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold">
          USER PRIVACY PREFERENCES & CONTROLS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle 1: Location Sharing */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-bold text-[#1E1B4B]">On-Device Location Processing</div>
              <div className="text-[11px] text-[#6B7280]">
                Keep raw GPS encrypted in memory; compute routes on client.
              </div>
            </div>
            <button
              onClick={() =>
                updatePrivacy({
                  locationProcessingActive: !privacy.locationProcessingActive,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacy.locationProcessingActive ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy.locationProcessingActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Emergency Sharing */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-bold text-[#1E1B4B]">Emergency Location Sharing Protocol</div>
              <div className="text-[11px] text-[#6B7280]">
                Allow trusted parents to receive live coordinates during SOS.
              </div>
            </div>
            <button
              onClick={() =>
                updatePrivacy({
                  emergencySharingAuthorized: !privacy.emergencySharingAuthorized,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacy.emergencySharingAuthorized ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy.emergencySharingAuthorized ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Parent Routine Visibility */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-bold text-[#1E1B4B]">Parent Routine Visibility</div>
              <div className="text-[11px] text-[#6B7280]">
                Only show safe transit arrival badges, never routine breadcrumbs.
              </div>
            </div>
            <button
              onClick={() =>
                updatePrivacy({
                  parentLiveVisibility: !privacy.parentLiveVisibility,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacy.parentLiveVisibility ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy.parentLiveVisibility ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: Nearby User Visibility */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-bold text-[#1E1B4B]">Nearby Peer Network Opt-In</div>
              <div className="text-[11px] text-[#6B7280]">
                Participate in emergency network alerts with pseudonymous codename.
              </div>
            </div>
            <button
              onClick={() =>
                updatePrivacy({
                  nearbyUserNetworkOptIn: !privacy.nearbyUserNetworkOptIn,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacy.nearbyUserNetworkOptIn ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy.nearbyUserNetworkOptIn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 5: Routine Learning */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-bold text-[#1E1B4B]">On-Device Routine Learning</div>
              <div className="text-[11px] text-[#6B7280]">
                Identify regular paths to recognize route deviation alerts.
              </div>
            </div>
            <button
              onClick={() =>
                updatePrivacy({
                  routineLearningEnabled: !privacy.routineLearningEnabled,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacy.routineLearningEnabled ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy.routineLearningEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 6: Report Anonymity */}
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs font-bold text-[#1E1B4B]">Report Anonymity Guarantee</div>
              <div className="text-[11px] text-[#6B7280]">
                Strip account identifiers and jitter coordinates on submissions.
              </div>
            </div>
            <button
              onClick={() =>
                updatePrivacy({
                  reportAnonymityGuaranteed: !privacy.reportAnonymityGuaranteed,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                privacy.reportAnonymityGuaranteed ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  privacy.reportAnonymityGuaranteed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
