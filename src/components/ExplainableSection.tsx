import React from 'react';
import { ScoredMaterial, PackagingRequirement } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle, Shield, Truck, DollarSign, Leaf, Cpu } from 'lucide-react';

interface ExplainableSectionProps {
  material: ScoredMaterial;
  requirements: PackagingRequirement[];
}

export const ExplainableSection: React.FC<ExplainableSectionProps> = ({ material, requirements }) => {
  const bd = material.breakdown;

  return (
    <div id="explainable-ai-section" className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <Cpu className="w-3.5 h-3.5 text-[#059669]" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Decision Support Audit Trail — {material.material.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic rule synthesis and multi-objective scoring rationale.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs self-start sm:self-auto">
          <span className="text-slate-500">Total Score:</span>
          <span className="font-mono font-bold text-slate-900 text-sm">{material.score}/100</span>
        </div>
      </div>

      {/* Two Column Reasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Positive Justifications */}
        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
          <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>Favorable Engineering Factors</span>
          </h4>
          <ul className="space-y-1.5">
            {material.reasonsPositive.length > 0 ? (
              material.reasonsPositive.map((reason, idx) => (
                <li key={idx} className="text-xs text-slate-800 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{reason}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-700">Satisfies minimum baseline compatibility.</li>
            )}
            <li className="text-xs text-slate-800 flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-700 font-bold shrink-0">✓</span>
              <span>
                Fulfills all {requirements.filter(r => r.level === 'Required').length} mandatory safety constraints.
              </span>
            </li>
          </ul>
        </div>

        {/* Negative Factors / Trade-Offs */}
        <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200">
          <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Trade-Offs & Cautionary Vectors</span>
          </h4>
          <ul className="space-y-1.5">
            {material.reasonsNegative.length > 0 ? (
              material.reasonsNegative.map((neg, idx) => (
                <li key={idx} className="text-xs text-slate-800 flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-700 font-bold shrink-0">⚠</span>
                  <span>{neg}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-600">No severe trade-off penalties detected.</li>
            )}
            {material.warnings.map((w, idx) => (
              <li key={`warn-${idx}`} className="text-xs text-slate-800 flex items-start gap-2 leading-relaxed">
                <span className="text-amber-700 font-bold shrink-0">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deterministic Mathematical Score Breakdown */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Sub-Metric Breakdown
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Score = Protection + Storage + Transport + Cost + Eco - Penalties
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {/* Protection */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Barrier Protection</span>
            <span className="font-mono font-bold text-slate-900">{bd.protectionScore}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">WVTR / OTR / Light</span>
          </div>

          {/* Storage */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Storage Suitability</span>
            <span className="font-mono font-bold text-slate-900">{bd.storageSuitability}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Thermal & RH match</span>
          </div>

          {/* Transport */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Transit Resistance</span>
            <span className="font-mono font-bold text-slate-900">{bd.transportStrength}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Puncture & shock</span>
          </div>

          {/* Cost */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Economics Utility</span>
            <span className="font-mono font-bold text-slate-900">{bd.costScore}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Commercial price tier</span>
          </div>

          {/* Eco */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Circularity / Eco</span>
            <span className="font-mono font-bold text-slate-900">{bd.sustainabilityScore}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Recyclability rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
