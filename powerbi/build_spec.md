# Power BI Report Build Specification: RetailIQ

This document is the exact build blueprint for reproducing the RetailIQ Executive Suite in Microsoft Power BI Desktop.

---

## 1. Canvas & Canvas Architecture

- **Page Size**: 16:9 Standard (1280 × 720 px)
- **Theme**: Executive Clean Slate (Off-white canvas `#F8FAFC`, Dark Slate `#0F172A`, Accent Blue `#2563EB`, Success `#16A34A`, Warning `#D97706`, Error `#DC2626`)
- **Typography**: Segoe UI / Plus Jakarta Sans, with tabular figures for cards and KPI matrices.

---

## 2. Multi-Page Architecture

### Page 1: Executive Overview (`Executive_Summary`)
- **Top Row (KPI Cards)**:
  1. `[Net Revenue]` with trend sparkline and YoY variance.
  2. `[Total Orders]` with monthly target bar.
  3. `[Average Order Value (AOV)]`.
  4. `[Estimated Gross Margin (£)]` (40% proxy).
  5. `[Overall Return Rate %]`.
- **Center-Left Visual**: Clustered column & line chart: `Monthly Net Revenue` (Bars) vs `YoY Growth %` (Line).
- **Center-Right Visual**: Donut Chart: `Revenue by Market Segment` ('Domestic UK' vs 'International Export').
- **Bottom Visual**: Table visual of Top 10 High-Growth Product Categories with Data Bars for Gross Margin.

### Page 2: Customer Cohort Retention (`Cohort_Matrix`)
- **Primary Visual**: Matrix visual:
  - **Rows**: `dim_customer[Cohort Month]` (Format: `YYYY-MM`).
  - **Columns**: `Calculation[Month Offset]` ($0, 1, 2, \dots, 12$).
  - **Values**: `[Cohort Retention %]`.
  - **Conditional Formatting**: Background color scale (White to Deep Slate Blue `#1E3A8A`) based on values $0\%$ to $100\%$.
- **Secondary Visual**: Line Chart: `Average Retention Curve` across all cohorts showing the Month 1 drop-off and Month 6 plateau.

### Page 3: RFM Customer Segmentation (`RFM_Intelligence`)
- **Primary Visual**: Treemap or Scatter Plot:
  - **Category**: `dim_customer[rfm_segment]`.
  - **Size**: `[Net Revenue]`.
  - **Color**: `[Average Recency Days]`.
- **Segment Drill-Through Card**: Shows count of customers, average spend, and recommended business playbook (e.g., VIP Wholesale treatment for Champions, win-back discounts for At Risk).

### Page 4: Product Pareto & Return Risk (`Product_Pareto`)
- **Primary Visual**: Pareto Chart:
  - **X-axis**: `dim_product[StockCode]` sorted by Net Revenue descending.
  - **Y-axis 1**: `[Net Revenue]` (Columns).
  - **Y-axis 2**: `[Cumulative Revenue %]` (Line with reference band at 80%).
- **Secondary Visual**: Scatter Plot: `Unit Return Rate %` (Y) vs `Units Sold` (X) to detect fragile high-volume ceramic/glass outliers.

---

## 3. Data Ingestion Instructions in Power BI
1. Open Power BI Desktop -> **Get Data** -> **Folder** (or SQLite ODBC / Parquet).
2. Point to `data/processed/` and import:
   - `fact_sales.parquet`
   - `dim_date.parquet`
   - `dim_customer.parquet`
   - `dim_product.parquet`
3. In Model View, establish relationships as described in `powerbi/data_model.md`.
