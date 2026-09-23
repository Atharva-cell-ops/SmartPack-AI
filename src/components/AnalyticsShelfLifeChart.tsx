import React, { useState } from 'react';
import { TrendingUp, BarChart3, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MonthlyMetric {
  month: string;
  baselineDays: number;
  engineeredDays: number;
  gainPercent: number;
  sampleCommodity: string;
}

const MONTHLY_METRICS: MonthlyMetric[] = [
  { month: 'Jan', baselineDays: 45, engineeredDays: 68, gainPercent: 51, sampleCommodity: 'Dry Baked Goods' },
  { month: 'Feb', baselineDays: 48, engineeredDays: 72, gainPercent: 50, sampleCommodity: 'Roasted Nuts' },
  { month: 'Mar', baselineDays: 52, engineeredDays: 79, gainPercent: 52, sampleCommodity: 'Fresh Produce' },
  { month: 'Apr', baselineDays: 50, engineeredDays: 76, gainPercent: 52, sampleCommodity: 'Extruded Snacks' },
  { month: 'May', baselineDays: 55, engineeredDays: 84, gainPercent: 53, sampleCommodity: 'Pasteurized Dairy' },
  { month: 'Jun', baselineDays: 60, engineeredDays: 91, gainPercent: 52, sampleCommodity: 'Tomato Emulsion' },
  { month: 'Jul', baselineDays: 58, engineeredDays: 88, gainPercent: 52, sampleCommodity: 'Ground Coffee' },
  { month: 'Aug', baselineDays: 62, engineeredDays: 94, gainPercent: 52, sampleCommodity: 'Export Pulses' }
];

export const AnalyticsShelfLifeChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'days' | 'percent'>('days');

  // Chart dimensions
  const chartHeight = 180;
  const chartWidth = 460;
  const maxDays = 100; // Y-axis max
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 15;
  const paddingBottom = 25;

  const availableWidth = chartWidth - paddingLeft - paddingRight;
  const groupWidth = availableWidth / MONTHLY_METRICS.length;
  const barWidth = 10;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Analysis Results — Shelf Life Extension (+42%)
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-[#059669] border border-emerald-200">
                Calibrated
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Month-by-month shelf life performance: Baseline vs. SmartPack Engineered Specification
            </p>
          </div>

          {/* Metric View Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[10px] shrink-0">
            <button
              type="button"
              onClick={() => setActiveMetricTab('days')}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                activeMetricTab === 'days'
                  ? 'bg-white text-[#0F172A] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Days Scale
            </button>
            <button
              type="button"
              onClick={() => setActiveMetricTab('percent')}
              className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                activeMetricTab === 'percent'
                  ? 'bg-white text-[#0F172A] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              % Extension
            </button>
          </div>
        </div>

        {/* Industrial KPI Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 font-medium block">Avg Extension</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-[#059669]">+42.4%</span>
              <span className="text-[10px] text-emerald-800 font-semibold">Across Batches</span>
            </div>
          </div>

          <div className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 font-medium block">Oxidation Spoilage</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-[#0F172A]">-64.8%</span>
              <span className="text-[10px] text-slate-500">Defects</span>
            </div>
          </div>

          <div className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 font-medium block">FSSAI Compliance</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-extrabold text-[#059669]">99.1%</span>
              <span className="text-[10px] text-emerald-800">Pass Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Industrial Bar Chart */}
      <div className="mt-4 relative select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 overflow-visible"
        >
          {/* Y-Axis Horizontal Gridlines */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = chartHeight - paddingBottom - (val / maxDays) * (chartHeight - paddingTop - paddingBottom);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? 'none' : '3 3'}
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="system-ui, sans-serif"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {activeMetricTab === 'days' ? `${val}d` : `${val}%`}
                </text>
              </g>
            );
          })}

          {/* Month Bars */}
          {MONTHLY_METRICS.map((item, idx) => {
            const groupX = paddingLeft + idx * groupWidth + (groupWidth - barWidth * 2 - 4) / 2;
            const isHovered = hoveredIndex === idx;

            // Values to render based on active tab
            const baselineVal = activeMetricTab === 'days' ? item.baselineDays : 0;
            const engineeredVal = activeMetricTab === 'days' ? item.engineeredDays : item.gainPercent;

            const baselineH = (baselineVal / maxDays) * (chartHeight - paddingTop - paddingBottom);
            const engineeredH = (engineeredVal / maxDays) * (chartHeight - paddingTop - paddingBottom);

            const baselineY = chartHeight - paddingBottom - baselineH;
            const engineeredY = chartHeight - paddingBottom - engineeredH;

            return (
              <g
                key={item.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Background Hover Highlight Column */}
                {isHovered && (
                  <rect
                    x={paddingLeft + idx * groupWidth}
                    y={paddingTop}
                    width={groupWidth}
                    height={chartHeight - paddingTop - paddingBottom}
                    fill="#F1F5F9"
                    rx="2"
                  />
                )}

                {/* Baseline Bar (Slate #94A3B8) */}
                {activeMetricTab === 'days' && (
                  <rect
                    x={groupX}
                    y={baselineY}
                    width={barWidth}
                    height={baselineH}
                    fill={isHovered ? '#64748B' : '#94A3B8'}
                    rx="1.5"
                    className="transition-colors"
                  />
                )}

                {/* Engineered Bar (Emerald Green #059669) */}
                <rect
                  x={activeMetricTab === 'days' ? groupX + barWidth + 3 : groupX + barWidth / 2}
                  y={engineeredY}
                  width={activeMetricTab === 'days' ? barWidth : barWidth * 1.5}
                  height={engineeredH}
                  fill={isHovered ? '#047857' : '#059669'}
                  rx="1.5"
                  className="transition-colors"
                />

                {/* Month Label on X-Axis */}
                <text
                  x={paddingLeft + idx * groupWidth + groupWidth / 2}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                  fontWeight={isHovered ? '700' : '500'}
                  fill={isHovered ? '#0F172A' : '#64748B'}
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-1 right-2 bg-[#0F172A] text-white text-[11px] p-2 rounded shadow-md z-20 pointer-events-none space-y-0.5 border border-slate-700"
          >
            <div className="font-bold text-slate-200 border-b border-slate-700 pb-0.5 flex items-center justify-between gap-2">
              <span>{MONTHLY_METRICS[hoveredIndex].month} 2026 Audit Batch</span>
              <span className="text-emerald-400 font-mono">+{MONTHLY_METRICS[hoveredIndex].gainPercent}%</span>
            </div>
            <div className="text-[10px] text-slate-300">
              Sample: {MONTHLY_METRICS[hoveredIndex].sampleCommodity}
            </div>
            <div className="flex items-center gap-3 pt-0.5 font-mono text-[10px]">
              <span className="text-slate-400">Baseline: {MONTHLY_METRICS[hoveredIndex].baselineDays}d</span>
              <span className="text-emerald-300 font-bold">Engineered: {MONTHLY_METRICS[hoveredIndex].engineeredDays}d</span>
            </div>
          </div>
        )}
      </div>

      {/* Industrial Chart Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#94A3B8]" />
            <span>Standard Baseline (Days)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" />
            <span className="font-semibold text-slate-800">SmartPack Engineered (ASTM/FSSAI)</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">IS 15609 Calibrated</span>
      </div>
    </div>
  );
};
