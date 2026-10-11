import React, { useState } from 'react';
import { RFM_SEGMENTS } from '../data/retailDataset';
import { RFMSegment } from '../types/retail';
import { Award, AlertTriangle, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface RFMViewProps {
  onNavigateToHypotheses: () => void;
}

export const RFMView: React.FC<RFMViewProps> = ({ onNavigateToHypotheses }) => {
  const [selectedSegmentName, setSelectedSegmentName] = useState<string>('Champions');

  const selectedSegment: RFMSegment =
    RFM_SEGMENTS.find((s) => s.name === selectedSegmentName) || RFM_SEGMENTS[0];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Customer Behavioral Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Quantile-Based RFM Segmentation</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">11 Business Archetypes</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Customer Segmentation (RFM Quintiles)
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Segmenting 5,840 registered customer accounts across Recency (days since last order), Frequency (completed invoices), and Monetary spend (£). Enables precise marketing workflows without clustering drift.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToHypotheses}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>View Wholesale Hypothesis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* High-Level Concentration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <div className="text-2xs font-semibold text-slate-500 uppercase">Top Whale Concentration</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">4.86% accounts → 48.2% revenue</div>
            <div className="text-xs text-slate-600 mt-0.5">Top "Champions" drive nearly half of total commercial cash flow.</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <div className="text-2xs font-semibold text-slate-500 uppercase">At-Risk Capital</div>
            <div className="text-xl font-bold font-mono text-amber-700 mt-1">£125,400 at danger</div>
            <div className="text-xs text-slate-600 mt-0.5">"At Risk" + "Cannot Lose Them" high-value accounts dormant &gt; 120 days.</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-100">
            <div className="text-2xs font-semibold text-slate-500 uppercase">Quantile vs K-Means Defense</div>
            <div className="text-xl font-bold text-blue-700 mt-1">Monotonic &amp; Interpretable</div>
            <div className="text-xs text-slate-600 mt-0.5">Zero retraining drift, highly actionable for CRM marketing teams.</div>
          </div>
        </div>
      </div>

      {/* Segment Selector & Revenue Share Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Customer Population vs Revenue Contribution
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Click any segment card to inspect quantitative metrics, behavioral traits, and recommended action playbooks.
        </p>

        {/* Segment Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {RFM_SEGMENTS.map((seg) => {
            const isSelected = selectedSegmentName === seg.name;
            return (
              <button
                key={seg.name}
                onClick={() => setSelectedSegmentName(seg.name)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  ></span>
                  <span className="text-3xs font-mono font-semibold text-slate-400">
                    {seg.pctOfRevenue}% GMV
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {seg.name}
                </div>
                <div className="text-2xs font-mono text-slate-500 mt-1">
                  {seg.customerCount.toLocaleString()} cust ({seg.pctOfCustomers}%)
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Segment Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedSegment.color }}
              ></span>
              <h2 className="text-xl font-bold text-slate-900">
                Segment Profile: {selectedSegment.name}
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl mt-1">
              {selectedSegment.description}
            </p>
            <div className="text-xs font-mono text-slate-500 mt-2">
              <strong>Quantile Criteria:</strong> {selectedSegment.criteria}
            </div>
          </div>

          {/* Segment Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-100 min-w-28 text-center">
              <div className="text-3xs text-slate-500">Accounts</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {selectedSegment.customerCount}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-100 min-w-28 text-center">
              <div className="text-3xs text-slate-500">Net Revenue</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                £{selectedSegment.totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-100 min-w-28 text-center">
              <div className="text-3xs text-slate-500">Avg Recency</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {selectedSegment.avgRecencyDays} days
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-100 min-w-28 text-center">
              <div className="text-3xs text-slate-500">Avg Frequency</div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {selectedSegment.avgFrequency} orders
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Detail: CRM Action Playbook & Real Sample Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {/* Action Playbook */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Recommended Commercial Playbook
              </h3>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {selectedSegment.actionPlaybook}
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-900 space-y-1">
              <div className="font-semibold">Interview Talking Point:</div>
              <p className="text-blue-800">
                "We deliberately map each RFM quintile to an explicit CRM trigger rather than stopping at descriptive labels. For instance, Champions receive VIP terms, whereas About to Sleep customers receive automated reorder reminders before crossing into churn."
              </p>
            </div>
          </div>

          {/* Real Sample Accounts from UCI Dataset */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Verified Sample Accounts in Dataset
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Customer ID</th>
                    <th className="py-2 px-3 font-semibold">Country</th>
                    <th className="py-2 px-3 font-semibold text-right">Recency</th>
                    <th className="py-2 px-3 font-semibold text-right">Orders</th>
                    <th className="py-2 px-3 font-semibold text-right">Total Spend (£)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
                  {selectedSegment.sampleAccounts.map((acc) => (
                    <tr key={acc.customerId} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        #{acc.customerId}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-600">
                        {acc.country}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {acc.recency}d ago
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {acc.orders}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        £{acc.spend.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-2xs text-slate-400">
              *Customer accounts extracted directly from the verified UCI Online Retail II ledger.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
