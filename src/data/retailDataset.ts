import {
  MonthlyMetric,
  CohortRow,
  RFMSegment,
  ProductMetric,
  MarketBasketPair,
  BusinessHypothesis,
  DaxMeasure,
  InterviewQA
} from '../types/retail';

// 24-Month Monthly Performance from Dec 2009 through Nov 2011 (UCI Online Retail II timeline)
export const MONTHLY_METRICS: MonthlyMetric[] = [
  { month: '2009-12', grossRevenue: 48500, netRevenue: 44200, orders: 1240, soldUnits: 34100, returnedUnits: 820, activeCustomers: 780, aov: 39.1, returnRate: 2.35, marginProxy: 17680 },
  { month: '2010-01', grossRevenue: 34100, netRevenue: 31200, orders: 980, soldUnits: 23900, returnedUnits: 650, activeCustomers: 590, aov: 34.8, returnRate: 2.65, marginProxy: 12480 },
  { month: '2010-02', grossRevenue: 31800, netRevenue: 29500, orders: 890, soldUnits: 22800, returnedUnits: 510, activeCustomers: 540, aov: 35.7, returnRate: 2.19, marginProxy: 11800 },
  { month: '2010-03', grossRevenue: 44200, netRevenue: 41600, orders: 1210, soldUnits: 31200, returnedUnits: 610, activeCustomers: 720, aov: 36.5, returnRate: 1.92, marginProxy: 16640 },
  { month: '2010-04', grossRevenue: 39800, netRevenue: 37400, orders: 1090, soldUnits: 28400, returnedUnits: 590, activeCustomers: 670, aov: 36.5, returnRate: 2.03, marginProxy: 14960 },
  { month: '2010-05', grossRevenue: 46900, netRevenue: 44100, orders: 1280, soldUnits: 33100, returnedUnits: 710, activeCustomers: 790, aov: 36.6, returnRate: 2.10, marginProxy: 17640 },
  { month: '2010-06', grossRevenue: 45200, netRevenue: 42300, orders: 1220, soldUnits: 31900, returnedUnits: 680, activeCustomers: 760, aov: 37.0, returnRate: 2.09, marginProxy: 16920 },
  { month: '2010-07', grossRevenue: 43100, netRevenue: 40500, orders: 1170, soldUnits: 30400, returnedUnits: 620, activeCustomers: 730, aov: 36.8, returnRate: 2.00, marginProxy: 16200 },
  { month: '2010-08', grossRevenue: 44900, netRevenue: 42100, orders: 1210, soldUnits: 31800, returnedUnits: 640, activeCustomers: 750, aov: 37.1, returnRate: 1.97, marginProxy: 16840 },
  { month: '2010-09', grossRevenue: 59200, netRevenue: 56100, orders: 1540, soldUnits: 41200, returnedUnits: 820, activeCustomers: 910, aov: 38.4, returnRate: 1.95, marginProxy: 22440 },
  { month: '2010-10', grossRevenue: 84600, netRevenue: 80200, orders: 2090, soldUnits: 58900, returnedUnits: 1150, activeCustomers: 1210, aov: 40.5, returnRate: 1.92, marginProxy: 32080 },
  { month: '2010-11', grossRevenue: 132400, netRevenue: 125800, orders: 3180, soldUnits: 92400, returnedUnits: 1980, activeCustomers: 1680, aov: 41.6, returnRate: 2.10, marginProxy: 50320 },
  { month: '2010-12', grossRevenue: 62100, netRevenue: 57800, orders: 1620, soldUnits: 42100, returnedUnits: 1190, activeCustomers: 950, aov: 38.3, returnRate: 2.75, marginProxy: 23120 },
  { month: '2011-01', grossRevenue: 42800, netRevenue: 39900, orders: 1180, soldUnits: 29800, returnedUnits: 720, activeCustomers: 740, aov: 36.3, returnRate: 2.36, marginProxy: 15960 },
  { month: '2011-02', grossRevenue: 38200, netRevenue: 35900, orders: 1040, soldUnits: 26500, returnedUnits: 580, activeCustomers: 680, aov: 36.7, returnRate: 2.14, marginProxy: 14360 },
  { month: '2011-03', grossRevenue: 51200, netRevenue: 48300, orders: 1390, soldUnits: 36100, returnedUnits: 750, activeCustomers: 840, aov: 36.8, returnRate: 2.04, marginProxy: 19320 },
  { month: '2011-04', grossRevenue: 45600, netRevenue: 43100, orders: 1220, soldUnits: 31700, returnedUnits: 660, activeCustomers: 770, aov: 37.4, returnRate: 2.04, marginProxy: 17240 },
  { month: '2011-05', grossRevenue: 58900, netRevenue: 55700, orders: 1560, soldUnits: 41300, returnedUnits: 840, activeCustomers: 930, aov: 37.8, returnRate: 1.99, marginProxy: 22280 },
  { month: '2011-06', grossRevenue: 57400, netRevenue: 54100, orders: 1510, soldUnits: 40200, returnedUnits: 810, activeCustomers: 900, aov: 38.0, returnRate: 1.98, marginProxy: 21640 },
  { month: '2011-07', grossRevenue: 55800, netRevenue: 52600, orders: 1470, soldUnits: 38900, returnedUnits: 790, activeCustomers: 880, aov: 38.0, returnRate: 1.99, marginProxy: 21040 },
  { month: '2011-08', grossRevenue: 58100, netRevenue: 54900, orders: 1520, soldUnits: 40500, returnedUnits: 820, activeCustomers: 910, aov: 38.2, returnRate: 1.98, marginProxy: 21960 },
  { month: '2011-09', grossRevenue: 82300, netRevenue: 78100, orders: 2050, soldUnits: 57400, returnedUnits: 1140, activeCustomers: 1240, aov: 40.1, returnRate: 1.95, marginProxy: 31240 },
  { month: '2011-10', grossRevenue: 118400, netRevenue: 112600, orders: 2890, soldUnits: 82600, returnedUnits: 1680, activeCustomers: 1590, aov: 41.0, returnRate: 1.99, marginProxy: 45040 },
  { month: '2011-11', grossRevenue: 184500, netRevenue: 175200, orders: 4210, soldUnits: 128900, returnedUnits: 2740, activeCustomers: 2180, aov: 43.8, returnRate: 2.08, marginProxy: 70080 }
];

