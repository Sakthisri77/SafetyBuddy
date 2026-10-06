import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { INITIAL_RISK_ZONES } from '../data/mockData';
import { LiveSafetyMap } from '../components/map/LiveSafetyMap';
import {
  User,
  ShieldAlert,
  FileCheck,
  AlertOctagon,
  CheckCircle,
  Flag,
  XCircle,
  MapPin,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { reports, updateReportStatus, emergencyState } = useSafety();

  const totalReports = reports.length;
  const highRiskAreasCount = INITIAL_RISK_ZONES.filter(
    (z) => z.riskLevel === 'HIGH' || z.riskLevel === 'CRITICAL'
  ).length;
  const activeEmergenciesCount = emergencyState.isActive ? 1 : 0;

  // Category counts
  const categoryCounts = reports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase bg-[#EDE9FE] px-2.5 py-0.5 rounded-lg border border-[#DDD6FE]">
                CAMPUS SAFETY DISPATCH
              </span>
              <span className="text-xs text-[#6B7280]">Dispatch & Moderation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              Admin & Community Moderation Dashboard
            </h1>
          </div>
        </div>

        <div className="text-xs font-mono text-[#7C3AED] bg-[#F5F3FF] px-3.5 py-2 rounded-2xl border border-[#DDD6FE] font-bold">
          Privacy Mode: Aggregated Obfuscated View
        </div>
      </div>

      {/* Top 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-xs text-[#6B7280] flex items-center justify-between">
            <span className="font-medium">Total Safety Reports</span>
            <FileCheck className="w-5 h-5 text-[#059669]" />
          </div>
          <div className="text-3xl font-black text-[#1E1B4B] font-mono mt-2">
            {totalReports}
          </div>
          <div className="text-[11px] text-[#059669] mt-1 font-semibold">+3 logged today</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-xs text-[#6B7280] flex items-center justify-between">
            <span className="font-medium">High-Risk Areas Flagged</span>
            <ShieldAlert className="w-5 h-5 text-[#D97706]" />
          </div>
          <div className="text-3xl font-black text-[#1E1B4B] font-mono mt-2">
            {highRiskAreasCount}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">Central Rd & Industrial Corridor</div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-xs text-[#6B7280] flex items-center justify-between">
            <span className="font-medium">Active Emergency Events</span>
            <AlertOctagon className={`w-5 h-5 ${emergencyState.isActive ? 'text-[#DC2626] animate-pulse' : 'text-[#6B7280]'}`} />
          </div>
          <div className="text-3xl font-black text-[#1E1B4B] font-mono mt-2">
            {activeEmergenciesCount}
          </div>
          <div className={`text-[11px] mt-1 font-semibold ${emergencyState.isActive ? 'text-[#DC2626] font-bold' : 'text-[#059669]'}`}>
            {emergencyState.isActive ? 'Active dispatch in progress' : 'Normal routine conditions'}
          </div>
        </div>
      </div>

      {/* Grid: Risk Map & Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Risk Map (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold mb-3.5">
              CAMPUS & MUNICIPAL RISK HEATMAP
            </h2>
            <LiveSafetyMap height="h-[360px]" />
          </div>

          {/* Category breakdown bar cards */}
          <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold mb-3.5">
              REPORTS BY HAZARD CATEGORY
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs text-[#1E1B4B] font-medium">
                    <span>{cat}</span>
                    <span className="font-mono text-[#6B7280]">{count} reports</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EDE9FE] overflow-hidden">
                    <div
                      className="h-full bg-[#7C3AED] rounded-full"
                      style={{ width: `${(count / totalReports) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Moderation Queue (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EDE9FE] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#7C3AED] font-bold">
              COMMUNITY REPORT MODERATION QUEUE
            </h2>
            <span className="text-[10px] font-mono text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0] font-bold">
              Zero PII Exposed
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E1B4B]">{report.category}</span>
                    <span className="text-[10px] font-mono text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-md font-semibold">
                      {report.areaName}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                      report.status === 'approved'
                        ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        : report.status === 'flagged'
                        ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {report.description}
                </p>

                {/* Moderation Action Buttons: Approve, Flag, Reject */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDE9FE]">
                  <button
                    onClick={() => updateReportStatus(report.id, 'approved')}
                    className="px-3 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'flagged')}
                    className="px-3 py-1 rounded-lg bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Flag className="w-3 h-3" /> Flag
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'rejected')}
                    className="px-3 py-1 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
