"""
Module: Segmentation
Computes Recency, Frequency, Monetary (RFM) quintile scores and business segment archetypes.
"""

import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("retailiq.segmentation")

def compute_rfm_segments(fact_sales: pd.DataFrame, reference_date: str = "2011-12-10") -> pd.DataFrame:
    """
    Computes RFM metrics and quintile rankings for registered customers.
    Filters out cancellations and guest accounts.
    """
    valid = fact_sales[(fact_sales["customer_key"] > 0) & (~fact_sales["is_cancellation"])].copy()
    valid["invoice_date"] = pd.to_datetime(valid["invoice_timestamp"])
    ref_dt = pd.to_datetime(reference_date)

    rfm = valid.groupby("customer_key").agg(
        recency_days=("invoice_date", lambda dates: (ref_dt - dates.max()).days),
        frequency=("invoice_no", "nunique"),
        monetary=("net_amount", "sum")
    ).reset_index()

    # Avoid zero/negative monetary
    rfm["monetary"] = rfm["monetary"].clip(lower=0.01)

    # Quintile scoring (1 to 5)
    # Recency: lower days is better -> invert ranks
    rfm["r_score"] = pd.qcut(rfm["recency_days"], q=5, labels=[5, 4, 3, 2, 1]).astype(int)
    
    # Frequency: rank with duplicate handling
    rfm["f_score"] = pd.qcut(rfm["frequency"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)
    
    # Monetary
    rfm["m_score"] = pd.qcut(rfm["monetary"].rank(method="first"), q=5, labels=[1, 2, 3, 4, 5]).astype(int)

    def map_rfm_segment(row) -> str:
        r, f, m = row["r_score"], row["f_score"], row["m_score"]
        if r >= 4 and f >= 4 and m >= 4:
            return "Champions"
        if r >= 3 and f >= 3 and m >= 3:
            return "Loyal Customers"
        if r >= 4 and f >= 2 and m >= 2:
            return "Potential Loyalists"
        if r >= 4 and f == 1:
            return "Recent Customers"
        if r >= 3 and f <= 2 and m >= 2:
            return "Promising"
        if r == 3 and f >= 2 and m >= 2:
            return "Customers Needing Attention"
        if r == 2 and f <= 2:
            return "About to Sleep"
        if r <= 2 and f >= 3 and m >= 3:
            return "At Risk"
        if r == 1 and f >= 4 and m >= 4:
            return "Cannot Lose Them"
        if r <= 2 and f <= 2:
            return "Hibernating"
        return "Lost"

    rfm["segment"] = rfm.apply(map_rfm_segment, axis=1)
    rfm["rfm_score"] = rfm["r_score"].astype(str) + rfm["f_score"].astype(str) + rfm["m_score"].astype(str)
    
    logger.info(f"RFM segmentation complete for {len(rfm):,} registered customers.")
    return rfm
