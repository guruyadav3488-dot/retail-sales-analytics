import React from 'react';
import { Download, FileSpreadsheet, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportExcel: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onExportExcel
}) => {
  const navItems = [
    { id: 'executive', label: 'Executive' },
    { id: 'cohorts', label: 'Cohorts' },
    { id: 'rfm', label: 'RFM Segments' },
    { id: 'pareto', label: 'Pareto & Basket' },
    { id: 'forecast', label: 'Forecasting' },
    { id: 'hypotheses', label: 'Hypotheses' },
    { id: 'sql', label: 'SQL Studio' },
    { id: 'powerbi', label: 'Power BI & DAX' },
    { id: 'excel', label: 'Excel Studio' },
    { id: 'interview', label: 'Interview Defense' },
    { id: 'repo', label: 'Repo Code' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('executive')}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-sm inline-block"></span>
              RetailIQ
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs font-semibold ${
                    isActive
                      ? 'text-slate-900 border-slate-900'
                      : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-4 overflow-x-auto py-2 border-t border-slate-100 text-xs text-slate-600 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 px-2 py-1 rounded ${
                activeTab === item.id ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
