import React, { useState } from 'react';
import { MONTHLY_METRICS } from '../data/retailDataset';
import { Calendar, TrendingUp, AlertTriangle, ArrowRight, Layers } from 'lucide-react';

interface ForecastingViewProps {
  onNavigateToHypotheses: () => void;
}

export const ForecastingView: React.FC<ForecastingViewProps> = ({ onNavigateToHypotheses }) => {
  const [confidenceLevel, setConfidenceLevel] = useState<'80' | '95'>('95');

  // Baseline 6-month projected values (Dec 2011 to May 2012)
  const forecastHorizon = [
    { month: '2011-12', base: 78000, lower80: 68600, upper80: 87400, lower95: 60800, upper95: 95200, factor: 'Post-peak holiday wrap' },
    { month: '2012-01', base: 45000, lower80: 39600, upper80: 50400, lower95: 35100, upper95: 54900, factor: 'January seasonal low' },
    { month: '2012-02', base: 41000, lower80: 36000, upper80: 46000, lower95: 32000, upper95: 50000, factor: 'February trough' },
    { month: '2012-03', base: 56000, lower80: 49200, upper80: 62800, lower95: 43600, upper95: 68400, factor: 'Spring inventory restock' },
    { month: '2012-04', base: 51000, lower80: 44800, upper80: 57200, lower95: 39800, upper95: 62200, factor: 'Easter seasonal ramp' },
    { month: '2012-05', base: 62000, lower80: 54500, upper80: 69500, lower95: 48300, upper95: 75700, factor: 'Summer wedding / party orders' }
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Predictive &amp; Operations Analytics</span>
              <span aria-hidden="true">·</span>
              <span>Time-Series Seasonality Decomposition</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">Q4 Holiday Surge Modeling</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Revenue Forecasting &amp; Seasonality
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Decomposing 24 months of e-commerce transactions into underlying trend and multiplicative seasonal indices. Prepares warehouse labor and carrier capacity for predictable Q4 peaks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToHypotheses}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Test Early Restock Hypothesis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Holiday Surge Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <div className="text-2xs font-semibold text-slate-500 uppercase">Q4 Seasonal Multiplier</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">3.4x vs February Base</div>
            <div className="text-xs text-slate-600 mt-0.5">November net sales reach £175,200 compared to February baseline of £35,900.</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <div className="text-2xs font-semibold text-slate-500 uppercase">Peak Fulfillment Stress</div>
            <div className="text-xl font-bold font-mono text-indigo-700 mt-1">128,900 Units Sold / Mo</div>
            <div className="text-xs text-slate-600 mt-0.5">Dispatches surge from ~30k units in summer to nearly 130k units in late autumn.</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <div className="text-2xs font-semibold text-slate-500 uppercase">Methodology Defense</div>
            <div className="text-xl font-bold text-blue-700 mt-1">Multiplicative Holt-Winters</div>
            <div className="text-xs text-slate-600 mt-0.5">Seasonal amplitude expands proportionally with top-line growth.</div>
          </div>
        </div>
      </div>

      {/* Seasonality Decomposition Visualizer */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900">
            Historical Actuals vs Trend Baseline
          </h2>
          <p className="text-xs text-slate-500">
            Illustrating the underlying operational trend and the massive November spike each operating year.
          </p>
        </div>

        {/* Comparative CSS Visualization */}
        <div className="space-y-3">
          {MONTHLY_METRICS.slice(12, 24).map((m) => {
            const isNov = m.month.endsWith('-11');
            const isOct = m.month.endsWith('-10');
            const pctOfMax = Math.round((m.netRevenue / 180000) * 100);

            return (
              <div key={m.month} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-medium text-slate-800">
                    {m.month} {isNov ? '★ Holiday Peak' : ''}
                  </span>
                  <span className="font-mono text-slate-700 tabular-nums font-semibold">
                    £{m.netRevenue.toLocaleString('en-GB', { maximumFractionDigits: 0 })} · {m.orders} orders
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pctOfMax}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isNov
                        ? 'bg-indigo-700'
                        : isOct
                        ? 'bg-indigo-500'
                        : 'bg-blue-600'
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6-Month Baseline Forecast Table with Confidence Toggle */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              6-Month Forward Baseline Projections
            </h2>
            <p className="text-xs text-slate-500">
              Projected net revenue with statistical uncertainty intervals.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Confidence Interval:</span>
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setConfidenceLevel('80')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  confidenceLevel === '80' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                80% CI
              </button>
              <button
                onClick={() => setConfidenceLevel('95')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  confidenceLevel === '95' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                95% CI
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Forecast Horizon</th>
                <th className="py-2.5 px-3 font-semibold">Underlying Seasonal Driver</th>
                <th className="py-2.5 px-3 font-semibold text-right">Point Estimate (£)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Lower Bound ({confidenceLevel}%)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Upper Bound ({confidenceLevel}%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
              {forecastHorizon.map((f) => {
                const lower = confidenceLevel === '80' ? f.lower80 : f.lower95;
                const upper = confidenceLevel === '80' ? f.upper80 : f.upper95;

                return (
                  <tr key={f.month} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">
                      {f.month}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">
                      {f.factor}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700">
                      £{f.base.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      £{lower.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      £{upper.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
          <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Operational Planning Defense:</strong> In warehouse operations interviews, highlight that seasonal forecasts should directly dictate pallet storage reservations, seasonal temporary packing hires, and supplier purchase orders placed 90–120 days in advance.
          </div>
        </div>
      </div>
    </div>
  );
};
