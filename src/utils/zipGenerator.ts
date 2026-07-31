import JSZip from 'jszip';
import { SAMPLE_CUSTOMERS, RETENTION_TASKS, MODEL_METRICS, SEGMENT_STATS } from '../data/mockDatabase';

/**
 * Generates a ZIP archive containing customer churn prediction data,
 * analytics summary reports, and retention task action plans.
 */
export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Customer Churn Predictions CSV
  const csvHeader = 'Customer ID,Name,Tenure (Months),Monthly Charges ($),Contract,Internet Service,Tech Support,Churn Probability,Risk Level,Monthly Revenue at Risk ($)\n';
  const csvRows = SAMPLE_CUSTOMERS.map((c) => {
    const revenueAtRisk = (c.monthlyCharges * c.churnProbability).toFixed(2);
    return `"${c.id}","${c.name}",${c.tenureMonths},${c.monthlyCharges},"${c.contract}","${c.internetService}",${c.techSupport},${c.churnProbability.toFixed(3)},"${c.riskLevel}",${revenueAtRisk}`;
  }).join('\n');

  zip.file('customer_churn_predictions.csv', csvHeader + csvRows);

  // 2. Retention Tasks Action Plan CSV
  const taskHeader = 'Task ID,Customer ID,Customer Name,Action Item,Risk Level,Assigned Agent,Status,Monthly Value ($),Due Date\n';
  const taskRows = RETENTION_TASKS.map((t) => {
    return `"${t.id}","${t.customerId}","${t.customerName}","${t.action}","${t.riskLevel}","${t.assignedTo}","${t.status}",${t.monthlyValue},"${t.dueDate}"`;
  }).join('\n');

  zip.file('retention_action_plan.csv', taskHeader + taskRows);

  // 3. Churn Analytics & Model Performance Summary (JSON)
  const totalRevenueAtRisk = SAMPLE_CUSTOMERS.reduce((acc, c) => acc + (c.monthlyCharges * c.churnProbability), 0);
  const avgChurnProb = SAMPLE_CUSTOMERS.reduce((acc, c) => acc + c.churnProbability, 0) / SAMPLE_CUSTOMERS.length;

  const analyticsReport = {
    exportedAt: new Date().toISOString(),
    summary: {
      totalCustomers: SAMPLE_CUSTOMERS.length,
      averageChurnProbability: Number(avgChurnProb.toFixed(4)),
      totalMonthlyRevenueAtRisk: Number(totalRevenueAtRisk.toFixed(2)),
      activeRetentionTasks: RETENTION_TASKS.length
    },
    modelMetrics: MODEL_METRICS,
    segmentStatistics: SEGMENT_STATS
  };

  zip.file('churn_analytics_summary.json', JSON.stringify(analyticsReport, null, 2));

  // 4. Data Package Overview Text File
  const readmeContent = `Customer Churn Prediction - Analytics Export Package
===================================================

Contents of this export package:
1. customer_churn_predictions.csv - Customer records with churn risk scores and revenue impact.
2. retention_action_plan.csv      - Priority retention tasks and assigned account managers.
3. churn_analytics_summary.json  - High-level churn performance metrics and segment breakdown.

Export Generated: ${new Date().toLocaleString()}
`;

  zip.file('EXPORT_SUMMARY.txt', readmeContent);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Triggers a browser file download for a given Blob object.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
