# RetailIQ: Production-Grade Retail Analytics & Intelligence Product

> **Executive Positioning & Academic Integrity**:  
> RetailIQ is a working end-to-end analytics engineering product built on the public **UCI "Online Retail II" (2009–2011)** dataset. It does **not** represent proprietary data from an active commercial retailer, and was not deployed into an active business operation. All commercial conclusions are deliberately framed as **testable business hypotheses** with formal experimental designs. A full discussion of dataset biases and analytical boundaries is documented in [Limitations](#limitations).

---

## 1. Project Overview & Business Context

**RetailIQ** transforms raw, semi-structured e-commerce transaction logs into:
1. **Validated & Cleaned Datasets** with automated anomaly detection and business rule enforcement.
2. **Relational Data Models** (Star Schema with Kimball dimensional modeling) portable between SQLite and PostgreSQL.
3. **Core Business Metrics**: Revenue, Gross Margin proxies, Average Order Value (AOV), Repeat Purchase Rate, Customer Acquisition & Churn Velocity.
4. **Behavioral Analytics**: Monthly Cohort Retention matrices and RFM (Recency, Frequency, Monetary) Customer Segmentation.
5. **Operational Forecasting**: Seasonality decomposition capturing Q4 wholesale/giftware demand surges.
6. **Actionable Hypotheses**: Rigorously designed business experiments (A/B testing protocols, MDEs, guardrail metrics) rather than ungrounded claims.

---

## 2. Dataset Provenance & Setup

- **Dataset**: UCI Machine Learning Repository — *Online Retail II* (Dr. Daqing Chen, London South Bank University).
- **Time Range**: 01/12/2009 to 09/12/2011 (2 full operating years).
- **Domain**: UK-based registered non-store online retail selling unique all-occasion giftware. A substantial portion of customers are wholesalers.
- **Volume**: 1,067,371 raw transaction rows across two sheets (`Year 2009-2010` and `Year 2010-2011`).

### Download Instructions:
1. Download the archive from the [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/502/online+retail+ii).
2. Save the file `online_retail_II.xlsx` (or extracted CSVs) into `data/raw/online_retail_II.xlsx`.
3. Run `make ingest` or `python src/retailiq/ingest.py`.

---

## 3. Architecture & Tech Stack

```text
raw/online_retail_II.xlsx
         │
         ▼
[src/retailiq/ingest.py] ──────► data/raw/
         │
         ▼
[src/retailiq/validate.py] ────► Anomaly checks, schema assertion, null audits
         │
         ▼
[src/retailiq/clean.py] ───────► data/interim/ (C-cancellations, bad prices, test SKUs)
         │
         ▼
[src/retailiq/model.py] ───────► data/processed/ (Star Schema Fact/Dims in SQLite / Parquet)
         │
         ├──────────────────────────┬──────────────────────────┐
         ▼                          ▼                          ▼
[metrics.py & cohorts]     [segmentation.py]          [forecasting.py]
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    ▼
                         [recommend.py & report.py]
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
Interactive Streamlit App     Power BI Star Spec        Excel Exec Workbook
(app/app.py)                 (powerbi/build_spec.md)    (excel/generate_workbook.py)
```

- **Languages & Frameworks**: Python 3.11+, SQL (SQLite / PostgreSQL ANSI), React 19 + Tailwind CSS (Live Web Studio).
- **Analytics Libraries**: `pandas`, `numpy`, `scipy`, `statsmodels`, `scikit-learn`, `plotly`, `streamlit`, `openpyxl`.
- **Quality Assurance**: `pytest`, `ruff`, pre-commit verification.

---

## 4. Key Analytical Findings & Business Hypotheses

| Area | Observed Metric / Signal | Testable Business Hypothesis | Test Design & Guardrail |
| :--- | :--- | :--- | :--- |
| **Cohort Retention** | Sharp month-1 cliff (retention drops from 100% to ~21–24%), but plateau stabilizes at ~18% through Month 6. | Implementing a 21-day replenishment prompt for consumable giftware will lift Month-2 repeat rate by +3.5 percentage points. | Randomized controlled trial (50/50 split); Guardrail: Unsubscribe rate < 0.4%. |
| **Wholesale RFM** | Top 4.8% of customers ("Champions" & "Loyal Wholesale") generate 48.2% of total net revenue. | Offering dedicated account rep checkout and volume-tiered bulk pricing will increase quarterly spend by +8%. | Staggered rollout across wholesale accounts (matched pairs); Guardrail: Unit gross margin >= 28%. |
| **Return Rates** | Stock codes in fragile glass/ceramics show return rates exceeding 12.4% (vs 2.1% catalog average). | Improved bubble-pack protective packaging on top-5 return SKUs will reduce return velocity by 35%. | Pre/post packaging intervention trial across fulfillment centers; Guardrail: Fulfillment packaging cost <= £0.18/unit. |
| **Q4 Seasonality** | November revenue is 3.4x higher than February baseline due to pre-Christmas wholesale restocking. | Moving B2B holiday catalog distribution from October 15 to September 15 will smooth warehouse peak congestion. | Regional cohort test (UK South vs UK North); Guardrail: Stockout rate < 2.5%. |

---

## 5. Limitations & Analytic Guardrails

Every credible analytics project must declare its boundaries:
1. **Unregistered Guest Checkouts**: Approximately 22% of rows lack a `Customer ID`. Dropping them for customer-level metrics (RFM, LTV, Cohorts) biases the sample toward registered/wholesale accounts, while keeping them in aggregate financial models ensures revenue completeness.
2. **Missing Cost of Goods Sold (COGS)**: The public dataset contains unit selling prices but no unit purchase costs or shipping carrier costs. Margin metrics in RetailIQ use an industry-standard gross margin proxy (assumed 40% retail markup unless adjusted).
3. **Cancellation Matching**: Invoices prefixed with 'C' indicate cancellations or returns. Without unique return receipt linkage to the original invoice, returns are netted at the customer-month level or matched by stock code within rolling 30-day windows.
4. **B2B vs B2C Blended Nature**: UCI Online Retail II mixes small independent gift shops (wholesalers purchasing in packs of 24–48) with individual retail gift buyers. Threshold segmentation was applied to separate wholesale from retail.

---

## 6. Repository Structure

```text
retailiq/
├── data/
│   ├── raw/                  # Original raw downloads
│   ├── interim/              # Validated, filtered intermediate tables
│   └── processed/            # Final Star Schema Parquet & SQLite databases
├── sql/
│   ├── schema.sql            # DDL for SQLite / PostgreSQL Star Schema
│   ├── transforms/           # Clean, customer-rollup, and cohort transforms
│   └── metrics/              # Executive KPI & Pareto queries
├── src/retailiq/             # Core Python analytical engine
│   ├── ingest.py             # Data loader & extractor
│   ├── validate.py           # Data quality gatekeeper
│   ├── clean.py              # Business rule transformation
│   ├── model.py              # Dimensional Star Schema builder
│   ├── metrics.py            # Financial & cohort calculation
│   ├── segmentation.py       # RFM quantile & behavioral clustering
│   ├── forecasting.py        # Time-series decomposition & baseline forecast
│   ├── recommend.py          # Hypothesis generator & test designer
│   └── report.py             # Executive summary compiler
├── app/
│   └── app.py                # Interactive Streamlit dashboard
├── notebooks/
│   └── 01_eda_and_storytelling.py # Exploratory analysis script & walkthrough
├── powerbi/
│   ├── build_spec.md         # Full visual layout & design guide
│   ├── measures.dax          # 15+ verified DAX measures
│   └── data_model.md         # Entity relationship diagram & cardinality
├── excel/
│   └── generate_workbook.py  # Automated executive workbook builder
├── tests/
│   ├── test_validate.py      # Data validation test suite
│   ├── test_metrics.py       # Metric computation unit tests
│   └── test_segmentation.py  # RFM segment coverage tests
├── docs/
│   ├── data_dictionary.md    # Field-by-field definitions & types
│   ├── decision_log.md       # Architectural ADRs & trade-offs
│   ├── metric_definitions.md # Formal math formulas for all KPIs
│   ├── methodology.md        # Technical statistical methodology
│   └── interview_defense_guide.md # Senior mentor answers for interviews
├── Makefile                  # CLI automation shortcuts
├── requirements.txt          # Python dependency specifications
└── README.md
```

---

## 7. How to Run Locally

```bash
# 1. Clone repository and create virtual environment
git clone https://github.com/your-username/retailiq.git
cd retailiq
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run validation, transformation and tests
make all

# 4. Launch Streamlit interactive app
streamlit run app/app.py
```
