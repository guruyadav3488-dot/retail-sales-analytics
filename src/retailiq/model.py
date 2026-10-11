"""
Module: Model
Constructs Kimball Star Schema dimensional tables and populates SQLite / Parquet stores.
"""

import sqlite3
from pathlib import Path
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("retailiq.model")

DB_PATH = Path("data/processed/retailiq.db")
PROCESSED_DIR = Path("data/processed")

def build_dim_date(start_date: str = "2009-12-01", end_date: str = "2011-12-31") -> pd.DataFrame:
    """Builds a comprehensive date dimension table."""
    dates = pd.date_range(start=start_date, end=end_date, freq="D")
    df = pd.DataFrame({"calendar_date": dates})
    df["date_key"] = df["calendar_date"].dt.strftime("%Y%m%d").astype(int)
    df["year"] = df["calendar_date"].dt.year
    df["quarter"] = df["calendar_date"].dt.quarter
    df["month_num"] = df["calendar_date"].dt.month
    df["month_name"] = df["calendar_date"].dt.strftime("%B")
    df["day_of_month"] = df["calendar_date"].dt.day
    df["day_of_week"] = df["calendar_date"].dt.dayofweek + 1
    df["day_name"] = df["calendar_date"].dt.strftime("%A")
    df["is_weekend"] = df["day_of_week"].isin([6, 7])
    return df

def build_dim_product(clean_df: pd.DataFrame) -> pd.DataFrame:
    """Builds product dimension with surrogate keys."""
    products = clean_df.groupby("StockCode").agg(
        description=("Description", "first"),
        avg_unit_price=("Price", "mean")
    ).reset_index()

    products["product_key"] = np.arange(1, len(products) + 1)
    products["unit_cost_proxy"] = (products["avg_unit_price"] * 0.60).round(2)
    products["category"] = "General Giftware"
    return products

def build_dim_customer(clean_df: pd.DataFrame) -> pd.DataFrame:
    """Builds customer dimension including surrogate key -1 for guest checkout."""
    registered = clean_df[clean_df["customer_id_clean"] > 0]
    cust_agg = registered.groupby("customer_id_clean").agg(
        country=("Country", "first"),
        first_order_date=("InvoiceDate", "min")
    ).reset_index()

    cust_agg.rename(columns={"customer_id_clean": "customer_id"}, inplace=True)
    cust_agg["customer_key"] = cust_agg["customer_id"]
    cust_agg["market_segment"] = np.where(cust_agg["country"] == "United Kingdom", "Domestic UK", "International Export")

    # Add guest record
    guest = pd.DataFrame([{
        "customer_id": -1,
        "customer_key": -1,
        "country": "United Kingdom",
        "first_order_date": pd.Timestamp("2009-12-01"),
        "market_segment": "Unregistered Guest"
    }])

    return pd.concat([guest, cust_agg], ignore_index=True)

def build_fact_sales(clean_df: pd.DataFrame, dim_cust: pd.DataFrame, dim_prod: pd.DataFrame) -> pd.DataFrame:
    """Builds the central sales fact table."""
    fact = clean_df.copy()
    fact["date_key"] = fact["InvoiceDate"].dt.strftime("%Y%m%d").astype(int)

    prod_map = dict(zip(dim_prod["StockCode"], dim_prod["product_key"]))
    fact["product_key"] = fact["StockCode"].map(prod_map).fillna(0).astype(int)
    fact["customer_key"] = fact["customer_id_clean"]

    fact["sales_key"] = np.arange(1, len(fact) + 1)
    fact.rename(columns={
        "Invoice": "invoice_no",
        "Price": "unit_price",
        "Quantity": "quantity",
        "InvoiceDate": "invoice_timestamp"
    }, inplace=True)

    columns = [
        "sales_key", "invoice_no", "date_key", "customer_key", "product_key",
        "invoice_timestamp", "quantity", "unit_price", "gross_amount",
        "net_amount", "gross_margin_proxy", "is_cancellation"
    ]
    return fact[columns]

def export_star_schema_to_sqlite(dim_date: pd.DataFrame, dim_cust: pd.DataFrame, dim_prod: pd.DataFrame, fact: pd.DataFrame):
    """Saves all dimensional tables into SQLite database."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    dim_date.to_sql("dim_date", conn, if_exists="replace", index=False)
    dim_cust.to_sql("dim_customer", conn, if_exists="replace", index=False)
    dim_prod.to_sql("dim_product", conn, if_exists="replace", index=False)
    fact.to_sql("fact_sales", conn, if_exists="replace", index=False)
    conn.close()
    logger.info(f"Exported Star Schema tables to SQLite database at {DB_PATH}")
