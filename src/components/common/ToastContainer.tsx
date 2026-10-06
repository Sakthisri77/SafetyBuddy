import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSafety();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in slide-in-from-top-2 bg-white ${
              isDanger
                ? 'border-[#FECACA] shadow-[#DC2626]/10'
                : isWarning
                ? 'border-[#FDE68A] shadow-[#D97706]/10'
                : isSuccess
                ? 'border-[#A7F3D0] shadow-[#059669]/10'
                : 'border-[#EDE9FE] shadow-[#7C3AED]/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isDanger && <AlertCircle className="w-5 h-5 text-[#DC2626]" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-[#D97706]" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#059669]" />}
                {!isDanger && !isWarning && !isSuccess && (
                  <Info className="w-5 h-5 text-[#7C3AED]" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E1B4B]">{toast.title}</div>
                <div className="text-[11px] text-[#4B5563] mt-0.5 leading-snug">
                  {toast.message}
                </div>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9CA3AF] hover:text-[#1E1B4B] p-1 ml-2 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
