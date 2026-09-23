import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Leaf, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface TelemetryMetric {
  id: string;
  title: string;
  value: string;
  subtext: string;
  badge: string;
  detail: string;
  progressPercent: number;
  colorScheme: 'emerald' | 'blue' | 'slate';
}

const TELEMETRY_METRICS: TelemetryMetric[] = [
  {
    id: 'shelf-life',
    title: 'Avg. Shelf Life Gain',
    value: '+42.4%',
    subtext: 'Across 12,480 Audited Batches',
    badge: 'ASTM D3985 Calibrated',
    detail: 'Extends ambient and cold-chain commercial shelf stability without synthetic preservatives.',
    progressPercent: 84,
    colorScheme: 'emerald'
  },
  {
    id: 'oxidation',
    title: 'Oxidation Defect Reduction',
    value: '-64.8%',
    subtext: 'Peroxide Cutoff < 5 meq/kg',
    badge: 'Zero Rancidity Spoilage',
    detail: 'Mitigates oxidative rancidity in lipid-rich snack foods and volatile aroma scalping in roasted goods.',
    progressPercent: 78,
    colorScheme: 'emerald'
  },
  {
    id: 'fssai-compliance',
    title: 'FSSAI Compliance Rate',
    value: '99.1%',
    subtext: 'IS 15609 & IS 9845 Passed',
    badge: 'Statutory Pass (Class 1)',
    detail: 'Overall and specific migration limits verified in compliant third-party NABL food laboratories.',
    progressPercent: 99,
    colorScheme: 'emerald'
  },
  {
    id: 'eco-adoption',
    title: 'Eco-Packaging Adoption Index',
    value: '78%',
    subtext: 'Mono-Polyolefin & Circular rPET',
    badge: 'MoFPI PMKSY Incentive',
    detail: 'Transitions flexible multilayer structures to mechanically recyclable mono-material substrates.',
    progressPercent: 78,
    colorScheme: 'blue'
  }
];

export const IntermediateTelemetryStrip: React.FC = () => {
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);

  return (
    <section
      id="intermediate-telemetry-strip"
      className="w-full bg-white border border-[#CBD5E1] rounded-md shadow-xs p-2 sm:p-2.5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1.5 pb-1.5 mb-2 border-b border-[#CBD5E1]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#059669]" />
          <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-tight">
            High-Density Industrial Telemetry Strip
          </h4>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300">
            Real-Time Engine Metrics
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Updated: Today, 11:20 IST • Sample Size: 24,000+ Barrier Data Points
        </div>
      </div>

      {/* 4 Interactive Summary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {TELEMETRY_METRICS.map(metric => {
          const isSelected = activeMetricId === metric.id;
          return (
            <div
              key={metric.id}
              onClick={() => setActiveMetricId(isSelected ? null : metric.id)}
              className={`p-2 rounded border transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50 border-[#059669] shadow-xs'
                  : 'bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <span className="truncate">{metric.title}</span>
                  <span className="text-[9px] font-black px-1 py-0.2 rounded bg-white text-[#059669] border border-[#CBD5E1] font-mono">
                    {metric.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight font-mono">
                    {metric.value}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold truncate">
                    {metric.subtext}
                  </span>
                </div>
              </div>

              {/* Progress Mini Bar */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mb-0.5">
                  <span>Audit Index</span>
                  <span className="font-bold text-[#0F172A]">{metric.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    style={{ width: `${metric.progressPercent}%` }}
                    className="h-full bg-[#059669]"
                  />
                </div>
                {isSelected && (
                  <p className="text-[9px] text-slate-600 mt-1 leading-tight animate-fadeIn">
                    {metric.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
