-- ============================================================================
-- Step 3: Monthly Customer Cohort Retention Matrix
-- Dialect: ANSI SQL (CTE + Date Truncation / String Substring)
-- ============================================================================

WITH customer_first_purchase AS (
    SELECT
        customer_id,
        MIN(SUBSTR(invoice_timestamp, 1, 7)) AS cohort_month
    FROM fact_sales
    WHERE customer_id > 0
      AND is_cancellation = 0
    GROUP BY customer_id
),

customer_monthly_activity AS (
    SELECT DISTINCT
        f.customer_id,
        c.cohort_month,
        SUBSTR(f.invoice_timestamp, 1, 7) AS activity_month
    FROM fact_sales f
    JOIN customer_first_purchase c ON f.customer_id = c.customer_id
    WHERE f.customer_id > 0
      AND f.is_cancellation = 0
),

cohort_sizes AS (
    SELECT
        cohort_month,
        COUNT(DISTINCT customer_id) AS cohort_base_size
    FROM customer_first_purchase
    GROUP BY cohort_month
),

cohort_retention_raw AS (
    SELECT
        a.cohort_month,
        a.activity_month,
        -- Calculate month offset in SQLite:
        (CAST(SUBSTR(a.activity_month, 1, 4) AS INT) - CAST(SUBSTR(a.cohort_month, 1, 4) AS INT)) * 12 +
        (CAST(SUBSTR(a.activity_month, 6, 2) AS INT) - CAST(SUBSTR(a.cohort_month, 6, 2) AS INT)) AS month_index,
        COUNT(DISTINCT a.customer_id) AS active_customers
    FROM customer_monthly_activity a
    GROUP BY a.cohort_month, a.activity_month
)

SELECT
    r.cohort_month,
    s.cohort_base_size,
    r.month_index,
    r.active_customers,
    ROUND((CAST(r.active_customers AS REAL) / s.cohort_base_size) * 100.0, 2) AS retention_rate_pct
FROM cohort_retention_raw r
JOIN cohort_sizes s ON r.cohort_month = s.cohort_month
ORDER BY r.cohort_month, r.month_index;
