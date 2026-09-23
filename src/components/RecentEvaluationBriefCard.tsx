import React from 'react';
import {
  ShieldCheck,
  Layers,
  Wind,
  Leaf,
  Sparkles,
  QrCode,
  CheckCircle2,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { TraceabilityReportItem } from './TraceabilityQrModal';

interface RecentEvaluationBriefCardProps {
  report: TraceabilityReportItem | null;
  onStartEvaluation: (commodityName: string) => void;
  onGenerateQr: (report: TraceabilityReportItem) => void;
  onNavigateToCompare?: () => void;
}

export const RecentEvaluationBriefCard: React.FC<RecentEvaluationBriefCardProps> = ({
  report,
  onStartEvaluation,
  onGenerateQr,
  onNavigateToCompare
}) => {
  if (!report) {
    return (
      <div className="bg-white border border-[#CBD5E1] rounded-md p-6 shadow-xs text-center text-xs text-slate-500 font-medium">
        Select an audited commodity from the Recent Reports &amp; Traceability grid above to inspect the physical packaging brief.
      </div>
    );
  }

  // Calculate percentage widths for MAP gas bar
  const totalGas = (report.mapGas.o2 + report.mapGas.co2 + report.mapGas.n2) || 100;
  const o2Width = Math.max(0, Math.min(100, (report.mapGas.o2 / totalGas) * 100));
  const co2Width = Math.max(0, Math.min(100, (report.mapGas.co2 / totalGas) * 100));
  const n2Width = Math.max(0, Math.min(100, (report.mapGas.n2 / totalGas) * 100));

  return (
    <div
      id="recent-evaluation-brief-card"
      className="bg-white border border-[#CBD5E1] rounded-md shadow-xs overflow-hidden"
    >
      {/* Top Header of the Brief Card: Strictly titled "Recent Evaluation Brief — [Selected Item from Table Above]" */}
      <div className="py-1.5 px-2.5 border-b border-[#CBD5E1] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] tracking-tight uppercase">
              Recent Evaluation Brief — {report.itemName}
            </h3>
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-[#059669] border border-emerald-300 font-mono">
              Trace ID: {report.batchTraceId}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium">
            Physicochemical specification dossier, transmission rate boundary conditions, and FSSAI 2026 statutory audit record.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onGenerateQr(report)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-[#CBD5E1] text-[#0F172A] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <QrCode className="w-3 h-3 text-[#059669]" />
            <span>Generate QR Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => onStartEvaluation(report.itemName)}
            className="px-3 py-1 rounded bg-[#059669] hover:bg-[#047857] text-white text-xs font-black flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>Load in Evaluation Engine</span>
          </button>
        </div>
      </div>

      {/* 4 Structured Breakdown Columns / Dense Grid */}
      <div className="p-2 sm:p-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 bg-white">
        
        {/* 1. Recommended Material Specifications (Structure, Micron Thickness, Lamination) */}
        <div className="p-2 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col justify-between space-y-1.5">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#059669]" />
                Material Specification
              </span>
              <span className="text-[9px] font-mono bg-white px-1 py-0.2 rounded border border-[#CBD5E1] text-slate-700 font-bold">
                Structure
              </span>
            </div>

            <div className="text-xs font-black text-[#0F172A] leading-tight mt-1.5">
              {report.materialSuggested}
            </div>

            <div className="mt-1.5 text-[10px] space-y-1 bg-white p-1.5 rounded border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gauge / Thickness:</span>
                <span className="font-mono font-bold text-[#0F172A]">{report.thicknessMicrons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Engineered Shelf Life:</span>
                <span className="font-mono font-black text-[#059669]">{report.shelfLifeEngineeredDays} Days (+{report.shelfLifeGainPercent}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Baseline Shelf Life:</span>
                <span className="font-mono text-slate-600">{report.shelfLifeBaselineDays} Days</span>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-200 text-[9px] text-slate-500 font-mono">
            Tensile: ASTM D882 • Seal: ASTM F88
          </div>
        </div>

        {/* 2. Measured Barrier Thresholds (OTR, WVTR values) */}
        <div className="p-2 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col justify-between space-y-1.5">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#059669]" />
                Barrier Thresholds
              </span>
              <span className="text-[9px] font-mono bg-emerald-100 text-[#059669] font-black px-1.5 py-0.2 rounded border border-emerald-300">
                Index {report.packageIndex}/100
              </span>
            </div>

            {/* OTR Metric */}
            <div className="p-1.5 rounded bg-white border border-[#E2E8F0] mt-1.5 space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-semibold">Oxygen (OTR):</span>
                <span className="font-mono font-black text-[#0F172A]">{report.otr}</span>
              </div>
              <span className="text-[8px] text-slate-400 block font-mono">
                ASTM D3985 (Coulometric, 23°C, 0% RH)
              </span>
            </div>

            {/* WVTR Metric */}
            <div className="p-1.5 rounded bg-white border border-[#E2E8F0] mt-1 space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-semibold">Moisture (WVTR):</span>
                <span className="font-mono font-black text-[#0F172A]">{report.wvtr}</span>
              </div>
              <span className="text-[8px] text-slate-400 block font-mono">
                ASTM F1249 (Modulated IR, 38°C, 90% RH)
              </span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-200 text-[9px] text-[#059669] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
            <span>Permeation limits within safe cutoff</span>
          </div>
        </div>

        {/* 3. MAP Gas Composition Ratios (% O2, % CO2, % N2) */}
        <div className="p-2 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col justify-between space-y-1.5">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Wind className="w-3 h-3 text-blue-600" />
                MAP Gas Composition
              </span>
              <span className="text-[9px] font-mono bg-white px-1 py-0.2 rounded border border-[#CBD5E1] text-slate-700 font-bold">
                Headspace
              </span>
            </div>

            <div className="text-[10px] font-bold text-slate-800 mt-1.5 truncate">
              {report.mapGas.flushType}
            </div>

            {/* Visual Gas Mix Proportional Bar */}
            <div className="w-full h-2.5 rounded bg-slate-200 overflow-hidden flex my-1.5 border border-slate-300">
              {o2Width > 0 && (
                <div
                  style={{ width: `${o2Width}%` }}
                  className="bg-cyan-500 h-full"
                  title={`O₂: ${report.mapGas.o2}%`}
                />
              )}
              {co2Width > 0 && (
                <div
                  style={{ width: `${co2Width}%` }}
                  className="bg-amber-500 h-full"
                  title={`CO₂: ${report.mapGas.co2}%`}
                />
              )}
              {n2Width > 0 && (
                <div
                  style={{ width: `${n2Width}%` }}
                  className="bg-[#059669] h-full"
                  title={`N₂: ${report.mapGas.n2}%`}
                />
              )}
            </div>

            {/* Gas Numerical Breakdown Grid */}
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
              <div className="p-1 rounded bg-white border border-[#E2E8F0]">
                <span className="text-slate-400 block text-[8px] font-bold">O₂</span>
                <span className="font-black text-cyan-700">{report.mapGas.o2}%</span>
              </div>
              <div className="p-1 rounded bg-white border border-[#E2E8F0]">
                <span className="text-slate-400 block text-[8px] font-bold">CO₂</span>
                <span className="font-black text-amber-700">{report.mapGas.co2}%</span>
              </div>
              <div className="p-1 rounded bg-white border border-[#E2E8F0]">
                <span className="text-slate-400 block text-[8px] font-bold">N₂</span>
                <span className="font-black text-[#059669]">{report.mapGas.n2}%</span>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-200 text-[9px] text-slate-500 font-mono">
            Calibrated Headspace: Servomex 5200
          </div>
        </div>

        {/* 4. Eco-Score Rating & FSSAI 2026 Compliance Stamp */}
        <div className="p-2 rounded bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col justify-between space-y-1.5">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Leaf className="w-3 h-3 text-[#059669]" />
                Eco-Score &amp; FSSAI Stamp
              </span>
              <span className="text-[9px] font-mono bg-emerald-100 text-[#059669] font-black px-1.5 py-0.2 rounded border border-emerald-300">
                Eco {report.ecoScore}/100
              </span>
            </div>

            {/* Official FSSAI 2026 Compliance Stamp Badge */}
            <div className="p-1.5 rounded bg-emerald-50 border border-emerald-300 space-y-0.5 mt-1.5">
              <div className="flex items-center gap-1 text-[11px] font-black text-emerald-950">
                <FileCheck className="w-3 h-3 text-[#059669] shrink-0" />
                <span className="leading-tight">{report.fssaiComplianceBadge}</span>
              </div>
              <div className="text-[9px] text-emerald-900 leading-snug font-medium">
                {report.clauseText}
              </div>
            </div>

            <div className="mt-1 text-[9px] text-slate-600 bg-white p-1 rounded border border-[#E2E8F0]">
              <span className="font-bold text-slate-800">Recyclability:</span>{' '}
              <span>{report.recyclabilityDetails}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-200 text-[9px] text-slate-600 flex items-center justify-between font-mono">
            <span>Std: {report.standardCode}</span>
            <span className="text-[#059669] font-black">Overall Migration PASS</span>
          </div>
        </div>

      </div>
    </div>
  );
};
