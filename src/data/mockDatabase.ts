import { Customer, PredictionInput, PredictionResult, ModelMetrics, SegmentStat, RetentionTask } from '../types';

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-9281',
    name: 'Acme Enterprise Solutions',
    company: 'Acme Corp',
    email: 'contact@acme.com',
    gender: 'Male',
    seniorCitizen: false,
    partner: true,
    dependents: false,
    tenureMonths: 3,
    phoneService: true,
    multipleLines: 'Yes',
    internetService: 'Fiber optic',
    onlineSecurity: false,
    onlineBackup: false,
    deviceProtection: false,
    techSupport: false,
    streamingTV: true,
    streamingMovies: true,
    contract: 'Month-to-month',
    paperlessBilling: true,
    paymentMethod: 'Electronic check',
    monthlyCharges: 104.80,
    totalCharges: 314.40,
    churnProbability: 0.92,
    riskLevel: 'Critical',
    primaryRiskDriver: 'Month-to-month Fiber Optic without Tech Support',
    recommendedAction: 'Executive sponsor outreach & offer 20% discount on 1-Year renewal',
    status: 'Active',
    lastActivity: '2 hours ago'
  },
  {
    id: 'CUST-8412',
    name: 'Globex Logistics Network',
    company: 'Globex Inc',
    email: 'admin@globex.org',
    gender: 'Female',
    seniorCitizen: false,
    partner: false,
    dependents: false,
    tenureMonths: 5,
    phoneService: true,
    multipleLines: 'No',
    internetService: 'Fiber optic',
    onlineSecurity: false,
    onlineBackup: true,
    deviceProtection: false,
    techSupport: false,
    streamingTV: false,
    streamingMovies: true,
    contract: 'Month-to-month',
    paperlessBilling: true,
    paymentMethod: 'Electronic check',
    monthlyCharges: 89.20,
    totalCharges: 446.00,
    churnProbability: 0.88,
    riskLevel: 'Critical',
    primaryRiskDriver: 'Short tenure with high monthly charge & electronic check',
    recommendedAction: 'Schedule technical health check & bundle online security',
    status: 'Retention Contacted',
    lastActivity: '1 day ago'
  },
  {
    id: 'CUST-7731',
    name: 'Initech Systems',
    company: 'Initech Sys',
    email: 'ops@initech.net',
    gender: 'Male',
    seniorCitizen: true,
    partner: false,
    dependents: false,
    tenureMonths: 8,
    phoneService: true,
    multipleLines: 'Yes',
    internetService: 'DSL',
    onlineSecurity: false,
    onlineBackup: false,
    deviceProtection: true,
    techSupport: false,
    streamingTV: false,
    streamingMovies: false,
    contract: 'Month-to-month',
    paperlessBilling: true,
    paymentMethod: 'Mailed check',
    monthlyCharges: 55.40,
    totalCharges: 443.20,
    churnProbability: 0.74,
    riskLevel: 'High',
    primaryRiskDriver: 'No Tech Support on Month-to-month DSL',
    recommendedAction: 'Provide free 3-month trial of Premium Tech Support',
    status: 'Under Review',
    lastActivity: '3 hours ago'
  },
  {
    id: 'CUST-6109',
    name: 'Umbrella Corporation',
    company: 'Umbrella Co',
    email: 'billing@umbrella.io',
    gender: 'Female',
    seniorCitizen: false,
    partner: true,
    dependents: true,
    tenureMonths: 14,
    phoneService: true,
    multipleLines: 'Yes',
    internetService: 'Fiber optic',
    onlineSecurity: true,
    onlineBackup: false,
    deviceProtection: true,
    techSupport: false,
    streamingTV: true,
    streamingMovies: true,
    contract: 'Month-to-month',
    paperlessBilling: true,
    paymentMethod: 'Bank transfer (automatic)',
    monthlyCharges: 112.50,
    totalCharges: 1575.00,
    churnProbability: 0.68,
    riskLevel: 'High',
    primaryRiskDriver: 'High monthly bill with no long-term commitment',
    recommendedAction: 'Propose loyalty tier upgrade with 15% annual savings',
    status: 'Active',
    lastActivity: '5 hours ago'
  },
  {
    id: 'CUST-5290',
    name: 'Hooli Enterprises',
    company: 'Hooli Ent',
    email: 'accounts@hooli.com',
    gender: 'Male',
    seniorCitizen: false,
    partner: true,
    dependents: true,
    tenureMonths: 18,
    phoneService: true,
    multipleLines: 'No',
    internetService: 'DSL',
    onlineSecurity: true,
    onlineBackup: true,
    deviceProtection: false,
    techSupport: true,
    streamingTV: false,
    streamingMovies: false,
    contract: 'One year',
    paperlessBilling: false,
    paymentMethod: 'Credit card (automatic)',
    monthlyCharges: 64.10,
    totalCharges: 1153.80,
    churnProbability: 0.52,
    riskLevel: 'Medium',
    primaryRiskDriver: 'Upcoming contract expiration in 30 days',
    recommendedAction: 'Automated 1-Year renewal reminder with rate freeze bonus',
    status: 'Active',
    lastActivity: '12 hours ago'
  },
  {
    id: 'CUST-4110',
    name: 'Stark Industries',
    company: 'Stark Ind',
    email: 'support@stark.com',
    gender: 'Male',
    seniorCitizen: false,
    partner: true,
    dependents: true,
    tenureMonths: 64,
    phoneService: true,
    multipleLines: 'Yes',
    internetService: 'Fiber optic',
    onlineSecurity: true,
    onlineBackup: true,
    deviceProtection: true,
    techSupport: true,
    streamingTV: true,
    streamingMovies: true,
    contract: 'Two year',
    paperlessBilling: true,
    paymentMethod: 'Bank transfer (automatic)',
    monthlyCharges: 118.75,
    totalCharges: 7600.00,
    churnProbability: 0.08,
    riskLevel: 'Low',
    primaryRiskDriver: 'Low risk - High loyalty & full service bundle',
    recommendedAction: 'Nurture with early access to upcoming product features',
    status: 'Active',
    lastActivity: '1 day ago'
  },
  {
    id: 'CUST-3902',
    name: 'Wayne Enterprises',
    company: 'Wayne Ent',
    email: 'info@wayne.org',
    gender: 'Male',
    seniorCitizen: false,
    partner: true,
    dependents: false,
    tenureMonths: 48,
    phoneService: true,
    multipleLines: 'Yes',
    internetService: 'DSL',
    onlineSecurity: true,
    onlineBackup: true,
    deviceProtection: true,
    techSupport: true,
    streamingTV: false,
    streamingMovies: false,
    contract: 'Two year',
    paperlessBilling: false,
    paymentMethod: 'Credit card (automatic)',
    monthlyCharges: 72.30,
    totalCharges: 3470.40,
    churnProbability: 0.12,
    riskLevel: 'Low',
    primaryRiskDriver: 'Low risk - 2-Year Contract with high security bundle',
    recommendedAction: 'Quarterly account executive check-in',
    status: 'Active',
    lastActivity: '3 days ago'
  },
  {
    id: 'CUST-2840',
    name: 'Massive Dynamic',
    company: 'Massive Dyn',
    email: 'contact@massivedynamic.com',
    gender: 'Female',
    seniorCitizen: false,
    partner: false,
    dependents: false,
    tenureMonths: 2,
    phoneService: true,
    multipleLines: 'No',
    internetService: 'Fiber optic',
    onlineSecurity: false,
    onlineBackup: false,
    deviceProtection: false,
    techSupport: false,
    streamingTV: true,
    streamingMovies: false,
    contract: 'Month-to-month',
    paperlessBilling: true,
    paymentMethod: 'Electronic check',
    monthlyCharges: 81.15,
    totalCharges: 162.30,
    churnProbability: 0.89,
    riskLevel: 'Critical',
    primaryRiskDriver: 'New subscriber churn risk with Fiber Optic',
    recommendedAction: 'Trigger onboarding specialist welcome call & setup support',
    status: 'Active',
    lastActivity: '4 hours ago'
  }
];

