-- ============================================================================
-- Executive Financial & Operational KPIs Summary
-- ============================================================================

SELECT
    d.year,
    d.month_num,
    d.month_name,
    COUNT(DISTINCT f.invoice_no) AS total_orders,
    COUNT(DISTINCT CASE WHEN f.customer_key != -1 THEN f.customer_key END) AS active_registered_customers,
    SUM(CASE WHEN f.is_cancellation = 0 THEN f.quantity ELSE 0 END) AS gross_units_sold,
    SUM(CASE WHEN f.is_cancellation = 1 THEN ABS(f.quantity) ELSE 0 END) AS returned_units,
    ROUND(SUM(f.gross_amount), 2) AS gross_revenue_gbp,
    ROUND(SUM(f.net_amount), 2) AS net_revenue_gbp,
    ROUND(SUM(f.gross_margin_proxy), 2) AS estimated_gross_margin_gbp,
    ROUND(SUM(f.gross_amount) / NULLIF(COUNT(DISTINCT f.invoice_no), 0), 2) AS average_order_value_gbp,
    ROUND(
        (CAST(SUM(CASE WHEN f.is_cancellation = 1 THEN ABS(f.quantity) ELSE 0 END) AS REAL) /
         NULLIF(SUM(CASE WHEN f.is_cancellation = 0 THEN f.quantity ELSE 0 END) + 
                SUM(CASE WHEN f.is_cancellation = 1 THEN ABS(f.quantity) ELSE 0 END), 0)) * 100.0,
        2
    ) AS return_rate_pct
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY d.year, d.month_num, d.month_name
ORDER BY d.year, d.month_num;
