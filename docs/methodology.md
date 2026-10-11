# RetailIQ Statistical & Analytics Methodology

This document outlines the statistical and analytical methodologies embedded into RetailIQ.

---

## 1. Time Series Decomposition & Seasonality

E-commerce transaction series exhibit non-stationary trend and multi-seasonal rhythms (day-of-week, day-of-month, and Q4 annual holiday surges).

### Classical Additive vs Multiplicative Model:
$$Y_t = T_t \times S_t \times I_t$$
where:
- $T_t$: Long-term trend component.
- $S_t$: Annual seasonal component (captured at monthly frequency $m=12$).
- $I_t$: Irregular / stochastic residual component.

In retail, seasonal swings scale proportionally with trend; therefore, a **multiplicative decomposition** is applied to monthly net sales.

### Holiday Surge Metric:
The Q4 Seasonality Factor is quantified as:
$$\text{Q4 Ratio} = \frac{\text{Mean Monthly Sales in Nov & Dec}}{\text{Mean Monthly Sales in Jan through Aug}}$$
In the UCI Online Retail II dataset, the Q4 Ratio consistently exceeds **2.8x**, driven by wholesale giftware restocking prior to retail peak season.

---

## 2. Market Basket & Affinity Analysis (Association Rule Mining)

To support merchandise bundling hypotheses, RetailIQ implements Apriori association metrics across transactions containing $\ge 2$ items:

1. **Support**: Probability of a transaction containing both Item $A$ and Item $B$:
   $$\text{Support}(A \to B) = \frac{|\{T \mid A \in T \land B \in T\}|}{|\text{Total Invoices}|}$$
2. **Confidence**: Conditional probability of buying $B$ given $A$ was purchased:
   $$\text{Confidence}(A \to B) = \frac{\text{Support}(A \to B)}{\text{Support}(A)}$$
3. **Lift**: Degree to which the purchase of $A$ increases the likelihood of purchasing $B$:
   $$\text{Lift}(A \to B) = \frac{\text{Confidence}(A \to B)}{\text{Support}(B)} = \frac{P(A \cap B)}{P(A) \cdot P(B)}$$
   - $\text{Lift} > 1.0$ indicates meaningful positive association.
   - Example finding: Co-purchase of matching color variations (e.g. `HEART T-LIGHT HOLDER HANGING` in White and Red) has a $\text{Lift} = 6.4$.

---

## 3. Statistical Testing for Business Hypotheses

RetailIQ frames all recommendations with rigorous experimental designs:
- **Minimum Detectable Effect (MDE)**: Calculated using two-tailed two-sample proportion tests with standard power:
  $$n = \frac{2 \left(Z_{1-\alpha/2} + Z_{1-\beta}\right)^2 \cdot p(1-p)}{\text{MDE}^2}$$
  with $\alpha = 0.05$ (95% confidence) and $1-\beta = 0.80$ (80% statistical power).
- **Guardrail Metrics**: Every experiment pairs an objective KPI (e.g., Conversion Rate, Repeat Rate) with a guardrail KPI (e.g., Unsubscribe Rate, Return Rate, Unit Margin) to prevent metric gaming.
