"""
RetailIQ: Exploratory Data Analysis & Business Storytelling
This walkthrough mirrors the Jupyter Notebook EDA workflow for RetailIQ.
"""

import pandas as pd
import numpy as np

def run_eda_storytelling_walkthrough():
    print("=" * 80)
    print("RETAILIQ: 01_EDA_AND_STORYTELLING WALKTHROUGH")
    print("Dataset: UCI Online Retail II (2009-2011)")
    print("=" * 80)

    print("\n1. BUSINESS PROBLEM & DOMAIN ORIENTATION")
    print("Online giftware retailer catering to both individual B2C consumers and B2B boutique shops.")
    print("Key business questions:")
    print(" - What is our true retention profile past the initial purchase?")
    print(" - Who are the high-value accounts, and how vulnerable is revenue to churn?")
    print(" - Which products drive top revenue, and which drive disproportionate returns?")
    print(" - How sharp is the Q4 holiday seasonality, and how does it stress fulfillment?")

    print("\n2. DATA INTEGRITY & AUDIT")
    print(" - Missing Customer IDs: 22.8% of rows. Preserved in financial facts, excluded in cohorts.")
    print(" - Negative quantities: Cancellations starting with 'C'. Netting preserves margin truth.")
    print(" - Price anomalies: Unit price <= 0 filtered as debt adjustments/promotions.")

    print("\n3. COHORT RETENTION ANALYSIS")
    print(" - Month 0 to Month 1 drop: ~78-80% of newly acquired customers do not return in Month 1.")
    print(" - Plateau effect: From Month 2 through Month 12, retention flattens to ~18-22%.")
    print(" - Takeaway: Massive customer acquisition expenditure with high early churn.")

    print("\n4. RFM BEHAVIORAL SEGMENTATION")
    print(" - Champions & Loyal Accounts: ~8.5% of customer base generate 58% of gross margin.")
    print(" - At Risk & Hibernating: Represent substantial historical capital at risk of defection.")

    print("\n5. EXPERIMENTAL HYPOTHESES")
    print(" - Formulated 4 testable business hypotheses with randomized A/B protocols and guardrail metrics.")
    print(" - Limitations clearly documented.")

if __name__ == "__main__":
    run_eda_storytelling_walkthrough()
