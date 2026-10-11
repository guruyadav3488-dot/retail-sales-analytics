"""
Tests for Core Metrics & Cohort Computation.
"""

import pytest
import pandas as pd
from src.retailiq.metrics import compute_executive_kpis, compute_repeat_purchase_rate

@pytest.fixture
def sample_fact_sales():
    return pd.DataFrame({
        "sales_key": [1, 2, 3, 4],
        "invoice_no": ["INV-1", "INV-1", "INV-2", "C-INV-3"],
        "customer_key": [101, 101, 101, 102],
        "quantity": [10, 5, 2, -2],
        "unit_price": [10.0, 20.0, 50.0, 50.0],
        "gross_amount": [100.0, 100.0, 100.0, 0.0],
        "net_amount": [100.0, 100.0, 100.0, -100.0],
        "gross_margin_proxy": [40.0, 40.0, 40.0, -40.0],
        "is_cancellation": [False, False, False, True],
        "invoice_timestamp": pd.to_datetime(["2010-01-01", "2010-01-01", "2010-02-01", "2010-02-15"])
    })

def test_compute_executive_kpis(sample_fact_sales):
    kpis = compute_executive_kpis(sample_fact_sales)
    assert kpis["gross_revenue_gbp"] == 300.0
    assert kpis["net_revenue_gbp"] == 200.0
    assert kpis["gross_units_sold"] == 17
    assert kpis["units_returned"] == 2
    assert kpis["total_orders"] == 3
    assert kpis["active_registered_customers"] == 2

def test_compute_repeat_purchase_rate(sample_fact_sales):
    rate = compute_repeat_purchase_rate(sample_fact_sales)
    # Customer 101 has 2 orders (INV-1, INV-2), Customer 102 has 0 valid orders (only cancellation)
    assert rate == 100.0
