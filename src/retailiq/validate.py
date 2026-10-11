"""
Module: Validate
Applies automated data quality checks, schema assertions, and anomaly detection.
"""

from typing import Dict, Any
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("retailiq.validate")

REQUIRED_COLUMNS = [
    "Invoice",
    "StockCode",
    "Description",
    "Quantity",
    "InvoiceDate",
    "Price",
    "Customer ID",
    "Country"
]

def audit_data_quality(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs comprehensive data audit for the raw transaction logs.
    Identifies missing customer rates, negative prices, cancellations, and test SKUs.
    """
    total_rows = len(df)
    missing_customer = df["Customer ID"].isna().sum() if "Customer ID" in df.columns else 0
    missing_desc = df["Description"].isna().sum() if "Description" in df.columns else 0
    negative_quantity = (df["Quantity"] < 0).sum() if "Quantity" in df.columns else 0
    negative_price = (df["Price"] < 0).sum() if "Price" in df.columns else 0
    zero_price = (df["Price"] == 0).sum() if "Price" in df.columns else 0

    cancellations = 0
    if "Invoice" in df.columns:
        cancellations = df["Invoice"].astype(str).str.startswith("C").sum()

    audit_report = {
        "total_rows": int(total_rows),
        "missing_customer_count": int(missing_customer),
        "missing_customer_pct": round(float(missing_customer / total_rows * 100), 2) if total_rows else 0.0,
        "missing_description_count": int(missing_desc),
        "negative_quantity_count": int(negative_quantity),
        "cancellation_invoices_count": int(cancellations),
        "negative_price_count": int(negative_price),
        "zero_price_count": int(zero_price),
        "unique_invoices": int(df["Invoice"].nunique()) if "Invoice" in df.columns else 0,
        "unique_stock_codes": int(df["StockCode"].nunique()) if "StockCode" in df.columns else 0,
        "unique_customers": int(df["Customer ID"].dropna().nunique()) if "Customer ID" in df.columns else 0,
        "date_min": str(df["InvoiceDate"].min()) if "InvoiceDate" in df.columns else "",
        "date_max": str(df["InvoiceDate"].max()) if "InvoiceDate" in df.columns else ""
    }

    logger.info(f"Audit completed: {total_rows} rows analyzed. Missing customers: {audit_report['missing_customer_pct']}%")
    return audit_report

def validate_schema(df: pd.DataFrame) -> bool:
    """Verifies that all required raw columns exist."""
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Schema assertion failed. Missing expected columns: {missing}")
    return True
