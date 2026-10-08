import React from 'react';
import { Package, Sparkles, Scale, Sliders, Database, Info, Layers, SearchCheck, Globe } from 'lucide-react';

export type NavigationTabType = 'dashboard' | 'recommendation' | 'materials' | 'compare' | 'what-if' | 'audit' | 'about' | 'tinyfish';

interface NavbarProps {
  activeTab: NavigationTabType;
  setActiveTab: (tab: NavigationTabType) => void;
  onQuickStart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onQuickStart }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div 
            id="brand-logo-container" 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">SmartPack <span className="text-cyan-600">AI</span></span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  SIH Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium hidden md:block leading-none">
                Food Packaging Recommendation System
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Dashboard
            </button>
            <button
              id="nav-tab-tinyfish"
              onClick={() => setActiveTab('tinyfish')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'tinyfish'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              Research
            </button>
            <button
              id="nav-tab-recommendation"
              onClick={() => setActiveTab('recommendation')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'recommendation'
                  ? 'bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-600" />
              New Recommendation
            </button>
            <button
              id="nav-tab-audit"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SearchCheck className="w-4 h-4 text-indigo-600" />
              Package Audit
            </button>
            <button
              id="nav-tab-materials"
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'materials'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Database className="w-4 h-4" />
              Materials
            </button>
            <button
              id="nav-tab-compare"
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4" />
              Compare
            </button>
            <button
              id="nav-tab-what-if"
              onClick={() => setActiveTab('what-if')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'what-if'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              What-If
            </button>
            <button
              id="nav-tab-about"
              onClick={() => setActiveTab('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Info className="w-4 h-4" />
              About & Truth
            </button>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center gap-2">
            <button
              id="header-start-btn"
              onClick={onQuickStart}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Recommendation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('tinyfish')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'tinyfish' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
          }`}
        >
          Research
        </button>
        <button
          onClick={() => setActiveTab('recommendation')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'recommendation' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Recommend
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Audit
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'materials' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Materials
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'compare' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Compare
        </button>
        <button
          onClick={() => setActiveTab('what-if')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'what-if' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          What-If
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap ${
            activeTab === 'about' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          About
        </button>
      </div>
    </header>
  );
};