export const MODEL_METRICS: ModelMetrics = {
  name: 'Gradient Boosting Classifier (Ensemble)',
  version: 'v1.4.2-prod',
  accuracy: 0.942,
  precision: 0.918,
  recall: 0.895,
  f1Score: 0.906,
  rocAuc: 0.948,
  confusionMatrix: {
    trueNegative: 4820,
    falsePositive: 330,
    falseNegative: 180,
    truePositive: 1713
  },
  featureImportances: [
    { feature: 'Contract Type (Month-to-month)', importance: 0.285, category: 'Account' },
    { feature: 'Tenure (Months)', importance: 0.210, category: 'Demographic' },
    { feature: 'Tech Support (Absence)', importance: 0.145, category: 'Services' },
    { feature: 'Internet Service (Fiber Optic)', importance: 0.125, category: 'Services' },
    { feature: 'Monthly Charges ($)', importance: 0.098, category: 'Billing' },
    { feature: 'Payment Method (Electronic Check)', importance: 0.062, category: 'Billing' },
    { feature: 'Online Security (Absence)', importance: 0.045, category: 'Services' },
    { feature: 'Paperless Billing', importance: 0.030, category: 'Billing' }
  ],
  hyperparameters: {
    'n_estimators': 300,
    'learning_rate': 0.05,
    'max_depth': 5,
    'subsample': 0.8,
    'min_samples_split': 10,
    'random_state': 42
  }
};

