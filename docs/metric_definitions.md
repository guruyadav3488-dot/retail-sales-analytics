# RetailIQ Formal Metric Definitions

This document contains mathematical formulas, grain definitions, and edge case rules for all business metrics computed by RetailIQ.

---

## 1. Top-Line Commercial Metrics

### Gross Revenue (£)
$$\text{Gross Revenue} = \sum_{i \in \text{Sales}} (\text{Quantity}_i \times \text{Price}_i) \quad \text{where } \text{Quantity}_i > 0 \land \text{Price}_i > 0$$
- **Grain**: Transaction line item.
- **Edge cases**: Excludes postage fees, bad debt corrections, and cancellations.

### Net Revenue (£)
$$\text{Net Revenue} = \text{Gross Revenue} - \left| \sum_{j \in \text{Cancellations}} (\text{Quantity}_j \times \text{Price}_j) \right|$$
- **Grain**: Aggregate over calendar period.
- **Edge cases**: Includes matched refund credits.

### Average Order Value (AOV)
$$\text{AOV} = \frac{\text{Gross Revenue}}{\text{Count of Distinct Orders}}$$
- **Order Definition**: Grouping by `Invoice` number. Multiple items in the same invoice constitute a single order.

### Return Rate (%)
$$\text{Return Rate} = \frac{\sum |\text{Cancelled Units}|}{\sum \text{Gross Sold Units} + \sum |\text{Cancelled Units}|} \times 100$$
- **SKU Grain Return Rate**: Evaluated at `StockCode` level to detect fragile products or misleading product descriptions.

---

## 2. Customer Cohort & Behavioral Metrics

### Monthly Cohort Definition
- **Customer Acquisition Month ($M_0$)**:
  $$\text{Cohort Month}_c = \min_{t \in \text{Orders}_c} \left( \text{DATE\_TRUNC}(\text{Month}, \text{InvoiceDate}_t) \right)$$
- **Cohort Retention Rate at Month $k$**:
  $$\text{Retention Rate}_{c, k} = \frac{|\text{Active Customers in Cohort } c \text{ at Month } (M_0 + k)|}{|\text{Total Distinct Customers in Cohort } c \text{ at } M_0|} \times 100$$

### Repeat Purchase Rate (%)
$$\text{Repeat Rate} = \frac{|\{c \in \text{Customers} \mid \text{Order Count}_c \ge 2\}|}{|\text{Total Distinct Registered Customers}|} \times 100$$

---

## 3. RFM Scoring Architecture

1. **Recency ($R$)**: Days between the analysis anchor date ($T_{\text{max}} + 1\text{ day}$) and the customer's most recent valid order date:
   $$R_c = \text{DateDiff}(T_{\text{max}}, \max(\text{InvoiceDate}_c))$$
2. **Frequency ($F$)**: Total count of distinct valid completed orders placed by customer $c$:
   $$F_c = \text{COUNT}(\text{DISTINCT } \text{Invoice}_c)$$
3. **Monetary ($M$)**: Total net spend (£) across all valid orders:
   $$M_c = \sum (\text{Quantity}_{c,i} \times \text{Price}_{c,i})$$

### Quintile Scoring ($1$ to $5$):
- $R_{\text{score}}$: Rank quintiles (5 = lowest days ago / most recent, 1 = oldest).
- $F_{\text{score}}$: Rank quintiles (5 = highest order frequency, 1 = single order).
- $M_{\text{score}}$: Rank quintiles (5 = highest total monetary spend, 1 = lowest spend).

### Customer Segment Mapping:
| Segment Name | RFM Rule Condition | Business Description |
| :--- | :--- | :--- |
| **Champions** | $R \in [4,5] \land F \in [4,5] \land M \in [4,5]$ | High-frequency, high-spend, purchased recently. |
| **Loyal Customers** | $R \in [3,5] \land F \in [3,5] \land M \in [3,5]$ | Consistently reorder with dependable order value. |
| **Potential Loyalists**| $R \in [4,5] \land F \in [2,3] \land M \in [2,4]$ | Recent buyers with above-average spend; ready for cross-sell. |
| **Recent Customers** | $R \in [4,5] \land F = 1$ | First-time purchasers needing onboarding sequences. |
| **Promising** | $R \in [3,4] \land F \in [1,2] \land M \in [2,4]$ | Recent buyers who spent moderate amounts. |
| **Customers Needing Attention** | $R = 3 \land F \in [2,3] \land M \in [2,3]$ | Average recency and spend; danger of lapsing. |
| **About to Sleep** | $R \in [2,3] \land F \le 2 \land M \le 2$ | Below average recency and frequency; churn warning. |
| **At Risk** | $R \le 2 \land F \in [3,5] \land M \in [3,5]$ | Former heavy buyers who haven't ordered recently. High churn risk! |
| **Cannot Lose Them** | $R = 1 \land F \in [4,5] \land M \in [4,5]$ | Top historical spenders who have stopped ordering completely. |
| **Hibernating** | $R \in [1,2] \land F \in [1,2] \land M \in [1,2]$ | Inactive customers with low historical engagement. |
| **Lost** | $R = 1 \land F = 1 \land M = 1$ | Lowest scores across all metrics. |
