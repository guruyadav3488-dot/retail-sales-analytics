-- ============================================================================
-- Step 2: Customer-Level RFM Metrics & Quintile Scoring
-- Dialect: ANSI SQL Window Functions (PostgreSQL / SQLite 3.25+ / Snowflake)
-- ============================================================================

WITH customer_orders AS (
    SELECT
        customer_id,
        country,
        COUNT(DISTINCT invoice_no) AS total_orders,
        SUM(net_amount) AS total_monetary_spend,
        MAX(invoice_timestamp) AS last_order_timestamp
    FROM fact_sales
    WHERE customer_id > 0 -- Exclude guest checkouts
      AND is_cancellation = 0
    GROUP BY customer_id, country
),

customer_rfm_raw AS (
    SELECT
        customer_id,
        country,
        total_orders AS frequency,
        total_monetary_spend AS monetary,
        -- Reference anchor date: 2011-12-10 (Day after dataset end)
        ROUND(JULIANDAY('2011-12-10') - JULIANDAY(last_order_timestamp)) AS recency_days
    FROM customer_orders
),

customer_quintiles AS (
    SELECT
        customer_id,
        country,
        recency_days,
        frequency,
        monetary,
        -- Recency: 5 is best (most recent / lowest days)
        NTILE(5) OVER (ORDER BY recency_days DESC) AS r_score,
        -- Frequency: 5 is best (highest order count)
        NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,
        -- Monetary: 5 is best (highest spend)
        NTILE(5) OVER (ORDER BY monetary ASC) AS m_score
    FROM customer_rfm_raw
)

SELECT
    customer_id,
    country,
    recency_days,
    frequency,
    monetary,
    r_score,
    f_score,
    m_score,
    (r_score || f_score || m_score) AS rfm_combined_code,
    CASE
        WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
        WHEN r_score >= 3 AND f_score >= 3 AND m_score >= 3 THEN 'Loyal Customers'
        WHEN r_score >= 4 AND f_score >= 2 AND m_score >= 2 THEN 'Potential Loyalists'
        WHEN r_score >= 4 AND f_score = 1 THEN 'Recent Customers'
        WHEN r_score >= 3 AND f_score <= 2 AND m_score >= 2 THEN 'Promising'
        WHEN r_score = 3 AND f_score >= 2 AND m_score >= 2 THEN 'Customers Needing Attention'
        WHEN r_score = 2 AND f_score <= 2 THEN 'About to Sleep'
        WHEN r_score <= 2 AND f_score >= 3 AND m_score >= 3 THEN 'At Risk'
        WHEN r_score = 1 AND f_score >= 4 AND m_score >= 4 THEN 'Cannot Lose Them'
        WHEN r_score <= 2 AND f_score <= 2 THEN 'Hibernating'
        ELSE 'Lost'
    END AS rfm_segment
FROM customer_quintiles;
