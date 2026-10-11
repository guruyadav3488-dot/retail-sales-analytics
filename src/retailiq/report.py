"""
Module: Report
Compiles comprehensive executive reports and limitation audits.
"""

from typing import Dict, Any
import logging

logger = logging.getLogger("retailiq.report")

def generate_executive_markdown_report(kpis: Dict[str, Any]) -> str:
    """Generates an executive-ready markdown report with mandatory Limitations section."""
    return f"""# RetailIQ Executive Analytics Brief

## 1. Top-Line Commercial Health
- **Gross Revenue**: £{kpis.get('gross_revenue_gbp', 0):,.2f}
- **Net Realized Revenue**: £{kpis.get('net_revenue_gbp', 0):,.2f}
- **Estimated Gross Margin Proxy**: £{kpis.get('gross_margin_proxy_gbp', 0):,.2f}
- **Total Invoices / Orders**: {kpis.get('total_orders', 0):,}
- **Average Order Value (AOV)**: £{kpis.get('aov_gbp', 0):.2f}
- **Overall Return Rate**: {kpis.get('return_rate_pct', 0):.2f}%
- **Active Registered Accounts**: {kpis.get('active_registered_customers', 0):,}

## 2. Strategic Synthesis & Recommendations
All operational insights are framed as controlled business hypotheses to test:
1. Replenishment automated CRM trigger at Day 21 post-purchase to combat Month-1 cohort cliff.
2. Wholesale volume discounting and dedicated account management for top 5% Champions accounts.
3. Upgraded packaging intervention for fragile glass/ceramic outliers exhibiting return rates > 12%.
4. Early bird B2B holiday booking incentives to smooth Q4 operational bottlenecks.

## 3. Limitations & Data Boundaries (Mandatory Governance)
- **Public Dataset Basis**: Findings derive from public 2009–2011 UK giftware transactions. No claims of active operational deployment or proven historical commercial lift are made.
- **Guest Checkout Gap**: 22.8% of transactions do not link to a customer ID and are preserved only in top-line aggregations.
- **Estimated Cost of Goods Sold**: True purchase margins are estimated using a standard 40% retail markup proxy.
- **Return Causality**: Invoices prefixed with 'C' do not capture return root causes (damage vs defect vs remorse).
"""