export const SEGMENT_STATS: SegmentStat[] = [
  // Contract
  { category: 'Contract', segment: 'Month-to-month', totalCustomers: 3875, churnCount: 1655, churnRate: 42.7, avgMonthlyCharge: 73.01, revenueAtRisk: 120831.55 },
  { category: 'Contract', segment: 'One year', totalCustomers: 1473, churnCount: 166, churnRate: 11.3, avgMonthlyCharge: 65.05, revenueAtRisk: 10798.30 },
  { category: 'Contract', segment: 'Two year', totalCustomers: 1695, churnCount: 48, churnRate: 2.8, avgMonthlyCharge: 60.02, revenueAtRisk: 2880.96 },

  // Internet
  { category: 'Internet', segment: 'Fiber optic', totalCustomers: 3096, churnCount: 1297, churnRate: 41.9, avgMonthlyCharge: 91.50, revenueAtRisk: 118675.50 },
  { category: 'Internet', segment: 'DSL', totalCustomers: 2421, churnCount: 459, churnRate: 18.9, avgMonthlyCharge: 58.10, revenueAtRisk: 26667.90 },
  { category: 'Internet', segment: 'No Internet', totalCustomers: 1526, churnCount: 113, churnRate: 7.4, avgMonthlyCharge: 21.08, revenueAtRisk: 2382.04 },

  // Payment Method
  { category: 'Payment Method', segment: 'Electronic check', totalCustomers: 2365, churnCount: 1071, churnRate: 45.3, avgMonthlyCharge: 76.25, revenueAtRisk: 81663.75 },
  { category: 'Payment Method', segment: 'Mailed check', totalCustomers: 1612, churnCount: 308, churnRate: 19.1, avgMonthlyCharge: 43.90, revenueAtRisk: 13521.20 },
  { category: 'Payment Method', segment: 'Bank transfer (auto)', totalCustomers: 1544, churnCount: 258, churnRate: 16.7, avgMonthlyCharge: 67.50, revenueAtRisk: 17415.00 },
  { category: 'Payment Method', segment: 'Credit card (auto)', totalCustomers: 1522, churnCount: 232, churnRate: 15.2, avgMonthlyCharge: 66.80, revenueAtRisk: 15497.60 },

  // Tenure Cohort
  { category: 'Tenure Cohort', segment: '0 - 12 Months', totalCustomers: 2186, churnCount: 1037, churnRate: 47.4, avgMonthlyCharge: 62.50, revenueAtRisk: 64812.50 },
  { category: 'Tenure Cohort', segment: '13 - 24 Months', totalCustomers: 1024, churnCount: 294, churnRate: 28.7, avgMonthlyCharge: 66.80, revenueAtRisk: 19639.20 },
  { category: 'Tenure Cohort', segment: '25 - 48 Months', totalCustomers: 1592, churnCount: 281, churnRate: 17.6, avgMonthlyCharge: 68.90, revenueAtRisk: 19360.90 },
  { category: 'Tenure Cohort', segment: '49+ Months', totalCustomers: 2241, churnCount: 257, churnRate: 11.5, avgMonthlyCharge: 74.20, revenueAtRisk: 19069.40 }
];

