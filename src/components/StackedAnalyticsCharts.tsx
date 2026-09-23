import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, ShieldCheck, Layers, Clock } from 'lucide-react';
import { TraceabilityReportItem } from './TraceabilityQrModal';

interface MaterialLayerShare {
  name: string;
  value: number;
  color: string;
  thickness: string;
  compliance: string;
  role: string;
}

interface ShelfLifePoint {
  day: string;
  smartPackQuality: number;
  standardQuality: number;
  degradationRisk: number;
}

interface StackedAnalyticsChartsProps {
  selectedReport?: TraceabilityReportItem;
}

export const StackedAnalyticsCharts: React.FC<StackedAnalyticsChartsProps> = ({
  selectedReport
}) => {
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  // 1. DYNAMIC PIE CHART DATA: Material Layer Breakdown for selectedReport
  const materialSlices: MaterialLayerShare[] = useMemo(() => {
    if (!selectedReport) {
      return [
        { name: 'Surface BOPP (20μm)', value: 42, color: '#059669', thickness: '20μm', compliance: 'EPR Cat-I Mono', role: 'Print & Mechanical' },
        { name: 'Met-BOPP Barrier Skin (15μm)', value: 35, color: '#D97706', thickness: '15μm', compliance: 'IS 15609 Barrier', role: 'OTR/WVTR Gas Shield' },
        { name: 'Solventless PU Adhesive', value: 10, color: '#475569', thickness: '2μm', compliance: 'FSSAI SML Approved', role: 'Lamination Bonding' },
        { name: 'Heat-Seal Polyolefin (PE)', value: 13, color: '#2563EB', thickness: '8μm', compliance: 'Low SIT (105°C)', role: 'Hermetic Pouch Seal' }
      ];
    }

    const reportId = selectedReport.id;

    if (reportId === 'report-biscuits') {
      return [
        { name: 'BOPP Outer Print Carrier', value: 42, color: '#059669', thickness: '20μm', compliance: 'IS 15609 Validated', role: 'Tensile & Gloss' },
        { name: 'Met-BOPP Vacuum Barrier', value: 35, color: '#D97706', thickness: '15μm', compliance: 'Moisture Cutoff <0.9g', role: 'WVTR & Lipid Shield' },
        { name: 'Solventless PU Laminant', value: 10, color: '#475569', thickness: '2μm', compliance: 'IS 9845 Migration Pass', role: 'Interlayer Tie' },
        { name: 'Heat-Seal Polyolefin Skin', value: 13, color: '#2563EB', thickness: '8μm', compliance: 'Food Grade PE', role: 'Crimped Pouch Seal' }
      ];
    }

    if (reportId === 'report-chips') {
      return [
        { name: 'Met-BOPP High Barrier', value: 40, color: '#D97706', thickness: '20μm', compliance: 'ASTM D3985 Coulometric', role: 'Light & O₂ Blocker' },
        { name: 'Cast Polypropylene (CPP)', value: 32, color: '#059669', thickness: '15μm', compliance: 'IS 10146 Non-Toxic', role: 'Puncture & Burst Rigidity' },
        { name: 'Anti-Grease Inner Skin', value: 16, color: '#2563EB', thickness: '10μm', compliance: 'Lipid Inert Contact', role: 'Seal-Through-Fat' },
        { name: 'Co-ex Primer Tie Layer', value: 12, color: '#475569', thickness: '2μm', compliance: 'FDA 175.105 Compliant', role: 'Laminate Adhesion' }
      ];
    }

    if (reportId === 'report-coffee') {
      return [
        { name: 'High-Purity 9μm Alu Foil', value: 38, color: '#D97706', thickness: '9μm', compliance: 'ASTM F1249 Zero-Perm', role: 'Absolute Aroma Barrier' },
        { name: 'Metallocene LLDPE Pouch Core', value: 28, color: '#059669', thickness: '64μm', compliance: 'Heavy Duty Hot-Tack', role: 'High Hermetic Toughness' },
        { name: 'Biaxially Oriented PET (BOPET)', value: 24, color: '#2563EB', thickness: '12μm', compliance: 'IS 15609 High Tensile', role: 'Puncture & Degas Mount' },
        { name: 'Solvent-Free Polyurethane Tie', value: 10, color: '#475569', thickness: '3μm', compliance: 'Zero Volatile Migration', role: 'Triple Layer Bonding' }
      ];
    }

    if (reportId === 'report-strawberries') {
      return [
        { name: 'Circular rPET Clamshell Body', value: 65, color: '#059669', thickness: '250μm', compliance: 'EFSA/FSSAI Bottle-Tray', role: 'Rigid Structural Shell' },
        { name: 'Laser Micro-perforated EMAP Lid', value: 18, color: '#2563EB', thickness: '25μm', compliance: 'Controlled OTR 3200cc', role: 'Respiration Equilibrium' },
        { name: 'Anti-Fog Surfactant Coating', value: 9, color: '#0284C7', thickness: '1μm', compliance: 'Condensation Clearing', role: 'Optical Clarity 99%' },
        { name: 'Food-Grade Cellulosic Hydro-Pad', value: 8, color: '#10B981', thickness: '2mm', compliance: 'MoFPI Fresh Produce Std', role: 'Exudate Moisture Absorption' }
      ];
    }

    if (reportId === 'report-milk') {
      return [
        { name: 'Virgin White HDPE Outer Skin', value: 45, color: '#059669', thickness: '200μm', compliance: 'TiO₂ Pigment Grade', role: 'Mechanical Rigidity & UV' },
        { name: 'Carbon-Black Light Core', value: 25, color: '#0F172A', thickness: '100μm', compliance: '<0.5% Light Transmittance', role: 'Riboflavin Photo-Protect' },
        { name: 'Food-Grade Virgin HDPE Inner', value: 30, color: '#2563EB', thickness: '150μm', compliance: 'IS 10146 Odorless', role: 'Direct Dairy Contact' }
      ];
    }

    if (reportId === 'report-ketchup') {
      return [
        { name: 'Virgin Polypropylene (PP) Outer', value: 44, color: '#059669', thickness: '180μm', compliance: 'Squeeze & Flex Modulus', role: 'Flexible Bottle Body' },
        { name: 'EVOH Gas Barrier Core (32 mol%)', value: 18, color: '#D97706', thickness: '20μm', compliance: 'ASTM D3985 OTR <0.8', role: 'Lycopene Browning Shield' },
        { name: 'Acid-Resistant PP Inner Contact', value: 28, color: '#2563EB', thickness: '160μm', compliance: 'pH 3.6 Chemical Inertness', role: 'Aseptic Squeeze Contact' },
        { name: 'Maleic Anhydride Tie Layers', value: 10, color: '#475569', thickness: '20μm', compliance: 'Co-ex Interfacial Bond', role: 'Delamination Resistance' }
      ];
    }

    if (reportId === 'report-rice') {
      return [
        { name: 'Woven PP Sack Outer Fabric', value: 48, color: '#059669', thickness: '90 GSM', compliance: 'IS 14887 High Burst', role: 'Puncture & Drop Strength' },
        { name: 'Hermetic Multilayer LDPE Liner', value: 34, color: '#2563EB', thickness: '120μm', compliance: 'WVTR <1.2g Hermetic', role: 'Moisture & Vapor Seal' },
        { name: 'Insecticidal Modified Gas Membrane', value: 18, color: '#D97706', thickness: '15μm', compliance: 'FSSAI Export Grain 2026', role: '15% CO₂ Bio-Retention' }
      ];
    }

    // Generic fallback breakdown for custom matrix
    return [
      { name: 'Engineered Primary Barrier', value: 45, color: '#059669', thickness: '40μm', compliance: 'IS 15609 Validated', role: 'Permeation Retardation' },
      { name: 'Secondary Moisture Shield', value: 30, color: '#D97706', thickness: '25μm', compliance: 'ASTM F1249 Compliant', role: 'Vapor Retardation' },
      { name: 'Tie Layer & Food Skin', value: 25, color: '#2563EB', thickness: '20μm', compliance: 'FSSAI SML Approved', role: 'Hermetic Seal Integrity' }
    ];
  }, [selectedReport]);

  // 2. DYNAMIC LINE GRAPH DATA: Real Shelf-Life Extension Curves for selectedReport
  const shelfLifeData: ShelfLifePoint[] = useMemo(() => {
    if (!selectedReport) {
      return [
        { day: '0d', smartPackQuality: 100, standardQuality: 100, degradationRisk: 2 },
        { day: '30d', smartPackQuality: 98, standardQuality: 82, degradationRisk: 6 },
        { day: '60d', smartPackQuality: 96, standardQuality: 64, degradationRisk: 11 },
        { day: '90d', smartPackQuality: 92, standardQuality: 46, degradationRisk: 18 },
        { day: '120d', smartPackQuality: 88, standardQuality: 28, degradationRisk: 25 },
        { day: '180d', smartPackQuality: 84, standardQuality: 12, degradationRisk: 34 },
        { day: '240d', smartPackQuality: 78, standardQuality: 4, degradationRisk: 46 },
        { day: '360d', smartPackQuality: 72, standardQuality: 0, degradationRisk: 58 }
      ];
    }

    const baseline = selectedReport.shelfLifeBaselineDays || 90;
    const engineered = selectedReport.shelfLifeEngineeredDays || 180;

    // Generate 7-8 points proportionally spanning the timeline
    const maxDays = engineered;
    const stepCount = 7;
    const points: ShelfLifePoint[] = [];

    for (let i = 0; i <= stepCount; i++) {
      const currentDay = Math.round((maxDays / stepCount) * i);
      const dayLabel = `${currentDay}d`;

      // SmartPack Quality remains high (100% down to ~76-80% at max days)
      const smartPackQuality = Math.max(
        72,
        Math.round(100 - (currentDay / maxDays) * 22)
      );

      // Standard Quality drops sharply to near 0 once it passes baseline
      let standardQuality = 100;
      if (currentDay <= baseline) {
        standardQuality = Math.round(100 - (currentDay / baseline) * 70);
      } else {
        const overDays = currentDay - baseline;
        standardQuality = Math.max(0, Math.round(30 - (overDays / (maxDays - baseline)) * 30));
      }

      // Degradation risk climbs inversely
      let degradationRisk = 2;
      if (currentDay <= baseline) {
        degradationRisk = Math.round(2 + (currentDay / baseline) * 25);
      } else {
        const overDays = currentDay - baseline;
        degradationRisk = Math.min(85, Math.round(27 + (overDays / (maxDays - baseline)) * 55));
      }

      points.push({
        day: dayLabel,
        smartPackQuality,
        standardQuality,
        degradationRisk
      });
    }

    return points;
  }, [selectedReport]);

  const activeSlice = activePieIndex !== null ? materialSlices[activePieIndex] : null;

  return (
    <div
      id="stacked-analytics-charts-container"
      className="bg-white border border-[#CBD5E1] rounded-md shadow-xs flex flex-col justify-between h-full overflow-hidden divide-y divide-[#CBD5E1]"
    >
      {/* ---------------- 1. TOP CHART: DYNAMIC PIE CHART ---------------- */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 bg-white min-h-[225px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="p-1 rounded bg-emerald-50 text-[#059669] border border-emerald-200">
              <PieIcon className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-tight truncate">
                Material Composition Breakdown
              </h4>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {selectedReport ? `${selectedReport.itemName} (${selectedReport.thicknessMicrons})` : 'Composite Substrate Structure & Microns'}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#059669] border border-emerald-300 shrink-0">
            {selectedReport ? selectedReport.materialSuggested.split('/')[0].trim() : 'FSSAI Cat-I'}
          </span>
        </div>

        {/* Content: Pie Chart on Left, Dynamic Layer Breakdown on Right */}
        <div className="grid grid-cols-12 gap-2 items-center my-1">
          {/* Recharts Pie Chart (5 cols) */}
          <div className="col-span-5 h-[135px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as MaterialLayerShare;
                      return (
                        <div className="bg-[#0F172A] text-white p-1.5 rounded shadow-lg text-[10px] border border-slate-700 font-mono">
                          <div className="font-black text-emerald-400">{data.name}</div>
                          <div className="text-slate-300 mt-0.5">
                            Share: <span className="font-bold text-white">{data.value}%</span> • Gauge: {data.thickness}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">Role: {data.role}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={materialSlices}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={56}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  cursor="pointer"
                >
                  {materialSlices.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activePieIndex === index ? '#0F172A' : '#FFFFFF'}
                      strokeWidth={activePieIndex === index ? 2 : 1}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Dynamic Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[12px] font-black text-[#0F172A] font-mono leading-none">
                {activeSlice ? `${activeSlice.value}%` : `${materialSlices.reduce((acc, s) => acc + s.value, 0)}%`}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                {activeSlice ? 'Selected' : 'Layers'}
              </span>
            </div>
          </div>

          {/* Dynamic Layer Breakdown List (7 cols) */}
          <div className="col-span-7 flex flex-col justify-center space-y-1">
            {materialSlices.map((item, index) => {
              const isHovered = activePieIndex === index;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  className={`p-1 rounded transition-colors cursor-pointer border ${
                    isHovered
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-[#F8FAFC] border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 min-w-0">
                      <span
                        className="w-2 h-2 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-[#0F172A] truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono font-black text-[#0F172A] ml-1 shrink-0">
                      {item.value}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono mt-0.5 pl-3">
                    <span className="truncate">{item.role}</span>
                    <span className="font-bold text-slate-700">{item.thickness}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Micro Footer Telemetry */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-[#059669] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>FSSAI IS 9845 Migration Pass</span>
          </span>
          <span>Target OTR: {selectedReport ? selectedReport.otr : '18.5 cc'}</span>
        </div>
      </div>

      {/* ---------------- 2. BOTTOM CHART: DYNAMIC LINE GRAPH ---------------- */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 bg-white min-h-[225px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="p-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-tight truncate">
                Shelf Life Curve: {selectedReport ? selectedReport.itemName : 'Commodity Timeline'}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {selectedReport
                  ? `Baseline: ${selectedReport.shelfLifeBaselineDays}d → Engineered: ${selectedReport.shelfLifeEngineeredDays}d (+${selectedReport.shelfLifeGainPercent}%)`
                  : 'Barrier Retention vs Unbarrier Baseline & Oxidation Risk'}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300 shrink-0">
            {selectedReport ? `${selectedReport.shelfLifeEngineeredDays} Days` : '360 Days'}
          </span>
        </div>

        {/* Recharts Line Graph with Dynamic Points */}
        <div className="h-[125px] w-full my-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shelfLifeData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0F172A] text-white p-2 rounded shadow-lg text-[10px] border border-slate-700 font-mono space-y-1">
                        <div className="font-black text-emerald-400 border-b border-slate-700 pb-0.5">
                          Timeline Milestone: {label}
                        </div>
                        <div className="flex items-center justify-between gap-3 text-[#10B981]">
                          <span>SmartPack Barrier:</span>
                          <span className="font-bold">{payload[0]?.value}% Quality</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-slate-400">
                          <span>Standard Baseline:</span>
                          <span className="font-bold">{payload[1]?.value}% Quality</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-amber-400">
                          <span>Degradation Risk:</span>
                          <span className="font-bold">{payload[2]?.value}% Cutoff</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* 1. SmartPack Quality Line (Solid Emerald Green) */}
              <Line
                type="monotone"
                dataKey="smartPackQuality"
                name="SmartPack Retention"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 1 }}
                activeDot={{ r: 4, stroke: '#059669', strokeWidth: 2 }}
              />
              {/* 2. Standard Packaging Degradation Baseline (Dashed Gray) */}
              <Line
                type="monotone"
                dataKey="standardQuality"
                name="Standard Baseline"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: '#94A3B8' }}
              />
              {/* 3. Rancidity / Oxidation Risk Line (Amber) */}
              <Line
                type="monotone"
                dataKey="degradationRisk"
                name="Degradation Risk"
                stroke="#D97706"
                strokeWidth={1.5}
                dot={{ r: 2, fill: '#D97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Micro Details */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-600 font-mono flex-wrap gap-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#059669] inline-block" />
              <span className="font-bold text-slate-800">SmartPack</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#94A3B8] inline-block border-b border-dashed border-slate-500" />
              <span>Standard Baseline</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#D97706] inline-block" />
              <span>Degradation Risk</span>
            </span>
          </div>
          <span className="text-[#059669] font-bold flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            <span>2.0x–3.0x Preservation</span>
          </span>
        </div>
      </div>
    </div>
  );
};
