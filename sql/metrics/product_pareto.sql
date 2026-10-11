-- ============================================================================
-- Product Pareto (ABC) Analysis & Return Velocity
-- ============================================================================

WITH product_performance AS (
    SELECT
        p.stock_code,
        p.description,
        p.category,
        SUM(CASE WHEN f.is_cancellation = 0 THEN f.quantity ELSE 0 END) AS units_sold,
        SUM(CASE WHEN f.is_cancellation = 1 THEN ABS(f.quantity) ELSE 0 END) AS units_returned,
        SUM(f.net_amount) AS net_revenue_gbp
    FROM fact_sales f
    JOIN dim_product p ON f.product_key = p.product_key
    GROUP BY p.stock_code, p.description, p.category
    HAVING SUM(f.net_amount) > 0
),

cumulative_pareto AS (
    SELECT
        stock_code,
        description,
        category,
        units_sold,
        units_returned,
        net_revenue_gbp,
        ROUND((CAST(units_returned AS REAL) / NULLIF(units_sold + units_returned, 0)) * 100.0, 2) AS return_rate_pct,
        SUM(net_revenue_gbp) OVER () AS total_catalog_revenue,
        SUM(net_revenue_gbp) OVER (ORDER BY net_revenue_gbp DESC) AS running_revenue_gbp
    FROM product_performance
)

SELECT
    stock_code,
    description,
    category,
    units_sold,
    units_returned,
    return_rate_pct,
    ROUND(net_revenue_gbp, 2) AS net_revenue_gbp,
    ROUND((running_revenue_gbp / total_catalog_revenue) * 100.0, 2) AS cumulative_revenue_pct,
    CASE
        WHEN (running_revenue_gbp / total_catalog_revenue) <= 0.80 THEN 'Class A (Top 80% Revenue)'
        WHEN (running_revenue_gbp / total_catalog_revenue) <= 0.95 THEN 'Class B (Next 15% Revenue)'
        ELSE 'Class C (Tail 5% Revenue)'
    END AS abc_classification
FROM cumulative_pareto
ORDER BY net_revenue_gbp DESC;
