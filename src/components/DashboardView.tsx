import React, { useState } from 'react';
import { Customer, RetentionTask } from '../types';
import { ArrowUpRight, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardViewProps {
  customers: Customer[];
  tasks: RetentionTask[];
  onSelectCustomer: (cust: Customer) => void;
  onNavigateToPredictor: () => void;
  onNavigateToSegment: () => void;
}

const MONTHLY_DATA = [
  { month: 'JAN', churnCount: 142, revenueLoss: 12400 },
  { month: 'FEB', churnCount: 135, revenueLoss: 11800 },
  { month: 'MAR', churnCount: 168, revenueLoss: 15200 },
  { month: 'APR', churnCount: 128, revenueLoss: 11200 },
  { month: 'MAY', churnCount: 145, revenueLoss: 13100 },
  { month: 'JUN', churnCount: 158, revenueLoss: 14600 },
  { month: 'JUL', churnCount: 182, revenueLoss: 16800 },
  { month: 'AUG', churnCount: 139, revenueLoss: 12900 }
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  tasks,
  onSelectCustomer,
  onNavigateToPredictor,
  onNavigateToSegment
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Top High Risk Customers
  const highRiskCustomers = [...customers]
    .sort((a, b) => b.churnProbability - a.churnProbability)
    .slice(0, 5);

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#F8FAFC]">
      {/* Top Stats Cards Matching Design HTML */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Churn Propensity */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Churn Propensity</div>
            <span className="p-1.5 bg-red-50 text-red-600 rounded">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
            14.2%
            <span className="text-sm font-semibold text-red-500">+1.2%</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[14.2%] transition-all duration-500"></div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>Industry Benchmark: 18.5%</span>
            <span className="text-emerald-600 font-bold">-4.3% better</span>
          </div>
        </div>

        {/* Card 2: Revenue at Risk */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Revenue at Risk</div>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900">$52,840</div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[42%] transition-all duration-500"></div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>High Risk Accounts: 48</span>
            <span className="text-slate-700 font-semibold">$1,100 avg/acct</span>
          </div>
        </div>

        {/* Card 3: Active Retention Tasks */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Retention Tasks</div>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900">248</div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[65%] transition-all duration-500"></div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-medium">
            <span>Resolution Rate: 84%</span>
            <span className="text-blue-600 font-bold">18 pending today</span>
          </div>
        </div>
      </div>

      {/* Main Visual & List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart Placeholder / Interactive Monthly Distribution */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Monthly Churn Distribution</h3>
              <p className="text-xs text-slate-500">Historical churn volume & monthly loss trend</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                <span className="text-slate-600">Actual Churn</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
                <span className="text-slate-500">Target Benchmark</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '6px', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', color: '#94A3B8' }}
                  formatter={(value: any) => [`${value} Customers`, 'Churned']}
                />
                <Bar dataKey="churnCount" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-800">Peak Churn Month:</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded">JUL (182)</span>
            </div>
            <button
              onClick={onNavigateToSegment}
              className="text-blue-600 hover:text-blue-800 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1"
            >
              <span>Explore Cohorts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Priority Risk List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Priority Risk List</span>
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Immediate Action
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="text-left p-3.5">Entity</th>
                  <th className="text-right p-3.5">Prob.</th>
                  <th className="text-right p-3.5">Value</th>
                  <th className="text-center p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {highRiskCustomers.map((cust) => {
                  const probPercent = Math.round(cust.churnProbability * 100);
                  const isCritical = probPercent >= 80;
                  const isHigh = probPercent >= 65 && probPercent < 80;

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 text-xs">{cust.company || cust.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{cust.contract}</div>
                      </td>
                      <td className="p-3.5 text-right font-bold text-xs">
                        <span className={`px-2 py-0.5 rounded font-mono ${
                          isCritical ? 'bg-red-50 text-red-600' : isHigh ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {probPercent}%
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-xs font-semibold text-slate-800">
                        ${cust.monthlyCharges}/mo
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onSelectCustomer(cust)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-blue-600 text-white rounded transition-colors"
                        >
                          Scoring
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
            <button
              onClick={onNavigateToPredictor}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
            >
              Run Single Customer Prediction →
            </button>
          </div>
        </div>
      </div>

      {/* Primary Churn Drivers & Automated Retention Playbooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Top Machine Learning Risk Factors</span>
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-800">Month-to-month Contract</span>
                <span className="text-xs font-bold text-red-600">+35% Churn Risk</span>
              </div>
              <p className="text-[11px] text-slate-500">Customers without annual contract commitment show 4.2x higher churn probability.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-800">Fiber Optic without Tech Support</span>
                <span className="text-xs font-bold text-red-600">+22% Churn Risk</span>
              </div>
              <p className="text-[11px] text-slate-500">High bandwidth expectations paired with self-service support leads to onboarding churn.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-800">Electronic Check Payment Method</span>
                <span className="text-xs font-bold text-amber-600">+12% Churn Risk</span>
              </div>
              <p className="text-[11px] text-slate-500">Manual payment friction causes billing gaps and unintentional subscriber loss.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Automated Retention Tasks Queue</span>
          </h3>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div key={task.id} className="p-3 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800">{task.company || task.customerName}</div>
                  <div className="text-[11px] text-slate-500">{task.action}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {task.assignedTo.split(' ')[0]}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{task.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
