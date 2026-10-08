import React, { useState } from 'react';
import { NavigationTabType } from './components/Navbar';
import { TopHeaderBanner } from './components/TopHeaderBanner';
import { NavigationUtilityBar } from './components/NavigationUtilityBar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RecommendationWorkflow } from './components/RecommendationWorkflow';
import { MaterialsCatalogView } from './components/MaterialsCatalogView';
import { CompareView } from './components/CompareView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ExistingPackageAuditView } from './components/ExistingPackageAuditView';
import { AboutView } from './components/AboutView';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { FssaiLogo, MofpiLogo, PackagingCommodityIcon } from './components/OfficialSeals';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [workflowInitialFoodId, setWorkflowInitialFoodId] = useState<string>('potato-chips');
  const [compareInitialIds, setCompareInitialIds] = useState<string[]>(['laminated-film', 'pet', 'biodegradable-film']);

  const handleStartRecommendation = (foodId?: string) => {
    if (foodId) {
      setWorkflowInitialFoodId(foodId);
    }
    setActiveTab('recommendation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCompare = (materialId?: string) => {
    if (materialId) {
      setCompareInitialIds(prev => {
        if (prev.includes(materialId)) return prev;
        return [materialId, ...prev.slice(0, 2)];
      });
    }
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAudit = () => {
    setActiveTab('audit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-row font-sans selection:bg-[#059669] selection:text-white">
      {/* 1. PERMANENT LEFT SIDEBAR NAVIGATION (w-60 to w-64 full-height panel spanning vertically along left edge) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickStart={() => handleStartRecommendation()}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* 2. MAIN CONTENT AREA SHIFT: Pushed to the RIGHT side of the vertical sidebar */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#F8FAFC]">
        {/* TOP HEADER: Prominent SmartPack AI logo, small subtext, metadata badges, top-right FSSAI/MoFPI seals */}
        <TopHeaderBanner onHomeClick={() => setActiveTab('dashboard')} />

        {/* FULL-WIDTH SEARCH BAR: Positioned right below top banner spanning 100% width of main content area */}
        <NavigationUtilityBar
          activeTab={activeTab}
          onNavigateTab={tab => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectCommodity={id => handleStartRecommendation(id)}
          onSelectMaterial={() => {
            setActiveTab('materials');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* MAIN PORTAL CONTENT AREA */}
        <main className="flex-1 w-full px-2 sm:px-3 py-2 sm:py-2.5">
          {/* If user navigates away from dashboard, show breadcrumb back to dashboard */}
          {activeTab !== 'dashboard' && (
            <div className="mb-2.5 pb-1.5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="font-bold text-[#059669] hover:underline cursor-pointer"
                >
                  Dashboard
                </button>
                <span className="text-slate-400">/</span>
                <span className="text-slate-700 font-semibold capitalize">
                  {activeTab === 'recommendation' ? 'New Evaluation Wizard' : activeTab.replace('-', ' ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-[#E2E8F0] bg-white px-2.5 py-1 rounded cursor-pointer"
              >
                ← Return to Dashboard
              </button>
            </div>
          )}

        {/* 3, 4, 5: DASHBOARD VIEW (Action Buttons Row, Middle Section 2-Col Grid, Bottom Section Brief Card) */}
        {activeTab === 'dashboard' && (
          <DashboardView
            onStartRecommendation={handleStartRecommendation}
            onNavigateToMaterials={() => {
              setActiveTab('materials');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCompare={() => {
              setActiveTab('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToWhatIf={() => {
              setActiveTab('what-if');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAudit={handleNavigateToAudit}
          />
        )}

        {/* Evaluation Wizard / Recommendation Tab */}
        {activeTab === 'recommendation' && (
          <RecommendationWorkflow
            key={workflowInitialFoodId}
            initialFoodId={workflowInitialFoodId}
            onNavigateToCompare={handleNavigateToCompare}
          />
        )}

        {/* My Audits / Existing Package Audit */}
        {activeTab === 'audit' && (
          <ExistingPackageAuditView
            onSelectForRecommendation={handleStartRecommendation}
          />
        )}

        {/* Packaging Materials Knowledge Base */}
        {activeTab === 'materials' && (
          <MaterialsCatalogView
            onCompareMaterial={handleNavigateToCompare}
          />
        )}

        {/* Compare Substrates */}
        {activeTab === 'compare' && (
          <CompareView
            key={compareInitialIds.join('-')}
            initialMaterialIds={compareInitialIds}
          />
        )}

        {/* What-If Sensitivity Simulator */}
        {activeTab === 'what-if' && (
          <WhatIfSimulator />
        )}

        {/* About & Regulatory Dossier */}
        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Statutory Disclaimer Notice Banner */}
      <DisclaimerBanner />

      {/* Government & Industrial Portal Engineering Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white text-xs text-[#475569] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PackagingCommodityIcon className="w-7 h-7" />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                <span>SmartPack AI</span>
                <span>—</span>
                <span className="font-semibold text-slate-600">Decision Support Platform</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Calibrated per FSSAI 2026 Food Contact Packaging Regulations &amp; MoFPI PMKSY Guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => {
                setActiveTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#059669] cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('audit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#059669] cursor-pointer"
            >
              My Audits
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('materials');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#059669] cursor-pointer"
            >
              Materials Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('compare');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#059669] cursor-pointer"
            >
              Compare
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('what-if');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#059669] cursor-pointer"
            >
              What-If
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#059669] cursor-pointer"
            >
              FSSAI Dossier
            </button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
