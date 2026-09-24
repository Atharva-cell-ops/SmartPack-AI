import React from 'react';
import { SmartPackLogo, OfficialFssaiLogo, OfficialMofpiLogo } from './OfficialSeals';
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Calculator,
  FileCheck,
  Layers,
  Cpu,
  Clock,
  Check,
  Scale,
  Activity,
  Award
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <SmartPackLogo className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm border border-slate-200 p-2.5 shrink-0" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest bg-slate-100 text-[#059669] border border-slate-200 mb-1.5">
                <Info className="w-3.5 h-3.5 text-[#059669]" />
                <span>ENGINEERING DOSSIER &amp; SYSTEM ARCHITECTURE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                About SmartPack AI
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3.5 self-start md:self-center">
            <OfficialMofpiLogo className="h-16 sm:h-20 w-auto px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs bg-white" />
            <OfficialFssaiLogo className="h-16 sm:h-20 w-auto px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs bg-white" />
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          SmartPack AI is an industrial decision-support and material screening platform for food packaging technologists, QA/QC teams, and agri-entrepreneurs. It calculates physicochemical barrier tolerances, evaluates barrier kinetics under ambient or cold-chain stress, and optimizes multi-layer substrate selection.
        </p>
      </div>

      {/* CORE DISCLAIMER SECTION */}
      <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs space-y-2.5 text-amber-950">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Important Statutory & Technical Disclaimer
          </h2>
        </div>
        <div className="text-xs space-y-2 leading-relaxed text-amber-900">
          <p className="font-semibold text-amber-950">
            This application is an engineering decision-support tool, NOT a certified statutory laboratory testing or regulatory clearance system.
          </p>
          <div className="p-3 rounded-lg bg-white/90 border border-amber-300 font-semibold text-xs text-amber-950">
            &quot;Recommendations are for preliminary screening and decision support only. Physical laboratory validation (ASTM F1249 / ASTM D3985), food safety migration testing, and applicable statutory clearances (e.g. FSSAI, US FDA 21 CFR, EU 10/2011) must be conducted prior to commercial manufacturing.&quot;
          </div>
          <p className="text-[11px] text-amber-800">
            All permeation rates and material indexes are grounded in published food packaging science literature for screening demonstration purposes.
          </p>
        </div>
      </div>

      {/* PROTOTYPE TRUTH: FEATURE READINESS MATRIX */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-100 text-slate-800">
              <Cpu className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Capability Readiness Matrix</h2>
              <p className="text-[11px] text-slate-500">Transparent classification of active, research-simulated, and planned engineering modules</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            AUDIT: TRANSPARENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* WORKING Column */}
          <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active & Fully Implemented</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">Active</span>
            </div>
            <ul className="text-xs text-slate-800 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold">•</span>
                <span><strong>10-Stage Pipeline:</strong> Input preprocessing, physics bounds derivation, and scoring.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold">•</span>
                <span><strong>Hard Constraint Engine:</strong> Automatic rejection of fatal combinations (e.g. respiring produce in foil).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold">•</span>
                <span><strong>Packaging Prescription Sheet:</strong> Engineering format, gauge, seal, and MAP recommendations.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold">•</span>
                <span><strong>What-If Sandbox:</strong> Dynamic sensitivity stress-testing under varying climate conditions.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold">•</span>
                <span><strong>Package Integrity Audit:</strong> Diagnosis of field defects and upgrade paths.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold">•</span>
                <span><strong>Confidence Scoring:</strong> Metric completeness assessment and penalty weighting.</span>
              </li>
            </ul>
          </div>

          {/* SIMULATED Column */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>Research-Grounded Models</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Model</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500 font-bold">•</span>
                <span><strong>Sorption Isotherm Kinetics:</strong> GAB/BET moisture equilibrium simulation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500 font-bold">•</span>
                <span><strong>Shelf Life Extrapolation:</strong> Arrhenius kinetic models for temperature-dependent lipid rancidity.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500 font-bold">•</span>
                <span><strong>ASTM Permeation Reference:</strong> Baseline values for WVTR (ASTM F1249) and OTR (ASTM D3985).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-500 font-bold">•</span>
                <span><strong>Transit Puncture Forces:</strong> Simulated rough handling shock and vibration thresholds.</span>
              </li>
            </ul>
          </div>

          {/* PLANNED Column */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Planned Roadmap</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Roadmap</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">•</span>
                <span><strong>Direct Lab IoT Sync:</strong> Automated telemetry integration with MOCON permeation instruments.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">•</span>
                <span><strong>FSSAI / FDA Regulatory API:</strong> Automated global food-contact migration compliance validation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">•</span>
                <span><strong>Packaging Line ERP Feasibility:</strong> Integration with form-fill-seal machinery telemetry.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-slate-400 font-bold">•</span>
                <span><strong>Live Resin Spot Index:</strong> Real-time Indian polymer and paperboard spot pricing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* METHODOLOGY & DETERMINISTIC SCORING EQUATION */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-slate-100 text-slate-800">
            <Calculator className="w-4 h-4 text-[#059669]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Scoring Methodology & Multi-Criteria Formulation</h2>
            <p className="text-[11px] text-slate-500">Deterministic multi-attribute utility model</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
          <p className="font-bold text-[#059669]">
            Material Score = Protection (35) + Storage (20) + Transport (15) + Cost (15) + Sustainability (15) - Failure Penalties
          </p>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
            Normalized to a standardized 0–100 index (scores are completely deterministic).
          </p>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Evaluation Component Breakdown:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong>Protection Score (Max 35 points): </strong>
                Fulfillment ratio comparing substrate barrier ratings (WVTR, OTR, Light UV, Heat, and Sealability) against dynamic thresholds computed from the selected food&apos;s physical sensitivities.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong>Storage Suitability (Max 20 points): </strong>
                Evaluates barrier endurance under ambient relative humidity (% RH) and heat deflection threshold at operational warehouse temperature (°C).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong>Transportation Strength (Max 15 points): </strong>
                Balances tensile and puncture resistance against handling severity (Gentle, Standard, Rough manual) and transit haul duration.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong>Cost Score (Max 15 points): </strong>
                Normalized commercial substrate cost, modulated by user-selected economic priority weight (Low, Medium, High).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <strong>Sustainability Score (Max 15 points): </strong>
                Composite of mechanical recyclability percentage (65% weight) and industrial compostability / bio-origin (35% weight), modulated by user sustainability priority.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Failure Penalties: </strong>
                Direct subtractions triggered whenever a material fails a mandatory barrier requirement (e.g. moisture-sensitive food in low barrier packaging).
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* SAMPLE DATASET LABELS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-2.5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#059669]" />
          <span>Dataset & Literature Citations</span>
        </h2>
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
          <p className="font-semibold text-slate-900">
            &quot;Calibrated dataset — synthesized from standard food packaging engineering literature.&quot;
          </p>
          <p>
            Barrier properties (WVTR, OTR, UV, tensile, and seal integrity) are synthesized from standard packaging engineering literature (Robertson, <em>Food Packaging: Principles and Practice</em>; Coles et al., <em>Food Packaging Technology</em>; ASTM F1249, ASTM D3985 standard test methods).
          </p>
        </div>
      </div>
    </div>
  );
};
