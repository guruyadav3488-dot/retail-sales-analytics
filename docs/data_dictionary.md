# RetailIQ Data Dictionary

This document details raw, interim, and dimensional star schema fields used throughout the RetailIQ pipeline.

---

## 1. Raw Dataset (`online_retail_II.xlsx`)

| Field | Raw Type | Description | Observed Data Quality Issues | Handling Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `Invoice` | String / Int | 6-digit transaction identifier. Prefixed with `'C'` if cancelled. | Cancellations prefix `'C'`, some alphanumeric internal codes (`TEST`, `ADJUST`). | Strip test codes; separate normal sales from cancellations (`is_cancellation = Invoice.startswith('C')`). |
| `StockCode` | String | 5-digit integral product code, optionally followed by an ASCII letter. | Special non-product codes: `POST` (Postage), `D` (Discount), `M` (Manual), `BANK CHARGES`, `CRUK`, `AMAZONFEE`. | Segregate non-inventory adjustments into administrative transactions. |
| `Description` | String | Nominal product name in uppercase text. | Missing in ~4,382 rows; lower-case audit notes (`damaged`, `check`, `lost in space`, `found`). | Impute missing descriptions from known `StockCode` map; filter out audit strings. |
| `Quantity` | Integer | Quantity of each product per transaction. | Negative values correspond to cancellations, damages, or stock corrections. | Enforce `Quantity > 0` for gross demand; pair negative values with cancellations. |
| `InvoiceDate` | Timestamp | Date and time when transaction was generated. | Distributed between 2009-12-01 07:45 and 2011-12-09 12:50. Standard UK business hours. | Cast to UTC standard datetime; extract date keys (`DateKey` YYYYMMDD). |
| `Price` | Float | Unit price per product in GBP (£). | Negative prices exist (e.g. bad debt adjustment), zero prices for giveaways/samples. | Filter `Price > 0.00` for commercial sales; treat zero price as free promotional samples. |
| `Customer ID` | Float | 5-digit unique integral customer identifier. | Missing in ~22.8% of rows (~243,007 transactions) due to guest checkouts. | Retain in aggregate financial tables (`Customer_Key = -1` for Guest); exclude from customer-grain models (RFM, Cohorts). |
| `Country` | String | Country of residence / delivery destination. | 43 distinct countries; ~90% United Kingdom. Some ambiguous entries (`Unspecified`). | Standardize ISO names; create `Market_Segment` ('Domestic UK' vs 'International Export'). |

---

## 2. Processed Dimensional Star Schema (`data/processed/`)

```text
       ┌──────────────────────┐
       │     dim_customer     │
       ├──────────────────────┤
       │ customer_key (PK)    │
       │ customer_id          │
       │ country              │
       │ first_order_date     │
       │ rfm_segment          │
       └──────────┬───────────┘
                  │ 1
                  │
                  │ *
       ┌──────────┴───────────┐         1 ┌──────────────────────┐
       │      fact_sales      ├───────────┤     dim_product      │
       ├──────────────────────┤           ├──────────────────────┤
       │ sales_key (PK)       │           │ product_key (PK)     │
       │ invoice_no           │           │ stock_code           │
       │ line_item_id         │           │ description          │
       │ date_key (FK)        │           │ category             │
       │ customer_key (FK)    │           │ unit_cost_proxy      │
       │ product_key (FK)     │           └──────────────────────┘
       │ quantity             │
       │ unit_price           │           1 ┌──────────────────────┐
       │ gross_amount         │───────────┤       dim_date       │
       │ discount_amount      │           ├──────────────────────┤
       │ net_amount           │           │ date_key (PK)        │
       │ is_cancellation      │           │ calendar_date        │
       └──────────────────────┘           │ year                 │
                                          │ quarter              │
                                          │ month_num            │
                                          │ month_name           │
                                          │ day_of_week          │
                                          │ is_weekend           │
                                          └──────────────────────┘
```

### Fact Table: `fact_sales`
- `sales_key`: Surrogate primary key (Auto-increment integer).
- `invoice_no`: Degenerate dimension storing invoice number.
- `date_key`: Integer foreign key matching `dim_date.date_key` (e.g., `20101115`).
- `customer_key`: Foreign key to `dim_customer`. Defaults to `-1` for guest checkouts.
- `product_key`: Foreign key to `dim_product`.
- `quantity`: Signed integer. Positive for sales, negative for refunds.
- `unit_price`: Selling price per unit (£).
- `gross_amount`: `quantity * unit_price`.
- `net_amount`: Net monetary exchange after refund adjustments.
- `gross_margin_proxy`: Estimated contribution margin (£) based on 40% margin baseline.
- `is_cancellation`: Boolean flag (`TRUE` if invoice starts with 'C').
