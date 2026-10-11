# Power BI Data Model Blueprint: Star Schema

```text
                  ┌──────────────────────────────┐
                  │          dim_date            │
                  ├──────────────────────────────┤
                  │ date_key (PK) [Int]          │
                  │ calendar_date [Date]         │
                  │ year, quarter, month, day    │
                  └──────────────┬───────────────┘
                                 │ 1
                                 │
                                 │ *
┌────────────────────────┐       │       ┌────────────────────────┐
│      dim_customer      │       │       │      dim_product       │
├────────────────────────┤       │       ├────────────────────────┤
│ customer_key (PK) [Int]│ 1   * │     1 │ product_key (PK) [Int] │
│ customer_id            ├───────┼───────┤ stock_code             │
│ country                │       │       │ description            │
│ market_segment         │       │       │ unit_cost_proxy        │
└────────────────────────┘       │       └────────────────────────┘
                                 ▼
                  ┌──────────────────────────────┐
                  │          fact_sales          │
                  ├──────────────────────────────┤
                  │ sales_key (PK)               │
                  │ invoice_no                   │
                  │ date_key (FK)                │
                  │ customer_key (FK)            │
                  │ product_key (FK)             │
                  │ quantity                     │
                  │ unit_price                   │
                  │ gross_amount                 │
                  │ net_amount                   │
                  │ gross_margin_proxy           │
                  │ is_cancellation              │
                  └──────────────────────────────┘
```

## Relationships:
1. `dim_date[date_key]` $\to$ `fact_sales[date_key]`: **1 to Many (1:\*)**, Single Direction cross-filter, Active.
2. `dim_customer[customer_key]` $\to$ `fact_sales[customer_key]`: **1 to Many (1:\*)**, Single Direction cross-filter, Active.
3. `dim_product[product_key]` $\to$ `fact_sales[product_key]`: **1 to Many (1:\*)**, Single Direction cross-filter, Active.

## Cardinality & Storage Mode Recommendations:
- `fact_sales`: Direct Import (or Dual mode for large enterprise volumes).
- Mark `dim_date` as official Date Table (`calendar_date` column) to enable DAX time intelligence functions (`SAMEPERIODLASTYEAR`, `DATEADD`).
