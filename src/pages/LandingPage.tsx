import React from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Shield,
  ShieldCheck,
  Lock,
  Watch,
  Users,
  AlertTriangle,
  ArrowRight,
  EyeOff,
  Activity,
  Navigation,
  FileText,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { LiveSafetyMap } from '../components/map/LiveSafetyMap';

export const LandingPage: React.FC = () => {
  const { setActiveView, runFullEmergencySimulation } = useSafety();

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#171717] selection:bg-[#7C3AED]/20">
      {/* Top Navigation for Landing */}
      <header className="border-b border-[#EDE9FE] bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-md shadow-[#7C3AED]/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1E1B4B]">SafetyBuddy</span>
              <span className="block text-[9px] font-mono tracking-widest text-[#7C3AED] uppercase font-bold">
                Privacy-Preserving
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-semibold text-[#6B7280] hover:text-[#1E1B4B] px-3 py-2 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-xl transition shadow-md shadow-[#7C3AED]/20 cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#EDE9FE] bg-gradient-to-b from-[#F5F3FF]/50 to-[#F8F9FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Privacy Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DDD6FE] text-xs font-semibold text-[#7C3AED] shadow-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Your precise location stays private by default.</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-[#1E1B4B]">
              Safety that understands when{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#6D28D9]">
                something is wrong.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
              Predictive protection, privacy-preserving location intelligence, wearable-assisted emergency detection, and a trusted community network.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-[#7C3AED]/25 transition cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setTimeout(() => runFullEmergencySimulation(), 600);
                }}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F5F3FF] text-[#1E1B4B] font-bold text-sm border border-[#DDD6FE] transition cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Radio className="w-4 h-4 text-[#7C3AED]" />
                <span>View Live Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Visual: Interactive Light Map */}
          <div className="mt-12 max-w-5xl mx-auto relative rounded-3xl overflow-hidden border border-[#EDE9FE] shadow-xl bg-white">
            <div className="p-3.5 bg-[#F5F3FF] border-b border-[#EDE9FE] flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[#1E1B4B] font-semibold">Live Operational Campus Grid</span>
              </div>
              <span className="font-mono text-[11px] text-[#7C3AED] font-bold">Zero-Knowledge Encrypted</span>
            </div>
            <LiveSafetyMap height="h-[440px]" showControls={true} />
          </div>
        </div>
      </section>

      {/* 6 Key Pillars / Sections */}
      <section className="py-20 border-b border-[#EDE9FE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-[#7C3AED] uppercase">
              ARCHITECTED FOR REAL-WORLD TRUST
            </span>
            <h2 className="text-3xl font-black text-[#1E1B4B] mt-2 tracking-tight">
              Six layers of intelligent, privacy-first personal defense.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Predictive Safety */}
            <div className="p-6 rounded-3xl bg-[#F8F9FD] border border-[#EDE9FE] hover:border-[#DDD6FE] transition group shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B] mb-2 group-hover:text-[#7C3AED] transition">
                Predictive Safety & Routes
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Evaluates lighting levels, historical crime clusters, crowd presence, and municipal infrastructure to recommend the safest transit corridors before you step out.
              </p>
            </div>

            {/* 2. Privacy-First Location */}
            <div className="p-6 rounded-3xl bg-[#F8F9FD] border border-[#EDE9FE] hover:border-[#DDD6FE] transition group shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B] mb-2 group-hover:text-[#7C3AED] transition">
                Privacy-Preserving Location
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Zero-Knowledge-inspired processing. Precise coordinates remain strictly sealed on-device during routine transit; only generalized sector analytics inform risk checks.
              </p>
            </div>

            {/* 3. Smartwatch Intelligence */}
            <div className="p-6 rounded-3xl bg-[#F8F9FD] border border-[#EDE9FE] hover:border-[#DDD6FE] transition group shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                <Watch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B] mb-2 group-hover:text-[#7C3AED] transition">
                Smartwatch Telemetry
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Continuous physiological baseline monitoring compares live heart rate, skin temperature, and acute stress signals to detect panic spikes or distress even if your phone is trapped.
              </p>
            </div>

            {/* 4. Community Safety Reports */}
            <div className="p-6 rounded-3xl bg-[#F8F9FD] border border-[#EDE9FE] hover:border-[#DDD6FE] transition group shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B] mb-2 group-hover:text-[#7C3AED] transition">
                Community Safety Reports
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Decentralized, fully anonymized community hazard reporting for poor streetlighting, suspicious loitering, and harassment alerts without ever exposing reporter identities.
              </p>
            </div>

            {/* 5. Automatic Emergency Detection */}
            <div className="p-6 rounded-3xl bg-[#F8F9FD] border border-[#EDE9FE] hover:border-[#DDD6FE] transition group shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B] mb-2 group-hover:text-[#7C3AED] transition">
                Proactive Auto-Escalation
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Multi-signal AI evaluation combines route deviation with biometric anomalies to start a 5-minute safety check. Zero response triggers automatic emergency escalation.
              </p>
            </div>

            {/* 6. Nearby Safety Network */}
            <div className="p-6 rounded-3xl bg-[#F8F9FD] border border-[#EDE9FE] hover:border-[#DDD6FE] transition group shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B] mb-2 group-hover:text-[#7C3AED] transition">
                Nearby Safety Network
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Peer-to-peer verified community network alerts nearby opted-in SafetyBuddy members within 500 meters during genuine emergencies to bridge response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Architecture Flow Visual */}
      <section className="py-20 border-b border-[#EDE9FE] bg-[#F8F9FD]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-[#7C3AED] uppercase">
              ZERO-KNOWLEDGE-INSPIRED ARCHITECTURE
            </span>
            <h2 className="text-3xl font-black text-[#1E1B4B] mt-2 tracking-tight">
              How Your Location Stays Protected
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center">
            <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center mb-2 font-mono text-xs font-bold">
                1
              </div>
              <div className="text-xs font-bold text-[#1E1B4B]">LIVE GPS</div>
              <div className="text-[10px] text-[#6B7280] mt-1">Raw coordinates kept strictly in device memory</div>
            </div>

            <div className="text-center font-mono text-[#7C3AED] font-bold hidden sm:block">→</div>

            <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center mb-2 font-mono text-xs font-bold">
                2
              </div>
              <div className="text-xs font-bold text-[#1E1B4B]">PRIVACY LAYER</div>
              <div className="text-[10px] text-[#6B7280] mt-1">Spatial hashing & sector filtering</div>
            </div>

            <div className="text-center font-mono text-[#7C3AED] font-bold hidden sm:block">→</div>

            <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mx-auto flex items-center justify-center mb-2 font-mono text-xs font-bold">
                3
              </div>
              <div className="text-xs font-bold text-[#1E1B4B]">LOCAL RISK ENGINE</div>
              <div className="text-[10px] text-[#6B7280] mt-1">Sector safety queried without revealing origin</div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-white border border-[#EDE9FE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280] shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Normal state: “Exact location is protected.”</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#7C3AED]" />
              <span>Emergency state: “Precise location sharing available only to authorized contacts.”</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white text-center text-xs text-[#6B7280] border-t border-[#EDE9FE]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7C3AED]" />
            <span className="text-[#1E1B4B] font-bold">SafetyBuddy</span>
            <span>— AI-Assisted Personal Safety Platform</span>
          </div>
          <div className="text-[11px] text-[#9CA3AF]">
            Prototype Demonstration • Simulated Sensor Telemetry
          </div>
        </div>
      </footer>
    </div>
  );
};
