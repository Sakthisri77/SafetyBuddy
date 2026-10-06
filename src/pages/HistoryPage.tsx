import React from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { generatePostIncidentReport } from '../services/emergencyService';

export const HistoryPage: React.FC = () => {
  const { incidentHistory, postIncidentReport, setPostIncidentReport, addToast } = useSafety();

  const handleOpenLatestAudit = () => {
    if (!postIncidentReport) {
      // Create a fresh post-incident report object if none exists yet
      const rep = generatePostIncidentReport({});
      setPostIncidentReport(rep);
    } else {
      setPostIncidentReport(postIncidentReport);
    }
    addToast('Audit Report Loaded', 'Viewing post-incident audit summary.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg border border-[#DDD6FE]">
                AUDIT LOGS
              </span>
              <span className="text-xs text-[#6B7280]">Historical Journeys</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              Incident & Journey History
            </h1>
          </div>
        </div>

        {/* View Post-Incident Audit Button */}
        <button
          onClick={handleOpenLatestAudit}
          className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shadow-md shadow-[#7C3AED]/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>VIEW POST-INCIDENT REPORT AUDIT</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3.5">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold">
          RECORDED SAFETY EVENTS ({incidentHistory.length})
        </h2>

        {incidentHistory.map((item) => {
          const isHigh = item.riskLevel === 'HIGH' || item.riskLevel === 'CRITICAL';
          const isModerate = item.riskLevel === 'MODERATE';

          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] hover:border-[#DDD6FE] transition space-y-3 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isHigh ? 'bg-[#DC2626]' : isModerate ? 'bg-[#D97706]' : 'bg-[#059669]'
                    }`}
                  />
                  <h3 className="text-sm font-bold text-[#1E1B4B]">{item.type}</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                      isHigh
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                        : isModerate
                        ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                    }`}
                  >
                    {item.riskLevel} RISK
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                  <span className="font-mono text-[#1E1B4B] font-semibold">{item.date}</span>
                  <span>{item.time}</span>
                  <span className="text-[#059669] font-bold bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0]">
                    {item.outcome}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">{item.notes}</p>

              {/* Signals detected tags */}
              {item.signalsDetected && item.signalsDetected.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F3F4F6]">
                  {item.signalsDetected.map((sig, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#F8F9FD] text-[#6B7280] border border-[#EDE9FE]"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
