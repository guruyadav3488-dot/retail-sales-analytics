import React, { useState } from 'react';
import { DAX_MEASURES } from '../data/retailDataset';
import { DaxMeasure } from '../types/retail';
import { Layout, Copy, Check, GitCommit, Layers, Eye, BookOpen } from 'lucide-react';

export const PowerBiSpecView: React.FC = () => {
  const [selectedDaxIndex, setSelectedDaxIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [activePageTab, setActivePageTab] = useState<'exec' | 'cohort' | 'rfm' | 'pareto'>('exec');

  const activeMeasure: DaxMeasure = DAX_MEASURES[selectedDaxIndex] || DAX_MEASURES[0];

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(activeMeasure.formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Business Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Power BI Report Specification</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">Star Schema &amp; Production DAX</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Power BI Report Spec &amp; DAX Measure Library
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Complete architectural blueprint for recreating RetailIQ inside Microsoft Power BI Desktop: Star Schema dimensional modeling, page layouts, visual hierarchies, and copy-paste DAX formulas with interview defenses.
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs font-mono text-slate-700">
            Canvas: 16:9 (1280 × 720) · Segoe UI / Plus Jakarta Sans
          </div>
        </div>
      </div>

      {/* Star Schema Interactive ERD */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-blue-600" />
              <span>Dimensional Star Schema (Kimball Architecture)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clean 1-to-many single-direction relationships ensuring optimal VertiPaq engine compression.
            </p>
          </div>
          <span className="text-2xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Cardinality: 1:* (Single-Direction)
          </span>
        </div>

        {/* Visual ERD Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Dim Date */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>dim_date</span>
              <span className="text-3xs font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Dim (1)</span>
            </div>
            <div className="font-mono text-2xs text-slate-600 space-y-1">
              <div className="font-bold text-blue-700">PK date_key (Int)</div>
              <div>calendar_date (Date)</div>
              <div>year, quarter, month</div>
              <div>day_of_week, day_name</div>
              <div>is_weekend (Boolean)</div>
            </div>
            <div className="text-3xs text-slate-400 pt-1 border-t border-slate-200">
              *Mark as Official Date Table
            </div>
          </div>

          {/* Fact Sales (Center Anchor) */}
          <div className="md:col-span-2 p-4 bg-slate-900 text-white rounded-lg border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>fact_sales</span>
              <span className="text-3xs font-mono bg-blue-600 text-white px-1.5 py-0.5 rounded">Fact (*)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-2xs text-slate-300">
              <div className="space-y-1">
                <div className="font-bold text-blue-400">PK sales_key</div>
                <div>invoice_no (Degenerate)</div>
                <div className="text-blue-300">FK date_key</div>
                <div className="text-blue-300">FK customer_key</div>
                <div className="text-blue-300">FK product_key</div>
              </div>
              <div className="space-y-1">
                <div>quantity (Signed Int)</div>
                <div>unit_price (£)</div>
                <div>gross_amount (£)</div>
                <div>net_amount (£)</div>
                <div>is_cancellation (Bool)</div>
              </div>
            </div>
            <div className="text-3xs text-slate-400 pt-1 border-t border-slate-800">
              Stores transaction lines; Customer key = -1 for Guest Checkouts
            </div>
          </div>

          {/* Dim Product & Customer */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>dim_customer</span>
                <span className="text-3xs font-mono bg-blue-100 text-blue-800 px-1 py-0.2 rounded">1</span>
              </div>
              <div className="font-mono text-2xs text-slate-600">
                <span className="font-bold text-blue-700">PK customer_key</span> · country · rfm_segment
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>dim_product</span>
                <span className="text-3xs font-mono bg-blue-100 text-blue-800 px-1 py-0.2 rounded">1</span>
              </div>
              <div className="font-mono text-2xs text-slate-600">
                <span className="font-bold text-blue-700">PK product_key</span> · stock_code · unit_cost_proxy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production DAX Measure Library */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Production DAX Measure Catalog</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any measure to inspect formula syntax, logic description, and interview defense tips.
            </p>
          </div>

          <button
            onClick={handleCopyFormula}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Formula Copied' : 'Copy Formula'}</span>
          </button>
        </div>

        {/* Measure Buttons Strip */}
        <div className="flex flex-wrap gap-2">
          {DAX_MEASURES.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setSelectedDaxIndex(idx)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                selectedDaxIndex === idx
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Active Measure Code Block */}
        <div className="p-4 bg-slate-950 text-slate-100 rounded-lg border border-slate-800 font-mono text-xs space-y-3">
          <div className="flex justify-between items-center text-3xs text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-bold text-blue-400">{activeMeasure.name}</span>
            <span>Category: {activeMeasure.category}</span>
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
            {activeMeasure.formula}
          </pre>
          <div className="text-2xs text-slate-400 pt-2 border-t border-slate-800 font-sans">
            {activeMeasure.description}
          </div>
        </div>

        {/* Interview Tip Callout */}
        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg text-xs space-y-1">
          <div className="font-bold text-blue-950">Power BI Interview Defense Note:</div>
          <p className="text-blue-900/90 leading-relaxed">
            {activeMeasure.interviewTip}
          </p>
        </div>
      </div>

      {/* 4-Page Visual Layout Blueprint */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layout className="w-4 h-4 text-slate-700" />
          <span>4-Page Report Layout &amp; Visual Hierarchy</span>
        </h2>

        {/* Page Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium w-fit">
          <button
            onClick={() => setActivePageTab('exec')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activePageTab === 'exec' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            1. Executive Summary
          </button>
          <button
            onClick={() => setActivePageTab('cohort')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activePageTab === 'cohort' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            2. Cohort Matrix
          </button>
          <button
            onClick={() => setActivePageTab('rfm')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activePageTab === 'rfm' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            3. RFM Intelligence
          </button>
          <button
            onClick={() => setActivePageTab('pareto')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activePageTab === 'pareto' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            4. Product Pareto &amp; Risk
          </button>
        </div>

        {/* Layout Wireframe Spec */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
          {activePageTab === 'exec' && (
            <div>
              <div className="font-bold text-slate-900 mb-1">Page 1: Executive Summary Layout</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Top KPI Row (5 Cards)</strong>: Net Revenue (£), Total Orders, AOV, Gross Margin Proxy (£), Overall Return Rate %.</li>
                <li><strong>Center Left Visual</strong>: Clustered Column &amp; Line Chart: Monthly Net Revenue (Bars) vs YoY Growth % (Line).</li>
                <li><strong>Center Right Visual</strong>: Donut Chart: Market Segment ('Domestic UK' 89% vs 'International Export' 11%).</li>
                <li><strong>Bottom Visual</strong>: High-density data grid of Top Product Categories with in-cell data bars for Gross Margin.</li>
              </ul>
            </div>
          )}

          {activePageTab === 'cohort' && (
            <div>
              <div className="font-bold text-slate-900 mb-1">Page 2: Customer Cohort Retention Layout</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Primary Visual</strong>: Power BI Matrix visual with Rows = `Cohort Month`, Columns = `Month Index (0 to 12)`, Values = `[Cohort Retention %]`.</li>
                <li><strong>Conditional Formatting</strong>: Linear color gradient scale (White to Deep Indigo `#1E3A8A`) on matrix cell backgrounds.</li>
                <li><strong>Side Visual</strong>: Average Retention Curve Line Chart highlighting the Month-1 cliff and Month-6 plateau.</li>
              </ul>
            </div>
          )}

          {activePageTab === 'rfm' && (
            <div>
              <div className="font-bold text-slate-900 mb-1">Page 3: RFM Customer Intelligence Layout</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Primary Visual</strong>: Treemap visual where tile area = `[Net Revenue]` and grouping = `dim_customer[rfm_segment]`.</li>
                <li><strong>Scatter Chart</strong>: Average Recency Days (X) vs Average Order Frequency (Y) colored by Segment.</li>
                <li><strong>Card Cluster</strong>: Selected segment profile showing recommended CRM playbook and sample VIP accounts.</li>
              </ul>
            </div>
          )}

          {activePageTab === 'pareto' && (
            <div>
              <div className="font-bold text-slate-900 mb-1">Page 4: Product ABC Pareto &amp; Return Risk Layout</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Primary Visual</strong>: Pareto Chart: Net Revenue per SKU (Columns) + Cumulative Revenue % (Line with 80% reference line).</li>
                <li><strong>Risk Quadrant</strong>: Scatter chart of Return Rate % (Y) vs Units Sold (X) to instantly flag fragile ceramic outliers.</li>
                <li><strong>Filter Slicers</strong>: ABC Class slicer (Class A, Class B, Class C) and Category multi-select.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