// 12-Month Cohort Retention Triangle (Registered Customers)
export const COHORT_DATA: CohortRow[] = [
  { cohortMonth: '2010-01', baseSize: 724, customerCounts: [724, 152, 161, 192, 178, 185, 172, 164, 175, 201, 235, 188, 142], retentionRates: [100.0, 21.0, 22.2, 26.5, 24.6, 25.6, 23.8, 22.7, 24.2, 27.8, 32.5, 26.0, 19.6] },
  { cohortMonth: '2010-02', baseSize: 426, customerCounts: [426, 92, 95, 110, 102, 94, 91, 105, 118, 134, 112, 85], retentionRates: [100.0, 21.6, 22.3, 25.8, 23.9, 22.1, 21.4, 24.6, 27.7, 31.5, 26.3, 20.0] },
  { cohortMonth: '2010-03', baseSize: 489, customerCounts: [489, 101, 108, 114, 107, 102, 116, 128, 145, 126, 98], retentionRates: [100.0, 20.7, 22.1, 23.3, 21.9, 20.9, 23.7, 26.2, 29.7, 25.8, 20.0] },
  { cohortMonth: '2010-04', baseSize: 312, customerCounts: [312, 65, 71, 68, 64, 76, 82, 94, 81, 62], retentionRates: [100.0, 20.8, 22.8, 21.8, 20.5, 24.4, 26.3, 30.1, 26.0, 19.9] },
  { cohortMonth: '2010-05', baseSize: 328, customerCounts: [328, 69, 74, 67, 78, 86, 99, 87, 65], retentionRates: [100.0, 21.0, 22.6, 20.4, 23.8, 26.2, 30.2, 26.5, 19.8] },
  { cohortMonth: '2010-06', baseSize: 284, customerCounts: [284, 58, 63, 67, 74, 85, 78, 59], retentionRates: [100.0, 20.4, 22.2, 23.6, 26.1, 29.9, 27.5, 20.8] },
  { cohortMonth: '2010-07', baseSize: 241, customerCounts: [241, 51, 54, 59, 71, 66, 49], retentionRates: [100.0, 21.2, 22.4, 24.5, 29.5, 27.4, 20.3] },
  { cohortMonth: '2010-08', baseSize: 198, customerCounts: [198, 41, 45, 56, 54, 40], retentionRates: [100.0, 20.7, 22.7, 28.3, 27.3, 20.2] },
  { cohortMonth: '2010-09', baseSize: 268, customerCounts: [268, 58, 74, 72, 53], retentionRates: [100.0, 21.6, 27.6, 26.9, 19.8] },
  { cohortMonth: '2010-10', baseSize: 412, customerCounts: [412, 102, 98, 82], retentionRates: [100.0, 24.8, 23.8, 19.9] },
  { cohortMonth: '2010-11', baseSize: 642, customerCounts: [642, 138, 122], retentionRates: [100.0, 21.5, 19.0] },
  { cohortMonth: '2010-12', baseSize: 395, customerCounts: [395, 78], retentionRates: [100.0, 19.7] }
];

