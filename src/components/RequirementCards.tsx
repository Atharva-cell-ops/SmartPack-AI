import React from 'react';
import { PackagingRequirement, RequirementLevel } from '../types';
import { Droplets, Wind, Sun, ShieldCheck, Flame, Lock, Gauge, AlertCircle } from 'lucide-react';

interface RequirementCardsProps {
  requirements: PackagingRequirement[];
}

const getIcon = (id: string) => {
  switch (id) {
    case 'moisture':
      return <Droplets className="w-4 h-4 text-blue-700" />;
    case 'oxygen':
      return <Wind className="w-4 h-4 text-cyan-700" />;
    case 'light':
      return <Sun className="w-4 h-4 text-amber-600" />;
    case 'strength':
      return <ShieldCheck className="w-4 h-4 text-slate-700" />;
    case 'heat':
      return <Flame className="w-4 h-4 text-rose-600" />;
    case 'sealability':
      return <Lock className="w-4 h-4 text-[#059669]" />;
    default:
      return <ShieldCheck className="w-4 h-4 text-slate-600" />;
  }
};

const getLevelBadge = (level: RequirementLevel) => {
  switch (level) {
    case 'Required':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
          MANDATORY
        </span>
      );
    case 'Preferred':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
          PREFERRED
        </span>
      );
    case 'Low Priority':
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
          SECONDARY
        </span>
      );
  }
};

export const RequirementCards: React.FC<RequirementCardsProps> = ({ requirements }) => {
  const mandatoryCount = requirements.filter(r => r.level === 'Required').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Target Barrier Requirements & Physicochemical Thresholds
          </h4>
          <p className="text-xs text-slate-500">
            Synthesized by the rule engine from commodity sorption isotherms, ambient RH/temp stress, and logistics.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            {mandatoryCount} Mandatory Constraints
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            ASTM Calibrated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {requirements.map(req => {
          const isRequired = req.level === 'Required';
          return (
            <div
              key={req.id}
              className={`rounded-lg p-3.5 border transition-all space-y-2.5 ${
                isRequired
                  ? 'bg-amber-50/20 border-amber-300/80 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-slate-100 border border-slate-200">
                    {getIcon(req.id)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{req.name}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">Index Target: {req.targetScore}/100</span>
                  </div>
                </div>
                {getLevelBadge(req.level)}
              </div>

              {/* Concrete scientific metric specification */}
              {req.requiredMetric && (
                <div className="px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Engineering Spec:</span>
                  <span className="font-mono font-bold text-slate-900 text-[11px]">{req.requiredMetric}</span>
                </div>
              )}

              {/* Scientific Mechanism Rationale */}
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {req.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
