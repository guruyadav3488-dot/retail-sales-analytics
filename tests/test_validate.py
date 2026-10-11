"""
Tests for Data Validation module.
"""

import pytest
import pandas as pd
from src.retailiq.validate import audit_data_quality, validate_schema

@pytest.fixture
def sample_raw_df():
    return pd.DataFrame({
        "Invoice": ["536365", "C536366", "536367"],
        "StockCode": ["85123A", "84879", "22423"],
        "Description": ["WHITE HANGING HEART", "ASSORTED COLOUR BIRD", "REGENCY CAKESTAND"],
        "Quantity": [6, -1, 8],
        "InvoiceDate": ["2010-12-01 08:26:00", "2010-12-01 08:28:00", "2010-12-01 08:34:00"],
        "Price": [2.55, 1.69, 12.75],
        "Customer ID": [17850.0, 17850.0, None],
        "Country": ["United Kingdom", "United Kingdom", "France"]
    })

def test_audit_data_quality(sample_raw_df):
    report = audit_data_quality(sample_raw_df)
    assert report["total_rows"] == 3
    assert report["missing_customer_count"] == 1
    assert report["cancellation_invoices_count"] == 1
    assert report["negative_quantity_count"] == 1
    assert report["unique_customers"] == 1

def test_validate_schema_passes(sample_raw_df):
    assert validate_schema(sample_raw_df) is True

def test_validate_schema_fails_on_missing_col():
    bad_df = pd.DataFrame({"Invoice": ["123"], "Price": [10.0]})
    with pytest.raises(ValueError):
        validate_schema(bad_df)
