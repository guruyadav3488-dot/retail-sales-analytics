"""
Tests for RFM Segmentation module.
"""

import pytest
import pandas as pd
from src.retailiq.segmentation import compute_rfm_segments

@pytest.fixture
def sample_rfm_fact():
    records = []
    # Create 10 customers with distinct frequencies and amounts to enable quintile splits
    for cust_id in range(1, 15):
        records.append({
            "customer_key": cust_id,
            "invoice_no": f"INV-{cust_id}",
            "net_amount": float(cust_id * 100),
            "is_cancellation": False,
            "invoice_timestamp": pd.to_datetime(f"2011-12-0{min(cust_id, 9)} 10:00:00")
        })
    return pd.DataFrame(records)

def test_compute_rfm_segments_structure(sample_rfm_fact):
    rfm = compute_rfm_segments(sample_rfm_fact, reference_date="2011-12-10")
    assert "r_score" in rfm.columns
    assert "f_score" in rfm.columns
    assert "m_score" in rfm.columns
    assert "segment" in rfm.columns
    assert len(rfm) == 14
    # Check that segment names are non-empty
    assert rfm["segment"].notna().all()
