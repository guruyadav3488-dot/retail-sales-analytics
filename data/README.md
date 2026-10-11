# RetailIQ Data Directory Structure

This directory structure implements data engineering best practices separating raw, interim, and processed data assets.

```text
data/
├── raw/                      # Immutable raw source files (online_retail_II.xlsx)
│   └── .gitkeep
├── interim/                  # Intermediate cleaned & audited datasets
│   └── .gitkeep
└── processed/                # Production Star Schema (SQLite DB & Parquet exports)
    ├── retailiq.db           # SQLite database
    └── .gitkeep
```

## How to Populate Data
1. Download `online_retail_II.xlsx` from [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/502/online+retail+ii).
2. Place it into `data/raw/online_retail_II.xlsx`.
3. Run `make all` or `python src/retailiq/model.py`.
4. The script will automatically populate `data/interim/` and `data/processed/retailiq.db`.
