import React, { useState, useMemo } from 'react';
import {
  FoodCommodity,
  StorageInput,
  TransportInput,
  UserPreferences,
  ProductInput,
  StorageMode
} from '../types';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import { runRecommendationPipeline, calculateWhatIfDeltas } from '../services/recommendationEngine';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Droplets,
  Truck,
  DollarSign,
  Leaf,
  RefreshCw,
  Clock,
  Snowflake,
  ShieldAlert,
  HelpCircle,
  Package,
  Layers,
  Activity
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  // Baseline Food Selection
  const [selectedFoodId, setSelectedFoodId] = useState<string>('potato-chips');
  const selectedFood = useMemo(
    () => FOOD_COMMODITIES.find(f => f.id === selectedFoodId) || FOOD_COMMODITIES[0],
    [selectedFoodId]
  );

  // Baseline conditions
  const baselineProductInput: ProductInput = useMemo(() => ({
    foodId: selectedFood.id,
    quantityAmount: selectedFood.profile.defaultQuantity.amount,
    quantityUnit: selectedFood.profile.defaultQuantity.unit,
    ingredients: selectedFood.profile.defaultIngredients,
    moistureKnown: true,
    fatKnown: true,
    phKnown: true,
    respirationRateKnown: true,
    currentShelfLifeDays: selectedFood.recommendedShelfLifeDays,
    targetShelfLifeDays: selectedFood.recommendedShelfLifeDays
  }), [selectedFood]);

  const baselineStorage: StorageInput = useMemo(() => ({
    temperatureC: selectedFood.recommendedStorageTemp,
    relativeHumidityPercent: selectedFood.recommendedStorageRH,
    storageDurationDays: selectedFood.recommendedShelfLifeDays,
    storageMode: 'Ambient',
    environmentType: 'Indoor Ambient'
  }), [selectedFood]);

  const baselineTransport: TransportInput = useMemo(() => ({
    durationDays: 3,
    distanceKm: 400,
    vehicleType: 'Covered Commercial Truck',
    handling: 'Standard Commercial',
    heatExposure: 'Moderate',
    moistureExposure: 'Moderate'
  }), []);

  const baselinePreferences: UserPreferences = useMemo(() => ({
    costPriority: 'Medium',
    sustainabilityPriority: 'Medium',
    protectionPriority: 'High',
    availabilityPriority: 'Medium'
  }), []);

  // What-If Interactive Controls
  const [simTemp, setSimTemp] = useState<number>(38);
  const [simRH, setSimRH] = useState<number>(85);
  const [simStorageMode, setSimStorageMode] = useState<StorageMode>('Ambient');
  const [simTargetShelfLife, setSimTargetShelfLife] = useState<number>(180);
  const [simTransitDays, setSimTransitDays] = useState<number>(7);
  const [simCostPriority, setSimCostPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [simSustainPriority, setSimSustainPriority] = useState<'Low' | 'Medium' | 'High'>('High');

  // Baseline Run
  const baseResult = useMemo(() => {
    return runRecommendationPipeline(selectedFood, baselineProductInput, baselineStorage, baselineTransport, baselinePreferences);
  }, [selectedFood, baselineProductInput, baselineStorage, baselineTransport, baselinePreferences]);

  // Simulated Run
  const simProductInput: ProductInput = useMemo(() => ({
    ...baselineProductInput,
    targetShelfLifeDays: simTargetShelfLife
  }), [baselineProductInput, simTargetShelfLife]);

  const simStorage: StorageInput = useMemo(() => ({
    temperatureC: simStorageMode === 'Frozen' ? -18 : simStorageMode === 'Chilled' ? 4 : simTemp,
    relativeHumidityPercent: simRH,
    storageDurationDays: simTargetShelfLife,
    storageMode: simStorageMode,
    environmentType: simRH > 75 ? 'Outdoor Sheltered' : 'Indoor Ambient'
  }), [simStorageMode, simTemp, simRH, simTargetShelfLife]);

  const simTransport: TransportInput = useMemo(() => ({
    durationDays: simTransitDays,
    distanceKm: simTransitDays * 150,
    vehicleType: simStorageMode === 'Frozen' || simStorageMode === 'Chilled' ? 'Refrigerated Reefer Container' : 'Covered Commercial Truck',
    handling: simTransitDays >= 6 ? 'Rough / Manual' : 'Standard Commercial',
    heatExposure: simTemp >= 35 && simStorageMode === 'Ambient' ? 'High' : 'Moderate',
    moistureExposure: simRH >= 75 ? 'High' : 'Moderate'
  }), [simTransitDays, simStorageMode, simTemp, simRH]);

  const simPreferences: UserPreferences = useMemo(() => ({
    costPriority: simCostPriority,
    sustainabilityPriority: simSustainPriority,
    protectionPriority: 'High',
    availabilityPriority: 'Medium'
  }), [simCostPriority, simSustainPriority]);

  const simResult = useMemo(() => {
    return runRecommendationPipeline(selectedFood, simProductInput, simStorage, simTransport, simPreferences);
  }, [selectedFood, simProductInput, simStorage, simTransport, simPreferences]);

  // Deltas and dynamic reasoning
  const deltas = useMemo(() => {
    return calculateWhatIfDeltas(baseResult, simResult);
  }, [baseResult, simResult]);

  // Generate primary dynamic explanation text
  const primaryDynamicReason = useMemo(() => {
    const reasons: string[] = [];

    if (simStorageMode === 'Frozen') {
      reasons.push('Switching to Frozen Mode (-18°C) reduced lipid oxidation kinetics, but introduced sub-zero embrittlement constraints on brittle paperboard and PLA.');
    } else if (simStorageMode === 'Chilled') {
      reasons.push('Switching to Chilled Cold Chain (4°C) reduced product respiration and transpiration, stabilizing shelf life.');
    } else if (simTemp >= 35 && baselineStorage.temperatureC < 30) {
      reasons.push(`High ambient temperature (${simTemp}°C) accelerated polymer thermal softening risks, favoring Aluminium and high-deflection barrier substrates.`);
    }

    if (simRH >= 75 && baselineStorage.relativeHumidityPercent < 65) {
      reasons.push(`Elevated humidity (${simRH}% RH) intensified moisture barrier demands (WVTR < 1.5 g/m²·day), heavily penalizing unlaminated paper and breathable films.`);
    }

    if (simTargetShelfLife >= 180 && baselineProductInput.targetShelfLifeDays < 120) {
      reasons.push(`Extending target shelf life to ${simTargetShelfLife} days elevated hermetic seal integrity and near-zero gas transmission (OTR) to mandatory criteria.`);
    }

    if (simTransitDays >= 7) {
      reasons.push(`Longer rough transit (${simTransitDays} days, ${simTransitDays * 150} km) boosted mechanical burst requirements (> 800 kPa).`);
    }

    if (simSustainPriority === 'High' && baselinePreferences.sustainabilityPriority !== 'High') {
      reasons.push('High sustainability weighting rewarded mono-material recyclables and compostable polymers.');
    }

    if (reasons.length === 0) {
      return 'Adjust temperature, relative humidity, storage mode, or target shelf life to observe dynamic shifts in material suitability and confidence score.';
    }
    return reasons.join(' Furthermore, ');
  }, [simStorageMode, simTemp, simRH, simTargetShelfLife, simTransitDays, simSustainPriority, baselineStorage, baselineProductInput, baselinePreferences]);

  const handleResetToBaseline = () => {
    setSimTemp(selectedFood.recommendedStorageTemp);
    setSimRH(selectedFood.recommendedStorageRH);
    setSimStorageMode('Ambient');
    setSimTargetShelfLife(selectedFood.recommendedShelfLifeDays);
    setSimTransitDays(3);
    setSimCostPriority('Medium');
    setSimSustainPriority('Medium');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <Sliders className="w-4 h-4 text-[#1B4332]" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332]">
              SENSITIVITY & WHAT-IF SIMULATION
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Packaging Sensitivity & Stress Sandbox
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how shifts in storage mode, ambient RH/temperature, transit duration, and sustainability targets alter substrate rankings in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Commodity picker for simulator */}
          <select
            value={selectedFoodId}
            onChange={e => setSelectedFoodId(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 cursor-pointer"
          >
            {FOOD_COMMODITIES.map(f => (
              <option key={f.id} value={f.id}>
                Target: {f.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetToBaseline}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Simulator Interactive Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        {/* Storage Mode */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <Snowflake className="w-3.5 h-3.5 text-blue-600" />
            <span>Storage Mode</span>
          </span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs bg-slate-50 p-0.5">
            {(['Ambient', 'Chilled', 'Frozen'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setSimStorageMode(mode)}
                className={`flex-1 py-1 text-center font-bold rounded cursor-pointer text-[11px] transition-colors ${
                  simStorageMode === mode
                    ? 'bg-[#1B4332] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block truncate font-mono">
            {simStorageMode === 'Frozen' ? '-18°C Sub-zero' : simStorageMode === 'Chilled' ? '4°C Cold Chain' : 'Ambient Room'}
          </span>
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>Temp</span>
            </span>
            <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              {simTemp}°C
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="48"
            step="1"
            disabled={simStorageMode !== 'Ambient'}
            value={simTemp}
            onChange={e => setSimTemp(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer disabled:opacity-30"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10°C</span>
            <span>30°C</span>
            <span>48°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>Humidity</span>
            </span>
            <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              {simRH}% RH
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="95"
            step="5"
            value={simRH}
            onChange={e => setSimRH(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>20% (Dry)</span>
            <span>60%</span>
            <span>95% (Wet)</span>
          </div>
        </div>

        {/* Target Shelf Life */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-700" />
              <span>Target Life</span>
            </span>
            <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              {simTargetShelfLife}d
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="365"
            step="15"
            value={simTargetShelfLife}
            onChange={e => setSimTargetShelfLife(Number(e.target.value))}
            className="w-full accent-cyan-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>15d</span>
            <span>180d</span>
            <span>365d</span>
          </div>
        </div>

        {/* Transit Duration */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-slate-700" />
              <span>Transit</span>
            </span>
            <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              {simTransitDays}d
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="14"
            step="1"
            value={simTransitDays}
            onChange={e => setSimTransitDays(Number(e.target.value))}
            className="w-full accent-slate-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1d</span>
            <span>7d</span>
            <span>14d</span>
          </div>
        </div>

        {/* Sustainability Weight */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-teal-700" />
            <span>Eco Weight</span>
          </span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs bg-slate-50 p-0.5">
            {(['Low', 'Medium', 'High'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setSimSustainPriority(p)}
                className={`flex-1 py-1 text-center font-bold rounded cursor-pointer text-[11px] transition-colors ${
                  simSustainPriority === p
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block truncate font-mono">
            {simSustainPriority === 'High' ? 'Favors circular' : 'Standard balance'}
          </span>
        </div>
      </div>

      {/* DYNAMIC EXPLANATION BANNER */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded bg-[#1B4332] text-white shrink-0 mt-0.5">
            <Activity className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Sensitivity Impact & Decision Trace
              </h4>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                Confidence: {baseResult.confidenceGrade} ({baseResult.confidenceScore}%) → {simResult.confidenceGrade} ({simResult.confidenceScore}%)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {primaryDynamicReason}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Baseline vs Simulated */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Baseline Scenario */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                BASELINE BENCHMARK
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Standard Regime ({baselineStorage.temperatureC}°C / {baselineStorage.relativeHumidityPercent}% RH)
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Grade: {baseResult.confidenceGrade}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {baseResult.topRecommendations.bestOverall && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                    #1 Best Overall
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{baseResult.topRecommendations.bestOverall.material.name}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{baseResult.topRecommendations.bestOverall.prescription?.packageFormat}</span>
                </div>
                <span className="font-mono font-extrabold text-slate-900 text-sm">{baseResult.topRecommendations.bestOverall.score}/100</span>
              </div>
            )}

            {baseResult.topRecommendations.bestForShelfLife && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    #2 Shelf Life Max
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{baseResult.topRecommendations.bestForShelfLife.material.name}</p>
                </div>
                <span className="font-mono font-extrabold text-slate-900 text-sm">{baseResult.topRecommendations.bestForShelfLife.score}/100</span>
              </div>
            )}

            {baseResult.topRecommendations.mostEconomical && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    #3 Cost Optimized
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{baseResult.topRecommendations.mostEconomical.material.name}</p>
                </div>
                <span className="font-mono font-extrabold text-slate-900 text-sm">{baseResult.topRecommendations.mostEconomical.score}/100</span>
              </div>
            )}
          </div>
        </div>

        {/* Simulated Scenario */}
        <div className="bg-white rounded-xl border border-[#1B4332]/40 p-4 sm:p-5 shadow-2xs space-y-3 ring-1 ring-[#1B4332]/10">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332] font-mono">
                SIMULATED WHAT-IF SCENARIO
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                {simStorageMode} ({simStorage.temperatureC}°C / {simRH}% RH / {simTargetShelfLife}d)
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Grade: {simResult.confidenceGrade}
            </span>
          </div>

          {simResult.isNoFeasibleSolution ? (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                No Feasible Candidate
              </span>
              <p>Under these extreme parameters, all evaluated commercial materials failed at least one mandatory constraint.</p>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {simResult.topRecommendations.bestOverall && (
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                      #1 Best Overall
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{simResult.topRecommendations.bestOverall.material.name}</p>
                    <span className="text-[10px] text-slate-600 font-mono">{simResult.topRecommendations.bestOverall.prescription?.packageFormat}</span>
                  </div>
                  <span className="font-mono font-extrabold text-[#1B4332] text-sm">{simResult.topRecommendations.bestOverall.score}/100</span>
                </div>
              )}

              {simResult.topRecommendations.bestForShelfLife && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      #2 Shelf Life Max
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{simResult.topRecommendations.bestForShelfLife.material.name}</p>
                  </div>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">{simResult.topRecommendations.bestForShelfLife.score}/100</span>
                </div>
              )}

              {simResult.topRecommendations.mostEconomical && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      #3 Cost Optimized
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{simResult.topRecommendations.mostEconomical.material.name}</p>
                  </div>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">{simResult.topRecommendations.mostEconomical.score}/100</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Itemized Material Sensitivity Score Deltas */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        <div className="mb-3">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            Material Sensitivity Trajectory & Score Deltas
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic delta tracking across the 11 packaging candidates between baseline and simulated conditions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Substrate</th>
                <th className="py-2.5 px-2 text-center font-mono">Baseline Score (/100)</th>
                <th className="py-2.5 px-2 text-center font-mono">Simulated Score (/100)</th>
                <th className="py-2.5 px-2 text-center font-mono">Delta</th>
                <th className="py-2.5 px-3">Algorithmic Sensitivity Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deltas.map(d => {
                const isPositive = d.delta > 0;
                const isNeutral = d.delta === 0;

                return (
                  <tr key={d.materialName} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{d.materialName}</td>
                    <td className="py-3 px-2 text-center font-mono">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block text-xs border border-slate-200">
                        ({d.previousScore}/100)
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block text-xs border border-slate-200">
                        ({d.newScore}/100)
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          isPositive
                            ? 'bg-emerald-50 text-[#1B4332] border border-emerald-200'
                            : isNeutral
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? null : <TrendingDown className="w-3 h-3" />}
                        {isPositive ? `+${d.delta}` : d.delta}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 leading-snug">{d.driverReason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
