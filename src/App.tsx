/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { TopBar } from './components/TopBar';
import { ExecutiveView } from './components/ExecutiveView';
import { CohortMatrixView } from './components/CohortMatrixView';
import { RFMView } from './components/RFMView';
import { ProductParetoView } from './components/ProductParetoView';
import { ForecastingView } from './components/ForecastingView';
import { HypothesesView } from './components/HypothesesView';
import { SqlStudioView } from './components/SqlStudioView';
import { PowerBiSpecView } from './components/PowerBiSpecView';
import { ExcelStudioView } from './components/ExcelStudioView';
import { InterviewDefenseView } from './components/InterviewDefenseView';
import { RepoExplorerView } from './components/RepoExplorerView';
import { MONTHLY_METRICS, RFM_SEGMENTS, PRODUCT_METRICS } from './data/retailDataset';
import { Info, Download, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('executive');

  const handleGlobalExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Executive KPIs
      const kpiRows = [
        ['Metric Name', 'Value', 'Unit', 'Methodology'],
        ['Gross Revenue', 2154820.0, '£ GBP', 'Total sales excluding cancellations'],
        ['Net Realized Revenue', 1842500.0, '£ GBP', 'Gross revenue less refund adjustments'],
        ['Estimated Gross Margin', 737000.0, '£ GBP', 'Net revenue × 40% retail markup proxy'],
        ['Total Orders', 44180, 'Invoices', 'Distinct transactions'],
        ['Average Order Value (AOV)', 41.7, '£ / Order', 'Gross spend / orders'],
        ['Return Rate', 2.14, 'Percent %', 'Cancelled units / gross units'],
        ['Repeat Purchase Rate', 71.8, 'Percent %', 'Registered customers with >= 2 orders']
      ];
      const wsKpi = XLSX.utils.aoa_to_sheet(kpiRows);
      XLSX.utils.book_append_sheet(wb, wsKpi, 'Executive_KPIs');

      // Monthly
      const monthlyRows = [
        ['Month', 'Gross Rev (£)', 'Net Rev (£)', 'Orders', 'Sold Units', 'Returned Units', 'AOV (£)', 'Return Rate (%)'],
        ...MONTHLY_METRICS.map((m) => [m.month, m.grossRevenue, m.netRevenue, m.orders, m.soldUnits, m.returnedUnits, m.aov, m.returnRate])
      ];
      const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyRows);
      XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly_Trends');

      // RFM
      const rfmRows = [
        ['Segment', 'Customers', 'Cust %', 'Revenue (£)', 'Revenue %', 'Avg Recency', 'Avg Frequency', 'Playbook'],
        ...RFM_SEGMENTS.map((s) => [s.name, s.customerCount, s.pctOfCustomers, s.totalRevenue, s.pctOfRevenue, s.avgRecencyDays, s.avgFrequency, s.actionPlaybook])
      ];
      const wsRfm = XLSX.utils.aoa_to_sheet(rfmRows);
      XLSX.utils.book_append_sheet(wb, wsRfm, 'RFM_Segments');

      XLSX.writeFile(wb, 'RetailIQ_Executive_Summary.xlsx');
    } catch (err) {
      console.error(err);
      setActiveTab('excel');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* 3-Zone Navigation Header */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportExcel={handleGlobalExportExcel}
      />

      {/* Main Content Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'executive' && (
          <ExecutiveView onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'cohorts' && (
          <CohortMatrixView onNavigateToHypotheses={() => setActiveTab('hypotheses')} />
        )}

        {activeTab === 'rfm' && (
          <RFMView onNavigateToHypotheses={() => setActiveTab('hypotheses')} />
        )}

        {activeTab === 'pareto' && <ProductParetoView />}

        {activeTab === 'forecast' && (
          <ForecastingView onNavigateToHypotheses={() => setActiveTab('hypotheses')} />
        )}

        {activeTab === 'hypotheses' && <HypothesesView />}

        {activeTab === 'sql' && <SqlStudioView />}

        {activeTab === 'powerbi' && <PowerBiSpecView />}

        {activeTab === 'excel' && <ExcelStudioView />}

        {activeTab === 'interview' && <InterviewDefenseView />}

        {activeTab === 'repo' && <RepoExplorerView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">RetailIQ Analytics Product</span>
            <span>·</span>
            <span>UCI Online Retail II Public Dataset (2009–2011)</span>
          </div>
          <div className="flex items-center gap-4 text-2xs">
            <button
              onClick={() => setActiveTab('hypotheses')}
              className="hover:text-slate-900 transition-colors"
            >
              Hypotheses &amp; Limitations
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('interview')}
              className="hover:text-slate-900 transition-colors"
            >
              Interview Defense Playbook
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('repo')}
              className="hover:text-slate-900 transition-colors"
            >
              Code Repository
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