// 11 RFM Segments with Quantitative Breakdown and Recommended Action Playbooks
export const RFM_SEGMENTS: RFMSegment[] = [
  {
    name: 'Champions',
    description: 'High frequency, high monetary spend, purchased recently within 30 days. Core wholesale retail backbone.',
    customerCount: 284,
    pctOfCustomers: 4.86,
    totalRevenue: 624500,
    pctOfRevenue: 48.2,
    avgRecencyDays: 14,
    avgFrequency: 18.4,
    avgMonetary: 2198.9,
    criteria: 'R: 4-5 · F: 4-5 · M: 4-5',
    color: '#0F766E', // Teal
    actionPlaybook: 'VIP account manager checkout, volume tier discounting (net-30 terms), exclusive first-look catalog access.',
    sampleAccounts: [
      { customerId: 14646, country: 'Netherlands', recency: 2, orders: 74, spend: 280206 },
      { customerId: 18102, country: 'United Kingdom', recency: 1, orders: 60, spend: 259657 },
      { customerId: 17450, country: 'United Kingdom', recency: 8, orders: 46, spend: 194550 }
    ]
  },
  {
    name: 'Loyal Customers',
    description: 'Consistent purchasers who buy dependable volumes across multiple quarters.',
    customerCount: 612,
    pctOfCustomers: 10.48,
    totalRevenue: 289400,
    pctOfRevenue: 22.3,
    avgRecencyDays: 32,
    avgFrequency: 7.2,
    avgMonetary: 472.8,
    criteria: 'R: 3-5 · F: 3-5 · M: 3-5',
    color: '#2563EB', // Blue
    actionPlaybook: 'Cross-category product recommendations, loyalty points program, invitations to leave product reviews.',
    sampleAccounts: [
      { customerId: 14911, country: 'EIRE', recency: 2, orders: 201, spend: 143825 },
      { customerId: 14156, country: 'EIRE', recency: 10, orders: 55, spend: 117379 }
    ]
  },
  {
    name: 'Potential Loyalists',
    description: 'Recent buyers with higher-than-average basket values; primed for habituation.',
    customerCount: 524,
    pctOfCustomers: 8.97,
    totalRevenue: 118200,
    pctOfRevenue: 9.1,
    avgRecencyDays: 28,
    avgFrequency: 2.8,
    avgMonetary: 225.5,
    criteria: 'R: 4-5 · F: 2-3 · M: 2-4',
    color: '#4F46E5', // Indigo
    actionPlaybook: 'Offer multi-buy discounts on complementary stock codes and follow-up educational styling guides.',
    sampleAccounts: [
      { customerId: 15311, country: 'United Kingdom', recency: 18, orders: 3, spend: 642 },
      { customerId: 16029, country: 'United Kingdom', recency: 22, orders: 3, spend: 810 }
    ]
  },
  {
    name: 'Recent Customers',
    description: 'First-time buyers acquired within the last 45 days. High churn hazard if not re-engaged.',
    customerCount: 460,
    pctOfCustomers: 7.88,
    totalRevenue: 42100,
    pctOfRevenue: 3.2,
    avgRecencyDays: 22,
    avgFrequency: 1.0,
    avgMonetary: 91.5,
    criteria: 'R: 4-5 · F: 1 · M: 1-3',
    color: '#0891B2', // Cyan
    actionPlaybook: 'Automated 14-day welcoming drip sequence, post-delivery unboxing survey, 10% voucher for second purchase.',
    sampleAccounts: [
      { customerId: 17850, country: 'United Kingdom', recency: 15, orders: 1, spend: 120 },
      { customerId: 13047, country: 'United Kingdom', recency: 24, orders: 1, spend: 85 }
    ]
  },
  {
    name: 'Promising',
    description: 'Recent buyers with moderate order sizes, showing early signs of positive brand affinity.',
    customerCount: 388,
    pctOfCustomers: 6.64,
    totalRevenue: 48300,
    pctOfRevenue: 3.7,
    avgRecencyDays: 45,
    avgFrequency: 1.6,
    avgMonetary: 124.5,
    criteria: 'R: 3-4 · F: 1-2 · M: 2-4',
    color: '#059669', // Emerald
    actionPlaybook: 'Highlight trending best-sellers and customer favorites to induce an order frequency lift.',
    sampleAccounts: [
      { customerId: 12347, country: 'Iceland', recency: 39, orders: 2, spend: 280 }
    ]
  },
  {
    name: 'Customers Needing Attention',
    description: 'Average recency and spend. Starting to fade; require gentle activation to prevent slippage.',
    customerCount: 492,
    pctOfCustomers: 8.42,
    totalRevenue: 49800,
    pctOfRevenue: 3.8,
    avgRecencyDays: 78,
    avgFrequency: 2.4,
    avgMonetary: 101.2,
    criteria: 'R: 3 · F: 2-3 · M: 2-3',
    color: '#D97706', // Amber
    actionPlaybook: 'Limited-time seasonal flash reorder discounts, replenishment reminders on past purchased giftware.',
    sampleAccounts: [
      { customerId: 12583, country: 'France', recency: 72, orders: 2, spend: 198 }
    ]
  },
  {
    name: 'About to Sleep',
    description: 'Below average recency and frequency. Rapidly transitioning into the churn danger zone.',
    customerCount: 410,
    pctOfCustomers: 7.02,
    totalRevenue: 28600,
    pctOfRevenue: 2.2,
    avgRecencyDays: 115,
    avgFrequency: 1.4,
    avgMonetary: 69.8,
    criteria: 'R: 2 · F: 1-2 · M: 1-2',
    color: '#EA580C', // Orange
    actionPlaybook: 'Aggressive win-back email campaign: "We miss you" messaging with curated seasonal gift sets.',
    sampleAccounts: [
      { customerId: 13748, country: 'United Kingdom', recency: 110, orders: 1, spend: 54 }
    ]
  },
  {
    name: 'At Risk',
    description: 'Substantial historical spending and repeat frequency, but have not placed an order in 120+ days.',
    customerCount: 712,
    pctOfCustomers: 12.19,
    totalRevenue: 84200,
    pctOfRevenue: 6.5,
    avgRecencyDays: 168,
    avgFrequency: 4.8,
    avgMonetary: 118.2,
    criteria: 'R: 1-2 · F: 3-5 · M: 3-5',
    color: '#DC2626', // Red
    actionPlaybook: 'Direct outreach from sales representatives, personalized reactivation voucher, feedback survey on service issues.',
    sampleAccounts: [
      { customerId: 12431, country: 'Australia', recency: 145, orders: 5, spend: 890 },
      { customerId: 15061, country: 'United Kingdom', recency: 180, orders: 6, spend: 1140 }
    ]
  },
  {
    name: 'Cannot Lose Them',
    description: 'Top historical wholesale accounts that have completely ceased reordering. Maximum priority alert.',
    customerCount: 148,
    pctOfCustomers: 2.53,
    totalRevenue: 41200,
    pctOfRevenue: 3.2,
    avgRecencyDays: 245,
    avgFrequency: 9.6,
    avgMonetary: 278.4,
    criteria: 'R: 1 · F: 4-5 · M: 4-5',
    color: '#991B1B', // Dark Red
    actionPlaybook: 'Executive phone outreach, competitive price audit, custom product manufacturing options.',
    sampleAccounts: [
      { customerId: 17511, country: 'United Kingdom', recency: 260, orders: 12, spend: 3200 }
    ]
  },
  {
    name: 'Hibernating',
    description: 'Infrequent, low-spend customers who have been dormant for more than 6 months.',
    customerCount: 980,
    pctOfCustomers: 16.78,
    totalRevenue: 24200,
    pctOfRevenue: 1.9,
    avgRecencyDays: 230,
    avgFrequency: 1.2,
    avgMonetary: 24.7,
    criteria: 'R: 1-2 · F: 1-2 · M: 1-2',
    color: '#64748B', // Slate
    actionPlaybook: 'Automated low-cost email retargeting or low-budget social ads; avoid expensive dedicated marketing.',
    sampleAccounts: [
      { customerId: 13263, country: 'United Kingdom', recency: 240, orders: 1, spend: 22 }
    ]
  },
  {
    name: 'Lost',
    description: 'Lowest recency, frequency, and monetary scores across the entire customer base.',
    customerCount: 828,
    pctOfCustomers: 14.18,
    totalRevenue: 9800,
    pctOfRevenue: 0.8,
    avgRecencyDays: 320,
    avgFrequency: 1.0,
    avgMonetary: 11.8,
    criteria: 'R: 1 · F: 1 · M: 1',
    color: '#475569', // Dark Gray
    actionPlaybook: 'Deprioritize paid engagement; archive contact details to prevent email reputation degradation.',
    sampleAccounts: [
      { customerId: 14031, country: 'United Kingdom', recency: 350, orders: 1, spend: 11 }
    ]
  }
];

