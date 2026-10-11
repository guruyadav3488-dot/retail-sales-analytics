import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { MONTHLY_METRICS, RFM_SEGMENTS, PRODUCT_METRICS, COHORT_DATA } from '../data/retailDataset';
import { FileSpreadsheet, Download, Check, Eye, Table2, Layers } from 'lucide-react';

export const ExcelStudioView: React.FC = () => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [activeSheetPreview, setActiveSheetPreview] = useState<'kpi' | 'monthly' | 'rfm' | 'pareto' | 'governance'>('kpi');

  const handleDownloadWorkbook = () => {
    setDownloading(true);

    try {
      const wb = XLSX.utils.book_new();

      // 1. Executive KPIs Sheet
      const kpiRows = [
        ['Metric Name', 'Value', 'Unit / Currency', 'Methodology & Definition'],
        ['Gross Revenue', 2154820.0, '£ GBP', 'Total invoice lines excluding cancellations and non-merchandise fees'],
        ['Net Realized Revenue', 1842500.0, '£ GBP', 'Gross revenue minus refund credit adjustments'],
        ['Estimated Gross Margin (40%)', 737000.0, '£ GBP', 'Net revenue multiplied by standard 40% retail markup proxy'],
        ['Total Orders / Invoices', 44180, 'Invoices', 'Count of distinct completed transactions'],
        ['Average Order Value (AOV)', 41.7, '£ / Order', 'Gross revenue divided by total distinct orders'],
        ['Overall Return Rate', 2.14, 'Percent %', 'Cancelled units divided by (gross units + cancelled units)'],
        ['Active Registered Accounts', 5840, 'Accounts', 'Unique accounts with non-null Customer ID'],
        ['Repeat Purchase Rate', 71.8, 'Percent %', 'Registered customers with 2 or more lifetime purchases']
      ];
      const wsKpi = XLSX.utils.aoa_to_sheet(kpiRows);
      XLSX.utils.book_append_sheet(wb, wsKpi, 'Executive_KPIs');

      // 2. Monthly Trends Sheet
      const monthlyRows = [
        ['Month (YYYY-MM)', 'Gross Revenue (£)', 'Net Revenue (£)', 'Orders', 'Sold Units', 'Returned Units', 'AOV (£)', 'Return Rate (%)'],
        ...MONTHLY_METRICS.map((m) => [
          m.month,
          m.grossRevenue,
          m.netRevenue,
          m.orders,
          m.soldUnits,
          m.returnedUnits,
          m.aov,
          m.returnRate
        ])
      ];
      const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyRows);
      XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly_Trends');

      // 3. RFM Segments Sheet
      const rfmRows = [
        ['Segment Name', 'Customer Count', 'Pct of Cust (%)', 'Total Net Spend (£)', 'Pct of Revenue (%)', 'Avg Recency (Days)', 'Avg Frequency (Orders)', 'Criteria Code', 'Recommended Action Playbook'],
        ...RFM_SEGMENTS.map((s) => [
          s.name,
          s.customerCount,
          s.pctOfCustomers,
          s.totalRevenue,
          s.pctOfRevenue,
          s.avgRecencyDays,
          s.avgFrequency,
          s.criteria,
          s.actionPlaybook
        ])
      ];
      const wsRfm = XLSX.utils.aoa_to_sheet(rfmRows);
      XLSX.utils.book_append_sheet(wb, wsRfm, 'RFM_Segments');

      // 4. Product Pareto Sheet
      const paretoRows = [
        ['Stock Code', 'Product Description', 'Category', 'ABC Class', 'Units Sold', 'Units Returned', 'Net Revenue (£)', 'Return Rate (%)', 'Cum Revenue (%)'],
        ...PRODUCT_METRICS.map((p) => [
          p.stockCode,
          p.description,
          p.category,
          p.abcClass,
          p.unitsSold,
          p.unitsReturned,
          p.netRevenue,
          p.returnRate,
          p.cumRevenuePct
        ])
      ];
      const wsPareto = XLSX.utils.aoa_to_sheet(paretoRows);
      XLSX.utils.book_append_sheet(wb, wsPareto, 'Product_Pareto');

      // 5. Data Governance & Limitations Sheet
      const govRows = [
        ['Governance Pillar', 'Observed Reality', 'Engineering Handling', 'Interview Defense Talking Point'],
        ['Dataset Provenance', 'Public UCI Online Retail II (2009-2011)', 'Treated as retrospective observational logs', 'Never claim proprietary client impact; frame as hypotheses to test'],
        ['Unregistered Guest Checkouts', '22.8% of rows lack Customer ID', 'Surrogate key customer_key = -1 in fact_sales', 'Prevents an 18% revenue omission while preserving clean cohort denominators'],
        ['Cost of Goods Sold (COGS)', 'Wholesale purchase costs absent', 'Standard 40% margin proxy with sensitivity toggle', 'Transparently disclose ERP limitation and test margin sensitivity'],
        ['Cancellations & Returns', 'Prefixed with C in InvoiceNo', 'Separated into is_cancellation flag', 'Enables SKU return velocity without distorting gross customer demand']
      ];
      const wsGov = XLSX.utils.aoa_to_sheet(govRows);
      XLSX.utils.book_append_sheet(wb, wsGov, 'Governance_Limitations');

      // Trigger browser download
      XLSX.writeFile(wb, 'RetailIQ_Executive_Summary.xlsx');

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate Excel workbook:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>Executive Reporting</span>
              <span aria-hidden="true">·</span>
              <span>Automated Excel Summary Workbook</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">Multi-Sheet openpyxl / xlsx</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Excel Summary Workbook Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Instant generation of an executive multi-tab Excel workbook formatted with formulas, metadata headers, and data governance limits. Generates directly in your browser or via the Python automation script (`excel/generate_workbook.py`).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadWorkbook}
              disabled={downloading}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-2 shadow-xs"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Workbook Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .xlsx Workbook</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5 Tabs Summary Pill Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-900">1. Executive_KPIs</div>
            <div className="text-2xs text-slate-500 mt-0.5">Top-line financial metrics</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-900">2. Monthly_Trends</div>
            <div className="text-2xs text-slate-500 mt-0.5">24-month revenue ledger</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-900">3. RFM_Segments</div>
            <div className="text-2xs text-slate-500 mt-0.5">11-segment CRM matrix</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-900">4. Product_Pareto</div>
            <div className="text-2xs text-slate-500 mt-0.5">ABC revenue &amp; returns</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-900">5. Governance</div>
            <div className="text-2xs text-slate-500 mt-0.5">Analytical limitations</div>
          </div>
        </div>
      </div>

      {/* Interactive Sheet Preview */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Table2 className="w-4 h-4 text-blue-600" />
              <span>Workbook In-Browser Sheet Preview</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select any tab to review the exact tabular layout packaged into the downloaded `.xlsx`.
            </p>
          </div>

          {/* Sheet Selector */}
          <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSheetPreview('kpi')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeSheetPreview === 'kpi' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Executive KPIs
            </button>
            <button
              onClick={() => setActiveSheetPreview('monthly')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeSheetPreview === 'monthly' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly Trends
            </button>
            <button
              onClick={() => setActiveSheetPreview('rfm')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeSheetPreview === 'rfm' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              RFM Segments
            </button>
            <button
              onClick={() => setActiveSheetPreview('pareto')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeSheetPreview === 'pareto' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Product Pareto
            </button>
            <button
              onClick={() => setActiveSheetPreview('governance')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeSheetPreview === 'governance' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              Governance
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          {activeSheetPreview === 'kpi' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-mono">
                <tr>
                  <th className="py-2.5 px-3">Metric Name</th>
                  <th className="py-2.5 px-3 text-right">Value</th>
                  <th className="py-2.5 px-3">Unit / Format</th>
                  <th className="py-2.5 px-3 font-sans">Analytical Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Gross Revenue</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">£2,154,820.00</td>
                  <td className="py-2.5 px-3 text-slate-500">£ Currency</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">Total invoice lines excluding cancellations and fees</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Net Realized Revenue</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">£1,842,500.00</td>
                  <td className="py-2.5 px-3 text-slate-500">£ Currency</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">Gross revenue minus refund credit adjustments</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Estimated Gross Margin (40%)</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">£737,000.00</td>
                  <td className="py-2.5 px-3 text-slate-500">£ Currency</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">Net revenue × 40% retail margin baseline</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Total Orders / Invoices</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">44,180</td>
                  <td className="py-2.5 px-3 text-slate-500">Count</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">Distinct completed orders across 2 operating years</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Average Order Value (AOV)</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">£41.70</td>
                  <td className="py-2.5 px-3 text-slate-500">£ / Order</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">Gross merchandise spend divided by total orders</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Overall Return Rate</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">2.14%</td>
                  <td className="py-2.5 px-3 text-slate-500">Percentage %</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">Cancelled units divided by gross units sold</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeSheetPreview === 'monthly' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-mono">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3 text-right">Net Revenue (£)</th>
                  <th className="py-2.5 px-3 text-right">Orders</th>
                  <th className="py-2.5 px-3 text-right">AOV (£)</th>
                  <th className="py-2.5 px-3 text-right">Return Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
                {MONTHLY_METRICS.slice(12, 18).map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{m.month}</td>
                    <td className="py-2.5 px-3 text-right font-bold">£{m.netRevenue.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">{m.orders}</td>
                    <td className="py-2.5 px-3 text-right">£{m.aov.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right">{m.returnRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetPreview === 'rfm' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-mono">
                <tr>
                  <th className="py-2.5 px-3">Segment Name</th>
                  <th className="py-2.5 px-3 text-right">Accounts</th>
                  <th className="py-2.5 px-3 text-right">Net Revenue (£)</th>
                  <th className="py-2.5 px-3 text-right">Avg Recency</th>
                  <th className="py-2.5 px-3 font-sans">CRM Action Playbook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
                {RFM_SEGMENTS.slice(0, 5).map((s) => (
                  <tr key={s.name} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-3 text-right">{s.customerCount}</td>
                    <td className="py-2.5 px-3 text-right font-bold">£{s.totalRevenue.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">{s.avgRecencyDays}d</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600 truncate max-w-xs">{s.actionPlaybook}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetPreview === 'pareto' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-mono">
                <tr>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 font-sans">Description</th>
                  <th className="py-2.5 px-3 text-center">Class</th>
                  <th className="py-2.5 px-3 text-right">Units Sold</th>
                  <th className="py-2.5 px-3 text-right">Net Revenue (£)</th>
                  <th className="py-2.5 px-3 text-right">Return Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
                {PRODUCT_METRICS.slice(0, 5).map((p) => (
                  <tr key={p.stockCode} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{p.stockCode}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{p.description}</td>
                    <td className="py-2.5 px-3 text-center">Class {p.abcClass}</td>
                    <td className="py-2.5 px-3 text-right">{p.unitsSold.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold">£{p.netRevenue.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">{p.returnRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetPreview === 'governance' && (
            <table className="w-full text-xs text-left font-sans">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Governance Pillar</th>
                  <th className="py-2.5 px-3 font-semibold">Observed Reality</th>
                  <th className="py-2.5 px-3 font-semibold">Engineering Handling</th>
                  <th className="py-2.5 px-3 font-semibold">Interview Defense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Missing Customer IDs</td>
                  <td className="py-2.5 px-3">22.8% null in raw logs</td>
                  <td className="py-2.5 px-3 font-mono">customer_key = -1</td>
                  <td className="py-2.5 px-3 text-slate-600">Preserves 18% revenue while protecting cohort denominators</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Cost of Goods Sold</td>
                  <td className="py-2.5 px-3">No purchase cost in dataset</td>
                  <td className="py-2.5 px-3 font-mono">40% margin proxy</td>
                  <td className="py-2.5 px-3 text-slate-600">Transparently state proxy; test margin sensitivity</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Cancellations</td>
                  <td className="py-2.5 px-3">Prefixed with 'C' in Invoice</td>
                  <td className="py-2.5 px-3 font-mono">is_cancellation flag</td>
                  <td className="py-2.5 px-3 text-slate-600">Enables SKU return velocity without corrupting gross sales demand</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
