import React, { useState, useMemo } from 'react';
import { PRODUCT_METRICS, MARKET_BASKET_PAIRS } from '../data/retailDataset';
import { ProductMetric } from '../types/retail';
import { Search, AlertCircle, ShoppingCart, Layers, ArrowUpRight } from 'lucide-react';

export const ProductParetoView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');

  const filteredProducts = useMemo(() => {
    return PRODUCT_METRICS.filter((p) => {
      const matchSearch =
        p.stockCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'ALL' || p.abcClass === selectedClass;
      return matchSearch && matchClass;
    });
  }, [searchTerm, selectedClass]);

  // Fragile return outliers (> 8% return rate)
  const returnOutliers = PRODUCT_METRICS.filter((p) => p.returnRate > 8.0);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Catalog &amp; Merchandising Analytics</span>
              <span aria-hidden="true">·</span>
              <span>ABC Pareto Classification &amp; Return Velocity</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">SKU Level Risk Analysis</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Product Pareto (ABC) &amp; Return Velocity
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Categorizes catalog items by cumulative revenue contribution and measures return velocity. Uncovers that top 20% of SKUs generate 80% of revenue, while high-value ceramics suffer from packaging transit breakage.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="p-2 bg-slate-50 rounded border border-slate-200">
              Catalog Median Return Rate: <strong className="font-mono text-slate-900">2.14%</strong>
            </span>
          </div>
        </div>

        {/* ABC Class Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 bg-blue-50/50 rounded border border-blue-200/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-blue-900">Class A (Top 80% Revenue)</span>
              <span className="font-mono text-blue-700 font-semibold">18.4% of SKUs</span>
            </div>
            <p className="text-2xs text-blue-800 mt-1">Core revenue drivers. Prioritize strict inventory availability and priority supplier contracts.</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Class B (Next 15% Revenue)</span>
              <span className="font-mono text-slate-700 font-semibold">27.2% of SKUs</span>
            </div>
            <p className="text-2xs text-slate-600 mt-1">Secondary catalog. Moderate reorder frequency; candidate for basket cross-sell bundling.</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Class C (Tail 5% Revenue)</span>
              <span className="font-mono text-slate-700 font-semibold">54.4% of SKUs</span>
            </div>
            <p className="text-2xs text-slate-600 mt-1">Long tail. High inventory carrying cost risk; candidate for discontinuation or clearance.</p>
          </div>
        </div>
      </div>

      {/* Fragile Outliers Alert Strip */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-amber-950">
                Operational Alert: Fragile Packaging Outliers Detected
              </h2>
              <span className="text-2xs font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-semibold">
                Return Rate &gt; 11%
              </span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed max-w-4xl">
              While general catalog return rates sit at a healthy 2.14%, several high-volume fragile items display severe return velocities exceeding 11.5%. For example, <strong>Regency Cakestand 3 Tier (22423)</strong> generated 1,820 return cancellations. This quantitative signal underpins <strong>Hypothesis 3: Protective Packaging Intervention</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {returnOutliers.map((item) => (
                <div key={item.stockCode} className="p-2.5 bg-white rounded border border-amber-200 text-xs font-mono">
                  <div className="font-bold text-slate-900 truncate font-sans">{item.description}</div>
                  <div className="flex justify-between text-2xs text-slate-600 mt-1">
                    <span>SKU #{item.stockCode}</span>
                    <span className="text-rose-600 font-bold">{item.returnRate}% Returns</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid with Search and Filtering */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              SKU Performance Ledger &amp; ABC Class
            </h2>
            <p className="text-xs text-slate-500">
              Sorted by net revenue generation with individual return rate calculations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search SKU or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 w-48 sm:w-60"
              />
            </div>

            {/* Class Filter */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {(['ALL', 'A', 'B', 'C'] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                    selectedClass === cls
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls === 'ALL' ? 'All Classes' : `Class ${cls}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">SKU Code</th>
                <th className="py-2.5 px-3 font-semibold">Product Description</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold text-center">ABC Class</th>
                <th className="py-2.5 px-3 font-semibold text-right">Units Sold</th>
                <th className="py-2.5 px-3 font-semibold text-right">Net Revenue (£)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Return Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
              {filteredProducts.map((p) => {
                const isHighReturn = p.returnRate > 8.0;
                return (
                  <tr key={p.stockCode} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {p.stockCode}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-900 font-medium">
                      {p.description}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">
                      {p.category}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-2xs font-bold ${
                          p.abcClass === 'A'
                            ? 'bg-blue-100 text-blue-900'
                            : p.abcClass === 'B'
                            ? 'bg-slate-100 text-slate-800'
                            : 'bg-slate-50 text-slate-500'
                        }`}
                      >
                        Class {p.abcClass}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {p.unitsSold.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      £{p.netRevenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`font-semibold ${
                          isHighReturn ? 'text-rose-600' : 'text-slate-600'
                        }`}
                      >
                        {p.returnRate.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Basket Cross-Selling Affinity Pairs */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Market Basket Affinity Pairs (Association Mining)
          </h2>
          <p className="text-xs text-slate-500">
            Items frequently co-purchased together in the same order (Lift &gt; 1 indicates significant positive association).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MARKET_BASKET_PAIRS.map((pair, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Co-Purchase Pair #{idx + 1}</span>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Lift: {pair.lift}x
                </span>
              </div>
              <div className="space-y-1 text-slate-700 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="font-medium truncate">{pair.nameA} ({pair.itemA})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span className="font-medium truncate">{pair.nameB} ({pair.itemB})</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-2xs font-mono text-slate-500">
                <span>Support: {pair.supportPct}%</span>
                <span>Confidence: {pair.confidencePct}%</span>
                <span>Commercial Action: Pre-bundled 2-pack discount</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
