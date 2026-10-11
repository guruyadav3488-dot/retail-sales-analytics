import React, { useState } from 'react';
import { Folder, FileText, Copy, Check, Code2, Terminal, ArrowUpRight } from 'lucide-react';

interface RepoFile {
  path: string;
  category: string;
  language: string;
  content: string;
}

const REPO_FILES: RepoFile[] = [
  {
    path: 'README.md',
    category: 'Documentation',
    language: 'markdown',
    content: `# RetailIQ: Production-Grade Retail Analytics & Intelligence Product

> **Executive Positioning & Academic Integrity**:  
> RetailIQ is a working end-to-end analytics engineering product built on the public **UCI "Online Retail II" (2009–2011)** dataset. All commercial conclusions are framed as **testable business hypotheses** with formal experimental designs.

## Architecture & Tech Stack
- Python 3.11+ (pandas, numpy, scipy, statsmodels, scikit-learn, plotly, streamlit)
- SQL (SQLite / PostgreSQL ANSI)
- Power BI & DAX Specification
- Excel openpyxl Automation
- pytest & ruff Code Quality`
  },
  {
    path: 'sql/schema.sql',
    category: 'SQL Models',
    language: 'sql',
    content: `-- Dimensional Star Schema DDL (Kimball Methodology)
CREATE TABLE IF NOT EXISTS dim_date (
    date_key INT PRIMARY KEY,
    calendar_date DATE NOT NULL,
    year INT NOT NULL,
    quarter INT NOT NULL,
    month_num INT NOT NULL,
    month_name VARCHAR(12) NOT NULL,
    is_weekend BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS dim_customer (
    customer_key INTEGER PRIMARY KEY,
    customer_id INT,
    country VARCHAR(64) NOT NULL,
    market_segment VARCHAR(32) NOT NULL,
    rfm_segment VARCHAR(32) DEFAULT 'New'
);

CREATE TABLE IF NOT EXISTS fact_sales (
    sales_key INTEGER PRIMARY KEY,
    invoice_no VARCHAR(32) NOT NULL,
    date_key INT NOT NULL,
    customer_key INT NOT NULL,
    product_key INT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL,
    net_amount NUMERIC(12, 2) NOT NULL,
    gross_margin_proxy NUMERIC(12, 2) NOT NULL,
    is_cancellation BOOLEAN NOT NULL DEFAULT 0
);`
  },
  {
    path: 'src/retailiq/clean.py',
    category: 'Python Pipeline',
    language: 'python',
    content: `"""
Module: Clean
Cleans raw transaction logs and implements the dual-path customer/financial rules.
"""
import pandas as pd
import numpy as np

def clean_transactions(raw_df: pd.DataFrame) -> pd.DataFrame:
    df = raw_df.copy()
    df["Invoice"] = df["Invoice"].astype(str).str.strip()
    df["StockCode"] = df["StockCode"].astype(str).str.strip()
    
    # Filter negative price anomalies (bad debt adjustments)
    df = df[df["Price"] > 0.0].copy()
    
    # Flag cancellations
    df["is_cancellation"] = df["Invoice"].str.startswith("C") | (df["Quantity"] < 0)
    
    # Line totals
    df["gross_amount"] = np.where(~df["is_cancellation"], df["Quantity"] * df["Price"], 0.0)
    df["net_amount"] = df["Quantity"] * df["Price"]
    df["gross_margin_proxy"] = df["net_amount"] * 0.40
    
    # Fill customer ID (-1 for unregistered guests)
    df["customer_id_clean"] = df["Customer ID"].fillna(-1).astype(int)
    return df`
  },
  {
    path: 'src/retailiq/segmentation.py',
    category: 'Python Pipeline',
    language: 'python',
    content: `"""
Module: Segmentation
Computes Recency, Frequency, Monetary (RFM) quintile scores and business segment archetypes.
"""
import pandas as pd

def compute_rfm_segments(fact_sales: pd.DataFrame, reference_date: str = "2011-12-10") -> pd.DataFrame:
    valid = fact_sales[(fact_sales["customer_key"] > 0) & (~fact_sales["is_cancellation"])].copy()
    valid["invoice_date"] = pd.to_datetime(valid["invoice_timestamp"])
    ref_dt = pd.to_datetime(reference_date)

    rfm = valid.groupby("customer_key").agg(
        recency_days=("invoice_date", lambda dates: (ref_dt - dates.max()).days),
        frequency=("invoice_no", "nunique"),
        monetary=("net_amount", "sum")
    ).reset_index()

    # Quintile scoring (1 to 5)
    rfm["r_score"] = pd.qcut(rfm["recency_days"], q=5, labels=[5, 4, 3, 2, 1]).astype(int)
    rfm["f_score"] = pd.qcut(rfm["frequency"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
    rfm["m_score"] = pd.qcut(rfm["monetary"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
    return rfm`
  },
  {
    path: 'powerbi/measures.dax',
    category: 'Power BI & DAX',
    language: 'dax',
    content: `[Gross Revenue] = 
CALCULATE(
    SUM(fact_sales[gross_amount]),
    fact_sales[is_cancellation] = FALSE
)

[Net Revenue] = 
SUM(fact_sales[net_amount])

[Return Rate %] = 
DIVIDE(
    CALCULATE(ABS(SUM(fact_sales[quantity])), fact_sales[is_cancellation] = TRUE),
    [Gross Units Sold] + [Returned Units],
    0
)

[Net Revenue YoY Growth %] = 
VAR CurrentRevenue = [Net Revenue]
VAR PriorYearRevenue = 
    CALCULATE(
        [Net Revenue],
        SAMEPERIODLASTYEAR(dim_date[calendar_date])
    )
RETURN
    DIVIDE(CurrentRevenue - PriorYearRevenue, PriorYearRevenue, 0)`
  },
  {
    path: 'tests/test_validate.py',
    category: 'Test Suites',
    language: 'python',
    content: `"""
Tests for Data Validation module.
"""
import pytest
import pandas as pd
from src.retailiq.validate import audit_data_quality, validate_schema

def test_audit_data_quality():
    df = pd.DataFrame({
        "Invoice": ["536365", "C536366"],
        "StockCode": ["85123A", "84879"],
        "Quantity": [6, -1],
        "Price": [2.55, 1.69],
        "Customer ID": [17850.0, None]
    })
    report = audit_data_quality(df)
    assert report["total_rows"] == 2
    assert report["missing_customer_count"] == 1
    assert report["cancellation_invoices_count"] == 1`
  },
  {
    path: 'docs/decision_log.md',
    category: 'Architecture ADRs',
    language: 'markdown',
    content: `# Architecture Decision Records (ADRs)

## ADR-001: Dual-Path Handling of Missing Customer IDs
- Context: 22.8% of rows lack Customer ID (~18% of revenue).
- Decision: Surrogate key customer_key = -1 in fact_sales preserves 100% financial revenue completeness, while filtering customer_key != -1 in cohorts prevents repeat distortion.

## ADR-003: Quantile RFM vs K-Means
- Decision: Quantile 1-5 rankings provide monotonic, deterministic rules that map directly into CRM business operations with zero retraining drift.`
  }
];

