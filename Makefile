.PHONY: help install lint test ingest clean model metrics forecast excel app all

PYTHON ?= python
PYTEST ?= pytest
RUFF ?= ruff

help:
	@echo "RetailIQ Makefile Commands:"
	@echo "  make install    - Install required dependencies from requirements.txt"
	@echo "  make lint       - Run ruff linter and style check"
	@echo "  make test       - Execute pytest test suites"
	@echo "  make ingest     - Load raw UCI Online Retail II dataset"
	@echo "  make clean      - Clean and validate transactions"
	@echo "  make model      - Build dimensional Star Schema (SQLite & Parquet)"
	@echo "  make metrics    - Compute cohorts, RFM, and KPIs"
	@echo "  make forecast   - Run time-series decomposition & baseline forecast"
	@echo "  make excel      - Generate multi-tab executive summary Excel workbook"
	@echo "  make app        - Launch Streamlit interactive dashboard"
	@echo "  make all        - Complete pipeline run: clean -> model -> metrics -> test"

install:
	$(PYTHON) -m pip install -r requirements.txt

lint:
	$(RUFF) check .

test:
	$(PYTEST) tests/ -v

ingest:
	$(PYTHON) src/retailiq/ingest.py

clean:
	$(PYTHON) src/retailiq/clean.py

model:
	$(PYTHON) src/retailiq/model.py

metrics:
	$(PYTHON) src/retailiq/metrics.py

forecast:
	$(PYTHON) src/retailiq/forecasting.py

excel:
	$(PYTHON) excel/generate_workbook.py

app:
	streamlit run app/app.py

all: clean model metrics forecast test excel
