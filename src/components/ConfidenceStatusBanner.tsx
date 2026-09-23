import React from 'react';
import { ConfidenceGrade } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertCircle,
  FileCheck,
  Cpu,
  Layers,
  FlaskConical
} from 'lucide-react';

interface ConfidenceStatusBannerProps {
  confidenceGrade: ConfidenceGrade;
  confidenceScore: number;
  confidenceReason: string;
  missingDataWarnings: string[];
  systemWarnings: string[];
  prototypeStatusTags?: Record<string, string>;
}

export const ConfidenceStatusBanner: React.FC<ConfidenceStatusBannerProps> = ({
  confidenceGrade,
  confidenceScore,
  confidenceReason,
  missingDataWarnings,
  systemWarnings,
  prototypeStatusTags
}) => {
  const getGradeStyle = () => {
    switch (confidenceGrade) {
      case 'HIGH':
        return {
          border: 'border-emerald-300',
          badge: 'bg-emerald-50 text-[#059669] border-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-[#059669]" />,
          barColor: 'bg-[#059669]'
        };
      case 'MEDIUM':
        return {
          border: 'border-amber-300',
          badge: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-700" />,
          barColor: 'bg-amber-600'
        };
      case 'LOW':
        return {
          border: 'border-orange-300',
          badge: 'bg-orange-50 text-orange-900 border-orange-300',
          icon: <HelpCircle className="w-4 h-4 text-orange-700" />,
          barColor: 'bg-orange-600'
        };
      case 'NO RECOMMENDATION':
        return {
          border: 'border-rose-300',
          badge: 'bg-rose-50 text-rose-900 border-rose-300',
          icon: <ShieldAlert className="w-4 h-4 text-rose-700" />,
          barColor: 'bg-rose-600'
        };
    }
  };

  const style = getGradeStyle();

  return (
    <div id="confidence-status-banner" className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
      {/* Primary Status Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
            {style.icon}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${style.badge}`}>
                Confidence Grade: {confidenceGrade}
              </span>
              <span className="text-xs font-mono font-bold text-slate-800">
                Index: {confidenceScore}/100
              </span>
              <span className="text-[11px] text-slate-500">
                • ASTM D3985 / F1249 Calibration
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {confidenceReason}
            </p>
          </div>
        </div>

        {/* Completeness Meter */}
        <div className="w-full md:w-56 shrink-0 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Input Completeness</span>
            <span className="font-mono">{confidenceScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${style.barColor}`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Missing Input Warnings (if any) */}
      {missingDataWarnings.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Missing Physical Input Parameters (Default Heuristics Applied)</span>
          </div>
          <ul className="space-y-0.5 text-[11px] text-amber-850 pl-5 list-disc">
            {missingDataWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* System Rule Warnings (if any) */}
      {systemWarnings.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#059669]" />
            <span>Operational Warnings & Environmental Flags</span>
          </div>
          <ul className="space-y-0.5 text-[11px] text-slate-600 pl-5 list-disc">
            {systemWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
