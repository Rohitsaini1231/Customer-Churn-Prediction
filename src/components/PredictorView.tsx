import React, { useState, useEffect } from 'react';
import { Customer, PredictionInput, PredictionResult } from '../types';
import { predictCustomerChurn, SAMPLE_CUSTOMERS } from '../data/mockDatabase';
import { Calculator, ShieldAlert, Sparkles, Check, AlertCircle, RefreshCw, DollarSign, Activity } from 'lucide-react';

interface PredictorViewProps {
  initialCustomer?: Customer | null;
}

export const PredictorView: React.FC<PredictorViewProps> = ({ initialCustomer }) => {
  const [input, setInput] = useState<PredictionInput>({
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
    totalCharges: 314.40
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('acme');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialCustomer) {
      setInput({
        seniorCitizen: initialCustomer.seniorCitizen,
        partner: initialCustomer.partner,
        dependents: initialCustomer.dependents,
        tenureMonths: initialCustomer.tenureMonths,
        phoneService: initialCustomer.phoneService,
        multipleLines: initialCustomer.multipleLines,
        internetService: initialCustomer.internetService,
        onlineSecurity: initialCustomer.onlineSecurity,
        onlineBackup: initialCustomer.onlineBackup,
        deviceProtection: initialCustomer.deviceProtection,
        techSupport: initialCustomer.techSupport,
        streamingTV: initialCustomer.streamingTV,
        streamingMovies: initialCustomer.streamingMovies,
        contract: initialCustomer.contract,
        paperlessBilling: initialCustomer.paperlessBilling,
        paymentMethod: initialCustomer.paymentMethod,
        monthlyCharges: initialCustomer.monthlyCharges,
        totalCharges: initialCustomer.totalCharges
      });
      setSelectedPreset('custom');
    }
  }, [initialCustomer]);

  // Recalculate whenever input changes
  useEffect(() => {
    const res = predictCustomerChurn(input);
    setPrediction(res);
  }, [input]);

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === 'acme') {
      const acme = SAMPLE_CUSTOMERS[0];
      setInput({
        seniorCitizen: acme.seniorCitizen,
        partner: acme.partner,
        dependents: acme.dependents,
        tenureMonths: acme.tenureMonths,
        phoneService: acme.phoneService,
        multipleLines: acme.multipleLines,
        internetService: acme.internetService,
        onlineSecurity: acme.onlineSecurity,
        onlineBackup: acme.onlineBackup,
        deviceProtection: acme.deviceProtection,
        techSupport: acme.techSupport,
        streamingTV: acme.streamingTV,
        streamingMovies: acme.streamingMovies,
        contract: acme.contract,
        paperlessBilling: acme.paperlessBilling,
        paymentMethod: acme.paymentMethod,
        monthlyCharges: acme.monthlyCharges,
        totalCharges: acme.totalCharges
      });
    } else if (presetKey === 'loyal') {
      const stark = SAMPLE_CUSTOMERS[5];
      setInput({
        seniorCitizen: stark.seniorCitizen,
        partner: stark.partner,
        dependents: stark.dependents,
        tenureMonths: stark.tenureMonths,
        phoneService: stark.phoneService,
        multipleLines: stark.multipleLines,
        internetService: stark.internetService,
        onlineSecurity: stark.onlineSecurity,
        onlineBackup: stark.onlineBackup,
        deviceProtection: stark.deviceProtection,
        techSupport: stark.techSupport,
        streamingTV: stark.streamingTV,
        streamingMovies: stark.streamingMovies,
        contract: stark.contract,
        paperlessBilling: stark.paperlessBilling,
        paymentMethod: stark.paymentMethod,
        monthlyCharges: stark.monthlyCharges,
        totalCharges: stark.totalCharges
      });
    } else if (presetKey === 'new_fiber') {
      setInput({
        seniorCitizen: false,
        partner: false,
        dependents: false,
        tenureMonths: 1,
        phoneService: true,
        multipleLines: 'No',
        internetService: 'Fiber optic',
        onlineSecurity: false,
        onlineBackup: false,
        deviceProtection: false,
        techSupport: false,
        streamingTV: false,
        streamingMovies: false,
        contract: 'Month-to-month',
        paperlessBilling: true,
        paymentMethod: 'Electronic check',
        monthlyCharges: 85.00,
        totalCharges: 85.00
      });
    }
  };

  const handleInputChange = (field: keyof PredictionInput, value: any) => {
    setSelectedPreset('custom');
    setInput(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'tenureMonths' || field === 'monthlyCharges') {
        next.totalCharges = Number((next.tenureMonths * next.monthlyCharges).toFixed(2));
      }
      return next;
    });
  };

  const handleExecuteAction = (actionName: string) => {
    setActionSuccess(`Retention task queued: "${actionName}"`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const probPercent = prediction ? Math.round(prediction.churnProbability * 100) : 0;

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#F8FAFC]">
      {/* Preset Selector Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quick Profile Presets</h2>
          <p className="text-xs text-slate-500">Load sample customer profiles to simulate real-time scoring</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePresetSelect('acme')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              selectedPreset === 'acme' ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Acme Corp (High Risk)
          </button>
          <button
            onClick={() => handlePresetSelect('new_fiber')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              selectedPreset === 'new_fiber' ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            New Fiber Optic
          </button>
          <button
            onClick={() => handlePresetSelect('loyal')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              selectedPreset === 'loyal' ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Stark Ind (Loyal)
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Interactive Parameter Controls */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-base">Customer Parameters</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Live Calibration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Contract Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contract Commitment</label>
              <select
                value={input.contract}
                onChange={(e) => handleInputChange('contract', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Month-to-month">Month-to-month (High Risk)</option>
                <option value="One year">One year (Moderate Risk)</option>
                <option value="Two year">Two year (Low Risk)</option>
              </select>
            </div>

            {/* Tenure Months */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tenure (Months): <span className="font-mono text-blue-600">{input.tenureMonths}</span></label>
              <input
                type="range"
                min="1"
                max="72"
                value={input.tenureMonths}
                onChange={(e) => handleInputChange('tenureMonths', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer mt-2"
              />
            </div>

            {/* Internet Service */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Internet Service Type</label>
              <select
                value={input.internetService}
                onChange={(e) => handleInputChange('internetService', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Fiber optic">Fiber optic (Premium Tier)</option>
                <option value="DSL">DSL (Standard Tier)</option>
                <option value="No">No Internet Service</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={input.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Electronic check">Electronic check</option>
                <option value="Mailed check">Mailed check</option>
                <option value="Bank transfer (automatic)">Bank transfer (auto)</option>
                <option value="Credit card (automatic)">Credit card (auto)</option>
              </select>
            </div>

            {/* Monthly Charges */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Charges ($)</label>
              <input
                type="number"
                value={input.monthlyCharges}
                onChange={(e) => handleInputChange('monthlyCharges', Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Total Charges (Calculated) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Est. Lifetime Billing ($)</label>
              <input
                type="number"
                disabled
                value={input.totalCharges}
                className="w-full p-2 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-slate-600"
              />
            </div>
          </div>

          {/* Add-on Services Toggles */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">
              Add-On Security & Support Bundles
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={input.techSupport}
                  onChange={(e) => handleInputChange('techSupport', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="font-semibold text-slate-700">Tech Support</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={input.onlineSecurity}
                  onChange={(e) => handleInputChange('onlineSecurity', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="font-semibold text-slate-700">Online Security</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={input.onlineBackup}
                  onChange={(e) => handleInputChange('onlineBackup', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="font-semibold text-slate-700">Online Backup</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={input.paperlessBilling}
                  onChange={(e) => handleInputChange('paperlessBilling', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="font-semibold text-slate-700">Paperless Billing</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={input.seniorCitizen}
                  onChange={(e) => handleInputChange('seniorCitizen', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="font-semibold text-slate-700">Senior Citizen</span>
              </label>

              <label className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={input.partner}
                  onChange={(e) => handleInputChange('partner', e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span className="font-semibold text-slate-700">Partner / Family</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Live Machine Learning Score Output */}
        <div className="lg:col-span-5 space-y-6">
          {/* Churn Score Gauge Container */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Machine Learning Score</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                prediction?.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                prediction?.riskLevel === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {prediction?.riskLevel} Risk
              </span>
            </div>

            <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
              <div className={`text-5xl font-black ${
                probPercent >= 80 ? 'text-red-600' : probPercent >= 60 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {probPercent}%
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Churn Probability Score</p>

              {/* Progress bar */}
              <div className="w-3/4 mx-auto h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    probPercent >= 80 ? 'bg-red-600' : probPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${probPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Financial Risk Estimation */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900 text-white rounded-md text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly At-Risk Value</span>
                <span className="text-base font-mono font-bold text-amber-400">${prediction?.monthlyRevenueAtRisk}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">24-Mo Est. LTV Loss</span>
                <span className="text-base font-mono font-bold text-red-400">${prediction?.estimatedLtvLoss}</span>
              </div>
            </div>
          </div>

          {/* Risk Factors Breakdown */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Top Risk Drivers</h4>
            {prediction?.riskDrivers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No significant churn risk drivers detected for this profile.</p>
            ) : (
              prediction?.riskDrivers.map((driver, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{driver.factor}</span>
                    <span className="text-red-600 font-mono">+{Math.round(driver.impact * 100)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{driver.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Automated Retention Playbook */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Recommended Intervention Playbook</h4>
            {prediction?.retentionActions.map((action, idx) => (
              <div key={idx} className="p-3 bg-blue-50/50 rounded border border-blue-100 text-xs space-y-2">
                <div className="font-bold text-blue-900 flex justify-between items-center">
                  <span>{action.action}</span>
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px] uppercase">
                    {action.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{action.impactDescription}</p>
                <button
                  onClick={() => handleExecuteAction(action.action)}
                  className="w-full mt-1 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded text-[11px] font-semibold transition-colors"
                >
                  Queue Retention Task
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};