import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode, Copy, Check } from 'lucide-react';
import { FssaiLogo, MofpiLogo } from './OfficialSeals';

export interface TraceabilityReportItem {
  id: string;
  itemName: string;
  category: string;
  date: string;
  packageIndex: number;
  materialSuggested: string;
  otr: string;
  wvtr: string;
  thicknessMicrons: string;
  mapGas: {
    o2: number;
    co2: number;
    n2: number;
    label: string;
    flushType: string;
  };
  ecoScore: number;
  ecoRating: string;
  recyclabilityDetails: string;
  fssaiComplianceBadge: string;
  standardCode: string;
  clauseText: string;
  shelfLifeBaselineDays: number;
  shelfLifeEngineeredDays: number;
  shelfLifeGainPercent: number;
  batchTraceId: string;
  testLab: string;
  inspectorName: string;
}

interface TraceabilityQrModalProps {
  report: TraceabilityReportItem | null;
  onClose: () => void;
}

export const TraceabilityQrModal: React.FC<TraceabilityQrModalProps> = ({ report, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!report) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(report.batchTraceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-md shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Certificate Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-emerald-100 text-[#059669]">
              <QrCode className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                FSSAI Digital Traceability QR Certificate
              </h3>
              <p className="text-[10px] text-slate-500">
                MoFPI &amp; FSSAI Packaging Safety Regulation 2026
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Official Seals in Modal */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <FssaiLogo className="h-8" />
            <MofpiLogo className="h-8" />
          </div>

          {/* QR Code Graphic & Batch Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
            {/* High-Contrast Crisp SVG QR Code */}
            <div className="p-2.5 bg-white border border-[#CBD5E1] rounded-md shadow-2xs shrink-0 text-center">
              <svg
                viewBox="0 0 120 120"
                className="w-28 h-28 mx-auto"
                shapeRendering="crispEdges"
              >
                {/* Background */}
                <rect width="120" height="120" fill="#FFFFFF" />
                
                {/* Corner Position Mark 1 (Top-Left) */}
                <rect x="10" y="10" width="30" height="30" fill="#0F172A" />
                <rect x="15" y="15" width="20" height="20" fill="#FFFFFF" />
                <rect x="20" y="20" width="10" height="10" fill="#0F172A" />

                {/* Corner Position Mark 2 (Top-Right) */}
                <rect x="80" y="10" width="30" height="30" fill="#0F172A" />
                <rect x="85" y="15" width="20" height="20" fill="#FFFFFF" />
                <rect x="90" y="20" width="10" height="10" fill="#0F172A" />

                {/* Corner Position Mark 3 (Bottom-Left) */}
                <rect x="10" y="80" width="30" height="30" fill="#0F172A" />
                <rect x="15" y="85" width="20" height="20" fill="#FFFFFF" />
                <rect x="20" y="90" width="10" height="10" fill="#0F172A" />

                {/* Alignment Mark */}
                <rect x="75" y="75" width="15" height="15" fill="#0F172A" />
                <rect x="78" y="78" width="9" height="9" fill="#FFFFFF" />
                <rect x="81" y="81" width="3" height="3" fill="#0F172A" />

                {/* Simulated Cryptographic Data Grid Modules */}
                <rect x="45" y="15" width="5" height="5" fill="#0F172A" />
                <rect x="55" y="15" width="5" height="5" fill="#0F172A" />
                <rect x="65" y="15" width="5" height="5" fill="#0F172A" />
                <rect x="50" y="25" width="5" height="5" fill="#0F172A" />
                <rect x="60" y="25" width="5" height="5" fill="#0F172A" />
                <rect x="70" y="25" width="5" height="5" fill="#0F172A" />
                <rect x="45" y="35" width="5" height="5" fill="#0F172A" />
                <rect x="55" y="35" width="5" height="5" fill="#0F172A" />
                <rect x="45" y="45" width="5" height="5" fill="#0F172A" />
                <rect x="65" y="45" width="5" height="5" fill="#0F172A" />
                <rect x="15" y="50" width="5" height="5" fill="#0F172A" />
                <rect x="25" y="50" width="5" height="5" fill="#0F172A" />
                <rect x="85" y="50" width="5" height="5" fill="#0F172A" />
                <rect x="95" y="50" width="5" height="5" fill="#0F172A" />
                <rect x="15" y="60" width="5" height="5" fill="#0F172A" />
                <rect x="35" y="60" width="5" height="5" fill="#0F172A" />
                <rect x="55" y="60" width="5" height="5" fill="#0F172A" />
                <rect x="75" y="60" width="5" height="5" fill="#0F172A" />
                <rect x="95" y="60" width="5" height="5" fill="#0F172A" />
                <rect x="105" y="60" width="5" height="5" fill="#0F172A" />
                <rect x="45" y="70" width="5" height="5" fill="#0F172A" />
                <rect x="55" y="70" width="5" height="5" fill="#0F172A" />
                <rect x="65" y="70" width="5" height="5" fill="#0F172A" />
                <rect x="45" y="85" width="5" height="5" fill="#0F172A" />
                <rect x="60" y="85" width="5" height="5" fill="#0F172A" />
                <rect x="50" y="95" width="5" height="5" fill="#0F172A" />
                <rect x="65" y="95" width="5" height="5" fill="#0F172A" />
                <rect x="100" y="85" width="5" height="5" fill="#0F172A" />
                <rect x="100" y="95" width="5" height="5" fill="#0F172A" />
                <rect x="105" y="105" width="5" height="5" fill="#0F172A" />

                {/* Central Verified Emblem Dot */}
                <circle cx="60" cy="60" r="7" fill="#059669" />
                <path d="M57 60L59 62L63 58" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-mono text-slate-500 font-bold mt-1 block">
                FSSAI VERIFIED QR
              </span>
            </div>

            {/* Traceability Metadata */}
            <div className="space-y-2 min-w-0 flex-1">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Unique Traceability Hash ID</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-mono font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] truncate">
                    {report.batchTraceId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                    title="Copy Traceability ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Commodity:</span>
                  <span className="font-bold text-[#0F172A]">{report.itemName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Evaluation Date:</span>
                  <span className="font-mono text-[#0F172A]">{report.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Package Index:</span>
                  <span className="font-bold text-[#059669]">{report.packageIndex} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Standards:</span>
                  <span className="font-mono text-[#0F172A]">{report.standardCode}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-400 block text-[10px]">Prescribed Material:</span>
                <span className="font-semibold text-slate-800 text-[11px] leading-tight block">
                  {report.materialSuggested} ({report.thicknessMicrons})
                </span>
              </div>
            </div>
          </div>

          {/* Compliance & Audit Information */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-md space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>{report.fssaiComplianceBadge}</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              {report.clauseText}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[10px] text-emerald-900 font-mono">
              <span>Audited by: {report.inspectorName}</span>
              <span>Lab: {report.testLab}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Scan with any standard industrial QR code reader or FSSAI FoSCoS mobile app to verify barrier certificate integrity.
          </p>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-[#CBD5E1] bg-white text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-md bg-[#059669] text-white font-semibold flex items-center gap-1.5 hover:bg-[#047857] shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Batch Certificate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
