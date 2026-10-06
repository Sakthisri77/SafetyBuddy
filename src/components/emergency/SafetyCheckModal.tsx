import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { AlertTriangle, ShieldCheck, HeartCrack, Clock, AlertCircle } from 'lucide-react';

export const SafetyCheckModal: React.FC = () => {
  const { safetyCheck, respondSafetyCheck, simulateNoResponse, watchTelemetry } = useSafety();

  if (!safetyCheck.isOpen) return null;

  const minutes = Math.floor(safetyCheck.countdownSeconds / 60);
  const seconds = safetyCheck.countdownSeconds % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = safetyCheck.countdownSeconds < 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-2 border-[#F59E0B] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#F59E0B]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono tracking-wider font-bold text-[#D97706]">
              ⚠️ UNEXPECTED ROUTE DEVIATION
            </span>
            <h3 className="text-xl font-black text-[#1E1B4B]">Are you safe?</h3>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          Your current movement differs from your usual routine (<span className="text-[#1E1B4B] font-semibold">Campus → SRM TRP Engineering College</span>).
          SafetyBuddy is monitoring your safety state.
        </p>

        {/* 5:00 Countdown meter */}
        <div className="mt-5 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className={`w-5 h-5 ${isLowTime ? 'text-[#DC2626] animate-spin' : 'text-[#D97706]'}`} />
            <div>
              <div className="text-xs font-bold text-[#92400E]">Auto-Escalation Countdown</div>
              <div className="text-[11px] text-[#B45309]">If unconfirmed, emergency flow triggers</div>
            </div>
          </div>
          <div
            className={`font-mono text-2xl font-black tracking-widest ${
              isLowTime ? 'text-[#DC2626] animate-pulse' : 'text-[#92400E]'
            }`}
          >
            {formattedTime}
          </div>
        </div>

        {/* Live signals monitored status */}
        <div className="mt-4 space-y-2 text-xs text-[#6B7280]">
          <div className="flex items-center justify-between">
            <span>• Checking route divergence</span>
            <span className="text-[#D97706] font-mono font-bold">+125m off path</span>
          </div>
          <div className="flex items-center justify-between">
            <span>• Monitoring biometric telemetry</span>
            <span className="text-[#1E1B4B] font-mono font-semibold">{watchTelemetry.heartRate} BPM ({watchTelemetry.stressLevel})</span>
          </div>
          <div className="flex items-center justify-between">
            <span>• Waiting for user response</span>
            <span className="text-[#6B7280] font-mono">Standby</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => respondSafetyCheck(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-[#10B981]/25"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>YES, I&apos;M SAFE</span>
          </button>

          <button
            onClick={() => respondSafetyCheck(false)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-[#DC2626]/25"
          >
            <HeartCrack className="w-4 h-4" />
            <span>NEED HELP</span>
          </button>
        </div>

        {/* Demo Fast-forward Trigger */}
        <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
          <span>Testing & Demo mode:</span>
          <button
            onClick={simulateNoResponse}
            className="text-[11px] font-bold text-[#D97706] hover:underline cursor-pointer"
          >
            [Simulate No Response]
          </button>
        </div>
      </div>
    </div>
  );
};
