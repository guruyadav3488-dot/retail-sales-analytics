"""
Module: Recommend
Generates structured business recommendations framed strictly as testable hypotheses.
"""

from typing import List, Dict, Any

def get_actionable_hypotheses() -> List[Dict[str, Any]]:
    """
    Returns production-grade analytical recommendations framed as testable hypotheses.
    Adheres strictly to the portfolio positioning requirement:
    No claims of historical proprietary impact; all framed as hypotheses to test with a business.
    """
    return [
        {
            "id": "HYP-01",
            "title": "Automated Replenishment Cadence for Consumable Giftware",
            "observed_signal": (
                "Cohort analysis reveals an 80% customer drop-off between Month 0 and Month 1, "
                "with repeat repurchase stabilizing at ~18% thereafter."
            ),
            "hypothesis": (
                "If we send a personalized replenishment email sequence at Day 21 post-purchase "
                "for high-velocity consumable categories (e.g. tea lights, decorative napkins, party bunting), "
                "then Month-1 repeat repurchase rate will increase by +3.5 percentage points."
            ),
            "test_design": {
                "method": "Randomized Controlled Trial (A/B Test)",
                "target_audience": "First-time purchasers of top-20 consumable SKUs",
                "sample_size_per_variant": "1,850 customers",
                "mde": "+3.0 percentage points at 95% confidence (alpha=0.05, power=0.80)",
                "duration": "60 days",
                "primary_metric": "Month-1 Repeat Order Rate (%)",
                "guardrail_metric": "Email unsubscribe rate must remain below 0.5%"
            },
            "expected_impact": "Estimated +£42,000 annualized net revenue if hypothesis holds.",
            "limitations": (
                "Public dataset lacks customer email open/click telemetry; "
                "requires CRM integration in live production."
            )
        },
        {
            "id": "HYP-02",
            "title": "VIP Wholesale Tiering for Top 5% Accounts",
            "observed_signal": (
                "RFM analysis demonstrates that the top 4.8% of accounts ('Champions') generate "
                "48.2% of total net revenue, buying in median pack sizes of 36 units."
            ),
            "hypothesis": (
                "If we offer high-volume wholesale buyers dedicated net-30 terms and quantity breaks "
                "(5% discount on 50+ units), then average annual order frequency will increase by 15% "
                "without cannibalizing unit gross margins."
            ),
            "test_design": {
                "method": "Staggered Rollout / Matched-Pairs Quasi-Experiment",
                "target_audience": "Wholesale accounts with historical LTV > £2,500",
                "sample_size_per_variant": "210 accounts per cohort",
                "mde": "+10% reorder velocity (alpha=0.05, power=0.80)",
                "duration": "90 days",
                "primary_metric": "Quarterly Order Frequency & Total GMV",
                "guardrail_metric": "Net realized contribution margin >= 34%"
            },
            "expected_impact": "Potential +£85,000 GMV lift across wholesale segment.",
            "limitations": (
                "Dataset does not contain credit scoring or accounts receivable payment delays."
            )
        },
        {
            "id": "HYP-03",
            "title": "Protective Packaging Intervention for Fragile Outliers",
            "observed_signal": (
                "Pareto return analysis identifies 7 ceramic and glassware SKUs with return rates "
                "exceeding 12.5%, compared to the catalog median of 2.1%."
            ),
            "hypothesis": (
                "If we upgrade protective packaging (reinforced bubble sleeve costing £0.14/unit) "
                "on the top 5 high-return ceramic SKUs, then return rates will decline by at least 40%, "
                "yielding a net cost reduction after packaging expenses."
            ),
            "test_design": {
                "method": "Fulfillment Center Pre/Post Interrupted Time Series",
                "target_audience": "All orders containing StockCodes: 85123A, 22423, 84879",
                "sample_size_per_variant": "500 fulfilled orders per SKU",
                "mde": "-3.5 percentage point drop in returns",
                "duration": "45 days",
                "primary_metric": "SKU Return Rate (%)",
                "guardrail_metric": "Packaging unit cost <= £0.18/unit"
            },
            "expected_impact": "Reduction of ~£14,500 in return processing and damaged goods waste.",
            "limitations": (
                "Dataset logs cancellations together with damaged returns; "
                "cannot distinguish between buyer remorse and transit breakage without return reason codes."
            )
        },
        {
            "id": "HYP-04",
            "title": "Pre-Holiday B2B Restocking Promotion in September",
            "observed_signal": (
                "Time series decomposition indicates that November and December demand is 3.4x higher "
                "than Q1/Q2 baselines, creating severe seasonal logistics bottlenecks."
            ),
            "hypothesis": (
                "If we launch an 'Early Bird Christmas Wholesale Restocking' incentive in September "
                "(free standard freight on orders placed before Oct 1), then 25% of peak November order volume "
                "will shift to September/October, reducing expedited warehouse overtime labor."
            ),
            "test_design": {
                "method": "Geographic Market Cluster Test (UK South vs UK North)",
                "target_audience": "Active B2B retailers in test region",
                "sample_size_per_variant": "450 B2B stores",
                "mde": "+18% September order shift",
                "duration": "30 days (Sept 1 – Sept 30)",
                "primary_metric": "Pre-Season Order Volume Proportion (%)",
                "guardrail_metric": "Total Q4 margin dilution <= 1.2%"
            },
            "expected_impact": "Smoother warehouse staffing utilization and lower peak carrier surcharges.",
            "limitations": (
                "Requires inventory availability 60 days ahead of standard seasonal schedules."
            )
        }
    ]
