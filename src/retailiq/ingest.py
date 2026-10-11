"""
Module: Ingest
Extracts and loads raw UCI Online Retail II dataset files.
"""

import os
from pathlib import Path
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("retailiq.ingest")

RAW_DATA_PATH = Path("data/raw/online_retail_II.xlsx")
INTERIM_DATA_DIR = Path("data/interim")

def check_raw_dataset_exists() -> bool:
    """Verifies whether the UCI Online Retail II Excel file is present."""
    return RAW_DATA_PATH.exists()

def load_raw_dataset(limit: int | None = None) -> pd.DataFrame:
    """
    Loads raw transaction logs from data/raw/online_retail_II.xlsx.
    If the file is not yet downloaded, prints clear instructions for the user.
    """
    if not check_raw_dataset_exists():
        logger.warning(
            f"Raw dataset not found at {RAW_DATA_PATH}.\n"
            "Download instructions:\n"
            "1. Visit: https://archive.ics.uci.edu/dataset/502/online+retail+ii\n"
            "2. Download 'online_retail_II.xlsx'\n"
            "3. Place file into 'data/raw/online_retail_II.xlsx'"
        )
        raise FileNotFoundError(f"Missing {RAW_DATA_PATH}")

    logger.info("Loading Year 2009-2010 and Year 2010-2011 sheets...")
    df_0910 = pd.read_excel(RAW_DATA_PATH, sheet_name="Year 2009-2010", nrows=limit)
    df_1011 = pd.read_excel(RAW_DATA_PATH, sheet_name="Year 2010-2011", nrows=limit)
    
    combined = pd.concat([df_0910, df_1011], ignore_index=True)
    logger.info(f"Successfully loaded {len(combined):,} raw transaction records.")
    return combined

if __name__ == "__main__":
    try:
        df = load_raw_dataset(limit=100)
        print(df.head())
    except FileNotFoundError as e:
        print(e)
