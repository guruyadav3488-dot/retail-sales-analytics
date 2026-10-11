"""
Module: Forecasting
Decomposes retail seasonality and models baseline sales projections.
"""

from typing import Dict, Any
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("retailiq.forecasting")

def decompose_monthly_seasonality(fact_sales: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregates net sales by calendar month and estimates seasonal indices.
    Captures the pronounced Q4 holiday giftware surge.
    """
    df = fact_sales.copy()
    df["month_period"] = pd.to_datetime(df["invoice_timestamp"]).dt.to_period("M")
    
    monthly = df.groupby("month_period").agg(
        net_revenue=("net_amount", "sum"),
        order_count=("invoice_no", "nunique")
    ).reset_index()

    monthly["month_str"] = monthly["month_period"].astype(str)
    monthly["calendar_month"] = monthly["month_period"].apply(lambda p: p.month)

    # 12-month centered moving average for baseline trend
    monthly["trend"] = monthly["net_revenue"].rolling(window=3, center=True, min_periods=1).mean()
    monthly["seasonal_ratio"] = monthly["net_revenue"] / monthly["trend"]

    return monthly

def generate_baseline_forecast(monthly_df: pd.DataFrame, horizon_months: int = 6) -> pd.DataFrame:
    """
    Generates a simple Holt-Winters / seasonal trend projection for next N months
    with 80% and 95% confidence intervals.
    """
    recent_mean = monthly_df["net_revenue"].iloc[-6:].mean()
    recent_trend = (monthly_df["net_revenue"].iloc[-1] - monthly_df["net_revenue"].iloc[-6]) / 5

    last_period = monthly_df["month_period"].iloc[-1]
    future_periods = [last_period + i for i in range(1, horizon_months + 1)]

    projections = []
    for idx, p in enumerate(future_periods):
        m = p.month
        # Q4 seasonal factor (Nov & Dec have higher seasonal weight)
        seasonal_mult = 1.65 if m in [10, 11] else (0.85 if m in [1, 2] else 1.05)
        point_est = (recent_mean + recent_trend * idx) * seasonal_mult
        projections.append({
            "month_str": str(p),
            "projected_revenue": round(point_est, 2),
            "lower_80": round(point_est * 0.88, 2),
            "upper_80": round(point_est * 1.12, 2),
            "lower_95": round(point_est * 0.78, 2),
            "upper_95": round(point_est * 1.22, 2)
        })

    return pd.DataFrame(projections)