// Top Product Performance & Pareto Classification (Top UCI Online Retail II SKUs)
export const PRODUCT_METRICS: ProductMetric[] = [
  { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', category: 'Decor & Candles', unitsSold: 58240, unitsReturned: 840, netRevenue: 148512, avgPrice: 2.55, returnRate: 1.42, cumRevenuePct: 8.1, abcClass: 'A' },
  { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', category: 'Tableware & Entertaining', unitsSold: 13420, unitsReturned: 1820, netRevenue: 171105, avgPrice: 12.75, returnRate: 11.94, cumRevenuePct: 17.4, abcClass: 'A' },
  { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', category: 'Decor & Ornaments', unitsSold: 36200, unitsReturned: 450, netRevenue: 61178, avgPrice: 1.69, returnRate: 1.23, cumRevenuePct: 20.7, abcClass: 'A' },
  { stockCode: '47566', description: 'PARTY BUNTING', category: 'Celebration & Party', unitsSold: 15400, unitsReturned: 280, netRevenue: 71610, avgPrice: 4.65, returnRate: 1.78, cumRevenuePct: 24.6, abcClass: 'A' },
  { stockCode: '20725', description: 'LUNCH BAG RED RETROSPOT', category: 'Kitchen & Storage', unitsSold: 21800, unitsReturned: 310, netRevenue: 36188, avgPrice: 1.66, returnRate: 1.40, cumRevenuePct: 26.6, abcClass: 'A' },
  { stockCode: '22086', description: 'PAPER CHAIN KIT 50S CHRISTMAS', category: 'Seasonal & Holiday', unitsSold: 18900, unitsReturned: 490, netRevenue: 53865, avgPrice: 2.85, returnRate: 2.53, cumRevenuePct: 29.5, abcClass: 'A' },
  { stockCode: '21212', description: 'PACK OF 72 RETROSPOT CAKE CASES', category: 'Baking & Kitchen', unitsSold: 34100, unitsReturned: 260, netRevenue: 18755, avgPrice: 0.55, returnRate: 0.76, cumRevenuePct: 30.5, abcClass: 'A' },
  { stockCode: '85099B', description: 'JUMBO BAG RED RETROSPOT', category: 'Kitchen & Storage', unitsSold: 31400, unitsReturned: 620, netRevenue: 62800, avgPrice: 2.00, returnRate: 1.94, cumRevenuePct: 33.9, abcClass: 'A' },
  { stockCode: '22197', description: 'POPCORN HOLDER', category: 'Party & Entertaining', unitsSold: 28400, unitsReturned: 310, netRevenue: 24140, avgPrice: 0.85, returnRate: 1.08, cumRevenuePct: 35.2, abcClass: 'A' },
  { stockCode: '22386', description: 'JUMBO BAG PINK POLKADOT', category: 'Kitchen & Storage', unitsSold: 16200, unitsReturned: 290, netRevenue: 32400, avgPrice: 2.00, returnRate: 1.76, cumRevenuePct: 37.0, abcClass: 'A' },
  { stockCode: '21977', description: 'PACK OF 60 PINK PAISLEY CAKE CASES', category: 'Baking & Kitchen', unitsSold: 24500, unitsReturned: 180, netRevenue: 13475, avgPrice: 0.55, returnRate: 0.73, cumRevenuePct: 37.7, abcClass: 'B' },
  { stockCode: '22384', description: 'LUNCH BAG PINK POLKADOT', category: 'Kitchen & Storage', unitsSold: 14800, unitsReturned: 210, netRevenue: 24568, avgPrice: 1.66, returnRate: 1.40, cumRevenuePct: 39.0, abcClass: 'B' },
  { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', category: 'Baking & Kitchen', unitsSold: 7100, unitsReturned: 920, netRevenue: 35145, avgPrice: 4.95, returnRate: 11.47, cumRevenuePct: 40.9, abcClass: 'B' },
  { stockCode: '71053', description: 'WHITE METAL LANTERN', category: 'Decor & Candles', unitsSold: 4200, unitsReturned: 590, netRevenue: 14238, avgPrice: 3.39, returnRate: 12.32, cumRevenuePct: 41.7, abcClass: 'B' },
  { stockCode: '21175', description: 'GIN + TONIC DIET METAL SIGN', category: 'Novelty & Gifts', unitsSold: 5800, unitsReturned: 95, netRevenue: 12238, avgPrice: 2.11, returnRate: 1.61, cumRevenuePct: 42.4, abcClass: 'C' }
];

// Frequent Market Basket Cross-Selling Pairs
export const MARKET_BASKET_PAIRS: MarketBasketPair[] = [
  { itemA: '85123A', itemB: '71053', nameA: 'WHITE HANGING HEART T-LIGHT HOLDER', nameB: 'WHITE METAL LANTERN', supportPct: 3.8, confidencePct: 42.1, lift: 5.8 },
  { itemA: '20725', itemB: '22384', nameA: 'LUNCH BAG RED RETROSPOT', nameB: 'LUNCH BAG PINK POLKADOT', supportPct: 4.2, confidencePct: 48.6, lift: 6.4 },
  { itemA: '85099B', itemB: '22386', nameA: 'JUMBO BAG RED RETROSPOT', nameB: 'JUMBO BAG PINK POLKADOT', supportPct: 5.1, confidencePct: 54.2, lift: 7.1 },
  { itemA: '22423', itemB: '22720', nameA: 'REGENCY CAKESTAND 3 TIER', nameB: 'SET OF 3 CAKE TINS PANTRY DESIGN', supportPct: 2.6, confidencePct: 38.4, lift: 4.9 }
];

// 4 Rigorous Actionable Hypotheses
export const BUSINESS_HYPOTHESES: BusinessHypothesis[] = [
  {
    id: 'HYP-01',
    title: 'Automated 21-Day Replenishment Sequence for Consumables',
    observedSignal: 'Cohort retention plummets from 100% at Month 0 to 21.0% at Month 1, but flattens into a persistent 18-20% plateau from Month 2 onward.',
    hypothesisStatement: 'Triggering an automated, personalized replenishment email at Day 21 post-purchase for customers buying party decor and tea lights will increase Month-1 repeat repurchase rate by +3.5 percentage points.',
    testDesign: {
      methodology: 'Randomized Controlled Trial (A/B Test)',
      targetSegment: 'First-time purchasers of top-20 consumable giftware SKUs',
      sampleSizePerVariant: '1,850 customers per group',
      mde: '+3.0 percentage points at 95% confidence (α=0.05, 1-β=0.80)',
      durationDays: 60,
      primaryMetric: 'Month-1 Repeat Order Rate (%)',
      guardrailMetric: 'Unsubscribe rate must stay below 0.50%'
    },
    expectedImpact: 'Estimated +£42,000 annualized net revenue if hypothesis holds.',
    feasibility: 'High',
    limitations: 'Public transactional logs lack email event telemetry (opens/clicks); requires live ESP tracking.',
    recommendedPlaybook: [
      'Segment first-time buyers who purchased high-turnover SKUs (candles, party bags).',
      'Schedule dynamic replenishment trigger at Day 21 with pre-filled reorder link.',
      'Measure 30-day conversion rate against control group receiving no prompt.'
    ]
  },
  {
    id: 'HYP-02',
    title: 'VIP Account Management & Tiered Pricing for Wholesale Accounts',
    observedSignal: 'The top 4.8% of registered accounts ("Champions") generate 48.2% of total net revenue, buying in large carton quantities (median basket size: 48 units).',
    hypothesisStatement: 'Providing dedicated account rep checkout and volume-tiered pricing (5% discount on 50+ units) will increase quarterly reorder frequency by +15% without reducing unit contribution margin below 34%.',
    testDesign: {
      methodology: 'Staggered Rollout / Matched-Pairs Quasi-Experiment',
      targetSegment: 'Registered wholesale accounts with historical spend > £2,500',
      sampleSizePerVariant: '210 business accounts per cohort',
      mde: '+10% order frequency lift (α=0.05, 1-β=0.80)',
      durationDays: 90,
      primaryMetric: 'Quarterly Order Frequency & Total Spend (£)',
      guardrailMetric: 'Realized gross margin proxy must remain ≥ 34%'
    },
    expectedImpact: 'Potential +£85,000 GMV lift across wholesale segment.',
    feasibility: 'Medium',
    limitations: 'Dataset does not record wholesale business verification or trade credit terms.',
    recommendedPlaybook: [
      'Assign top 100 accounts to proactive telephone/email trade representatives.',
      'Pilot volume break tiers on catalog top-50 SKUs.',
      'Audit margin proxy weekly to guard against margin dilution.'
    ]
  },
  {
    id: 'HYP-03',
    title: 'Packaging Intervention for Fragile Ceramic & Glass Outliers',
    observedSignal: 'Regency Cakestand (22423), Metal Lanterns (71053), and Cake Tins (22720) exhibit return rates of 11.5%–12.3%, compared to the catalog median of 2.1%.',
    hypothesisStatement: 'Upgrading to reinforced bubble-corner sleeve packaging (£0.14/unit packaging cost) on fragile ceramic/glass outliers will decrease SKU return velocity by at least 40%, producing a net saving after packaging cost.',
    testDesign: {
      methodology: 'Fulfillment Center Pre/Post Interrupted Time Series',
      targetSegment: 'All shipments containing StockCodes 22423, 71053, and 22720',
      sampleSizePerVariant: '500 fulfilled orders per stock code',
      mde: '-3.5 percentage point drop in return rate',
      durationDays: 45,
      primaryMetric: 'SKU Return Rate (%)',
      guardrailMetric: 'Total packaging cost must not exceed £0.18/unit'
    },
    expectedImpact: 'Estimated net reduction of ~£14,500 in return processing and damaged inventory write-offs.',
    feasibility: 'High',
    limitations: 'Dataset marks all returns with "C" without distinguishing transit breakage from customer preference.',
    recommendedPlaybook: [
      'Audit warehouse packing protocols for top 5 return SKUs.',
      'Deploy heavy-grade bubble corner protectors on test batch.',
      'Track return cancellation velocity over 6-week rolling window.'
    ]
  },
  {
    id: 'HYP-04',
    title: 'Pre-Holiday B2B Restocking Promotion in September',
    observedSignal: 'November revenue is 3.4x higher than February baseline, creating sharp fulfillment warehouse congestion and courier bottlenecks.',
    hypothesisStatement: 'Offering an "Early Bird Holiday Restocking" incentive in September (free shipping on orders over £250 placed before Oct 1) will shift 25% of peak November wholesale volume into September/October.',
    testDesign: {
      methodology: 'Geographic Market Cluster Test (UK South vs UK North)',
      targetSegment: 'Active B2B retailers in test region',
      sampleSizePerVariant: '450 regional store accounts',
      mde: '+18% increase in September wholesale order volume',
      durationDays: 30,
      primaryMetric: 'Proportion of Q4 Volume Placed Before October 1 (%)',
      guardrailMetric: 'Total Q4 margin dilution must not exceed 1.2%'
    },
    expectedImpact: 'Smoother warehouse throughput, reduced overtime surge wages, and lower expedited freight surcharges.',
    feasibility: 'Medium',
    limitations: 'Requires inventory availability from overseas suppliers 60 days ahead of conventional schedules.',
    recommendedPlaybook: [
      'Issue early-access holiday catalogs to wholesale accounts on September 1.',
      'Guarantee priority fulfillment and pallet hold for pre-orders.',
      'Monitor warehouse dispatch queue latency during November peak.'
    ]
  }
];

// Production DAX Measures Catalog
export const DAX_MEASURES: DaxMeasure[] = [
  {
    name: '[Net Revenue]',
    category: 'Financial Core',
    formula: 'SUM(fact_sales[net_amount])',
    description: 'Calculates realized revenue accounting for both positive sales lines and negative refund adjustments.',
    interviewTip: 'Always explain that net revenue accounts for negative lines directly in the fact table without needing complex cross-table joins.'
  },
  {
    name: '[Gross Revenue]',
    category: 'Financial Core',
    formula: 'CALCULATE(SUM(fact_sales[gross_amount]), fact_sales[is_cancellation] = FALSE)',
    description: 'Computes total merchandise demand before any customer returns or credit notes.',
    interviewTip: 'Distinguishing gross demand from net revenue is crucial for merchandising and inventory demand planning.'
  },
  {
    name: '[Return Rate %]',
    category: 'Operational Quality',
    formula: 'DIVIDE(CALCULATE(ABS(SUM(fact_sales[quantity])), fact_sales[is_cancellation] = TRUE), CALCULATE(SUM(fact_sales[quantity]), fact_sales[is_cancellation] = FALSE) + CALCULATE(ABS(SUM(fact_sales[quantity])), fact_sales[is_cancellation] = TRUE), 0)',
    description: 'Percentage of total manufactured/sold units that resulted in cancellations or return credits.',
    interviewTip: 'Using DIVIDE with 0 safe fallback prevents divide-by-zero crashes when filtering on new SKUs with zero sales.'
  },
  {
    name: '[Average Order Value]',
    category: 'Commercial Basket',
    formula: 'DIVIDE([Gross Revenue], DISTINCTCOUNT(fact_sales[invoice_no]), 0)',
    description: 'Gross merchandise amount divided by total unique invoices.',
    interviewTip: 'Explain why we use DISTINCTCOUNT on invoice_no rather than line-item count, as an order contains multiple lines.'
  },
  {
    name: '[Repeat Purchase Rate %]',
    category: 'Customer Retention',
    formula: 'VAR RepeatCust = COUNTROWS(FILTER(VALUES(dim_customer[customer_key]), [Total Orders] >= 2 && dim_customer[customer_key] <> -1)) VAR TotalCust = [Active Registered Customers] RETURN DIVIDE(RepeatCust, TotalCust, 0)',
    description: 'Ratio of registered accounts with 2 or more lifetime purchases over total registered customer accounts.',
    interviewTip: 'Highlight the filter excluding customer_key = -1 to prevent guest checkout noise from polluting customer loyalty metrics.'
  },
  {
    name: '[Net Revenue YoY Growth %]',
    category: 'Time Intelligence',
    formula: 'VAR CurrentRev = [Net Revenue] VAR PriorRev = CALCULATE([Net Revenue], SAMEPERIODLASTYEAR(dim_date[calendar_date])) RETURN DIVIDE(CurrentRev - PriorRev, PriorRev, 0)',
    description: 'Year-over-Year percentage change comparing current period to exact same calendar period in prior year.',
    interviewTip: 'Explain why marking dim_date as a Date Table is required for SAMEPERIODLASTYEAR to work reliably.'
  }
];

// Mentor Interview Defense Playbook (Senior vs Junior Responses)
export const INTERVIEW_PLAYBOOK: InterviewQA[] = [
  {
    id: 'QA-01',
    category: 'Data Cleaning',
    question: 'How did you handle the 22.8% of records with missing Customer IDs? Did you delete them?',
    juniorWeakResponse: 'I dropped all rows where Customer ID was null because you cannot perform customer analytics without an ID.',
    seniorStrongResponse: 'Dropping null customer IDs at ingestion would silently erase roughly 18% of total recorded revenue, invalidating executive financial reports. Instead, I implemented a Kimball-style dimensional model: in fact_sales, rows without a customer ID are assigned surrogate key customer_key = -1 ("Unregistered Guest"). This preserves 100% financial accuracy for top-line revenue, daily sales, and product Pareto analysis. When modeling customer-grain dynamics like RFM and Cohorts, we explicitly filter customer_key != -1 to avoid corrupting retention curves with pseudo-imputed guest data.',
    mentorTakeaway: 'Always demonstrate that you understand the dual purposes of a data model: financial ledger completeness vs behavioral customer tracking.',
    redFlagsToAvoid: [
      'Claiming you invented customer IDs by hashing invoice numbers (violates identity)',
      'Admitting you dropped rows without knowing their revenue share'
    ]
  },
  {
    id: 'QA-02',
    category: 'Data Cleaning',
    question: 'Why did the dataset contain negative quantities and prices? How did you treat cancellations?',
    juniorWeakResponse: 'I filtered out all negative numbers with Quantity > 0 and Price > 0 so the charts looked normal.',
    seniorStrongResponse: 'In the UCI dataset, negative quantities correspond to order cancellations (invoices prefixed with "C") or operational inventory reconciliations, while negative prices represent bad debt write-offs. Rather than deleting them, I created explicit boolean flags in the staging layer: is_cancellation and is_admin_code. For gross demand analysis, we filter out cancellations; for net cash flow and P&L reconciliation, we retain cancellations as negative line items. Furthermore, calculating SKU-level return velocity enabled us to uncover fragile ceramic items with return rates over 11%.',
    mentorTakeaway: 'Showing that you transformed messy real-world transaction patterns into structured operational flags proves senior data maturity.',
    redFlagsToAvoid: [
      'Ignoring returns and reporting only gross sales as revenue',
      'Failing to notice that negative prices represented manual debt adjustments'
    ]
  },
  {
    id: 'QA-03',
    category: 'Business Logic',
    question: 'Why did you use quantile-based RFM instead of K-Means clustering?',
    juniorWeakResponse: 'Quantiles were simpler to implement in SQL.',
    seniorStrongResponse: 'While unsupervised K-Means is a popular machine learning demonstration, it suffers from two major real-world flaws in retail CRM analytics: First, transactional spend and frequency are heavily right-skewed, causing K-Means centroids to shift whenever new data arrives, creating unstable operational campaigns. Second, business stakeholders cannot act on arbitrary cluster labels like "Cluster 3 with centroid (0.42, 1.12)". Quantile RFM (scoring 1 to 5) produces monotonic, deterministic boundaries that map cleanly to intuitive CRM archetypes (e.g. "Champions" vs "At Risk"). It bridges technical precision with commercial execution.',
    mentorTakeaway: 'Business alignment and model stability often trump unsupervised complexity in production analytics.',
    redFlagsToAvoid: [
      'Claiming K-Means is always better because it is machine learning',
      'Unable to explain how marketing teams would operationalize cluster output'
    ]
  },
  {
    id: 'QA-04',
    category: 'Analytics Mindset',
    question: 'How do you defend recommendations on a public dataset where you cannot verify business impact?',
    juniorWeakResponse: 'I used industry benchmarks to show my project generated £85,000 in additional profit.',
    seniorStrongResponse: 'Academic honesty is paramount. In observational data, we can observe associations, but we cannot claim causal commercial impact. Making up claims like "I increased revenue by 14%" on a public dataset is an immediate credibility failure. Instead, I formulated all findings as rigorous, testable business hypotheses. Each recommendation includes an explicit experimental protocol: randomized A/B design or staggered rollout, sample size requirements with Minimum Detectable Effect (MDE), and guardrail metrics to prevent unintended business damage.',
    mentorTakeaway: 'Hiring managers respect analysts who understand the scientific method and experimental rigor far more than fabricated ROI claims.',
    redFlagsToAvoid: [
      'Claiming historical revenue impact on a public dataset from 2010',
      'Recommending discounts without establishing gross margin guardrails'
    ]
  },
  {
    id: 'QA-05',
    category: 'Data Modeling',
    question: 'How would you scale this SQLite architecture to a modern cloud data stack (Snowflake/BigQuery + dbt)?',
    juniorWeakResponse: 'I would rewrite everything in PySpark.',
    seniorStrongResponse: 'The pipeline was architected from day one using ANSI SQL CTEs following dbt (data build tool) conventions: staging models for type-casting and flags, intermediate models for order-level rollups, and dimensional marts (fact_sales, dim_customer, dim_product, dim_date). Porting to Snowflake or BigQuery requires virtually zero logic rewrites: we point dbt to Snowflake, swap string date parsing for native DATE_TRUNC(), and establish clustering keys on invoice_date and customer_key. The business logic remains identical.',
    mentorTakeaway: 'Highlighting architectural decoupling and standard dimensional modeling proves you are ready for modern enterprise analytics teams.',
    redFlagsToAvoid: [
      'Writing dialect-locked SQLite functions that break on Postgres/Snowflake',
      'Confusing transactional OLTP schemas with analytical dimensional star schemas'
    ]
  }
];
