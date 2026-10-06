import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { ReportUnsafeModal } from '../components/reports/ReportUnsafeModal';
import {
  FileText,
  AlertTriangle,
  Lock,
  ThumbsUp,
  Filter,
  Plus,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export const SafetyReportsPage: React.FC = () => {
  const { reports, upvoteReport, currentAreaName } = useSafety();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Poor Lighting',
    'Harassment',
    'Theft',
    'Suspicious Activity',
    'Unsafe Road',
  ];

  const filteredReports = reports.filter((r) => {
    const matchesCategory =
      selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight">
              Safety Reports Near You
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Aggregated community hazard alerts with complete reporter anonymity.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-[#7C3AED]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report Unsafe Place</span>
        </button>
      </div>

      {/* Featured Sector Overview: CENTRAL ROAD HIGH RISK (Section 13) */}
      <div className="p-6 rounded-3xl bg-[#FEF2F2] border border-[#FECACA] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#DC2626] uppercase bg-white px-2.5 py-0.5 rounded-lg border border-[#FCA5A5]">
                CRITICAL FOCUS AREA
              </span>
              <span className="text-xs text-[#991B1B]">Active Safety Cluster</span>
            </div>
            <h2 className="text-xl font-black text-[#991B1B] mt-1.5">CENTRAL ROAD CORRIDOR</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-[#DC2626] bg-white px-3.5 py-1.5 rounded-xl border border-[#FCA5A5] shadow-xs">
              HIGH RISK
            </span>
            <span className="text-sm font-mono text-[#991B1B] font-bold bg-white px-3.5 py-1.5 rounded-xl border border-[#FCA5A5] shadow-xs">
              15 Reports Active
            </span>
          </div>
        </div>

        {/* Section 13 Categories Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#FCA5A5]/40">
          <div className="p-3.5 rounded-2xl bg-white border border-[#FECACA] shadow-2xs">
            <div className="text-[11px] text-[#991B1B]">Harassment</div>
            <div className="text-lg font-black text-[#DC2626] font-mono mt-0.5">6 reports</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#FECACA] shadow-2xs">
            <div className="text-[11px] text-[#991B1B]">Theft & Pickpocket</div>
            <div className="text-lg font-black text-[#DC2626] font-mono mt-0.5">4 reports</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#FECACA] shadow-2xs">
            <div className="text-[11px] text-[#991B1B]">Poor Street Lighting</div>
            <div className="text-lg font-black text-[#D97706] font-mono mt-0.5">3 reports</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#FECACA] shadow-2xs">
            <div className="text-[11px] text-[#991B1B]">Suspicious Loitering</div>
            <div className="text-lg font-black text-[#1E1B4B] font-mono mt-0.5">2 reports</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white text-[#6B7280] hover:text-[#1E1B4B] border border-[#EDE9FE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter by area name or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-xl bg-white border border-[#EDE9FE] text-xs text-[#171717] focus:outline-none focus:border-[#7C3AED] shadow-2xs"
        />
      </div>

      {/* Reports Feed */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EDE9FE] hover:border-[#DDD6FE] transition shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-[#059669] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Anonymous Safety Report
                  </span>
                  <span className="text-xs text-[#D1D5DB]">•</span>
                  <span className="text-xs text-[#6B7280]">{report.reportedAt}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      report.severity === 'High'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                        : report.severity === 'Medium'
                        ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                    }`}
                  >
                    {report.severity} Severity
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1E1B4B] mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7C3AED]" />
                  <span>{report.areaName}</span>
                  <span className="text-xs font-normal text-[#6B7280]">
                    ({report.category})
                  </span>
                </h3>
              </div>

              {/* Upvote Button */}
              <button
                onClick={() => upvoteReport(report.id)}
                className="px-3.5 py-2 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-xs font-bold text-[#7C3AED] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>{report.upvotes}</span>
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              {report.description}
            </p>

            <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>Privacy status: Location obfuscated to sector grid</span>
              <span className="text-[#059669] font-medium">✓ Verified by Community</span>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="p-12 text-center text-[#6B7280] bg-white rounded-3xl border border-[#EDE9FE]">
            No safety reports matched your filter query.
          </div>
        )}
      </div>

      <ReportUnsafeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
