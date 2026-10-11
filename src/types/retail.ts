export interface Transaction {
  invoiceNo: string;
  stockCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  grossAmount: number;
  netAmount: number;
  customerId: number; // -1 for guest
  country: string;
  invoiceDate: string; // YYYY-MM-DD HH:mm
  isCancellation: boolean;
  category: string;
}

export interface MonthlyMetric {
  month: string; // YYYY-MM
  grossRevenue: number;
  netRevenue: number;
  orders: number;
  soldUnits: number;
  returnedUnits: number;
  activeCustomers: number;
  aov: number;
  returnRate: number;
  marginProxy: number;
}

export interface CohortRow {
  cohortMonth: string;
  baseSize: number;
  retentionRates: number[]; // Index 0 to 12
  customerCounts: number[];
}

export interface RFMSegment {
  name: string;
  description: string;
  customerCount: number;
  pctOfCustomers: number;
  totalRevenue: number;
  pctOfRevenue: number;
  avgRecencyDays: number;
  avgFrequency: number;
  avgMonetary: number;
  actionPlaybook: string;
  color: string;
  criteria: string;
  sampleAccounts: Array<{
    customerId: number;
    country: string;
    recency: number;
    orders: number;
    spend: number;
  }>;
}

export interface ProductMetric {
  stockCode: string;
  description: string;
  category: string;
  unitsSold: number;
  unitsReturned: number;
  netRevenue: number;
  avgPrice: number;
  returnRate: number;
  cumRevenuePct: number;
  abcClass: 'A' | 'B' | 'C';
}

export interface MarketBasketPair {
  itemA: string;
  itemB: string;
  nameA: string;
  nameB: string;
  supportPct: number;
  confidencePct: number;
  lift: number;
}

export interface BusinessHypothesis {
  id: string;
  title: string;
  observedSignal: string;
  hypothesisStatement: string;
  testDesign: {
    methodology: string;
    targetSegment: string;
    sampleSizePerVariant: string;
    mde: string;
    durationDays: number;
    primaryMetric: string;
    guardrailMetric: string;
  };
  expectedImpact: string;
  feasibility: 'High' | 'Medium' | 'Low';
  limitations: string;
  recommendedPlaybook: string[];
}

export interface DaxMeasure {
  name: string;
  category: string;
  formula: string;
  description: string;
  interviewTip: string;
}

export interface InterviewQA {
  id: string;
  category: 'Data Cleaning' | 'Business Logic' | 'Data Modeling' | 'Analytics Mindset';
  question: string;
  juniorWeakResponse: string;
  seniorStrongResponse: string;
  mentorTakeaway: string;
  redFlagsToAvoid: string[];
}
