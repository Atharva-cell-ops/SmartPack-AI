import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 text-amber-950 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="leading-tight">
            <span className="font-semibold text-amber-900">Prototype Decision-Support System:</span>{' '}
            For Smart India Hackathon preliminary screening demonstration. Not a food safety certification system. Recommendations and research-based synthetic dataset are for demonstration only; physical laboratory validation & statutory regulatory clearance are required prior to commercial deployment.
          </p>
        </div>
        <span className="hidden lg:inline-flex shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          Non-Certified Prototype
        </span>
      </div>
    </div>
  );
};
