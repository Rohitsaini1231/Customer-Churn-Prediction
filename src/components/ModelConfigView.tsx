import React, { useState } from 'react';
import { MODEL_METRICS } from '../data/mockDatabase';
import { Sliders, Cpu, Activity, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ModelConfigView: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Gradient Boosting Classifier');
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainSuccess, setRetrainSuccess] = useState<boolean>(false);

  const [hyperparams, setHyperparams] = useState({
    nEstimators: 300,
    learningRate: 0.05,
    maxDepth: 5,
    subsample: 0.8
  });

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainSuccess(false);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#F8FAFC]">
      {/* Top Banner: Classifier Selector & Retrain trigger */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active ML Classifier Configuration</h2>
          </div>
          <p className="text-xs text-slate-500">Inspect model evaluation metrics, feature weights, and cross-validation matrix</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="Gradient Boosting Classifier">Gradient Boosting Classifier (Active)</option>
            <option value="Random Forest Classifier">Random Forest Classifier</option>
            <option value="XGBoost Classifier">XGBoost Classifier</option>
            <option value="Logistic Regression">Logistic Regression (Baseline)</option>
          </select>

          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining Model...' : 'Retrain Engine'}</span>
          </button>
        </div>
      </div>

      {retrainSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Model retrained successfully! 5-fold cross-validation accuracy: 94.4% (+0.2% improvement). Weights updated.</span>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Accuracy</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{(MODEL_METRICS.accuracy * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">+0.8% vs base</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">ROC-AUC</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{MODEL_METRICS.rocAuc.toFixed(3)}</span>
          <span className="text-[10px] text-blue-600 font-bold block mt-1">Excellent separation</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Precision</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{(MODEL_METRICS.precision * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">Low false alarms</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recall</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{(MODEL_METRICS.recall * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-1">High churn capture</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">F1 Score</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{MODEL_METRICS.f1Score.toFixed(3)}</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Balanced metric</span>
        </div>
      </div>

      {/* Feature Importance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Feature Importance Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Feature Importance Weights</h3>
              <p className="text-xs text-slate-500">Relative contribution of each feature to churn prediction decision trees</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MODEL_METRICS.featureImportances}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '6px', color: '#FFF' }}
                  formatter={(val: any) => [`${(val * 100).toFixed(1)}%`, 'Weight']}
                />
                <Bar dataKey="importance" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 cols: Confusion Matrix & Hyperparameters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Confusion Matrix */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
              Cross-Validation Confusion Matrix
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
              <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">True Negative</span>
                <span className="text-xl font-bold text-emerald-900">{MODEL_METRICS.confusionMatrix.trueNegative}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Retained Correctly</span>
              </div>
              <div className="p-4 bg-amber-50 rounded border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">False Positive</span>
                <span className="text-xl font-bold text-amber-900">{MODEL_METRICS.confusionMatrix.falsePositive}</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">False Alarm</span>
              </div>
              <div className="p-4 bg-red-50 rounded border border-red-200">
                <span className="text-[10px] uppercase font-bold text-red-800 block">False Negative</span>
                <span className="text-xl font-bold text-red-900">{MODEL_METRICS.confusionMatrix.falseNegative}</span>
                <span className="text-[10px] text-red-700 block mt-0.5">Missed Churn</span>
              </div>
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-800 block">True Positive</span>
                <span className="text-xl font-bold text-blue-900">{MODEL_METRICS.confusionMatrix.truePositive}</span>
                <span className="text-[10px] text-blue-700 block mt-0.5">Churn Detected</span>
              </div>
            </div>
          </div>

          {/* Hyperparameter Tuning Form */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
              Hyperparameter Controls
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700">N Estimators (Trees)</label>
                <input
                  type="number"
                  value={hyperparams.nEstimators}
                  onChange={(e) => setHyperparams({ ...hyperparams, nEstimators: Number(e.target.value) })}
                  className="w-20 p-1 bg-slate-50 border border-slate-200 rounded font-mono text-center font-bold"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700">Learning Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={hyperparams.learningRate}
                  onChange={(e) => setHyperparams({ ...hyperparams, learningRate: Number(e.target.value) })}
                  className="w-20 p-1 bg-slate-50 border border-slate-200 rounded font-mono text-center font-bold"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700">Max Tree Depth</label>
                <input
                  type="number"
                  value={hyperparams.maxDepth}
                  onChange={(e) => setHyperparams({ ...hyperparams, maxDepth: Number(e.target.value) })}
                  className="w-20 p-1 bg-slate-50 border border-slate-200 rounded font-mono text-center font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
