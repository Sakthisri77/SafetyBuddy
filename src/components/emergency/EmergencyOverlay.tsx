import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import {
  AlertOctagon,
  PhoneCall,
  Share2,
  CheckCircle2,
  Mic,
  Video,
  StopCircle,
  Radio,
  Lock,
  Unlock,
  ShieldAlert,
  Activity,
  Heart,
  UserCheck,
} from 'lucide-react';
import { LiveSafetyMap } from '../map/LiveSafetyMap';

export const EmergencyOverlay: React.FC = () => {
  const {
    emergencyState,
    resolveEmergency,
    authorizeLocationSharing,
    revokeLocationSharing,
    startEvidenceRecording,
    stopEvidenceRecording,
    watchTelemetry,
    trustedContacts,
    nearbyUsers,
    currentAreaRisk,
    aiAssessment,
  } = useSafety();

  const [callModalContact, setCallModalContact] = useState<string | null>(null);

  if (!emergencyState.isActive) return null;

  const recordingTimeFormatted = `${Math.floor(emergencyState.recordingDurationSeconds / 60)}:${(
    emergencyState.recordingDurationSeconds % 60
  )
    .toString()
    .padStart(2, '0')}`;

  const primaryContact = trustedContacts[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/95 text-white backdrop-blur-xl overflow-y-auto flex flex-col p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Top Banner Alert Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-3.5 px-5 rounded-3xl bg-[#DC2626]/20 border border-[#DC2626]/40 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center font-black animate-pulse shadow-md shadow-[#DC2626]/40">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-[#FCA5A5] font-black uppercase">
                🚨 EMERGENCY MODE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
              HIGH CONFIDENCE SAFETY ALERT
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => resolveEmergency('User marked themselves safe.')}
            className="px-5 py-2.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#10B981]/25"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>MARK SAFE</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left Column: Live Emergency Map & Signals */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#EF4444] animate-pulse" />
                <h3 className="text-sm font-bold text-white">
                  Live Emergency Map Feed
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-300">
                {emergencyState.locationSharingAuthorized
                  ? 'Authorized Contacts Receiving High-Precision Stream'
                  : 'Coordinates Protected (Zero-Knowledge)'}
              </span>
            </div>
            <LiveSafetyMap height="h-[340px]" showControls={false} />
          </div>

          {/* Real-time Multi-Signal Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-xs">
              <div className="text-[11px] text-slate-400">AI Confidence</div>
              <div className="text-xl font-extrabold text-[#EF4444] font-mono mt-0.5">
                {aiAssessment.emergencyConfidence}%
              </div>
              <div className="text-[10px] text-[#F87171] mt-1 font-semibold">HIGH RISK</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-xs">
              <div className="text-[11px] text-slate-400">Smartwatch HR</div>
              <div className="text-xl font-extrabold text-white font-mono mt-0.5 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#EF4444] animate-pulse" />
                <span>{watchTelemetry.heartRate}</span>
                <span className="text-xs font-normal text-slate-400">BPM</span>
              </div>
              <div className="text-[10px] text-[#FBBF24] mt-1 font-medium">Above Baseline</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-xs">
              <div className="text-[11px] text-slate-400">Route Deviation</div>
              <div className="text-xl font-extrabold text-[#FBBF24] mt-0.5">ACTIVE</div>
              <div className="text-[10px] text-slate-400 mt-1">Diverged &gt;120m</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-xs">
              <div className="text-[11px] text-slate-400">Area Risk</div>
              <div className="text-xl font-extrabold text-[#EF4444] mt-0.5">HIGH</div>
              <div className="text-[10px] text-slate-400 mt-1">15 Sector Reports</div>
            </div>
          </div>

          {/* Section 27: Audio / Video Emergency Evidence */}
          <div className="p-5 rounded-3xl bg-[#1E293B] border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                <h3 className="text-sm font-bold text-white">Emergency Evidence Capture</h3>
              </div>
              <span className="text-[10px] text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700 font-mono">
                Encrypted Buffer
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Notice: Actual hardware recording requires browser permissions. Never records silently. Local encrypted storage only.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {/* Audio Box */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Emergency Audio</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {emergencyState.audioRecording ? `RECORDING • ${recordingTimeFormatted}` : 'READY (Standby)'}
                  </div>
                </div>

                {emergencyState.audioRecording ? (
                  <button
                    onClick={() => stopEvidenceRecording('audio')}
                    className="px-3.5 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <StopCircle className="w-3.5 h-3.5" /> Stop
                  </button>
                ) : (
                  <button
                    onClick={() => startEvidenceRecording('audio')}
                    className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#EF4444]" /> START AUDIO
                  </button>
                )}
              </div>

              {/* Video Box */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Emergency Video</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {emergencyState.videoRecording ? `RECORDING • ${recordingTimeFormatted}` : 'READY (Standby)'}
                  </div>
                </div>

                {emergencyState.videoRecording ? (
                  <button
                    onClick={() => stopEvidenceRecording('video')}
                    className="px-3.5 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <StopCircle className="w-3.5 h-3.5" /> Stop
                  </button>
                ) : (
                  <button
                    onClick={() => startEvidenceRecording('video')}
                    className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-[#38BDF8]" /> START VIDEO
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Contact Sharing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 24: Emergency Location Sharing */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                PRIVACY CONTROL
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                  emergencyState.locationSharingAuthorized
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {emergencyState.locationSharingAuthorized ? 'SHARED WITH AUTHORIZED' : 'PROTECTED'}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mt-2">
              Precise Location Sharing
            </h3>

            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Under normal operation, exact GPS is sealed. In emergency mode, you can explicitly authorize high-precision telemetry stream exclusively to trusted parent contacts.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs">
              <div className="text-slate-400">Authorized Sharing Audience:</div>
              <div className="mt-1 font-semibold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#34D399]" />
                <span>Parent ({primaryContact?.name}) & Campus Dispatch</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5">
                Notice: Ordinary nearby users only receive area-level assistance requests, never precise coordinates.
              </div>
            </div>

            <div className="mt-4">
              {emergencyState.locationSharingAuthorized ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    <span>Precise location is being shared with authorized contacts.</span>
                  </div>
                  <button
                    onClick={revokeLocationSharing}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold transition cursor-pointer"
                  >
                    REVOKE PRECISE SHARING
                  </button>
                </div>
              ) : (
                <button
                  onClick={authorizeLocationSharing}
                  className="w-full py-3.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#DC2626]/25"
                >
                  <Share2 className="w-4 h-4" />
                  <span>AUTHORIZE LOCATION SHARING</span>
                </button>
              )}
            </div>
          </div>

          {/* Trusted Contact Fast Calling */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/80 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#34D399]" />
              <span>Emergency Voice Link</span>
            </h3>

            <div className="mt-3.5 space-y-2.5">
              {trustedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{contact.name}</div>
                    <div className="text-[11px] text-slate-400">{contact.relationship} • {contact.phone}</div>
                  </div>
                  <button
                    onClick={() => setCallModalContact(contact.name)}
                    className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-[#10B981]/25"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>CALL</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Notifications Timeline */}
          <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/80 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3.5">
              Dispatch Timeline
            </h3>

            <div className="space-y-3 relative pl-4 border-l-2 border-slate-700 text-xs">
              <div className="relative">
                <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-[#EF4444] border-2 border-[#1E293B]" />
                <div className="font-semibold text-white">Emergency Triggered</div>
                <div className="text-slate-400 text-[11px]">AI Safety Multi-Signal confidence spike (87%)</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-[#F59E0B] border-2 border-[#1E293B]" />
                <div className="font-semibold text-white">Parent Notified</div>
                <div className="text-slate-400 text-[11px]">Push alert & emergency SMS dispatched to Sarah Chen</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-[#38BDF8] border-2 border-[#1E293B]" />
                <div className="font-semibold text-white">Nearby SafetyBuddy Users Notified</div>
                <div className="text-slate-400 text-[11px]">2 verified users within 500m pinged for assistance</div>
              </div>
            </div>
          </div>

          {/* Emergency Bottom Bar Controls */}
          <div className="pt-2">
            <button
              onClick={() => resolveEmergency('Manual operator stop alert')}
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              STOP ALERT & CANCEL ESCALATION
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Phone Call Modal */}
      {callModalContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] mx-auto flex items-center justify-center text-[#10B981] animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mt-4">Connecting Call</h4>
            <div className="text-sm text-[#34D399] font-medium">{callModalContact}</div>
            <p className="text-xs text-slate-400 mt-2">
              Priority emergency cellular link initiated...
            </p>
            <button
              onClick={() => setCallModalContact(null)}
              className="mt-6 w-full py-3 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs cursor-pointer shadow-md shadow-[#DC2626]/30"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
