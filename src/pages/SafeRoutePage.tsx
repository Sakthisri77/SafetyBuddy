import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { POPULAR_DESTINATIONS, SAMPLE_SAFE_ROUTES } from '../data/mockData';
import { DestinationOption, SafeRouteOption } from '../types/safety';
import { LiveSafetyMap } from '../components/map/LiveSafetyMap';
import {
  Navigation,
  MapPin,
  Search,
  RefreshCw,
  Clock,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Radio,
  FileText,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const SafeRoutePage: React.FC = () => {
  const {
    location,
    latitude,
    longitude,
    accuracy,
    locationStatus,
    requestLocationPermission,
    refreshLocation,
    activeDestination,
    setActiveDestination,
    selectedRoute,
    setSelectedRoute,
    availableRoutes,
    calculateRoutesForDestination,
    isJourneyActive,
    startJourney,
    endJourney,
    simulateRouteDeviation,
    isRouteDeviated,
    safetyStatus,
    routeStatus,
    setActiveView,
    addToast,
  } = useSafety();

  const [toInput, setToInput] = useState<string>(activeDestination || 'SRM TRP Engineering College');
  const [manualFromInput, setManualFromInput] = useState<string>('');
  const [isManualFrom, setIsManualFrom] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showLocationDetails, setShowLocationDetails] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Sync toInput if activeDestination changes externally
  useEffect(() => {
    if (activeDestination) {
      setToInput(activeDestination);
    }
  }, [activeDestination]);

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (dest) =>
      dest.name.toLowerCase().includes(toInput.toLowerCase()) ||
      dest.address.toLowerCase().includes(toInput.toLowerCase())
  );

  const handleSelectDestination = (dest: DestinationOption) => {
    setToInput(dest.name);
    setActiveDestination(dest.name);
    setShowSuggestions(false);
    calculateRoutesForDestination(dest.name);
  };

  const handleFindSafeRoute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!toInput.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      calculateRoutesForDestination(toInput.trim());
      setIsAnalyzing(false);
    }, 600);
  };

  const currentRoute = selectedRoute || availableRoutes[0] || SAMPLE_SAFE_ROUTES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* SECTION 1: PROMINENT ROUTE INPUT EXPERIENCE */}
      <div className="bg-white rounded-3xl border border-[#EDE9FE] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#7C3AED] uppercase bg-[#EDE9FE] px-2.5 py-1 rounded-lg">
              GPS SAFE-CORRIDOR PLANNER
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight mt-1.5">
              Plan a Safe Journey
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              SafetyBuddy automatically roots your route from your real GPS position and evaluates environmental safety.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-mono text-[#6B7280]">
              “Protect the person. Protect their privacy.”
            </span>
          </div>
        </div>

        {/* Permission Callout if denied */}
        {locationStatus === 'denied' && (
          <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#991B1B]">
                  Location access is required to automatically use your current position.
                </div>
                <div className="text-[11px] text-[#B91C1C]">
                  You can retry granting browser permissions or type your starting point manually.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={requestLocationPermission}
                className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={() => setIsManualFrom(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold hover:bg-[#FEF2F2] transition"
              >
                Enter Starting Point Manually
              </button>
            </div>
          </div>
        )}

        {/* Location Request Banner if prompt */}
        {locationStatus === 'prompt' && (
          <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#7C3AED] shrink-0" />
              <div className="text-xs text-[#5B21B6]">
                <span className="font-bold">Allow location access</span> to find a safe route from your current location.
              </div>
            </div>
            <button
              onClick={requestLocationPermission}
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Allow Location
            </button>
          </div>
        )}

        {/* THE FROM AND TO ROUTE FORM */}
        <form onSubmit={handleFindSafeRoute} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* FROM FIELD */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-[#6D28D9] flex items-center justify-between">
                <span>FROM</span>
                {isManualFrom ? (
                  <button
                    type="button"
                    onClick={() => setIsManualFrom(false)}
                    className="text-[10px] text-[#7C3AED] hover:underline"
                  >
                    Use Live GPS Instead
                  </button>
                ) : (
                  <span className="text-[10px] font-mono font-normal text-[#16A34A] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" /> Live
                  </span>
                )}
              </label>

              {isManualFrom ? (
                <div className="relative">
                  <input
                    type="text"
                    value={manualFromInput}
                    onChange={(e) => setManualFromInput(e.target.value)}
                    placeholder="Enter starting location..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                  />
                </div>
              ) : (
                <div className="p-3 px-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      📍
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#171717]">
                        Current Location
                      </div>
                      <div className="text-[10px] text-[#6D28D9] font-medium flex items-center gap-1">
                        <span>Location detected</span>
                        <span>•</span>
                        <span className="font-mono text-[#6B7280]">Accuracy ±{accuracy}m</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={refreshLocation}
                    title="Refresh current GPS position"
                    className="p-2 rounded-xl bg-white hover:bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] transition shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* TO FIELD WITH AUTOCOMPLETE SUGGESTIONS */}
            <div className="md:col-span-5 space-y-1.5 relative">
              <label className="text-xs font-bold text-[#6D28D9] block">
                TO
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={toInput}
                  onChange={(e) => {
                    setToInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="🔎 Enter destination (e.g. SRM TRP Engineering College)..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm font-semibold text-[#171717] focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  required
                />
                <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl max-h-60 overflow-y-auto p-1.5 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-[#9CA3AF] uppercase">
                    Suggested Destinations
                  </div>
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleSelectDestination(dest)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F3FF] transition flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <div>
                          <div className="font-bold text-[#171717]">{dest.name}</div>
                          <div className="text-[10px] text-[#6B7280]">{dest.address}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded">
                        {dest.distanceKm} km
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTON */}
            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#7C3AED]/25 disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'ANALYZING...' : 'FIND SAFE ROUTE'}</span>
              </button>
            </div>
          </div>

          {/* Privacy & Location Details Toggle */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-[#6B7280]">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Location Protected: Zero-Knowledge client processing</span>
            </div>

            <button
              type="button"
              onClick={() => setShowLocationDetails(!showLocationDetails)}
              className="text-[#7C3AED] hover:underline flex items-center gap-1 font-semibold text-xs cursor-pointer"
            >
              <span>{showLocationDetails ? 'Hide Location Details' : 'Location Details'}</span>
              {showLocationDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable Location Details Disclosure (Section 22) */}
          {showLocationDetails && (
            <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-[#DDD6FE] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in">
              <div>
                <span className="text-[10px] text-[#6B7280] uppercase font-mono">Latitude</span>
                <div className="font-mono font-bold text-[#171717] mt-0.5">{latitude.toFixed(6)}° N</div>
              </div>
              <div>
                <span className="text-[10px] text-[#6B7280] uppercase font-mono">Longitude</span>
                <div className="font-mono font-bold text-[#171717] mt-0.5">{longitude.toFixed(6)}° W</div>
              </div>
              <div>
                <span className="text-[10px] text-[#6B7280] uppercase font-mono">GPS Accuracy</span>
                <div className="font-mono font-bold text-[#16A34A] mt-0.5">±{accuracy} meters</div>
              </div>
              <div>
                <span className="text-[10px] text-[#6B7280] uppercase font-mono">Last Updated</span>
                <div className="font-mono font-bold text-[#171717] mt-0.5">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ACTIVE JOURNEY HUD CARD (If journey started) */}
      {isJourneyActive && (
        <div className="p-5 rounded-3xl bg-white border-2 border-[#7C3AED] shadow-xl space-y-4 animate-in slide-in-from-top-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-black animate-pulse">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider text-[#7C3AED] uppercase">
                    JOURNEY ACTIVE
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                      isRouteDeviated ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}
                  >
                    {isRouteDeviated ? 'ROUTE DEVIATION DETECTED' : 'ON ROUTE'}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#171717]">
                  Heading to: {activeDestination}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={simulateRouteDeviation}
                className="px-3.5 py-1.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] text-xs font-bold border border-[#FCD34D] transition cursor-pointer"
              >
                Simulate Route Deviation
              </button>
              <button
                onClick={endJourney}
                className="px-4 py-1.5 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-bold transition cursor-pointer"
              >
                End Journey
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[#6B7280]">FROM</span>
              <div className="font-bold text-[#171717] mt-0.5">Current Location</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[#6B7280]">ETA</span>
              <div className="font-bold text-[#7C3AED] font-mono mt-0.5">{currentRoute.durationMinutes} min</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[#6B7280]">Distance</span>
              <div className="font-bold text-[#171717] font-mono mt-0.5">{currentRoute.distanceKm} km</div>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[#6B7280]">Safety Status</span>
              <div className="font-bold text-[#16A34A] mt-0.5">SAFE (Monitored)</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6 & 7: MAP & ROUTE OPTIONS COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (5 cols): Route Cards & Analysis */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#6B7280] font-bold">
            AVAILABLE SAFE ROUTES ({availableRoutes.length})
          </h2>

          <div className="space-y-3">
            {availableRoutes.map((route) => {
              const isSelected = route.id === currentRoute.id;
              const isRecommended = route.tag === 'RECOMMENDED';
              const isAvoid = route.tag === 'AVOID';

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? isAvoid
                        ? 'bg-[#FEF2F2] border-[#EF4444] ring-2 ring-[#EF4444]/20'
                        : isRecommended
                        ? 'bg-[#F5F3FF] border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-md'
                        : 'bg-[#FFFBEB] border-[#F59E0B] ring-2 ring-[#F59E0B]/20'
                      : 'bg-white border-[#E5E7EB] hover:border-[#DDD6FE]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-[#171717]">
                        {route.label}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider ${
                          isAvoid
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : isRecommended
                            ? 'bg-[#EDE9FE] text-[#6D28D9]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {isRecommended ? 'Recommended Safe Route' : route.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs">
                      <span className="text-[#6B7280]">Safety:</span>
                      <span
                        className={`font-black text-sm ${
                          route.safetyScore >= 80
                            ? 'text-[#16A34A]'
                            : route.safetyScore >= 50
                            ? 'text-[#D97706]'
                            : 'text-[#DC2626]'
                        }`}
                      >
                        {route.safetyScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1 font-medium text-[#171717]">
                      <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{route.durationMinutes} min ETA</span>
                    </span>
                    <span className="font-mono">{route.distanceKm} km</span>
                    <span
                      className={`font-bold ${
                        route.riskLevel === 'LOW'
                          ? 'text-[#16A34A]'
                          : route.riskLevel === 'MODERATE'
                          ? 'text-[#D97706]'
                          : 'text-[#DC2626]'
                      }`}
                    >
                      {route.riskLevel} Risk
                    </span>
                  </div>

                  {/* Why this route bullets */}
                  <div className="mt-3 pt-3 border-t border-[#EDE9FE] space-y-1.5 text-xs text-[#4B5563]">
                    {route.whyThisRoute.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#7C3AED] font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 9: PREVIOUS REPORTS ALONG ROUTE CARD */}
          <div className="p-5 rounded-2xl bg-white border border-[#EDE9FE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider text-[#6D28D9] uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                <span>ROUTE SAFETY ANALYSIS</span>
              </span>
              <span className="text-[10px] text-[#6B7280] font-mono">Demo Data</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                <div className="text-[10px] text-[#15803D] font-bold">✓ 3 Low Risk</div>
                <div className="text-[10px] text-[#6B7280]">Monitored sectors</div>
              </div>
              <div className="p-2 rounded-xl bg-[#FEF3C7] border border-[#FDE68A]">
                <div className="text-[10px] text-[#B45309] font-bold">⚠ 1 Moderate</div>
                <div className="text-[10px] text-[#6B7280]">Transit plaza</div>
              </div>
              <div className="p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                <div className="text-[10px] text-[#16A34A] font-bold">✓ 0 High Risk</div>
                <div className="text-[10px] text-[#6B7280]">Corridor verified</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F3F4F6]">
              <div className="text-xs font-bold text-[#171717] mb-1.5">Previous Reports Near Route:</div>
              <div className="flex flex-wrap gap-2 text-xs text-[#6B7280]">
                <span className="px-2 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  Poor lighting — 2 reports
                </span>
                <span className="px-2 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  Theft — 1 report
                </span>
                <span className="px-2 py-1 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  Suspicious activity — 1 report
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-[#6B7280] text-[11px]">Reporter identities protected by default</span>
              <button
                onClick={() => setActiveView('reports')}
                className="text-[#7C3AED] hover:underline font-bold text-xs cursor-pointer"
              >
                View Reports
              </button>
            </div>
          </div>

          {/* START JOURNEY BUTTON */}
          <button
            onClick={() => startJourney(currentRoute)}
            className="w-full py-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#7C3AED]/25"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START JOURNEY ON {currentRoute.label}</span>
          </button>
        </div>

        {/* Right (7 cols): Map & Route Visual */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-bold text-[#171717]">
                  Interactive Safe Route Map
                </h3>
              </div>
              <span className="text-xs font-mono text-[#6D28D9] font-semibold">
                🟣 Centered on Live GPS
              </span>
            </div>

            <LiveSafetyMap height="h-[460px]" />
          </div>

          {/* Summary Route Card */}
          <div className="p-5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-[#6D28D9] uppercase font-mono">
                Selected: {currentRoute.label} ({currentRoute.tag})
              </div>
              <div className="text-sm font-bold text-[#171717] mt-0.5">
                {currentRoute.safetyScore} Safety Score • {currentRoute.distanceKm} km • {currentRoute.durationMinutes} min
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                Continuous LED lighting along entire corridor with zero severe incidents in past 90 days.
              </p>
            </div>

            {!isJourneyActive && (
              <button
                onClick={() => startJourney(currentRoute)}
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition self-start sm:self-auto shrink-0 shadow-sm cursor-pointer"
              >
                Start Journey
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
