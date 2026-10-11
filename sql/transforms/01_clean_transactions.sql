-- ============================================================================
-- Step 1: Clean & Standardize Transactions (Staging CTE Pattern)
-- Dialect: ANSI SQL-92/99 (Compatible with SQLite, PostgreSQL, Snowflake)
-- ============================================================================

WITH raw_clean AS (
    SELECT
        TRIM(Invoice) AS invoice_no,
        TRIM(StockCode) AS stock_code,
        UPPER(TRIM(COALESCE(Description, 'UNKNOWN PRODUCT'))) AS description,
        CAST(Quantity AS INTEGER) AS quantity,
        CAST(InvoiceDate AS TIMESTAMP) AS invoice_timestamp,
        CAST(Price AS NUMERIC(10, 2)) AS unit_price,
        CAST(COALESCE("Customer ID", -1) AS INTEGER) AS customer_id,
        TRIM(COALESCE(Country, 'United Kingdom')) AS country,
        -- Detect cancellation prefix or negative quantities
        CASE 
            WHEN Invoice LIKE 'C%' OR Quantity < 0 THEN 1 
            ELSE 0 
        END AS is_cancellation,
        -- Detect non-merchandise administrative codes
        CASE
            WHEN StockCode IN ('POST', 'D', 'M', 'BANK CHARGES', 'CRUK', 'AMAZONFEE', 'TEST') THEN 1
            ELSE 0
        END AS is_administrative_code
    FROM raw_online_retail
    WHERE Price > 0.00 -- Exclude bad debt zero/negative price anomalies
),

standardized_transactions AS (
    SELECT
        invoice_no,
        stock_code,
        description,
        quantity,
        invoice_timestamp,
        unit_price,
        customer_id,
        country,
        is_cancellation,
        is_administrative_code,
        -- Gross commercial line total
        CASE 
            WHEN is_cancellation = 0 THEN (quantity * unit_price)
            ELSE 0 
        END AS gross_amount,
        -- Net line total including refunds
        (quantity * unit_price) AS net_amount,
        -- Estimated margin proxy (40% retail markup)
        ((quantity * unit_price) * 0.40) AS gross_margin_proxy
    FROM raw_clean
    WHERE is_administrative_code = 0
)

SELECT * FROM standardized_transactions;
