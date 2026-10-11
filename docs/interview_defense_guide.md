# RetailIQ Mentor Guide: Technical Interview Defense Playbook

This playbook prepares you to answer difficult, probing questions during data analyst, analytics engineer, and business intelligence interviews.

---

## Category 1: Data Cleaning & Edge Cases

### Question 1: "Why are there negative quantities and negative prices in the raw dataset? How did you handle them?"
- **Weak Answer**: "I just deleted all negative values using `.query('Quantity > 0')`."
  *(Why this fails: Interviewers know you discarded cancellations and refunds without considering their financial impact).*
- **Strong Senior Response**: 
  > "In the UCI Online Retail II dataset, negative quantities signify either order cancellations (invoices prefixed with 'C') or operational stock inventory adjustments. Negative prices represent bad debt corrections. 
  > I handled this by creating explicit boolean flags in my staging layer: `is_cancellation` and `is_adjustment`. For gross demand analysis, we filter out cancellations; but for net revenue and cash reconciliation, we retain cancellations as negative line items. Furthermore, I engineered a SKU-level Return Velocity metric to identify which specific products suffered from abnormal return rates."

---

### Question 2: "What did you do with the 22% of rows where `Customer ID` is missing?"
- **Weak Answer**: "I dropped them because you can't do customer analytics without a customer ID."
- **Strong Senior Response**:
  > "Dropping null customer IDs at the ingestion phase would silently erase roughly 18% of total recorded revenue, producing flawed executive financial dashboards. 
  > I implemented Kimball-style dimensional handling: in `fact_sales`, transactions without a customer ID are assigned `customer_key = -1` corresponding to 'Unregistered Guest'. This preserves 100% financial accuracy for top-line revenue, daily sales, and product Pareto charts. However, when building customer-grain models like RFM segmentation and Monthly Cohort Retention, we explicitly filter for registered customers (`customer_key != -1`), because pseudo-imputing guest accounts would distort repeat rate and retention curves."

---

## Category 2: Metrics & Business Logic

### Question 3: "Why did you use quantile-based RFM instead of K-Means clustering?"
- **Weak Answer**: "Quantiles were easier to write in SQL."
- **Strong Senior Response**:
  > "While unsupervised K-Means is mathematically interesting, it suffers from two major real-world flaws in retail analytics:
  > 1. Transactional data is heavily right-skewed. Even with log transformations, K-Means produces cluster centroids that shift every time you retrain the model, making ongoing CRM campaigns unstable.
  > 2. Business stakeholders cannot intuitively act on arbitrary cluster labels like 'Cluster 4 with center (0.8, -0.2)'. 
  > Quantile RFM (scoring 1 through 5) provides monotonic, deterministic scoring that maps directly into intuitive marketing archetypes—such as 'At Risk' (high spend, lapsed recency) versus 'Champions' (high recency, high frequency, high spend). It establishes a shared language between analytics and growth teams."

---

### Question 4: "Why did you frame your business recommendations as 'hypotheses to test' rather than claims of business impact?"
- **Weak Answer**: "Because I didn't work at the company."
- **Strong Senior Response**:
  > "Academic integrity and sound analytics engineering demand that we distinguish between observational data patterns and verified causal interventions. In observational retail logs, we can observe that customers who buy greeting cards have higher LTV, but that doesn't prove that pushing greeting cards causes higher LTV—it may just reflect an underlying gift-buyer persona.
  > By framing recommendations as testable hypotheses complete with randomized A/B test designs, sample size requirements (MDE), and guardrail metrics, I show hiring managers that I think like an experimentation-driven analyst who understands causation vs. correlation."

---

## Category 3: Data Modeling & Scalability

### Question 5: "How does your SQLite schema translate to a modern enterprise data warehouse like Snowflake or BigQuery?"
- **Strong Senior Response**:
  > "The queries are structured using ANSI SQL-92/99 CTEs and window functions, matching the exact staging, intermediate, and marts pattern used in dbt (data build tool).
  > - `stg_retail_transactions`: Data type casting, uppercase cleanup, cancellation flagging.
  > - `int_customer_orders`: Rollup of invoices at the customer-order grain.
  > - `fct_sales` and dimensional tables (`dim_customer`, `dim_product`, `dim_date`): Star schema dimensional model.
  > Moving to Snowflake simply requires pointing the dbt profiles to Snowflake warehouse, changing date string parsing to `DATE_TRUNC()` or `TO_DATE()`, and enabling clustering keys on `invoice_date` and `customer_key`."