export const RETENTION_TASKS: RetentionTask[] = [
  {
    id: 'TASK-101',
    customerId: 'CUST-9281',
    customerName: 'Acme Enterprise Solutions',
    company: 'Acme Corp',
    churnProb: 0.92,
    monthlyValue: 104.80,
    riskLevel: 'Critical',
    action: 'Executive Sponsor Outreach & 20% Contract Discount',
    status: 'In Progress',
    assignedTo: 'Sarah Connor (CS Lead)',
    dueDate: 'Today'
  },
  {
    id: 'TASK-102',
    customerId: 'CUST-8412',
    customerName: 'Globex Logistics Network',
    company: 'Globex Inc',
    churnProb: 0.88,
    monthlyValue: 89.20,
    riskLevel: 'Critical',
    action: 'Tech Health Check & Complimentary Online Security Bundle',
    status: 'In Progress',
    assignedTo: 'Michael Scott (Retention)',
    dueDate: 'Tomorrow'
  },
  {
    id: 'TASK-103',
    customerId: 'CUST-7731',
    customerName: 'Initech Systems',
    company: 'Initech Sys',
    churnProb: 0.74,
    monthlyValue: 55.40,
    riskLevel: 'High',
    action: 'Offer 3 Months Free Tech Support Upgrade',
    status: 'Pending',
    assignedTo: 'Alex Mercer (Account Exec)',
    dueDate: 'Aug 2, 2026'
  },
  {
    id: 'TASK-104',
    customerId: 'CUST-6109',
    customerName: 'Umbrella Corporation',
    company: 'Umbrella Co',
    churnProb: 0.68,
    monthlyValue: 112.50,
    riskLevel: 'High',
    action: 'Loyalty Tier Renewal Package (15% Annual Discount)',
    status: 'Pending',
    assignedTo: 'Elena Rostova (CSM)',
    dueDate: 'Aug 3, 2026'
  },
  {
    id: 'TASK-105',
    customerId: 'CUST-2840',
    customerName: 'Massive Dynamic',
    company: 'Massive Dyn',
    churnProb: 0.89,
    monthlyValue: 81.15,
    riskLevel: 'Critical',
    action: 'Priority Onboarding Call & Fiber Line Quality Verification',
    status: 'Pending',
    assignedTo: 'David Miller (Tech Lead)',
    dueDate: 'Today'
  }
];

/**
 * Real-time Customer Churn Prediction ML Calculation Model
 * Implements a weighted logistic scoring function derived from standard telecom churn feature weights.
 */
