import React from 'react';
import { RecommendationResult } from '../types';
import {
  X,
  Printer,
  Package,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  ShieldAlert,
  FileText
} from 'lucide-react';

interface ReportSummaryModalProps {
  result: RecommendationResult;
  onClose: () => void;
}

export const ReportSummaryModal: React.FC<ReportSummaryModalProps> = ({ result, onClose }) => {
  const {
    food,
    productInput,
    storage,
    transport,
    preferences,
    requirements,
    topRecommendations,
    filteredMaterials,
    confidenceGrade,
    confidenceScore,
    confidenceReason,
    missingDataWarnings,
    warnings,
    evaluatedAt,
    prototypeStatusTags
  } = result;

  const handlePrintAndDownload = () => {
    // 1. Generate and download standalone, print-ready HTML specification dossier
    const bestRec = topRecommendations.bestOverall;
    const auditRef = `SP-ENG-${Date.now().toString().slice(-6)}`;
    const evalDate = new Date(evaluatedAt).toLocaleString();

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SmartPack AI Dossier - ${food.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; background: #ffffff; padding: 24px; max-width: 900px; margin: 0 auto; line-height: 1.5; font-size: 13px; }
    h1, h2, h3, h4 { color: #0f172a; margin: 0 0 6px 0; }
    .header-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; background: #f8fafc; margin-bottom: 20px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
    .card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; background: #ffffff; }
    .card-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .val { font-size: 13px; font-weight: 600; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: bold; color: #334155; }
    .notice { font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; }
    .disqualified { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; }
    .btn-print { background: #059669; color: #ffffff; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 12px 16px; border-radius: 8px;">
    <span><strong>Packaging Specification Dossier:</strong> Ready to print or export as PDF.</span>
    <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
  </div>

  <div class="header-box">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <span class="badge">SMARTPACK AI TECHNICAL SPECIFICATION</span>
        <h2 style="font-size: 20px; margin-top: 6px;">${food.name} — Substrate Specification</h2>
        <p style="color: #64748b; margin: 0; font-family: monospace;">Audit Ref: ${auditRef} • Evaluated: ${evalDate}</p>
        <p style="color: #334155; margin: 4px 0 0 0;">Batch: ${productInput.quantityAmount} ${productInput.quantityUnit} • Target: ${productInput.targetShelfLifeDays} days • Storage: ${storage.storageMode} (${storage.temperatureC}°C, ${storage.relativeHumidityPercent}% RH)</p>
      </div>
      <div style="text-align: right;">
        <span class="badge">Confidence: ${confidenceGrade} (${confidenceScore}%)</span>
        <p style="font-size: 11px; color: #64748b; margin-top: 4px;">ASTM Standards Grounded</p>
      </div>
    </div>
  </div>

  <h3>1. Derived Barrier Requirements</h3>
  <table>
    <thead>
      <tr>
        <th>Requirement</th>
        <th>Priority</th>
        <th>Target Value / Specification</th>
        <th>Reasoning</th>
      </tr>
    </thead>
    <tbody>
      ${requirements.map(req => `
        <tr>
          <td><strong>${req.name}</strong></td>
          <td><span style="font-weight: 600; color: ${req.level === 'Required' ? '#dc2626' : '#2563eb'}">${req.level}</span></td>
          <td><code>${req.requiredMetric || 'N/A'}</code></td>
          <td style="color: #475569;">${req.reason}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h3>2. Recommended Substrate (#1 Best Overall)</h3>
  ${bestRec ? `
    <div class="card" style="margin-bottom: 20px; border-color: #cbd5e1; background: #f8fafc;">
      <h3 style="color: #059669; margin-bottom: 8px;">${bestRec.material.name} (Score: ${bestRec.score}/100)</h3>
      <div class="grid">
        <div class="card">
          <div class="card-title">1. Recommended Package Format</div>
          <div class="val">${bestRec.prescription?.packageFormat || 'N/A'}</div>
        </div>
        <div class="card">
          <div class="card-title">2 & 3. Material Structure & Gauge</div>
          <div class="val">${bestRec.prescription?.materialStructure || bestRec.material.structure} (${bestRec.prescription?.thicknessRange || 'Standard'})</div>
        </div>
        <div class="card">
          <div class="card-title">4 & 5. Barrier Transmission Targets</div>
          <div class="val">WVTR: ${bestRec.prescription?.moistureBarrier || `${bestRec.material.wvtrValue} g/m²·day`} | OTR: ${bestRec.prescription?.oxygenBarrier || `${bestRec.material.otrValue} cm³/m²·day`}</div>
        </div>
        <div class="card">
          <div class="card-title">6. Modified Atmosphere (MAP)</div>
          <div class="val">${bestRec.prescription?.mapRequirement || 'Ambient'}</div>
        </div>
      </div>
      <p style="margin: 0; color: #334155; font-size: 12px; line-height: 1.5;"><strong>Scientific Rationalization:</strong> ${bestRec.prescription?.explanation || 'Optimal barrier match derived through multi-criteria decision heuristics.'}</p>
    </div>
  ` : '<p>No matching substrate found.</p>'}

  ${filteredMaterials.length > 0 ? `
    <h3>3. Disqualified Materials (Hard Constraint Violations)</h3>
    ${filteredMaterials.map(f => `
      <div class="disqualified">
        <strong>${f.material.name} [DISQUALIFIED]:</strong> ${f.filterReason}
      </div>
    `).join('')}
  ` : ''}

  <div class="notice">
    <strong>Statutory & Engineering Notice:</strong> Recommendations are for preliminary screening and engineering decision support only. Physical laboratory validation (ASTM F1249 / ASTM D3985), food safety migration testing, and applicable statutory clearances (e.g. FSSAI, US FDA 21 CFR, EU 10/2011) must be conducted prior to commercial manufacturing.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `SmartPackAI_Spec_${food.id}_${Date.now()}.html`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    // 2. Also attempt direct window print if allowed
    try {
      if (typeof window !== 'undefined' && window.self === window.top) {
        window.print();
      }
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Header with ONE Single Action Button */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0 modal-action-bar">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#059669] text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Packaging Engineering Technical Dossier
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Audit Ref: SP-ENG-{Date.now().toString().slice(-6)} • Evaluated: {new Date(evaluatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintAndDownload}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download & print the complete technical specification dossier"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>Download & Print Spec</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Content */}
        <div id="printable-dossier" className="p-5 sm:p-7 overflow-y-auto space-y-5 text-slate-800">
          {/* Institutional Header Banner */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#059669] uppercase tracking-widest">
                  SMARTPACK AI TECHNICAL DOSSIER
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#059669] border border-emerald-200">
                  Confidence: {confidenceGrade} ({confidenceScore}%)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {food.name} — Substrate & Barrier Specification
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                Batch: {productInput.quantityAmount} {productInput.quantityUnit} • Target: {productInput.targetShelfLifeDays} days • Storage: {storage.storageMode}
              </p>
            </div>
            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 text-xs shrink-0">
              <span className="font-semibold text-slate-500 block text-[11px]">ASTM Grounded Engine</span>
              <p className="font-bold text-slate-900">Deterministic Multi-Criteria v2.0</p>
            </div>
          </div>

          {/* Confidence & Assessment Notice */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900">Confidence Calibration: </span>
            <span>{confidenceReason}</span>
            {missingDataWarnings.length > 0 && (
              <div className="text-[11px] text-amber-800 font-medium pt-0.5">
                Note: Input parameters estimated from reference benchmark data: {missingDataWarnings.join('; ')}
              </div>
            )}
          </div>

          {/* Section 1: Physicochemical Commodity & Operating Environment */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              1. Commodity Baseline & Transport Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-white border border-slate-200 rounded-lg p-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Moisture Equilibrium</span>
                <strong className="text-slate-900">{food.profile.moisturePercentage} ({food.profile.moistureSensitivity} Sens.)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Lipid Oxidation Risk</span>
                <strong className="text-slate-900">{food.profile.fatLevel} ({food.profile.oxygenSensitivity} Sens.)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Acidity / pH</span>
                <strong className="text-slate-900">{food.profile.acidity}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Respiration</span>
                <strong className="text-slate-900">{food.profile.respirationCategory}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Storage Temp</span>
                <strong className="text-slate-900 font-mono">{storage.temperatureC}°C ({storage.storageMode})</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Relative Humidity</span>
                <strong className="text-slate-900 font-mono">{storage.relativeHumidityPercent}% RH</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Transit Days & Dist</span>
                <strong className="text-slate-900 font-mono">{transport.durationDays}d ({transport.distanceKm} km)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Handling Shock</span>
                <strong className="text-slate-900">{transport.handling}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Derived Barrier Targets */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              2. Derived Engineering Barrier Requirements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {requirements.map(req => (
                <div key={req.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-start gap-2">
                  <div>
                    <strong className="text-slate-900 block">{req.name}</strong>
                    <span className="text-[11px] text-slate-600 leading-snug block mt-0.5">{req.reason}</span>
                    {req.requiredMetric && (
                      <span className="inline-block mt-1 font-mono font-bold text-[10px] text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {req.requiredMetric}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase font-mono ${
                    req.level === 'Required' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {req.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recommended Prescription (#1 Best Overall) */}
          {topRecommendations.bestOverall && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                3. Primary Substrate Specification Sheet (Best Overall)
              </h4>
              <div className="p-4 rounded-lg border border-slate-300 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                      #1 RECOMMENDED CANDIDATE
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {topRecommendations.bestOverall.material.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#059669] text-white">
                    Score: {topRecommendations.bestOverall.score}/100
                  </span>
                </div>

                {topRecommendations.bestOverall.prescription && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">1. Format</span>
                      <strong className="text-slate-900 leading-tight block">{topRecommendations.bestOverall.prescription.packageFormat}</strong>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">2 & 3. Structure & Gauge</span>
                      <strong className="text-slate-900 leading-tight block font-mono">
                        {topRecommendations.bestOverall.prescription.materialStructure} ({topRecommendations.bestOverall.prescription.thicknessRange})
                      </strong>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">4, 5, 6. Barrier Targets</span>
                      <span className="text-slate-800 text-[11px] block leading-tight font-mono">
                        {topRecommendations.bestOverall.prescription.moistureBarrier} • {topRecommendations.bestOverall.prescription.oxygenBarrier}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">7 & 8. Mechanical & Seal</span>
                      <span className="text-slate-800 text-[11px] block leading-tight">
                        {topRecommendations.bestOverall.prescription.mechanicalStrength} | {topRecommendations.bestOverall.prescription.sealability}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">9 & 10. Atmosphere & MAP</span>
                      <strong className="text-[#059669] text-[11px] block leading-tight">
                        {topRecommendations.bestOverall.prescription.mapRequirement}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">11 & 12. Unit Cost & Sustainability</span>
                      <span className="text-slate-800 text-[11px] block leading-tight">
                        {topRecommendations.bestOverall.prescription.cost} • {topRecommendations.bestOverall.prescription.sustainability}
                      </span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 p-2.5 rounded bg-white border border-slate-200">
                      <span className="text-slate-500 block font-semibold text-[10px]">Scientific Rationalization</span>
                      <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">
                        {topRecommendations.bestOverall.prescription.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Hard Filtered Materials */}
          {filteredMaterials.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                4. Disqualified Candidates (Hard Constraint Violations)
              </h4>
              <div className="space-y-1.5 text-xs">
                {filteredMaterials.map(f => (
                  <div key={f.material.id} className="p-2 rounded-lg bg-rose-50/60 border border-rose-200 flex items-start justify-between gap-2">
                    <div>
                      <strong className="text-rose-950 font-bold">{f.material.name}</strong>
                      <p className="text-[11px] text-rose-900 mt-0.5">{f.filterReason}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded shrink-0 font-mono">
                      Disqualified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Institutional Prototype Disclaimer Footer */}
          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Engineering Decision Support Notice:</p>
            <p>
              SmartPack AI is an engineering decision-support tool. All calculations are synthesized from empirical literature sorption models, ASTM barrier benchmarks, and multi-objective heuristics. Laboratory permeation cell validation (ASTM F1249 / D3985) and accelerated shelf-life studies (ASLT) are mandatory before commercial pilot production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
