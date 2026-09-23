import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Menu
} from 'lucide-react';
import { NavigationTabType } from './Navbar';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';

interface NavigationUtilityBarProps {
  activeTab: NavigationTabType;
  onNavigateTab: (tab: NavigationTabType) => void;
  onSelectCommodity?: (id: string) => void;
  onSelectMaterial?: (id: string) => void;
  onToggleSidebar?: () => void;
}

export const NavigationUtilityBar: React.FC<NavigationUtilityBarProps> = ({
  onNavigateTab,
  onSelectCommodity,
  onSelectMaterial,
  onToggleSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileContainerRef.current && !profileContainerRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter food commodities and materials by search query
  const queryLower = searchQuery.toLowerCase().trim();
  const matchedCommodities = queryLower.length > 0
    ? FOOD_COMMODITIES.filter(
        c => c.name.toLowerCase().includes(queryLower) || c.category.toLowerCase().includes(queryLower)
      ).slice(0, 4)
    : [];

  const matchedMaterials = queryLower.length > 0
    ? PACKAGING_MATERIALS.filter(
        m => m.name.toLowerCase().includes(queryLower) || m.structure.toLowerCase().includes(queryLower)
      ).slice(0, 4)
    : [];

  const hasSearchResults = matchedCommodities.length > 0 || matchedMaterials.length > 0;

  return (
    <nav
      id="main-content-search-utility-bar"
      className="w-full bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sticky top-0 z-30"
    >
      <div className="w-full flex items-center justify-between gap-3">
        {/* Mobile Hamburger Button to open sidebar drawer on smaller screens */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            <Menu className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}

        {/* FULL-WIDTH SEARCH BAR: Positioned spanning 100% width of main content area */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
            <input
              type="text"
              id="global-portal-search-input"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSearchDropdown(true);
              }}
              placeholder="Search packaging material / food commodities..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition-colors font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {hasSearchResults ? (
                <>
                  {matchedCommodities.length > 0 && (
                    <div className="p-2 bg-slate-50">
                      <span className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Food Commodities ({matchedCommodities.length})
                      </span>
                      <div className="mt-1 space-y-1">
                        {matchedCommodities.map(food => (
                          <div
                            key={food.id}
                            onClick={() => {
                              if (onSelectCommodity) onSelectCommodity(food.id);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="p-2 rounded hover:bg-emerald-50 cursor-pointer flex items-center justify-between text-xs transition-colors border border-transparent hover:border-emerald-200"
                          >
                            <div>
                              <span className="font-semibold text-slate-900">{food.name}</span>
                              <span className="text-[11px] text-slate-500 ml-2 font-mono">({food.category})</span>
                            </div>
                            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                              Evaluate <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedMaterials.length > 0 && (
                    <div className="p-2 bg-white">
                      <span className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        Packaging Materials ({matchedMaterials.length})
                      </span>
                      <div className="mt-1 space-y-1">
                        {matchedMaterials.map(mat => (
                          <div
                            key={mat.id}
                            onClick={() => {
                              if (onSelectMaterial) onSelectMaterial(mat.id);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="p-2 rounded hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors border border-transparent hover:border-slate-200"
                          >
                            <div>
                              <span className="font-semibold text-slate-900">{mat.name}</span>
                              <span className="text-[11px] text-slate-500 ml-2 font-mono">({mat.structure})</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                              Inspect <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No commodities or materials found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Far-Right Utilities: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell Icon */}
          <div ref={notifContainerRef} className="relative shrink-0">
            <button
              type="button"
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View notifications"
              className="relative p-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-rose-600 border border-white text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-76 sm:w-84 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden divide-y divide-slate-100">
                <div className="p-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-xs font-semibold text-slate-900">Regulatory Notices</span>
                  </div>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    3 New
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>FSSAI Advisory #2026/04</span>
                      <span>Today, 09:30</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      FSSAI 2026 Food Contact Plastics Migration Limits Updated
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      Specific migration limits for bisphenols enforced across flexible laminates.
                    </p>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Batch Audit Verified</span>
                      <span>Yesterday</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      Basmati Rice Export Packaging Certificate Ready
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      Hermetic liner integrity verified (WVTR &lt; 1.2 g/m²·d). Digital QR issued.
                    </p>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>MoFPI Circular</span>
                      <span>18 Sep 2026</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      Cold Chain Clamshell Subsidies Announced
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      rPET thermoformed containers eligible for 30% capital subsidy under PMKSY.
                    </p>
                  </div>
                </div>

                <div className="p-2 text-center bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Mark all regulatory advisories as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div ref={profileContainerRef} className="relative shrink-0">
            <button
              type="button"
              id="user-profile-avatar-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="View inspector user profile"
              className="flex items-center gap-2 p-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5 text-slate-200" strokeWidth={1.5} />
              </div>
              <div className="hidden sm:flex flex-col items-start text-left leading-tight">
                <span className="text-xs font-semibold text-slate-900 leading-tight">Dr. S. Raman</span>
                <span className="text-[10px] text-slate-500 font-normal leading-none">Lead Auditor</span>
              </div>
            </button>

            {/* Profile Menu Popover */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-1.5 w-68 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden divide-y divide-slate-100">
                <div className="p-3 bg-slate-50">
                  <div className="text-xs font-bold text-slate-900">Dr. S. Raman, Ph.D.</div>
                  <div className="text-[11px] text-slate-600 font-medium">Principal Packaging Technologist</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" strokeWidth={1.5} />
                    <span>ID: IN-FSSAI-4491</span>
                  </div>
                </div>

                <div className="p-1.5 space-y-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('audit');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>My Assigned Audits</span>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">8</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('about');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>FSSAI Standards Dossier</span>
                    <FileText className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="p-2 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span>NFL Ghaziabad</span>
                  <span className="text-emerald-600 font-semibold">ONLINE</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
