export type ContractType = 'Month-to-month' | 'One year' | 'Two year';
export type InternetServiceType = 'DSL' | 'Fiber optic' | 'No';
export type PaymentMethodType = 'Electronic check' | 'Mailed check' | 'Bank transfer (automatic)' | 'Credit card (automatic)';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  gender: 'Male' | 'Female';
  seniorCitizen: boolean;
  partner: boolean;
  dependents: boolean;
  tenureMonths: number;
  phoneService: boolean;
  multipleLines: 'Yes' | 'No' | 'No phone service';
  internetService: InternetServiceType;
  onlineSecurity: boolean;
  onlineBackup: boolean;
  deviceProtection: boolean;
  techSupport: boolean;
  streamingTV: boolean;
  streamingMovies: boolean;
  contract: ContractType;
  paperlessBilling: boolean;
  paymentMethod: PaymentMethodType;
  monthlyCharges: number;
  totalCharges: number;
  churnProbability: number; // 0.0 - 1.0
  riskLevel: RiskLevel;
  primaryRiskDriver: string;
  recommendedAction: string;
  status: 'Active' | 'Under Review' | 'Retention Contacted' | 'Churned';
  lastActivity: string;
}

export interface PredictionInput {
  seniorCitizen: boolean;
  partner: boolean;
  dependents: boolean;
  tenureMonths: number;
  phoneService: boolean;
  multipleLines: 'Yes' | 'No' | 'No phone service';
  internetService: InternetServiceType;
  onlineSecurity: boolean;
  onlineBackup: boolean;
  deviceProtection: boolean;
  techSupport: boolean;
  streamingTV: boolean;
  streamingMovies: boolean;
  contract: ContractType;
  paperlessBilling: boolean;
  paymentMethod: PaymentMethodType;
  monthlyCharges: number;
  totalCharges: number;
}

export interface PredictionResult {
  churnProbability: number;
  riskLevel: RiskLevel;
  monthlyRevenueAtRisk: number;
  estimatedLtvLoss: number;
  riskDrivers: { factor: string; impact: number; description: string }[];
  retentionActions: { priority: 'High' | 'Medium' | 'Low'; action: string; impactDescription: string }[];
}

export interface ModelMetrics {
  name: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  };
  featureImportances: { feature: string; importance: number; category: string }[];
  hyperparameters: { [key: string]: string | number };
}

export interface SegmentStat {
  category: string;
  segment: string;
  totalCustomers: number;
  churnCount: number;
  churnRate: number;
  avgMonthlyCharge: number;
  revenueAtRisk: number;
}

export interface RetentionTask {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  churnProb: number;
  monthlyValue: number;
  riskLevel: RiskLevel;
  action: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Escalated';
  assignedTo: string;
  dueDate: string;
}
