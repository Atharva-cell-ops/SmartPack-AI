import React, { useState, useMemo } from 'react';
import { FoodCommodity, ExistingPackageAuditInput, StorageInput, TransportInput } from '../types';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import { auditExistingPackage } from '../services/recommendationEngine';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
  Gauge,
  Activity,
  Wrench,
  Check
} from 'lucide-react';

interface ExistingPackageAuditViewProps {
  onSelectForRecommendation?: (foodId: string) => void;
}

export const ExistingPackageAuditView: React.FC<ExistingPackageAuditViewProps> = ({
  onSelectForRecommendation
}) => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('potato-chips');
  const selectedFood = useMemo(
    () => FOOD_COMMODITIES.find(f => f.id === selectedFoodId) || FOOD_COMMODITIES[0],
    [selectedFoodId]
  );

  // Current package input state
  const [currentMaterialName, setCurrentMaterialName] = useState<string>('LDPE Polybag (Thin Monolayer)');
  const [currentStructure, setCurrentStructure] = useState<string>('Single Monolayer Film');
  const [currentGaugeMicrons, setCurrentGaugeMicrons] = useState<number>(25);
  const [currentOtrKnown, setCurrentOtrKnown] = useState<boolean>(true);
  const [currentOtrValue, setCurrentOtrValue] = useState<number>(2500);
  const [currentWvtrKnown, setCurrentWvtrKnown] = useState<boolean>(true);
  const [currentWvtrValue, setCurrentWvtrValue] = useState<number>(18.0);
  const [achievedShelfLifeDays, setAchievedShelfLifeDays] = useState<number>(20);
  const [targetShelfLifeDays, setTargetShelfLifeDays] = useState<number>(90);

  // Observed issues checkboxes
  const [observedIssues, setObservedIssues] = useState({
    leakage: false,
    moistureLossOrGain: true,
    oxidationRancidity: true,
    mechanicalCrushing: false,
    colorFading: false,
    packageSwelling: false
  });

  // Storage and Transport context for audit
  const auditStorage: StorageInput = useMemo(() => ({
    temperatureC: 32,
    relativeHumidityPercent: 78,
    storageDurationDays: targetShelfLifeDays,
    storageMode: 'Ambient',
    environmentType: 'Indoor Ambient'
  }), [targetShelfLifeDays]);

  const auditTransport: TransportInput = useMemo(() => ({
    durationDays: 4,
    distanceKm: 500,
    vehicleType: 'Covered Commercial Truck',
    handling: 'Standard Commercial',
    heatExposure: 'Moderate',
    moistureExposure: 'High'
  }), []);

  // Run audit
  const auditResult = useMemo(() => {
    const input: ExistingPackageAuditInput = {
      commodityId: selectedFood.id,
      currentMaterialName,
      currentStructure,
      currentGaugeMicrons,
      currentOtrKnown,
      currentOtrValue: currentOtrKnown ? currentOtrValue : undefined,
      currentWvtrKnown,
      currentWvtrValue: currentWvtrKnown ? currentWvtrValue : undefined,
      achievedShelfLifeDays,
      targetShelfLifeDays,
      observedIssues
    };

    return auditExistingPackage(input, selectedFood, auditStorage, auditTransport);
  }, [
    currentMaterialName,
    currentStructure,
    currentGaugeMicrons,
    currentOtrKnown,
    currentOtrValue,
    currentWvtrKnown,
    currentWvtrValue,
    achievedShelfLifeDays,
    targetShelfLifeDays,
    observedIssues,
    selectedFood,
    auditStorage,
    auditTransport
  ]);

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Adequate':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'Marginal':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Substandard / High Failure Risk':
      default:
        return 'bg-rose-50 text-rose-900 border-rose-300';
    }
  };

  return (
    <div id="existing-package-audit-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Package Integrity Audit
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Packaging Diagnostic &amp; Barrier Gap Audit
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Benchmark current production packaging against calculated shelf-life requirements to pinpoint barrier leakages and failure root causes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="audit-food-select" className="text-xs font-semibold text-slate-500">
            Target Commodity:
          </label>
          <select
            id="audit-food-select"
            value={selectedFoodId}
            onChange={e => {
              const newFoodId = e.target.value;
              setSelectedFoodId(newFoodId);
              const found = FOOD_COMMODITIES.find(f => f.id === newFoodId);
              if (found) {
                setTargetShelfLifeDays(found.recommendedShelfLifeDays);
                setAchievedShelfLifeDays(Math.round(found.recommendedShelfLifeDays * 0.4));
              }
            }}
            className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 cursor-pointer"
          >
            {FOOD_COMMODITIES.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Package Input Form */}
        <div className="lg:col-span-5 bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
              <span>Current Production Specification</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 font-mono">SPEC INPUT</span>
          </div>

          {/* Current Material Structure */}
          <div className="space-y-1">
            <label htmlFor="audit-material-name" className="block text-xs font-semibold text-slate-700">
              Current Material / Substrate
            </label>
            <input
              id="audit-material-name"
              type="text"
              value={currentMaterialName}
              onChange={e => setCurrentMaterialName(e.target.value)}
              placeholder="e.g. 25 micron LDPE bag, Folding Carton, PET Jar"
              className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md p-2 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          {/* Gauge / Thickness */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="audit-gauge-slider">Thickness / Gauge (microns / μm)</label>
              <span className="text-slate-900 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {currentGaugeMicrons} μm
              </span>
            </div>
            <input
              id="audit-gauge-slider"
              type="range"
              min="10"
              max="200"
              step="5"
              value={currentGaugeMicrons}
              onChange={e => setCurrentGaugeMicrons(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10 μm (Thin Film)</span>
              <span>75 μm (Pouch)</span>
              <span>200 μm (Rigid)</span>
            </div>
          </div>

          {/* Shelf Life achieved vs target */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="audit-achieved-shelflife" className="block text-xs font-semibold text-slate-700">
                Achieved In-Market
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="audit-achieved-shelflife"
                  type="number"
                  min="1"
                  max="730"
                  value={achievedShelfLifeDays}
                  onChange={e => setAchievedShelfLifeDays(Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-2 outline-none"
                />
                <span className="text-xs text-slate-500 font-medium">days</span>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="audit-target-shelflife" className="block text-xs font-semibold text-slate-700">
                Target Specification
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="audit-target-shelflife"
                  type="number"
                  min="1"
                  max="730"
                  value={targetShelfLifeDays}
                  onChange={e => setTargetShelfLifeDays(Number(e.target.value))}
                  className="w-full text-xs font-bold text-[#059669] bg-slate-50 border border-slate-300 rounded-lg p-2 outline-none"
                />
                <span className="text-xs text-slate-500 font-medium">days</span>
              </div>
            </div>
          </div>

          {/* Barrier parameters (OTR & WVTR) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-700">Measured Barrier Values (ASTM calibrated)</span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">OTR Value</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentOtrKnown}
                      onChange={e => setCurrentOtrKnown(e.target.checked)}
                      className="rounded accent-[#059669]"
                    />
                    Known
                  </label>
                </div>
                {currentOtrKnown ? (
                  <input
                    type="number"
                    value={currentOtrValue}
                    onChange={e => setCurrentOtrValue(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded p-1.5"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400 italic block py-1.5">Estimated</span>
                )}
                <span className="text-[10px] text-slate-400 block font-mono">cm³/m²·day</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">WVTR Value</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentWvtrKnown}
                      onChange={e => setCurrentWvtrKnown(e.target.checked)}
                      className="rounded accent-[#059669]"
                    />
                    Known
                  </label>
                </div>
                {currentWvtrKnown ? (
                  <input
                    type="number"
                    step="0.1"
                    value={currentWvtrValue}
                    onChange={e => setCurrentWvtrValue(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded p-1.5"
                  />
                ) : (
                  <span className="text-[11px] text-slate-400 italic block py-1.5">Estimated</span>
                )}
                <span className="text-[10px] text-slate-400 block font-mono">g/m²·day</span>
              </div>
            </div>
          </div>

          {/* Observed Defects Checkbox List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-700">Observed Packaging Defects in Field:</span>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={observedIssues.moistureLossOrGain}
                  onChange={e => setObservedIssues({ ...observedIssues, moistureLossOrGain: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span className="text-slate-800 font-medium">Moisture ingress / loss of crispness / powder caking</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={observedIssues.oxidationRancidity}
                  onChange={e => setObservedIssues({ ...observedIssues, oxidationRancidity: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span className="text-slate-800 font-medium">Lipid oxidation / off-odor / rancidity</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={observedIssues.colorFading}
                  onChange={e => setObservedIssues({ ...observedIssues, colorFading: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span className="text-slate-800 font-medium">Photo-bleaching / color fading from light</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={observedIssues.leakage}
                  onChange={e => setObservedIssues({ ...observedIssues, leakage: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span className="text-slate-800 font-medium">Liquid pinholing / seal seam failure</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={observedIssues.mechanicalCrushing}
                  onChange={e => setObservedIssues({ ...observedIssues, mechanicalCrushing: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span className="text-slate-800 font-medium">Mechanical crushing / puncture during transit</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={observedIssues.packageSwelling}
                  onChange={e => setObservedIssues({ ...observedIssues, packageSwelling: e.target.checked })}
                  className="rounded accent-emerald-600"
                />
                <span className="text-slate-800 font-medium">Package puffing / microbial gas swelling</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Findings, Root Failure Diagnosis, and Recommended Upgrade */}
        <div className="lg:col-span-7 space-y-4">
          {/* Adequacy Banner */}
          <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  DIAGNOSTIC VERDICT
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Barrier Adequacy for {selectedFood.name}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border self-start sm:self-auto ${getRatingBadge(auditResult.adequacyRating)}`}>
                {auditResult.adequacyRating}
              </span>
            </div>

            {/* Shelf life gap meter */}
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium">Achieved Shelf Life:</span>
                <strong className="text-slate-900 text-sm ml-1.5 font-mono">{achievedShelfLifeDays} days</strong>
              </div>
              <div className="text-slate-400 font-bold">vs</div>
              <div>
                <span className="text-slate-500 font-medium">Target Spec:</span>
                <strong className="text-emerald-700 text-sm ml-1.5 font-mono">{targetShelfLifeDays} days</strong>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono">
                  {Math.round(((targetShelfLifeDays - achievedShelfLifeDays) / targetShelfLifeDays) * 100)}% Deficit
                </span>
              </div>
            </div>

            {/* Met vs Failed Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-md bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                  <span>Requirements Satisfied ({auditResult.requirementsMet.length})</span>
                </span>
                <ul className="space-y-1 pl-4 list-disc text-slate-800 text-[11px]">
                  {auditResult.requirementsMet.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-md bg-rose-50/60 border border-rose-200 space-y-1.5">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" strokeWidth={1.5} />
                  <span>Requirements Failed ({auditResult.requirementsFailed.length})</span>
                </span>
                <ul className="space-y-1 pl-4 list-disc text-rose-950 text-[11px]">
                  {auditResult.requirementsFailed.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Diagnosed Failure Modes */}
            {auditResult.diagnosedFailureModes.length > 0 && (
              <div className="p-3.5 rounded-md bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700" strokeWidth={1.5} />
                  <span>Root Failure Mode Analysis</span>
                </h4>
                <ul className="space-y-1.5 text-slate-800">
                  {auditResult.diagnosedFailureModes.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Immediate Improvement Suggestions */}
            {auditResult.immediateImprovementSuggestions.length > 0 && (
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                  <span>Corrective Engineering Recommendations</span>
                </h4>
                <ul className="space-y-1.5 text-slate-700">
                  {auditResult.immediateImprovementSuggestions.map((sug, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">→</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Direct Link to Recommendation Engine */}
            {onSelectForRecommendation && (
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectForRecommendation(selectedFood.id)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Run Recommendation Engine for {selectedFood.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