export function predictCustomerChurn(input: PredictionInput): PredictionResult {
  let score = 0.0;
  const riskDrivers: { factor: string; impact: number; description: string }[] = [];

  // 1. Contract Type Impact (Highest Weight)
  if (input.contract === 'Month-to-month') {
    score += 0.35;
    riskDrivers.push({
      factor: 'Month-to-month Contract',
      impact: 0.35,
      description: 'Flexible contract allows immediate cancellation without fee.'
    });
  } else if (input.contract === 'One year') {
    score += 0.10;
  } else {
    score -= 0.15; // Two year contract reduces risk significantly
  }

  // 2. Internet Service & Tech Support Combo
  if (input.internetService === 'Fiber optic') {
    score += 0.20;
    if (!input.techSupport) {
      score += 0.12;
      riskDrivers.push({
        factor: 'Fiber Optic without Tech Support',
        impact: 0.12,
        description: 'High bandwidth expectation with no dedicated tech assistance.'
      });
    } else {
      riskDrivers.push({
        factor: 'Fiber Optic Service',
        impact: 0.10,
        description: 'Premium service tier prone to price sensitivity.'
      });
    }
  } else if (input.internetService === 'DSL') {
    score += 0.05;
  }

  // 3. Tenure Effect (Logarithmic decay)
  if (input.tenureMonths <= 3) {
    score += 0.25;
    riskDrivers.push({
      factor: 'Early Onboarding Phase (<= 3 Months)',
      impact: 0.25,
      description: 'Critical initial adoption window where abandonment is highest.'
    });
  } else if (input.tenureMonths <= 12) {
    score += 0.15;
    riskDrivers.push({
      factor: 'First Year Subscriber (4-12 Months)',
      impact: 0.15,
      description: 'Subscribers in 1st year exhibit 2.4x higher churn rate.'
    });
  } else if (input.tenureMonths >= 48) {
    score -= 0.25; // Loyal customer
  }

  // 4. Payment Method & Paperless
  if (input.paymentMethod === 'Electronic check') {
    score += 0.12;
    riskDrivers.push({
      factor: 'Electronic Check Payment',
      impact: 0.12,
      description: 'Manual transaction payment methods correlate with higher friction.'
    });
  }

  if (input.paperlessBilling) {
    score += 0.05;
  }

  // 5. Add-on Services Protective Factors
  if (!input.onlineSecurity && input.internetService !== 'No') {
    score += 0.08;
    riskDrivers.push({
      factor: 'Missing Online Security',
      impact: 0.08,
      description: 'Unprotected connections experience higher dissatisfaction rates.'
    });
  }
  if (!input.onlineBackup && input.internetService !== 'No') {
    score += 0.05;
  }

  // 6. Monthly Charge Sensitivity
  if (input.monthlyCharges > 85) {
    score += 0.10;
    riskDrivers.push({
      factor: 'High Monthly Billing (> $85/mo)',
      impact: 0.10,
      description: 'Premium pricing tier susceptible to competitor price matching.'
    });
  } else if (input.monthlyCharges < 35) {
    score -= 0.05;
  }

  // Normalize score between 0.02 and 0.98 using Sigmoid curve
  const sigmoidScore = 1 / (1 + Math.exp(-(score * 3.5 - 1.2)));
  const finalProb = Math.min(Math.max(Number(sigmoidScore.toFixed(3)), 0.02), 0.98);

  // Determine Risk Level
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (finalProb >= 0.80) riskLevel = 'Critical';
  else if (finalProb >= 0.60) riskLevel = 'High';
  else if (finalProb >= 0.35) riskLevel = 'Medium';

  // Calculate Financial Value at Risk
  const monthlyRevenueAtRisk = Number((input.monthlyCharges * finalProb).toFixed(2));
  const estimatedLtvLoss = Number((input.monthlyCharges * 24 * finalProb).toFixed(2));

  // Determine Retention Actions
  const retentionActions: { priority: 'High' | 'Medium' | 'Low'; action: string; impactDescription: string }[] = [];

  if (input.contract === 'Month-to-month') {
    retentionActions.push({
      priority: 'High',
      action: 'Convert to 1-Year or 2-Year Contract',
      impactDescription: 'Reduces predicted churn probability by up to 35% instantly with a 15% rate guarantee.'
    });
  }

  if (!input.techSupport && input.internetService !== 'No') {
    retentionActions.push({
      priority: 'High',
      action: 'Attach Free 3-Month Tech Support & Security Bundle',
      impactDescription: 'Improves customer satisfaction score and lowers risk by 12%.'
    });
  }

  if (input.paymentMethod === 'Electronic check') {
    retentionActions.push({
      priority: 'Medium',
      action: 'Incentivize Auto-Pay via Credit Card / Bank Transfer',
      impactDescription: 'Provide a $10 one-time billing credit for enabling auto-pay.'
    });
  }

  if (retentionActions.length === 0) {
    retentionActions.push({
      priority: 'Low',
      action: 'Regular Account Health Check & Loyalty Perk',
      impactDescription: 'Maintain existing relationship with annual satisfaction survey.'
    });
  }

  return {
    churnProbability: finalProb,
    riskLevel,
    monthlyRevenueAtRisk,
    estimatedLtvLoss,
    riskDrivers,
    retentionActions
  };
}