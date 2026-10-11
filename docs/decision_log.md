# RetailIQ Architecture Decision Log (ADRs)

This document records the architectural and statistical decisions made during the development of RetailIQ, formatted as Architecture Decision Records (ADRs). Use this to defend design choices during technical interviews.

---

## ADR-001: Handling Missing `Customer ID` (22.8% of records)
- **Status**: Accepted
- **Context**: In the raw UCI Online Retail II dataset, ~243,000 out of 1.06M records have `NULL` or missing `Customer ID`. Dropping these blindly removes ~18% of total recorded revenue.
- **Decision**: Dual-path modeling:
  1. **Financial & Operational Reporting**: Keep guest transactions in `fact_sales` with a surrogate key `customer_key = -1` (Label: `'Unregistered Guest'`). This ensures executive revenue, inventory, and order volume metrics match full financial reality.
  2. **Customer Behavioral Modeling (RFM & Cohorts)**: Explicitly filter `customer_key != -1`. We do not pseudo-impute guest IDs (e.g., grouping by invoice or IP), because guest checkouts cannot be reliably linked over time and would corrupt repeat purchase and retention curves.
- **Interview Defense**: "Dropping null customer IDs at the beginning of an ETL pipeline causes a silent 18% revenue omission in financial rollups. By using a Kimbal-style unknown surrogate key (-1), we preserve total top-line revenue accuracy while preserving mathematical validity in customer cohort retention."

---

## ADR-002: Treatment of Cancellations (`Invoice` starting with 'C' and negative quantities)
- **Status**: Accepted
- **Context**: Negative quantities correspond to returned goods, order cancellations, or inventory write-offs. A cancellation does not always share the exact same invoice number as the original purchase.
- **Decision**: 
  - Tag rows with `is_cancellation = TRUE` if `Invoice` starts with `'C'` or `Quantity < 0`.
  - For gross sales analytics, filter `is_cancellation = FALSE`.
  - For net sales analytics, sum signed amounts (`Quantity * Price`).
  - Calculate **Return Rate** as `ABS(Cancelled Units) / (Gross Sold Units + ABS(Cancelled Units))`.
- **Interview Defense**: "Separating gross and net metrics prevents misrepresenting gross customer demand while accurately reflecting cash flows. We also compute a SKU-level Return Velocity metric to pinpoint fragile products."

---

## ADR-003: Customer Segmentation: Quantile-Based RFM vs. K-Means Clustering
- **Status**: Accepted
- **Context**: Unsupervised clustering (K-Means) is often used for segmentation, but produces unstable clusters with severe skewness and uninterpretable cluster boundaries for business teams.
- **Decision**: Use **Quintile-Ranked RFM (1–5 scores)** mapped to standard 11 business archetypes (`Champions`, `Loyal`, `Potential Loyalists`, `At Risk`, `Hibernating`, etc.).
- **Consequences**: 
  - Predictable, deterministic rules that business stakeholders (marketing and CRM managers) immediately understand.
  - Zero re-training drift when new data arrives.
  - In our technical comparison module, we demonstrate how log-transformed K-Means aligns with the RFM quantiles, proving theoretical rigor.
- **Interview Defense**: "Business users struggle to act on 'Cluster 3 with centroid (0.42, 1.12)'. Quantile-based RFM provides monotonic, interpretable rules (e.g. Recency 5, Frequency 5) that map directly to marketing workflows. It's stable, deterministic, and defensible."

---

## ADR-004: Portability: SQLite to PostgreSQL ANSI SQL
- **Status**: Accepted
- **Context**: SQLite offers zero-dependency portability for portfolio reviewers and local testing, but enterprise data warehouses use PostgreSQL, Snowflake, or BigQuery.
- **Decision**: Write transformation queries using strictly **ANSI SQL-92/99 compliant CTEs and window functions** (`ROW_NUMBER()`, `DENSE_RANK()`, `SUM() OVER ()`). Avoid SQLite-specific quirks (`strftime` vs `EXTRACT`/`DATE_TRUNC`) by providing SQL macros and explicit dialect comments.
- **Interview Defense**: "All data models rely on modular Common Table Expressions (CTEs) following dbt modeling conventions (staging -> intermediate -> marts). Moving from our SQLite repo to BigQuery or Snowflake is a 1:1 migration without rewriting business logic."

---

## ADR-005: Absence of Cost of Goods Sold (COGS) in Public Data
- **Status**: Accepted
- **Context**: The UCI dataset provides `Price` (unit retail price) but not supplier acquisition cost.
- **Decision**: Explicitly declare an assumed **Gross Margin Proxy (40%)** with configurable sensitivity toggles (30%–50%) in both code and dashboard.
- **Interview Defense**: "Rather than inventing fake cost numbers and claiming real profitability, we modeled a transparent gross margin proxy and tested sensitivity across varying product tiers. In production, this table joins to an ERP standard cost ledger."
