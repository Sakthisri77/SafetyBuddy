import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafetyReport } from '../../types/safety';
import { AlertTriangle, Lock, Shield, UploadCloud, X, CheckCircle2 } from 'lucide-react';

interface ReportUnsafeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportUnsafeModal: React.FC<ReportUnsafeModalProps> = ({ isOpen, onClose }) => {
  const { addReport, currentAreaName } = useSafety();

  const [category, setCategory] = useState<SafetyReport['category']>('Poor Lighting');
  const [severity, setSeverity] = useState<SafetyReport['severity']>('Medium');
  const [areaName, setAreaName] = useState<string>(currentAreaName || 'Central Road');
  const [description, setDescription] = useState<string>('');
  const [hasEvidence, setHasEvidence] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addReport({
      areaName,
      category,
      severity,
      description,
      hasEvidence,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/60 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white border border-[#EDE9FE] rounded-3xl p-6 sm:p-7 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E1B4B]">Report Unsafe Place</h3>
              <p className="text-xs text-[#6B7280]">Community Safety Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#1E1B4B] p-1.5 rounded-lg hover:bg-[#F5F3FF] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center border-2 border-[#10B981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#1E1B4B]">Report submitted securely.</h4>
            <p className="text-xs text-[#6B7280]">
              Thank you for keeping the community aware and safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Area Name */}
            <div>
              <label className="text-xs font-semibold text-[#6B7280] block mb-1">
                Approximate Sector / Road
              </label>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="e.g. Central Road Corridor"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#EDE9FE] text-sm text-[#1E1B4B] focus:outline-none focus:border-[#7C3AED]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-[#6B7280] block mb-1">
                Incident Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    'Harassment',
                    'Theft',
                    'Poor Lighting',
                    'Suspicious Activity',
                    'Unsafe Road',
                    'Other',
                  ] as SafetyReport['category'][]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      category === cat
                        ? 'bg-[#EDE9FE] border-[#7C3AED] text-[#6D28D9] font-bold'
                        : 'bg-[#F8F9FD] border-[#EDE9FE] text-[#6B7280] hover:text-[#1E1B4B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="text-xs font-semibold text-[#6B7280] block mb-1">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as SafetyReport['severity'][]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      severity === sev
                        ? sev === 'High'
                          ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626] font-bold'
                          : sev === 'Medium'
                          ? 'bg-[#FFFBEB] border-[#D97706] text-[#D97706] font-bold'
                          : 'bg-[#ECFDF5] border-[#059669] text-[#059669] font-bold'
                        : 'bg-[#F8F9FD] border-[#EDE9FE] text-[#6B7280]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-[#6B7280] block mb-1">
                Description (Anonymous)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe observations: broken lights, aggressive individuals, construction hazards..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#EDE9FE] text-xs text-[#1E1B4B] focus:outline-none focus:border-[#7C3AED]"
                required
              />
            </div>

            {/* Anonymity Notice */}
            <div className="p-3 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-start gap-2 text-xs text-[#6B7280]">
              <Lock className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
              <span>
                Reporter privacy guaranteed. Your user ID, real IP, and exact coordinates will not be linked to this community report.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs text-[#6B7280] hover:text-[#1E1B4B] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-[#7C3AED]/20 transition cursor-pointer"
              >
                Submit Report Anonymously
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
