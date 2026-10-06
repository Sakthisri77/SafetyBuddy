import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import {
  Play,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Activity,
  AlertTriangle,
  Heart,
  Shield,
  HelpCircle,
  Radio,
  CheckCircle,
  Flame,
} from 'lucide-react';

export const DemoSimulationBar: React.FC = () => {
  const {
    isFullSimRunning,
    fullSimStage,
    fullSimProgress,
    runFullEmergencySimulation,
    cancelFullSimulation,
    setSimScenario,
    emergencyState,
  } = useSafety();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-[580px] z-40 bg-white/95 border border-[#EDE9FE] rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-300">
      {/* Simulation Header */}
      <div className="px-4 py-2.5 bg-[#F5F3FF] border-b border-[#EDE9FE] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-[#1E1B4B]">
            DEMO SIMULATION CENTER
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED] font-bold">
            Interactive Test Hub
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFullSimRunning && (
            <span className="text-[11px] font-mono text-[#7C3AED] font-bold animate-pulse">
              Running Stage {fullSimProgress}%
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#6B7280] hover:text-[#1E1B4B] transition cursor-pointer"
            title={isExpanded ? 'Collapse Demo Bar' : 'Expand Demo Bar'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar when Full Simulation is Running */}
      {isFullSimRunning && (
        <div className="w-full bg-[#EDE9FE] h-1.5 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] transition-all duration-500 ease-out"
            style={{ width: `${fullSimProgress}%` }}
          />
        </div>
      )}

      {/* Body Content */}
      {isExpanded && (
        <div className="p-3.5 space-y-3">
          {/* Active Simulation Stage Banner */}
          {isFullSimRunning ? (
            <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#DC2626] animate-spin" />
                <div>
                  <span className="text-[#6B7280] text-[10px] block">CURRENT SIMULATED STAGE:</span>
                  <span className="font-bold text-[#1E1B4B]">{fullSimStage}</span>
                </div>
              </div>
              <button
                onClick={cancelFullSimulation}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#FECACA] hover:bg-[#FEF2F2] text-[#DC2626] text-[11px] font-bold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280]">
                Run full automated presentation or test individual scenario events:
              </span>
              <button
                onClick={runFullEmergencySimulation}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:opacity-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#7C3AED]/20 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>SIMULATE FULL EMERGENCY</span>
              </button>
            </div>
          )}

          {/* Individual Scenario Trigger Buttons */}
          <div className="grid grid-cols-4 gap-1.5 text-[11px]">
            <button
              onClick={() => setSimScenario('normal')}
              className="p-1.5 rounded-lg bg-[#F8F9FD] hover:bg-[#EDE9FE] text-[#4B5563] hover:text-[#059669] border border-[#EDE9FE] transition text-center truncate cursor-pointer font-medium"
              title="Normal Journey"
            >
              Normal
            </button>
            <button
              onClick={() => setSimScenario('enter_risk_zone')}
              className="p-1.5 rounded-lg bg-[#F8F9FD] hover:bg-[#EDE9FE] text-[#4B5563] hover:text-[#D97706] border border-[#EDE9FE] transition text-center truncate cursor-pointer font-medium"
              title="Enter Risk Zone"
            >
              Risk Zone
            </button>
            <button
              onClick={() => setSimScenario('route_deviation')}
              className="p-1.5 rounded-lg bg-[#F8F9FD] hover:bg-[#EDE9FE] text-[#4B5563] hover:text-[#7C3AED] border border-[#EDE9FE] transition text-center truncate cursor-pointer font-medium"
              title="Route Deviation"
            >
              Deviation
            </button>
            <button
              onClick={() => setSimScenario('ask_safe')}
              className="p-1.5 rounded-lg bg-[#F8F9FD] hover:bg-[#EDE9FE] text-[#4B5563] hover:text-[#D97706] border border-[#EDE9FE] transition text-center truncate cursor-pointer font-medium"
              title="Ask Are You Safe"
            >
              Safety Check
            </button>
            <button
              onClick={() => setSimScenario('simulate_no_response')}
              className="p-1.5 rounded-lg bg-[#F8F9FD] hover:bg-[#EDE9FE] text-[#4B5563] hover:text-[#DC2626] border border-[#EDE9FE] transition text-center truncate cursor-pointer font-medium"
              title="Simulate No Response"
            >
              No Response
            </button>
            <button
              onClick={() => setSimScenario('abnormal_hr')}
              className="p-1.5 rounded-lg bg-[#F8F9FD] hover:bg-[#EDE9FE] text-[#4B5563] hover:text-[#DC2626] border border-[#EDE9FE] transition text-center truncate cursor-pointer font-medium"
              title="Abnormal Heart Rate"
            >
              Spike HR
            </button>
            <button
              onClick={() => setSimScenario('trigger_emergency')}
              className="p-1.5 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] transition text-center font-bold truncate cursor-pointer"
              title="Trigger Emergency"
            >
              Emergency
            </button>
            <button
              onClick={() => setSimScenario('resolve')}
              className="p-1.5 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] transition text-center font-bold truncate cursor-pointer"
              title="Resolve Emergency & Generate Audit"
            >
              Resolve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
