import React, { useState } from 'react';
import { COHORT_DATA } from '../data/retailDataset';
import { Users, Info, TrendingDown, ArrowRight } from 'lucide-react';

interface CohortMatrixViewProps {
  onNavigateToHypotheses: () => void;
}

export const CohortMatrixView: React.FC<CohortMatrixViewProps> = ({ onNavigateToHypotheses }) => {
  const [metricMode, setMetricMode] = useState<'percent' | 'count'>('percent');
  const [selectedCohort, setSelectedCohort] = useState<string>('2010-01');

  const selectedCohortRow = COHORT_DATA.find((c) => c.cohortMonth === selectedCohort) || COHORT_DATA[0];

  // Helper for heatmap cell background intensity
  const getCellBgColor = (rate: number, isMonthZero: boolean) => {
    if (isMonthZero) return 'bg-slate-900 text-white font-bold';
    if (rate >= 30) return 'bg-blue-600 text-white font-semibold';
    if (rate >= 25) return 'bg-blue-500 text-white';
    if (rate >= 22) return 'bg-blue-400 text-white';
    if (rate >= 20) return 'bg-blue-200 text-blue-950';
    if (rate >= 15) return 'bg-blue-100 text-blue-900';
    return 'bg-blue-50 text-blue-800';
  };

  // Calculate average retention across all cohorts for month indices 0 to 6
  const averageRetentionCurve = [0, 1, 2, 3, 4, 5, 6].map((monthIdx) => {
    const validRows = COHORT_DATA.filter((c) => c.retentionRates[monthIdx] !== undefined);
    const sum = validRows.reduce((acc, curr) => acc + curr.retentionRates[monthIdx], 0);
    const avg = validRows.length ? sum / validRows.length : 0;
    return { monthIdx, avg: Math.round(avg * 10) / 10 };
  });

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Customer Analytics</span>
              <span aria-hidden="true">·</span>
              <span>12-Month Cohort Retention Matrix</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">Registered Accounts Only</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Customer Retention & Churn Velocity
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Tracks customer cohorts by their first recorded purchase month. Notice the dramatic <strong>Month-1 Cliff</strong> where roughly 79% of customers do not repurchase, followed by a loyal <strong>18%–24% retention plateau</strong>.
            </p>
          </div>

          {/* Toggle percentage vs count */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMetricMode('percent')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                metricMode === 'percent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Retention Rate (%)
            </button>
            <button
              onClick={() => setMetricMode('count')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                metricMode === 'count' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Customers (N)
            </button>
          </div>
        </div>

        {/* Analytical Callout */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Kimball Modeling Discipline:</strong> Unregistered guest transactions (without Customer ID) are deliberately excluded from this cohort denominator. Pseudo-imputing guest IDs would corrupt retention math with random noise.
          </div>
        </div>
      </div>

      {/* Cohort Heatmap Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Monthly Triangulated Retention Heatmap
            </h2>
            <p className="text-xs text-slate-500">
              Columns represent months elapsed since initial acquisition (M0 = first purchase month).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-2.5 px-3 text-left font-semibold sticky left-0 bg-slate-50 z-10 whitespace-nowrap">
                  Cohort
                </th>
                <th className="py-2.5 px-3 font-semibold text-right whitespace-nowrap">
                  Base (N)
                </th>
                {Array.from({ length: 13 }).map((_, idx) => (
                  <th key={idx} className="py-2.5 px-2 font-semibold font-mono text-center min-w-12">
                    M+{idx}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {COHORT_DATA.map((row) => {
                const isSelected = selectedCohort === row.cohortMonth;
                return (
                  <tr
                    key={row.cohortMonth}
                    onClick={() => setSelectedCohort(row.cohortMonth)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'ring-1 ring-blue-500 bg-blue-50/20' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-2 px-3 text-left font-sans font-medium text-slate-900 sticky left-0 bg-white z-10 whitespace-nowrap">
                      {row.cohortMonth}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600 font-medium">
                      {row.baseSize.toLocaleString()}
                    </td>

                    {/* Matrix Cells */}
                    {Array.from({ length: 13 }).map((_, monthIdx) => {
                      const rate = row.retentionRates[monthIdx];
                      const count = row.customerCounts[monthIdx];

                      if (rate === undefined) {
                        return (
                          <td key={monthIdx} className="py-2 px-1 text-slate-300">
                            -
                          </td>
                        );
                      }

                      const isM0 = monthIdx === 0;
                      const cellClass = getCellBgColor(rate, isM0);

                      return (
                        <td key={monthIdx} className="py-2 px-1">
                          <div
                            className={`py-1 px-1.5 rounded-xs text-3xs sm:text-2xs font-mono transition-transform hover:scale-105 ${cellClass}`}
                            title={`Cohort ${row.cohortMonth} at M+${monthIdx}: ${rate}% (${count} customers)`}
                          >
                            {metricMode === 'percent' ? `${rate.toFixed(1)}%` : count}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-2xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span>Retention Scale:</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800">10-15%</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">20-25%</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white">25-30%</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white">&gt;30% (Holiday Reorder)</span>
          </div>
          <span>Click any cohort row to inspect its vintage profile below.</span>
        </div>
      </div>

      {/* Two Column Analysis: Average Retention Curve & Vintage Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Retention Curve Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Benchmark Retention Decay Curve
            </h2>
            <p className="text-xs text-slate-500">
              Average repeat retention across all cohorts for the first 6 operating months.
            </p>
          </div>

          <div className="space-y-4">
            {averageRetentionCurve.map((point) => (
              <div key={point.monthIdx} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-800">
                    Month {point.monthIdx} {point.monthIdx === 0 ? '(Acquisition)' : ''}
                  </span>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    {point.avg}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${point.avg}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      point.monthIdx === 0
                        ? 'bg-slate-900'
                        : point.monthIdx === 1
                        ? 'bg-amber-600'
                        : 'bg-blue-600'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-amber-50/60 border border-amber-200 rounded-md text-xs text-amber-900">
            <div className="font-semibold flex items-center gap-1 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-amber-700" />
              Strategic Insight: Month-1 Inflection Point
            </div>
            <p className="text-amber-800/90 leading-relaxed">
              The steep drop from 100% to 21% between M0 and M1 signifies an e-commerce "leaky bucket". However, the accounts that survive Month 1 form a sticky wholesale baseline (~21% retention). Our core recommendation (Hypothesis 1) targets this 21-day window.
            </p>
          </div>
        </div>

        {/* Vintage Cohort Deep-Dive */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Vintage Spotlight: {selectedCohortRow.cohortMonth}
              </h2>
              <p className="text-xs text-slate-500">
                Acquired base of {selectedCohortRow.baseSize.toLocaleString()} registered accounts.
              </p>
            </div>
            <button
              onClick={onNavigateToHypotheses}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Test Hypotheses</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Initial Base</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {selectedCohortRow.baseSize}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Month 1 Retention</div>
              <div className="text-base font-bold font-mono text-amber-600 mt-0.5">
                {selectedCohortRow.retentionRates[1]}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <div className="text-2xs text-slate-500">Month 6 Retention</div>
              <div className="text-base font-bold font-mono text-blue-600 mt-0.5">
                {selectedCohortRow.retentionRates[6] ?? 'N/A'}%
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded p-4 text-xs space-y-2 text-slate-700">
            <div className="font-semibold text-slate-900">Observed Vintage Behavior:</div>
            <p className="text-slate-600 leading-relaxed">
              Customers acquired in <strong>{selectedCohortRow.cohortMonth}</strong> placed their first valid orders during this period. Notice that retention rates experience an uplift around <strong>Month 9–10</strong> (e.g. November peak restocking), demonstrating that B2B giftware buyers re-activate annually for the holiday shopping season.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
