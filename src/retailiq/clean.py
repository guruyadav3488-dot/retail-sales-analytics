"""
Module: Clean
Cleans raw transaction logs and implements the dual-path customer/financial rules.
"""

import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("retailiq.clean")

ADMIN_CODES = {"POST", "D", "M", "BANK CHARGES", "CRUK", "AMAZONFEE", "TEST", "ADJUST"}

def clean_transactions(raw_df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw retail logs into an intermediate standardized DataFrame:
    1. Trims text and casts types.
    2. Flags cancellations (Invoice prefix 'C' or Quantity < 0).
    3. Excludes bad debt anomalies (Price <= 0).
    4. Separates non-merchandise administrative entries.
    5. Flags guest checkouts without dropping them from the top-line ledger.
    """
    df = raw_df.copy()

    # Cast invoice & stock code to strings
    df["Invoice"] = df["Invoice"].astype(str).str.strip()
    df["StockCode"] = df["StockCode"].astype(str).str.strip()
    df["Description"] = df["Description"].fillna("UNKNOWN PRODUCT").astype(str).str.strip().str.upper()
    df["Country"] = df["Country"].fillna("United Kingdom").astype(str).str.strip()

    # Exclude non-positive prices (bad debt adjustments)
    df = df[df["Price"] > 0.0].copy()

    # Flag cancellations
    df["is_cancellation"] = df["Invoice"].str.startswith("C") | (df["Quantity"] < 0)

    # Flag administrative / postage codes
    df["is_admin_code"] = df["StockCode"].isin(ADMIN_CODES)

    # Ensure InvoiceDate is datetime
    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

    # Compute line totals
    df["gross_amount"] = np.where(~df["is_cancellation"], df["Quantity"] * df["Price"], 0.0)
    df["net_amount"] = df["Quantity"] * df["Price"]
    df["gross_margin_proxy"] = df["net_amount"] * 0.40

    # Fill customer ID: -1 for guest checkouts
    df["has_customer_id"] = ~df["Customer ID"].isna()
    df["customer_id_clean"] = df["Customer ID"].fillna(-1).astype(int)

    logger.info(f"Cleaned dataset: {len(df):,} rows retained after initial filtration.")
    return df
