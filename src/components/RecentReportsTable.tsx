import React from 'react';
import { Eye, QrCode } from 'lucide-react';
import { TraceabilityReportItem } from './TraceabilityQrModal';

interface RecentReportsTableProps {
  reports: TraceabilityReportItem[];
  selectedReportId: string;
  onSelectReport: (report: TraceabilityReportItem) => void;
  onGenerateQr: (report: TraceabilityReportItem) => void;
  onViewAnalysis?: (report: TraceabilityReportItem) => void;
}

export const RecentReportsTable: React.FC<RecentReportsTableProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onGenerateQr,
  onViewAnalysis
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-2xs flex flex-col justify-between h-full overflow-hidden">
      {/* Header Title Bar - Compact */}
      <div className="py-2.5 px-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Recent Reports &amp; Traceability
          </h3>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            FSSAI Calibrated
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="hidden sm:inline font-medium">Active Inspector: Dr. S. Raman</span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-900">
            {reports.length} Records
          </span>
        </div>
      </div>

      {/* Enterprise Compact Data Table */}
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold text-xs border-b border-slate-300 uppercase tracking-wider">
              <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Item Name</th>
              <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Date</th>
              <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Package Index</th>
              <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">Material Suggested</th>
              <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">OTR (cc/m²·d)</th>
              <th className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap">WVTR (g/m²·d)</th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {reports.map((item, idx) => {
              const isSelected = item.id === selectedReportId;
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectReport(item)}
                  className={`transition-colors cursor-pointer border-b border-slate-200 ${
                    isSelected
                      ? 'bg-emerald-50/70 text-slate-900 font-medium'
                      : idx % 2 === 0
                      ? 'bg-white hover:bg-slate-50/80'
                      : 'bg-slate-50/40 hover:bg-slate-50/80'
                  }`}
                >
                  {/* 1. Item Name with selection indicator */}
                  <td className={`py-2 px-3 border-r border-slate-200 ${isSelected ? 'border-l-4 border-l-emerald-600' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 text-xs">
                        {item.itemName}
                      </span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white font-mono tracking-tight shrink-0">
                          SYNCED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal block">
                      {item.category}
                    </span>
                  </td>

                  {/* 2. Date */}
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* 3. Package Index - Solid, low-saturation pill styles */}
                  <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold font-mono border ${
                        item.packageIndex >= 90
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.packageIndex >= 85
                          ? 'bg-slate-50 text-slate-700 border-slate-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.packageIndex}/100
                    </span>
                  </td>

                  {/* 4. Material Suggested */}
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-800 font-medium max-w-[160px] truncate text-xs" title={item.materialSuggested}>
                    {item.materialSuggested}
                  </td>

                  {/* 5. OTR */}
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700 font-mono text-xs whitespace-nowrap">
                    {item.otr}
                  </td>

                  {/* 6. WVTR */}
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700 font-mono text-xs whitespace-nowrap">
                    {item.wvtr}
                  </td>

                  {/* 7. Action Column */}
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Analysis Action */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onSelectReport(item);
                          if (onViewAnalysis) onViewAnalysis(item);
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1"
                        title="View Detailed Analysis"
                      >
                        <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Brief</span>
                      </button>

                      {/* Generate QR Action */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onGenerateQr(item);
                        }}
                        className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1"
                        title="Generate FSSAI Traceability QR"
                      >
                        <QrCode className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>QR Passport</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Navigation Bar */}
      <div className="py-2 px-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px]">
          FSSAI Central Food Safety Traceability Protocol (IS 15609:2026)
        </span>
        <span className="font-medium text-slate-600">
          Showing 1–{reports.length} of {reports.length} Audited Batches
        </span>
      </div>
    </div>
  );
};
