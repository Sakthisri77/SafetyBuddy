import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { AVAILABLE_SMARTWATCH_MODELS } from '../data/mockData';
import { PairDeviceModal } from '../components/watch/PairDeviceModal';
import {
  Watch,
  Heart,
  Activity,
  Thermometer,
  Zap,
  Battery,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Bluetooth,
  Plus,
  RefreshCw,
  Cpu,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  Unlink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const WatchPage: React.FC = () => {
  const {
    watchTelemetry,
    watchSimulationMode,
    setWatchSimulationMode,
    isWatchAboveBaseline,
    activeWatchModel,
    switchWatchModel,
    unpairWatch,
    pairWatchModel,
  } = useSafety();

  const [isPairModalOpen, setIsPairModalOpen] = useState<boolean>(false);

  const activeModel = activeWatchModel || AVAILABLE_SMARTWATCH_MODELS[0];
  const isConnected = !!activeWatchModel;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Demo Data Disclaimer */}
      <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Watch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isConnected ? 'text-[#059669]' : 'text-[#6B7280]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-[#10B981] animate-pulse' : 'bg-[#9CA3AF]'
                  }`}
                />
                {isConnected ? 'WATCH CONNECTED' : 'NO DEVICE CONNECTED'}
              </span>
              <span className="text-[10px] bg-[#F5F3FF] text-[#7C3AED] px-2.5 py-0.5 rounded-lg font-mono border border-[#DDD6FE] font-bold">
                {activeModel.name} • {activeModel.firmware}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1B4B] tracking-tight mt-1">
              Smartwatch Physiological Intelligence
            </h1>
          </div>
        </div>

        {/* Top Actions: Pair New Device & Demo Notice */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <button
            onClick={() => setIsPairModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-[#7C3AED]/20"
          >
            <Bluetooth className="w-4 h-4" />
            <span>Pair New Device</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs font-mono text-[#6B7280]">
            <span className="text-[#D97706] font-bold">DEMO / SIMULATED DATA</span>
            <span>• Battery: {watchTelemetry.batteryPct}%</span>
          </div>
        </div>
      </div>

      {/* Active Paired Device Hardware Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
              <Bluetooth className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1E1B4B]">{activeModel.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280]">
                  {activeModel.series}
                </span>
                <span className="text-[10px] font-mono text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0] font-bold">
                  BLE SECURE CONNECTION
                </span>
              </div>
              <div className="text-xs text-[#6B7280] mt-0.5 font-mono">
                MAC: {activeModel.bleAddress} • Manufacturer: {activeModel.manufacturer}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPairModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-xs font-bold text-[#7C3AED] border border-[#DDD6FE] flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Device</span>
            </button>
            {isConnected ? (
              <button
                onClick={unpairWatch}
                className="px-3.5 py-2 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-xs font-bold text-[#DC2626] border border-[#FECACA] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Unpair</span>
              </button>
            ) : (
              <button
                onClick={() => pairWatchModel(activeModel)}
                className="px-3.5 py-2 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-xs font-bold text-[#059669] border border-[#A7F3D0] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Bluetooth className="w-3.5 h-3.5" />
                <span>Reconnect</span>
              </button>
            )}
          </div>
        </div>

        {/* Hardware Characteristics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#F3F4F6] text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE]">
            <div className="text-[10px] text-[#6B7280] uppercase font-mono">Specialization</div>
            <div className="font-bold text-[#1E1B4B] mt-0.5 truncate">{activeModel.characteristics.specialty}</div>
            <div className="text-[10px] text-[#7C3AED] mt-0.5 font-medium">Custom calibrated</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE]">
            <div className="text-[10px] text-[#6B7280] uppercase font-mono">Sensor Sample Rate</div>
            <div className="font-bold text-[#1E1B4B] font-mono mt-0.5">{activeModel.sampleRateHz} Hz</div>
            <div className="text-[10px] text-[#059669] mt-0.5 font-medium">High fidelity continuous</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE]">
            <div className="text-[10px] text-[#6B7280] uppercase font-mono">Distress Detection Latency</div>
            <div className="font-bold text-[#D97706] font-mono mt-0.5">{activeModel.characteristics.latencySeconds} Seconds</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Sub-second pre-processing</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE]">
            <div className="text-[10px] text-[#6B7280] uppercase font-mono">Cryptographic Handshake</div>
            <div className="font-bold text-[#059669] text-[11px] mt-0.5 truncate">{activeModel.security.encryption}</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">Zero-Knowledge attestation</div>
          </div>
        </div>

        {/* Sensor Capability Tags */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#6B7280] mr-1">ACTIVE SENSORS:</span>
          {activeModel.sensors.map((sensor, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE] font-medium"
            >
              {sensor}
            </span>
          ))}
        </div>
      </div>

      {/* Model Switcher Carousel / Tab Strip */}
      <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7C3AED]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#1E1B4B] font-bold">
              SWITCH VIRTUAL SMARTWATCH MODEL (SIMULATE SENSOR DIVERSITY)
            </h3>
          </div>
          <span className="text-xs text-[#6B7280]">
            Toggle hardware to test varying baselines & latencies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AVAILABLE_SMARTWATCH_MODELS.map((model) => {
            const isSelected = activeModel.id === model.id;

            return (
              <div
                key={model.id}
                onClick={() => switchWatchModel(model.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F5F3FF] border-[#7C3AED] ring-2 ring-[#7C3AED]/30 shadow-xs'
                    : 'bg-white border-[#EDE9FE] hover:border-[#C4B5FD] hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs font-bold text-[#1E1B4B]">{model.name}</div>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
                  )}
                </div>

                <div className="text-[10px] font-mono text-[#7C3AED] mt-0.5 font-bold">{model.series}</div>

                <div className="mt-2 text-[11px] text-[#4B5563] line-clamp-2">
                  {model.characteristics.specialty}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#EDE9FE] flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                  <span>HR: {model.characteristics.baselineHrMin}–{model.characteristics.baselineHrMax} BPM</span>
                  <span className="text-[#7C3AED] font-bold">{model.characteristics.latencySeconds}s</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation Controls Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-mono text-[#6B7280] font-semibold">
          SIMULATION CONTROLS (Test Sensor Feed Under Distress):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setWatchSimulationMode('normal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              watchSimulationMode === 'normal'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-[#F5F3FF] text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]'
            }`}
          >
            [Normal]
          </button>
          <button
            onClick={() => setWatchSimulationMode('elevated')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              watchSimulationMode === 'elevated'
                ? 'bg-[#F59E0B] text-white shadow-sm'
                : 'bg-[#F5F3FF] text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]'
            }`}
          >
            [Elevated Stress]
          </button>
          <button
            onClick={() => setWatchSimulationMode('high_hr')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              watchSimulationMode === 'high_hr'
                ? 'bg-[#7C3AED] text-white shadow-sm'
                : 'bg-[#F5F3FF] text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]'
            }`}
          >
            [High Heart Rate]
          </button>
          <button
            onClick={() => setWatchSimulationMode('emergency')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              watchSimulationMode === 'emergency'
                ? 'bg-[#DC2626] text-white animate-pulse shadow-sm'
                : 'bg-[#F5F3FF] text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#EDE9FE]'
            }`}
          >
            [Emergency Pattern]
          </button>
        </div>
      </div>

      {/* 5 Core Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* Heart Rate Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Heart Rate</span>
            <Heart className={`w-4 h-4 ${isWatchAboveBaseline ? 'text-[#DC2626] animate-pulse' : 'text-[#059669]'}`} />
          </div>
          <div className="text-2xl font-black text-[#1E1B4B] font-mono mt-1">
            {watchTelemetry.heartRate} <span className="text-xs font-normal text-[#6B7280]">BPM</span>
          </div>
          <div className="mt-2 text-[10px] text-[#6B7280]">
            Baseline: {activeModel.characteristics.baselineHrMin}–{activeModel.characteristics.baselineHrMax} BPM
          </div>
        </div>

        {/* SpO2 Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>SpO₂ Blood Oxygen</span>
            <Zap className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-black text-[#1E1B4B] font-mono mt-1">
            {watchTelemetry.spo2}%
          </div>
          <div className="mt-2 text-[10px] text-[#059669] font-medium">
            Normal Oxygenation
          </div>
        </div>

        {/* Temperature Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Temperature</span>
            <Thermometer className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-black text-[#1E1B4B] font-mono mt-1">
            {watchTelemetry.temperature}°C
          </div>
          <div className="mt-2 text-[10px] text-[#6B7280]">
            Norm: 36.5–37.2°C
          </div>
        </div>

        {/* Stress Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Stress Index</span>
            <Activity className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-black text-[#1E1B4B] font-mono mt-1">
            {watchTelemetry.stressLevel}
          </div>
          <div className="mt-2 text-[10px] text-[#6B7280]">
            HRV Autonomic Tone
          </div>
        </div>

        {/* Activity Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>Activity State</span>
            <Watch className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-black text-[#1E1B4B] font-mono mt-1">
            {watchTelemetry.activity}
          </div>
          <div className="mt-2 text-[10px] text-[#6B7280]">
            IMU Accelerometer
          </div>
        </div>
      </div>

      {/* Section 19 Baseline Comparison Box */}
      <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C3AED] font-bold">
            PHYSIOLOGICAL BASELINE AUDIT
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-[#6B7280]">
              Normal HR: <span className="text-[#1E1B4B] font-bold">{activeModel.characteristics.baselineHrMin}–{activeModel.characteristics.baselineHrMax} BPM</span>
            </span>
            <span className="text-xs text-[#D1D5DB]">•</span>
            <span className="text-sm text-[#6B7280]">
              Current: <span className="text-[#1E1B4B] font-bold">{watchTelemetry.heartRate} BPM</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">STATUS:</span>
          <span
            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
              isWatchAboveBaseline
                ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] animate-pulse'
                : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
            }`}
          >
            {isWatchAboveBaseline ? 'ABOVE PERSONAL BASELINE' : 'WITHIN PERSONAL BASELINE'}
          </span>
        </div>
      </div>

      {/* Recharts: Live Heart Rate & Stress Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#DC2626]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#1E1B4B] font-bold">
                Heart Rate Chrono Stream (BPM)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#6B7280]">Rolling 15 intervals</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={watchTelemetry.history}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 160]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDD6FE',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#hrGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress Level Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#1E1B4B] font-bold">
                Autonomic Stress Score (0 - 100)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#6B7280]">Galvanic & HRV Analysis</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={watchTelemetry.history}>
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DDD6FE',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#stressGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pair New Device Modal */}
      <PairDeviceModal
        isOpen={isPairModalOpen}
        onClose={() => setIsPairModalOpen(false)}
      />
    </div>
  );
};
