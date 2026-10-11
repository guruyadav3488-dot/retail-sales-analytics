-- ============================================================================
-- RetailIQ: Dimensional Star Schema DDL (Kimball Methodology)
-- Compatible with SQLite, PostgreSQL, and Snowflake
-- ============================================================================

-- Date Dimension
CREATE TABLE IF NOT EXISTS dim_date (
    date_key INT PRIMARY KEY,              -- Format: YYYYMMDD (e.g. 20101115)
    calendar_date DATE NOT NULL,
    year INT NOT NULL,
    quarter INT NOT NULL,
    month_num INT NOT NULL,
    month_name VARCHAR(12) NOT NULL,
    day_of_month INT NOT NULL,
    day_of_week INT NOT NULL,              -- 1 = Monday, 7 = Sunday
    day_name VARCHAR(10) NOT NULL,
    is_weekend BOOLEAN NOT NULL
);

-- Customer Dimension
CREATE TABLE IF NOT EXISTS dim_customer (
    customer_key INTEGER PRIMARY KEY,      -- Surrogate key (-1 for Unregistered Guest)
    customer_id INT,                       -- Natural customer ID from transactional system
    country VARCHAR(64) NOT NULL,
    market_segment VARCHAR(32) NOT NULL,   -- 'Domestic UK' vs 'International Export'
    first_order_date TIMESTAMP,
    rfm_segment VARCHAR(32) DEFAULT 'New'
);

-- Product Dimension
CREATE TABLE IF NOT EXISTS dim_product (
    product_key INTEGER PRIMARY KEY,      -- Surrogate key
    stock_code VARCHAR(32) NOT NULL,       -- Natural SKU
    description VARCHAR(256),
    category VARCHAR(64) DEFAULT 'General Giftware',
    unit_cost_proxy NUMERIC(10, 2),        -- 60% of average unit price as proxy
    avg_unit_price NUMERIC(10, 2)
);

-- Sales Fact Table
CREATE TABLE IF NOT EXISTS fact_sales (
    sales_key INTEGER PRIMARY KEY,
    invoice_no VARCHAR(32) NOT NULL,
    line_item_id INT NOT NULL,
    date_key INT NOT NULL,
    customer_key INT NOT NULL,
    product_key INT NOT NULL,
    invoice_timestamp TIMESTAMP NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL,
    net_amount NUMERIC(12, 2) NOT NULL,
    gross_margin_proxy NUMERIC(12, 2) NOT NULL,
    is_cancellation BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key),
    FOREIGN KEY (product_key) REFERENCES dim_product(product_key)
);

-- Indexes for analytical query acceleration
CREATE INDEX IF NOT EXISTS idx_fact_sales_date ON fact_sales(date_key);
CREATE INDEX IF NOT EXISTS idx_fact_sales_customer ON fact_sales(customer_key);
CREATE INDEX IF NOT EXISTS idx_fact_sales_product ON fact_sales(product_key);
CREATE INDEX IF NOT EXISTS idx_fact_sales_invoice ON fact_sales(invoice_no);
