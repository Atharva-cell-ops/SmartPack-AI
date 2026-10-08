import React from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  ClipboardCheck,
  Package,
  Scale,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { NavigationTabType } from './Navbar';
import { SmartPackLogo } from './OfficialSeals';

interface SidebarProps {
  activeTab: NavigationTabType;
  setActiveTab: (tab: NavigationTabType) => void;
  onQuickStart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onQuickStart,
  isOpen,
  setIsOpen
}) => {
  // Primary navigation items with clean Lucide line icons (1.5px stroke weight)
  const navTabs: {
    id: NavigationTabType;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'audit',
      label: 'My Audits',
      icon: ClipboardCheck,
      badge: '8 Active'
    },
    {
      id: 'materials',
      label: 'Packaging Materials',
      icon: Package,
      badge: '150+'
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: Scale
    },
    {
      id: 'what-if',
      label: 'What-If',
      icon: SlidersHorizontal
    },
    {
      id: 'about',
      label: 'About',
      icon: Info
    }
  ];

  const handleSelect = (tab: NavigationTabType) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between bg-white text-[#0F172A] divide-y divide-[#E2E8F0]">
      {/* Top Branding Section */}
      <div className="p-4 bg-white">
        <div
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <SmartPackLogo className="w-11 h-11 shrink-0 rounded-xl bg-white shadow-2xs border border-slate-200 p-1.5 group-hover:border-emerald-500 transition-colors" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-[#0F2942] tracking-tight">SmartPack</span>
              <span className="text-base font-extrabold text-emerald-600">AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                SaaS
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 truncate">
              Food Packaging Intelligence
            </p>
          </div>
        </div>

        {/* Quick Evaluation CTA inside Sidebar */}
        <div className="mt-4">
          <button
            type="button"
            id="sidebar-quick-start-btn"
            onClick={() => {
              onQuickStart();
              setIsOpen(false);
            }}
            className="w-full py-2.5 px-3.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-sm font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>+ New Evaluation</span>
          </button>
        </div>
      </div>

      {/* Main Vertical Stack Navigation with Clean Line Icons */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
        <div className="px-3 pt-1 pb-1.5 text-xs font-black text-slate-400 uppercase tracking-wider">
          Primary Navigation
        </div>

        <nav className="space-y-1.5" id="permanent-sidebar-nav">
          {navTabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`sidebar-link-${tab.id}`}
                type="button"
                onClick={() => handleSelect(tab.id)}
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold text-base flex items-center justify-between transition-all cursor-pointer border group ${
                  isActive
                    ? 'bg-[#059669] hover:bg-[#047857] text-white border-[#047857] shadow-sm'
                    : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="truncate font-bold text-base">
                    {tab.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-1">
                  {tab.badge && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Regulatory Compliance Badge in Sidebar */}
        <div className="mt-4 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-black text-[#0F172A]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>FSSAI 2026 Aligned</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Calibrated barrier models under IS 15609 &amp; IS 9845 overall migration protocols.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-[#F8FAFC] text-xs text-slate-500 font-mono flex items-center justify-between">
        <span className="font-semibold">DB v2.4 • MoFPI</span>
        <span className="flex items-center gap-1.5 text-[#059669] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active</span>
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. PERMANENT DESKTOP SIDEBAR: Full-height, w-64 to w-72, sticky top-0, permanently along the left edge */}
      <aside
        id="permanent-left-sidebar"
        className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col sticky top-0 h-screen bg-white border-r border-[#CBD5E1] shadow-2xs z-30 select-none overflow-hidden"
      >
        <NavContent />
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR: Accessible via mobile toggle on smaller screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-2xs transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-navigation-sidebar-drawer"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-[#CBD5E1] shadow-xl flex flex-col justify-between transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full flex flex-col">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <NavContent />
        </div>
      </aside>
    </>
  );
};
