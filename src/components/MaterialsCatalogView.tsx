import React, { useState, useMemo } from 'react';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';
import { PackagingMaterial } from '../types';
import {
  Database,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Wind,
  Sun,
  Flame,
  Lock,
  DollarSign,
  Leaf,
  Scale,
  FileText,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface MaterialsCatalogViewProps {
  onCompareMaterial?: (id: string) => void;
}

type SortField = 'name' | 'otrValue' | 'wvtrValue' | 'costScore' | 'recyclabilityPercent';
type SortDirection = 'asc' | 'desc';

export const MaterialsCatalogView: React.FC<MaterialsCatalogViewProps> = ({ onCompareMaterial }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<PackagingMaterial | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  // Categories list with material counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PACKAGING_MATERIALS.length };
    PACKAGING_MATERIALS.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(PACKAGING_MATERIALS.map(m => m.category))).sort();
    return ['All', ...cats];
  }, []);

  // Filtered & Sorted materials
  const processedMaterials = useMemo(() => {
    const filtered = PACKAGING_MATERIALS.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.structure.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.suitableFoodTypes.some(f => f.toLowerCase().includes(q));
      
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'otrValue') {
        comparison = a.otrValue - b.otrValue;
      } else if (sortField === 'wvtrValue') {
        comparison = a.wvtrValue - b.wvtrValue;
      } else if (sortField === 'costScore') {
        comparison = a.costScore - b.costScore;
      } else if (sortField === 'recyclabilityPercent') {
        comparison = a.recyclabilityPercent - b.recyclabilityPercent;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, selectedCategory, sortField, sortDirection]);

  // Reset to page 1 whenever filters change
  const totalItems = processedMaterials.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMaterials = useMemo(() => {
    const startIdx = (validCurrentPage - 1) * itemsPerPage;
    return processedMaterials.slice(startIdx, startIdx + itemsPerPage);
  }, [processedMaterials, validCurrentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#059669]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#059669]" />
    );
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header Bar */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Central Industrial Materials Registry
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Packaging Substrates &amp; Barrier Technical Database
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            {PACKAGING_MATERIALS.length} calibrated commercial food-contact substrates with ASTM D3985 / ASTM F1249 barrier parameters &amp; FSSAI 2026 certification.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Catalog</span>
              <span className="font-mono font-bold text-slate-800">{PACKAGING_MATERIALS.length} Materials</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard</span>
              <span className="font-bold text-emerald-800">FSSAI 2026 / IS 9845</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across 160+ substrates by polymer, structure, commodity (e.g. EVOH, Foil, BOPP, Chips, Paneer)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#059669] text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-600 shrink-0">
            <span className="font-semibold text-slate-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white text-slate-800 focus:outline-none focus:border-[#059669] cursor-pointer"
            >
              <option value={10}>10 items</option>
              <option value={25}>25 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills with Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map(cat => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showing count summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing{' '}
          <span className="font-bold text-slate-800">
            {totalItems === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-bold text-slate-800">
            {Math.min(validCurrentPage * itemsPerPage, totalItems)}
          </span>{' '}
          of <span className="font-bold text-slate-900">{totalItems}</span> matching substrates
          {selectedCategory !== 'All' && <span> in category &ldquo;{selectedCategory}&rdquo;</span>}
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
          >
            Clear search filter
          </button>
        )}
      </div>

      {/* VIEW MODE: INDUSTRIAL DATA TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                  <th
                    className="py-2.5 px-3 cursor-pointer select-none group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Substrate &amp; Lamination</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="py-2.5 px-2">Classification</th>
                  <th
                    className="py-2.5 px-2 font-mono cursor-pointer select-none group"
                    onClick={() => handleSort('otrValue')}
                  >
                    <div className="flex items-center gap-1">
                      <span>OTR (cc/m²·d)</span>
                      {getSortIcon('otrValue')}
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-2 font-mono cursor-pointer select-none group"
                    onClick={() => handleSort('wvtrValue')}
                  >
                    <div className="flex items-center gap-1">
                      <span>WVTR (g/m²·d)</span>
                      {getSortIcon('wvtrValue')}
                    </div>
                  </th>
                  <th className="py-2.5 px-2">Thermal Range</th>
                  <th
                    className="py-2.5 px-2 cursor-pointer select-none group"
                    onClick={() => handleSort('costScore')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Price Tier</span>
                      {getSortIcon('costScore')}
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-2 cursor-pointer select-none group"
                    onClick={() => handleSort('recyclabilityPercent')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Recyclability</span>
                      {getSortIcon('recyclabilityPercent')}
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">Engineering Specs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <div className="font-bold text-slate-800 text-sm">No materials match your query</div>
                      <div className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting &ldquo;All&rdquo; categories.</div>
                    </td>
                  </tr>
                ) : (
                  paginatedMaterials.map((mat, rIdx) => {
                    const isUltraBarrier = mat.otrValue <= 1.0 && mat.wvtrValue <= 1.0;
                    return (
                      <tr
                        key={mat.id}
                        className={`hover:bg-slate-50/80 transition-colors border-b border-slate-200 ${
                          rIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="py-2.5 px-3 max-w-[280px]">
                          <div className="flex items-start gap-1.5">
                            <div>
                              <div className="font-semibold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => setSelectedMaterial(mat)}>
                                {mat.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono line-clamp-1">
                                {mat.structure}
                              </div>
                            </div>
                            {isUltraBarrier && (
                              <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Ultra-Barrier
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-mono">
                          <span
                            className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                              mat.otrValue <= 1.5
                                ? 'bg-emerald-50 text-emerald-800'
                                : mat.otrValue <= 50
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {mat.otrValue}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-mono">
                          <span
                            className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                              mat.wvtrValue <= 1.0
                                ? 'bg-emerald-50 text-emerald-800'
                                : mat.wvtrValue <= 15
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {mat.wvtrValue}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                          {mat.tempToleranceRange}
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-slate-800 whitespace-nowrap">
                          <div className="text-xs font-bold text-slate-900">{mat.costLevel}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{mat.estimatedCostPerKg}</div>
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1">
                            <span
                              className={`font-mono font-bold text-xs ${
                                mat.recyclabilityPercent >= 90
                                  ? 'text-emerald-700'
                                  : mat.recyclabilityPercent >= 50
                                  ? 'text-sky-700'
                                  : 'text-slate-600'
                              }`}
                            >
                              {mat.recyclabilityPercent}%
                            </span>
                            {mat.compostability && (
                              <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                                Bio
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedMaterial(mat)}
                              className="px-2.5 py-1 rounded text-xs font-semibold text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 transition-colors cursor-pointer"
                            >
                              Detail Sheet
                            </button>
                            {onCompareMaterial && (
                              <button
                                type="button"
                                onClick={() => onCompareMaterial(mat.id)}
                                className="px-2 py-1 rounded text-[11px] font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                                title="Compare Material"
                              >
                                <Scale className="w-3 h-3 text-slate-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                Page <span className="font-bold text-slate-900">{validCurrentPage}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span> ({totalItems} materials)
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = validCurrentPage - 2 + i;
                    if (validCurrentPage < 3) pageNum = i + 1;
                    if (validCurrentPage > totalPages - 2) pageNum = totalPages - 4 + i;
                    if (pageNum < 1 || pageNum > totalPages) return null;

                    const isActive = pageNum === validCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded text-xs font-bold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#059669] text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={validCurrentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={validCurrentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE: COMPACT ENGINEERING CARDS */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMaterials.map(mat => (
              <div
                key={mat.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-[#059669]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {mat.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {mat.estimatedCostPerKg}
                    </span>
                  </div>

                  <h3
                    className="text-sm font-bold text-slate-900 leading-snug hover:text-[#059669] cursor-pointer"
                    onClick={() => setSelectedMaterial(mat)}
                  >
                    {mat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                    {mat.structure}
                  </p>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Technical Specs Grid */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">WVTR (Moisture)</span>
                      <span className="font-mono font-bold text-slate-900">{mat.wvtrValue} g/m²·d</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">OTR (Oxygen)</span>
                      <span className="font-mono font-bold text-slate-900">{mat.otrValue} cc/m²·d</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Thermal Limit</span>
                      <span className="font-mono text-slate-800">{mat.tempToleranceRange}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Recyclability</span>
                      <span className="font-mono font-bold text-slate-800">{mat.recyclabilityPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                  >
                    Full Technical Sheet →
                  </button>
                  {onCompareMaterial && (
                    <button
                      type="button"
                      onClick={() => onCompareMaterial(mat.id)}
                      className="px-2.5 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Scale className="w-3 h-3 text-slate-500" />
                      <span>Compare</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cards Pagination */}
          {totalPages > 1 && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-semibold">
                Page {validCurrentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={validCurrentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 rounded bg-slate-100 text-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SLIDE-OVER DETAIL DRAWER / MODAL */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-300 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#059669] text-white">
                    TECHNICAL DATA SHEET (TDS)
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    {selectedMaterial.id.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {selectedMaterial.name}
                </h3>
                <span className="text-xs font-mono text-slate-600 block mt-0.5">
                  Structure: {selectedMaterial.structure} ({selectedMaterial.thicknessGauge})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
              {/* Material Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Substrate Overview & Industrial Purpose
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedMaterial.description}
                </p>
              </div>

              {/* Regulatory & Mechanical Properties Card (Requested fields) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Statutory Standards & Mechanical Properties</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">FSSAI Regulatory Standard</span>
                    <span className="font-bold text-slate-900">
                      {selectedMaterial.fssaiStandard || 'FSSAI Packaging Reg 2026 / IS 9845'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Overall Migration Limit</span>
                    <span className="font-bold text-emerald-800">
                      {selectedMaterial.migrationLimit || '< 10 mg/dm² (IS 9845 Pass)'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Dart Drop Impact</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedMaterial.dartDropImpact || '320 - 450 g (ASTM D1709)'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Tensile Strength</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedMaterial.tensileStrength || '140 - 240 MPa (ASTM D882)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thermal Properties & Sealant Compatibility */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Thermal Behavior & Sealing Compatibility</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Seal Temperature Range</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.sealTempRange}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Service Temperature Tolerance</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.tempToleranceRange}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Polymer Architecture</span>
                    <span className="font-bold text-slate-900">{selectedMaterial.monoOrMultilayer}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">EPR Recyclability</span>
                    <span className="font-bold text-emerald-800">{selectedMaterial.recyclabilityPercent}% Recyclable</span>
                  </div>
                </div>
              </div>

              {/* Barrier Permeation Indices */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Quantitative Barrier Indices (0 - 100 Scale)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Moisture Barrier (WVTR):</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.moistureProtection}/100</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Oxygen Barrier (OTR):</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.oxygenProtection}/100</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Light / UV Shielding:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.lightProtection}/100</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Puncture Resistance:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.punctureResistance}/100</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Thermal Resistance:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.heatResistance}/100</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Seal Integrity:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedMaterial.sealability}/100</span>
                  </div>
                </div>
              </div>

              {/* Key Advantages */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Engineered Advantages
                </h4>
                <ul className="space-y-1 text-xs">
                  {selectedMaterial.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Constraints */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Technical Constraints & Processing Limits
                </h4>
                <ul className="space-y-1 text-xs">
                  {selectedMaterial.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-slate-600">
                      <span className="text-amber-600 font-bold shrink-0">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              {onCompareMaterial && (
                <button
                  type="button"
                  onClick={() => {
                    onCompareMaterial(selectedMaterial.id);
                    setSelectedMaterial(null);
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#059669] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Scale className="w-4 h-4" />
                  <span>Send to Comparison Matrix</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedMaterial(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer ml-auto"
              >
                Close Datasheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
