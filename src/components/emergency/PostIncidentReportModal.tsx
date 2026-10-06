import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Download,
  Share2,
  X,
  Sparkles,
} from 'lucide-react';

export const PostIncidentReportModal: React.FC = () => {
  const { postIncidentReport, setPostIncidentReport, addToast } = useSafety();

  if (!postIncidentReport) return null;

  const handleDownload = () => {
    const reportText = JSON.stringify(postIncidentReport, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safetybuddy-${postIncidentReport.incidentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Report Exported', 'Post-incident safety record downloaded.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/60 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl my-8 bg-white border border-[#EDE9FE] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wider font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0]">
                  SECTION 29 AUDIT COMPLETE
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280] font-mono">
                  {postIncidentReport.incidentId}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E1B4B] mt-1">
                POST-INCIDENT SAFETY REPORT
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Download JSON Audit"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setPostIncidentReport(null)}
              className="p-2.5 rounded-xl text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#F3F4F6] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High-level Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] shadow-2xs">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">Date & Time</div>
            <div className="text-sm font-bold text-[#1E1B4B] mt-1">{postIncidentReport.date}</div>
            <div className="text-[11px] text-[#6B7280] font-mono">{postIncidentReport.time}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] shadow-2xs">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">Duration</div>
            <div className="text-sm font-bold text-[#1E1B4B] mt-1">{postIncidentReport.durationFormatted}</div>
            <div className="text-[11px] text-[#059669] font-medium">Rapid Escalation</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] shadow-2xs">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">Peak AI Confidence</div>
            <div className="text-sm font-bold text-[#DC2626] font-mono mt-1">
              {postIncidentReport.confidenceScore}%
            </div>
            <div className="text-[11px] text-[#D97706] font-bold">{postIncidentReport.riskLevel} RISK</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] shadow-2xs">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">Final Outcome</div>
            <div className="text-sm font-bold text-[#059669] mt-1">Resolved Safe</div>
            <div className="text-[11px] text-[#6B7280]">Location Resealed</div>
          </div>
        </div>

        {/* Trigger and Outcome */}
        <div className="mt-5 space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] text-xs">
            <span className="text-[#6B7280] font-bold uppercase tracking-wider text-[10px] block font-mono">
              Incident Trigger
            </span>
            <span className="text-[#1E1B4B] font-semibold text-sm mt-0.5 block">
              {postIncidentReport.trigger}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
            <span className="text-[#065F46] font-bold uppercase tracking-wider text-[10px] block font-mono">
              Resolution State
            </span>
            <span className="text-[#047857] font-medium text-xs mt-0.5 block">
              {postIncidentReport.outcome}
            </span>
          </div>
        </div>

        {/* Chronological Incident Timeline */}
        <div className="mt-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold mb-3.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7C3AED]" />
            <span>Chronological Incident Timeline</span>
          </h3>

          <div className="space-y-3 relative pl-4 border-l-2 border-[#DDD6FE]">
            {postIncidentReport.timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                <span
                  className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                    step.status === 'danger'
                      ? 'bg-[#DC2626]'
                      : step.status === 'warning'
                      ? 'bg-[#D97706]'
                      : step.status === 'success'
                      ? 'bg-[#059669]'
                      : 'bg-[#7C3AED]'
                  }`}
                />
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-[#1E1B4B]">{step.step}</div>
                  <span className="font-mono text-[11px] text-[#6B7280]">{step.time}</span>
                </div>
                <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Signals Detected & Actions Taken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE]">
            <h4 className="text-xs font-bold text-[#1E1B4B] mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Signals Detected</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              {postIncidentReport.signalsDetected.map((sig, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#7C3AED] font-bold mt-0.5">•</span>
                  <span className="font-medium text-[#1E1B4B]">{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE]">
            <h4 className="text-xs font-bold text-[#1E1B4B] mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#059669]" />
              <span>Emergency Actions Taken</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              {postIncidentReport.actionsTaken.map((act, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#059669] font-bold mt-0.5">✓</span>
                  <span className="font-medium text-[#1E1B4B]">{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety Insights */}
        <div className="mt-6 p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7C3AED]">
            <Sparkles className="w-4 h-4" />
            <span>AI Safety System Insights</span>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-[#1E1B4B]">
            {postIncidentReport.safetyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#7C3AED] font-black text-sm">“</span>
                <span className="italic font-medium">{insight}</span>
                <span className="text-[#7C3AED] font-black text-sm">”</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-[#F3F4F6] flex items-center justify-end gap-3">
          <button
            onClick={() => setPostIncidentReport(null)}
            className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition cursor-pointer shadow-md shadow-[#7C3AED]/20"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
