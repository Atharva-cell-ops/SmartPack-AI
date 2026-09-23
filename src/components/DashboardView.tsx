import React, { useState } from 'react';
import {
  Sparkles,
  ClipboardCheck,
  SlidersHorizontal,
  Scale,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { RECENT_TRACEABILITY_REPORTS } from '../data/traceabilityReports';
import { RecentReportsTable } from './RecentReportsTable';
import { StackedAnalyticsCharts } from './StackedAnalyticsCharts';
import { IntermediateTelemetryStrip } from './IntermediateTelemetryStrip';
import { RecentEvaluationBriefCard } from './RecentEvaluationBriefCard';
import { TraceabilityQrModal, TraceabilityReportItem } from './TraceabilityQrModal';
import { FOOD_COMMODITIES } from '../data/foodCommodities';

interface DashboardViewProps {
  onStartRecommendation: (foodId?: string) => void;
  onNavigateToMaterials: () => void;
  onNavigateToCompare: () => void;
  onNavigateToWhatIf: () => void;
  onNavigateToAudit?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartRecommendation,
  onNavigateToMaterials,
  onNavigateToCompare,
  onNavigateToWhatIf,
  onNavigateToAudit
}) => {
  // Selected report in Recent Reports table (defaults to Biscuits)
  const [selectedReportId, setSelectedReportId] = useState<string>(RECENT_TRACEABILITY_REPORTS[0].id);
  // QR Certificate Modal state
  const [qrModalReport, setQrModalReport] = useState<TraceabilityReportItem | null>(null);

  const selectedReport =
    RECENT_TRACEABILITY_REPORTS.find(r => r.id === selectedReportId) || RECENT_TRACEABILITY_REPORTS[0];

  const handleSelectReport = (report: TraceabilityReportItem) => {
    setSelectedReportId(report.id);
  };

  const handleGenerateQr = (report: TraceabilityReportItem) => {
    setQrModalReport(report);
  };

  const handleStartEvaluationForReport = (itemName: string) => {
    const matched = FOOD_COMMODITIES.find(
      c => c.name.toLowerCase().includes(itemName.toLowerCase().split(' ')[0])
    );
    onStartRecommendation(matched ? matched.id : undefined);
  };

  return (
    <div className="space-y-2 sm:space-y-2.5 pb-2 w-full">
      
      {/* 3. CENTER ACTION BUTTONS */}
      <section
        id="dashboard-primary-action-buttons-row"
        className="w-full flex items-center justify-center bg-white p-2 sm:p-2.5 rounded-md border border-[#CBD5E1] shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Button 1: "+ Start New Evaluation" (Large, Solid Emerald Green #059669 background, white bold text) */}
          <button
            type="button"
            id="btn-start-new-evaluation"
            onClick={() => onStartRecommendation()}
            className="px-6 sm:px-8 py-2.5 rounded-md bg-[#059669] hover:bg-[#047857] text-white text-sm sm:text-base font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 tracking-tight"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
            <span>+ Start New Evaluation</span>
          </button>

          {/* Button 2: "View Previous Audit" (Crisp outlined button) */}
          <button
            type="button"
            id="btn-view-previous-audit"
            onClick={() => {
              if (onNavigateToAudit) onNavigateToAudit();
            }}
            className="px-5 sm:px-7 py-2.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] text-sm sm:text-base font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            <span>View Previous Audit</span>
          </button>
        </div>
      </section>

      {/* 4. MIDDLE DUAL SECTION (Table + Dual Stacked Charts - Equal Height Alignment) */}
      <section
        id="dashboard-middle-dual-section"
        className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-2.5 items-stretch"
      >
        {/* Left Column: Recent Reports & Traceability Table (Takes 7 cols on lg screen) */}
        <div className="lg:col-span-7 flex flex-col min-h-[460px]">
          <RecentReportsTable
            reports={RECENT_TRACEABILITY_REPORTS}
            selectedReportId={selectedReportId}
            onSelectReport={handleSelectReport}
            onGenerateQr={handleGenerateQr}
            onViewAnalysis={() => {
              const el = document.getElementById('recent-evaluation-brief-card');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Right Column: Stacked Analytics (Takes 5 cols on lg screen - Height matched to Left Column) */}
        <div className="lg:col-span-5 flex flex-col min-h-[460px]">
          <StackedAnalyticsCharts selectedReport={selectedReport} />
        </div>
      </section>

      {/* 5. INTERMEDIATE VISUAL DATA PRESENTATION ROW */}
      <IntermediateTelemetryStrip />

      {/* 6. BOTTOM SECTION (Recent Evaluation Detailed Brief Card) */}
      <section id="dashboard-bottom-section">
        <RecentEvaluationBriefCard
          report={selectedReport}
          onStartEvaluation={handleStartEvaluationForReport}
          onGenerateQr={handleGenerateQr}
          onNavigateToCompare={onNavigateToCompare}
        />
      </section>

      {/* Zero Empty Whitespace: Dense Physicochemical Food Matrix Quick-Launcher Strip */}
      <section className="bg-white border border-[#CBD5E1] rounded-md p-2 sm:p-2.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded bg-slate-100 text-[#0F172A] border border-[#CBD5E1]">
              <Database className="w-3.5 h-3.5 text-[#059669]" />
            </span>
            <div>
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-tight">
                Pre-Calibrated Physicochemical Commodity Library
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                Instant barrier derivation for standardized Indian food commodity formulations:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {FOOD_COMMODITIES.slice(0, 6).map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => onStartRecommendation(c.id)}
                className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#059669] hover:bg-emerald-50 text-[10px] font-bold text-slate-800 hover:text-[#059669] transition-colors cursor-pointer"
              >
                {c.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onStartRecommendation()}
              className="text-[10px] font-black text-[#059669] hover:underline px-1.5 py-0.5 cursor-pointer flex items-center gap-0.5"
            >
              <span>+ Custom Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Modal for FSSAI Traceability QR Certificate */}
      {qrModalReport && (
        <TraceabilityQrModal
          report={qrModalReport}
          onClose={() => setQrModalReport(null)}
        />
      )}
    </div>
  );
};
