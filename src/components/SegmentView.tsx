import React, { useState } from 'react';
import { SEGMENT_STATS } from '../data/mockDatabase';
import { PieChart as PieIcon, BarChart3, Layers, Filter, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const SegmentView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Contract');

  const categories = ['Contract', 'Internet', 'Payment Method', 'Tenure Cohort'];

  const filteredStats = SEGMENT_STATS.filter(s => s.category === selectedCategory);

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#F8FAFC]">
      {/* Category Filter Tabs */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cohort Segment Breakdown</h2>
          <p className="text-xs text-slate-500">Analyze churn velocity and revenue exposure across business dimensions</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visuals & Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-base">{selectedCategory} Churn Rate Comparison (%)</h3>
              <p className="text-xs text-slate-500">Percentage of accounts churned within segment</p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono font-bold">
              {filteredStats.length} Segments
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="segment" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="%" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '6px', color: '#FFF' }}
                  formatter={(val: any) => [`${val}%`, 'Churn Rate']}
                />
                <Bar dataKey="churnRate" radius={[4, 4, 0, 0]}>
                  {filteredStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.churnRate > 30 ? '#EF4444' : entry.churnRate > 15 ? '#F59E0B' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Summary Cards */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
            Financial Impact Summary
          </h3>
          <div className="space-y-3">
            {filteredStats.map((stat, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>{stat.segment}</span>
                  <span className={`font-mono ${stat.churnRate > 30 ? 'text-red-600' : 'text-slate-700'}`}>
                    {stat.churnRate}% Churn
                  </span>
                </div>
                <div className="grid grid-cols-2 text-[11px] text-slate-500 pt-1 font-mono">
                  <span>Total Accts: {stat.totalCustomers.toLocaleString()}</span>
                  <span className="text-right">Risk: ${Math.round(stat.revenueAtRisk).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Segment Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Segment Data Breakdown</h3>
          <span className="text-xs text-slate-500 font-mono">Cohort Sample: 7,043 Accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-3.5">Dimension</th>
                <th className="p-3.5">Segment Name</th>
                <th className="p-3.5 text-right">Total Accounts</th>
                <th className="p-3.5 text-right">Churned Accounts</th>
                <th className="p-3.5 text-right">Churn Rate</th>
                <th className="p-3.5 text-right">Avg Monthly Charge</th>
                <th className="p-3.5 text-right">Total Risk Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SEGMENT_STATS.map((stat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors font-medium text-slate-700">
                  <td className="p-3.5 font-semibold text-slate-900">{stat.category}</td>
                  <td className="p-3.5">{stat.segment}</td>
                  <td className="p-3.5 text-right font-mono">{stat.totalCustomers.toLocaleString()}</td>
                  <td className="p-3.5 text-right font-mono">{stat.churnCount.toLocaleString()}</td>
                  <td className="p-3.5 text-right font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      stat.churnRate > 35 ? 'bg-red-50 text-red-600' : stat.churnRate > 15 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {stat.churnRate}%
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono">${stat.avgMonthlyCharge.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    ${Math.round(stat.revenueAtRisk).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