export const RepoExplorerView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = REPO_FILES[selectedFileIndex] || REPO_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
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
              <span>Repository Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Git-Ready Directory Structure</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-semibold">Python · SQL · DAX · Tests</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              RetailIQ Codebase &amp; Project Assets
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Inspect the exact production scripts generated for this portfolio product. Everything is fully created on disk and ready to be run locally with `make all` or `pytest`.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'File Copied' : 'Copy File Content'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: File Explorer Sidebar & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left File Tree Sidebar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Folder className="w-4 h-4 text-blue-600" />
            <span>Repository Files</span>
          </div>

          <div className="space-y-1">
            {REPO_FILES.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2 rounded text-xs font-mono transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{file.path}</span>
                  <span className="text-3xs opacity-60 ml-2 shrink-0">{file.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-3 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 overflow-hidden font-mono text-xs flex flex-col">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{activeFile.path}</span>
            </div>
            <span className="text-3xs text-slate-400 uppercase font-sans">
              Language: {activeFile.language}
            </span>
          </div>

          <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed scrollbar-thin">
            <pre className="text-slate-300 selection:bg-blue-600">
              {activeFile.content}
            </pre>
          </div>

          <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-3xs text-slate-400 font-sans">
            <span>Category: {activeFile.category}</span>
            <span>UTF-8 · Ready to run with Python 3.11+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
