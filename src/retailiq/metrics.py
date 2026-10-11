"""
Module: Metrics
Calculates top-line commercial KPIs, cohort retention matrices, and repeat rates.
"""

from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("retailiq.metrics")

def compute_executive_kpis(fact_sales: pd.DataFrame) -> Dict[str, Any]:
    """Calculates aggregate commercial KPIs from fact_sales."""
    gross_rev = fact_sales[~fact_sales["is_cancellation"]]["gross_amount"].sum()
    net_rev = fact_sales["net_amount"].sum()
    gross_margin = fact_sales["gross_margin_proxy"].sum()
    
    total_orders = fact_sales["invoice_no"].nunique()
    registered_cust = fact_sales[fact_sales["customer_key"] > 0]["customer_key"].nunique()
    
    sold_units = fact_sales[~fact_sales["is_cancellation"]]["quantity"].sum()
    returned_units = fact_sales[fact_sales["is_cancellation"]]["quantity"].abs().sum()
    
    return_rate = (returned_units / (sold_units + returned_units) * 100) if (sold_units + returned_units) > 0 else 0.0
    aov = (gross_rev / total_orders) if total_orders > 0 else 0.0

    return {
        "gross_revenue_gbp": round(float(gross_rev), 2),
        "net_revenue_gbp": round(float(net_rev), 2),
        "gross_margin_proxy_gbp": round(float(gross_margin), 2),
        "total_orders": int(total_orders),
        "active_registered_customers": int(registered_cust),
        "gross_units_sold": int(sold_units),
        "units_returned": int(returned_units),
        "return_rate_pct": round(float(return_rate), 2),
        "aov_gbp": round(float(aov), 2)
    }

def compute_monthly_cohort_retention(fact_sales: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Computes standard monthly cohort retention matrix for registered customers.
    Returns:
      1. cohort_counts: Raw count of active customers per month offset (0, 1, 2, ...).
      2. cohort_percentages: Retention rates relative to Month 0 base size.
    """
    valid = fact_sales[(fact_sales["customer_key"] > 0) & (~fact_sales["is_cancellation"])].copy()
    valid["order_month"] = pd.to_datetime(valid["invoice_timestamp"]).dt.to_period("M")
    
    # Customer acquisition cohort month
    customer_cohort = valid.groupby("customer_key")["order_month"].min().reset_index()
    customer_cohort.rename(columns={"order_month": "cohort_month"}, inplace=True)
    
    merged = valid.merge(customer_cohort, on="customer_key")
    
    # Calculate integer month index offset
    merged["cohort_year"] = merged["cohort_month"].apply(lambda p: p.year)
    merged["cohort_m"] = merged["cohort_month"].apply(lambda p: p.month)
    merged["order_year"] = merged["order_month"].apply(lambda p: p.year)
    merged["order_m"] = merged["order_month"].apply(lambda p: p.month)
    
    merged["month_index"] = (merged["order_year"] - merged["cohort_year"]) * 12 + (merged["order_m"] - merged["cohort_m"])
    
    cohort_data = merged.groupby(["cohort_month", "month_index"])["customer_key"].nunique().reset_index()
    
    # Pivot
    cohort_counts = cohort_data.pivot(index="cohort_month", columns="month_index", values="customer_key")
    cohort_sizes = cohort_counts.iloc[:, 0]
    cohort_percentages = cohort_counts.divide(cohort_sizes, axis=0) * 100.0

    return cohort_counts, cohort_percentages.round(2)

def compute_repeat_purchase_rate(fact_sales: pd.DataFrame) -> float:
    """Calculates percentage of registered customers with >= 2 distinct orders."""
    valid = fact_sales[(fact_sales["customer_key"] > 0) & (~fact_sales["is_cancellation"])]
    orders_per_cust = valid.groupby("customer_key")["invoice_no"].nunique()
    repeat_customers = (orders_per_cust >= 2).sum()
    total_customers = len(orders_per_cust)
    return round(float(repeat_customers / total_customers * 100), 2) if total_customers > 0 else 0.0
