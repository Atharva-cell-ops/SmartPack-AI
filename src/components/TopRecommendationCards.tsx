import React, { useState } from 'react';
import { ScoredMaterial, NoFeasibleAnalysis } from '../types';
import {
  Award,
  DollarSign,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  Info,
  XCircle,
  Wrench,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  Copy,
  Check
} from 'lucide-react';

interface TopRecommendationCardsProps {
  bestOverall: ScoredMaterial | null;
  bestForShelfLife: ScoredMaterial | null;
  mostEconomical: ScoredMaterial | null;
  mostSustainable: ScoredMaterial | null;
  feasibleAlternatives?: ScoredMaterial[];
  isNoFeasibleSolution?: boolean;
  noFeasibleAnalysis?: NoFeasibleAnalysis;
  onSelectMaterialToCompare: (materialId: string) => void;
  onSelectForBreakdown: (material: ScoredMaterial) => void;
  selectedBreakdownId?: string;
}

export const TopRecommendationCards: React.FC<TopRecommendationCardsProps> = ({
  bestOverall,
  bestForShelfLife,
  mostEconomical,
  mostSustainable,
  feasibleAlternatives = [],
  isNoFeasibleSolution = false,
  noFeasibleAnalysis,
  onSelectMaterialToCompare,
  onSelectForBreakdown,
  selectedBreakdownId
}) => {
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState<string | null>(
    bestOverall ? `best-overall-${bestOverall.material.id}` : null
  );
  const [copiedSpecId, setCopiedSpecId] = useState<string | null>(null);

  if (isNoFeasibleSolution || !bestOverall) {
    return (
      <div id="no-feasible-solution-banner" className="rounded-xl border border-rose-300 bg-rose-50/70 p-6 shadow-2xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-rose-600 text-white shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                CONSTRAINT VIOLATION
              </span>
              <span className="text-xs text-rose-700 font-semibold">Zero-Tolerance Elimination</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Fully Feasible Packaging Candidate Identified
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              The deterministic rule engine tested all indexed packaging materials against mandatory biological and physicochemical constraints. Every evaluated candidate breached at least one hard safety boundary.
            </p>
          </div>
        </div>

        {noFeasibleAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <div className="bg-white p-3.5 rounded-lg border border-rose-200 text-xs space-y-2">
              <h5 className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Violated Constraints</span>
              </h5>
              <ul className="space-y-1 text-rose-800">
                {noFeasibleAnalysis.failedConstraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#059669]" />
                <span>Nearest Candidate</span>
              </h5>
              {noFeasibleAnalysis.closestCandidate ? (
                <div>
                  <span className="font-bold text-slate-800 text-sm">
                    {noFeasibleAnalysis.closestCandidate.material.name}
                  </span>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Failed barrier parameter: {noFeasibleAnalysis.closestCandidate.filterReason}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">None identified</p>
              )}
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Recommended Engineering Adjustments</span>
              </h5>
              <ul className="space-y-1 text-slate-700">
                {noFeasibleAnalysis.requiredModifications.map((m, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">→</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  const cards = [
    {
      title: 'Best Overall Solution',
      type: 'best-overall',
      material: bestOverall,
      badgeColor: 'bg-emerald-50 text-[#059669] border-emerald-300',
      icon: <Award className="w-4 h-4 text-[#059669]" />,
      summary: 'Optimal multi-objective equilibrium across barrier, mechanical toughness, shelf life, and economics.'
    },
    {
      title: 'Maximum Shelf Life',
      type: 'best-shelflife',
      material: bestForShelfLife,
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
      icon: <ShieldCheck className="w-4 h-4 text-blue-700" />,
      summary: 'Highest hermetic seal integrity, lowest gas/moisture permeation rates.'
    },
    {
      title: 'Most Economical',
      type: 'most-economical',
      material: mostEconomical,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: <DollarSign className="w-4 h-4 text-amber-700" />,
      summary: 'Lowest commercial unit packaging cost per kg while clearing mandatory barrier hurdles.'
    },
    {
      title: 'Most Sustainable',
      type: 'most-sustainable',
      material: mostSustainable,
      badgeColor: 'bg-teal-50 text-teal-900 border-teal-200',
      icon: <Leaf className="w-4 h-4 text-teal-700" />,
      summary: 'Highest circularity score, industrial compostability or mechanical recyclability.'
    }
  ].filter(c => c.material !== null);

  const handleCopySpec = (mat: ScoredMaterial, key: string) => {
    if (!mat.prescription) return;
    const text = `SMARTPACK AI ENGINEERING SPECIFICATION SHEET
Material: ${mat.material.name} (${mat.material.structure})
Suitability Score: ${mat.score}/100
Package Format: ${mat.prescription.packageFormat}
Gauge / Thickness: ${mat.prescription.thicknessRange}
Moisture Barrier: ${mat.prescription.moistureBarrier}
Oxygen Barrier: ${mat.prescription.oxygenBarrier}
Light Barrier: ${mat.prescription.lightBarrier}
Mechanical Strength: ${mat.prescription.mechanicalStrength}
Sealing Method: ${mat.prescription.sealability}
MAP Requirement: ${mat.prescription.mapRequirement}
Economics: ${mat.prescription.cost}
Sustainability: ${mat.prescription.sustainability}
Engineering Notes: ${mat.prescription.explanation}`;

    navigator.clipboard.writeText(text);
    setCopiedSpecId(key);
    setTimeout(() => setCopiedSpecId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const mat = card.material!;
          const isSelected = selectedBreakdownId === mat.material.id;
          const cardKey = `${card.type}-${mat.material.id}`;
          const isPrescriptionOpen = expandedPrescriptionId === cardKey;

          return (
            <div
              key={cardKey}
              className={`bg-white rounded-xl border p-4 shadow-2xs flex flex-col justify-between transition-all ${
                card.type === 'best-overall'
                  ? 'border-[#059669] ring-1 ring-[#059669]/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${card.badgeColor}`}>
                    {card.icon}
                    <span>{card.title}</span>
                  </span>
                  <span className="text-xs font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {mat.score} / 100
                  </span>
                </div>

                {/* Material Name & Category */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {mat.material.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {mat.material.structure}
                </p>

                {/* Compact Technical Barrier Row */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">WVTR (Moisture)</span>
                    <span className="font-mono font-bold text-slate-800">
                      {mat.material.wvtrValue} <span className="text-[10px] text-slate-500 font-normal">g/m²·d</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">OTR (Oxygen)</span>
                    <span className="font-mono font-bold text-slate-800">
                      {mat.material.otrValue} <span className="text-[10px] text-slate-500 font-normal">cc/m²·d</span>
                    </span>
                  </div>
                </div>

                {/* Rationale Snippet */}
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {mat.keyReason}
                </p>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => setExpandedPrescriptionId(isPrescriptionOpen ? null : cardKey)}
                  className={`w-full py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isPrescriptionOpen
                      ? 'bg-[#059669] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isPrescriptionOpen ? 'Hide Specification' : 'View Engineering Spec'}</span>
                  </span>
                  {isPrescriptionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectForBreakdown(mat)}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                  >
                    <span>Audit Math</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectMaterialToCompare(mat.material.id)}
                    className="text-[11px] font-semibold text-[#059669] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Scale className="w-3 h-3" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED ENGINEERING SPECIFICATION SHEET (When any prescription is opened) */}
      {expandedPrescriptionId && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 space-y-5 animate-fadeIn">
          {(() => {
            const activeCard = cards.find(c => `${c.type}-${c.material!.material.id}` === expandedPrescriptionId);
            if (!activeCard || !activeCard.material!.prescription) return null;
            const mat = activeCard.material!;
            const p = mat.prescription!;

            return (
              <div className="space-y-4">
                {/* Spec Sheet Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#059669] text-white">
                        ENGINEERING SPECIFICATION SHEET
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Prescription Spec #{mat.material.id.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {mat.material.name} — Technical Deployment Prescription
                    </h3>
                    <p className="text-xs text-slate-600">
                      Recommended structure: <span className="font-mono font-semibold text-slate-800">{p.materialStructure}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopySpec(mat, expandedPrescriptionId)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSpecId === expandedPrescriptionId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Spec</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 10 Key Engineering Parameters Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {/* 1. Package Format */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      1. Package Format
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">{p.packageFormat}</span>
                    <span className="text-[11px] text-slate-500 block">Rigid/Flexible container configuration</span>
                  </div>

                  {/* 2. Material Structure */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      2. Substrate Lamination
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs block">{p.materialStructure}</span>
                    <span className="text-[11px] text-slate-500 block">Co-extruded barrier layers</span>
                  </div>

                  {/* 3. Gauge / Thickness */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      3. Thickness / Gauge
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">{p.thicknessRange}</span>
                    <span className="text-[11px] text-slate-500 block">Calibrated for transit puncture resistance</span>
                  </div>

                  {/* 4. Moisture Barrier */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      4. Moisture Barrier (WVTR)
                    </span>
                    <span className="font-semibold text-blue-900 text-xs block">{p.moistureBarrier}</span>
                    <span className="text-[11px] text-slate-500 block">ASTM F1249 test condition verified</span>
                  </div>

                  {/* 5. Oxygen Barrier */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      5. Oxygen Barrier (OTR)
                    </span>
                    <span className="font-semibold text-cyan-900 text-xs block">{p.oxygenBarrier}</span>
                    <span className="text-[11px] text-slate-500 block">ASTM D3985 standard test benchmark</span>
                  </div>

                  {/* 6. Light / UV Protection */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      6. Light & UV Shielding
                    </span>
                    <span className="font-semibold text-amber-900 text-xs block">{p.lightBarrier}</span>
                    <span className="text-[11px] text-slate-500 block">Prevents photo-oxidation & lipid rancidity</span>
                  </div>

                  {/* 7. Mechanical Strength */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      7. Mechanical Strength
                    </span>
                    <span className="font-semibold text-slate-900 text-xs block">{p.mechanicalStrength}</span>
                    <span className="text-[11px] text-slate-500 block">Tensile, burst, & tear resistance</span>
                  </div>

                  {/* 8. Sealing Method */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      8. Sealing Method
                    </span>
                    <span className="font-semibold text-slate-900 text-xs block">{p.sealability}</span>
                    <span className="text-[11px] text-slate-500 block">Hermetic heat-seal / ultrasonic seal</span>
                  </div>

                  {/* 9. Modified Atmosphere (MAP) */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      9. Modified Atmosphere (MAP)
                    </span>
                    <span className="font-semibold text-emerald-900 text-xs block">{p.mapRequirement}</span>
                    <span className="text-[11px] text-slate-500 block">Equilibrium gas composition target</span>
                  </div>

                  {/* 10. Cost & Commercial Profile */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      10. Cost & Availability
                    </span>
                    <span className="font-semibold text-slate-900 text-xs block">{p.cost}</span>
                    <span className="text-[11px] text-slate-500 block">Commercial converter supply tier</span>
                  </div>

                  {/* 11. Sustainability Profile */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      11. Sustainability & Recycling
                    </span>
                    <span className="font-semibold text-teal-900 text-xs block">{p.sustainability}</span>
                    <span className="text-[11px] text-slate-500 block">Mechanical circularity rating</span>
                  </div>

                  {/* 12. Quality Validation */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                      12. Quality Validation
                    </span>
                    <span className="font-semibold text-slate-900 text-xs block">
                      Score: {p.suitabilityScore} / 100
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      Passed 10-Stage Pipeline Verification
                    </span>
                  </div>
                </div>

                {/* Technical Rationale & Limitations Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>Prescription Engineering Explanation</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {p.explanation}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Engineering Caveats & Processing Limitations</span>
                    </span>
                    <ul className="space-y-1 text-slate-700 text-[11px] bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                      {p.limitations.map((lim, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>{p.confidenceCompleteness}</span>
                  <button
                    type="button"
                    onClick={() => setExpandedPrescriptionId(null)}
                    className="text-[#059669] font-semibold hover:underline cursor-pointer"
                  >
                    Collapse Specification ▲
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Feasible Alternatives Section */}
      {feasibleAlternatives.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              <span>Alternative Feasible Packaging Candidates ({feasibleAlternatives.length} Validated)</span>
            </span>
            <span className="text-[11px] text-slate-500">Passed all baseline barrier threshold rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {feasibleAlternatives.map(alt => (
              <div
                key={alt.material.id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{alt.material.name}</span>
                  <span className="text-[11px] text-slate-500">Score: {alt.score} • {alt.material.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectMaterialToCompare(alt.material.id)}
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold cursor-pointer"
                >
                  Compare
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
