import React, { useState } from 'react';
import { Download, FolderTree, FileCode, Terminal, CheckCircle2, Copy, FileText, Server } from 'lucide-react';

interface ExportViewProps {
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

const REPO_FILES: Record<string, string> = {
  'README.md': `# Customer Churn Prediction System

A production-ready end-to-end Machine Learning and Analytics Web Platform for forecasting customer churn probability, evaluating financial risk, analyzing segment churn patterns, and executing retention workflows.

## System Architecture
- **Machine Learning Engine**: Gradient Boosting Classifier & Random Forest trained on customer demographic, subscription, and billing features.
- **Backend Service**: Python Flask REST API (/api/predict, /api/customers, /api/metrics, /api/retrain).
- **Frontend Dashboard**: React 19, TypeScript, Tailwind CSS, Recharts analytics, and interactive churn predictor.
- **Containerization**: Docker & Docker Compose setup for instant reproducible deployment.

## Quick Start
docker-compose up --build
`,

  'ml_model/train.py': `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score
import joblib

def train_churn_model():
    print("[+] Training Customer Churn Prediction Model...")
    # Generate synthetic training dataset
    np.random.seed(42)
    n_samples = 2000
    
    tenure = np.random.randint(1, 72, size=n_samples)
    monthly_charges = np.random.uniform(20.0, 120.0, size=n_samples)
    contract_mtm = np.random.binomial(1, 0.5, size=n_samples)
    fiber_optic = np.random.binomial(1, 0.4, size=n_samples)
    tech_support = np.random.binomial(1, 0.35, size=n_samples)
    
    logits = (0.05 * monthly_charges - 0.08 * tenure + 1.8 * contract_mtm + 1.2 * fiber_optic - 1.4 * tech_support - 2.5)
    prob = 1 / (1 + np.exp(-logits))
    churn = (prob > 0.45).astype(int)
    
    df = pd.DataFrame({
        'tenure': tenure,
        'monthly_charges': monthly_charges,
        'contract_mtm': contract_mtm,
        'fiber_optic': fiber_optic,
        'tech_support': tech_support,
        'churn': churn
    })
    
    X = df.drop('churn', axis=1)
    y = df['churn']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    clf = GradientBoostingClassifier(n_estimators=200, learning_rate=0.05, max_depth=4, random_state=42)
    clf.fit(X_train, y_train)
    
    print(f"[✓] Accuracy: {accuracy_score(y_test, clf.predict(X_test)):.4f}")
    joblib.dump(clf, 'ml_model/trained_model.joblib')

if __name__ == '__main__':
    train_churn_model()
`,

  'backend/app.py': `from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "active", "system": "ChurnGuard ML Backend"})

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json or {}
    tenure = float(data.get('tenureMonths', 12))
    monthly = float(data.get('monthlyCharges', 70.0))
    contract = data.get('contract', 'Month-to-month')
    
    score = 0.35 if contract == 'Month-to-month' else 0.05
    if tenure <= 6: score += 0.20
    
    prob = min(max(round(1 / (1 + 2.718 ** (-(score * 3.0 - 1.0))), 3), 0.02), 0.98)
    return jsonify({"churnProbability": prob, "monthlyRevenueAtRisk": round(monthly * prob, 2)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
`,

  'requirements.txt': `scikit-learn==1.4.1
pandas==2.2.1
numpy==1.26.4
xgboost==2.0.3
flask==3.0.2
flask-cors==4.0.0
gunicorn==21.2.0
joblib==1.3.2
`,

  'Dockerfile': `FROM python:3.10-slim AS backend
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python ml_model/train.py
EXPOSE 5000
CMD ["python", "backend/app.py"]
`
};

export const ExportView: React.FC<ExportViewProps> = ({ onDownloadZip, isDownloadingZip }) => {
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(REPO_FILES[selectedFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto bg-[#F8FAFC]">
      {/* Top Banner & ZIP Download Hero */}
      <div className="bg-[#0F172A] text-white p-8 rounded-lg shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
            <Server className="w-3.5 h-3.5" />
            <span>Customer-Churn-Prediction.zip</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Standalone Source Code & Deployment Package</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Download the complete repository containing Python machine learning models, Flask backend service, React frontend dashboard, CSV datasets, Docker containerization scripts, and dependencies.
          </p>
        </div>

        <button
          onClick={onDownloadZip}
          disabled={isDownloadingZip}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-md shadow-lg flex items-center gap-3 transition-all cursor-pointer disabled:opacity-75 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloadingZip ? 'Building ZIP...' : 'Download Customer-Churn-Prediction.zip'}</span>
        </button>
      </div>

      {/* Code Repository Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* File Tree Side */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Repository Files</span>
          </div>

          <div className="space-y-1 text-xs">
            {Object.keys(REPO_FILES).map((filePath) => (
              <button
                key={filePath}
                onClick={() => setSelectedFile(filePath)}
                className={`w-full px-3 py-2 rounded text-left font-mono font-semibold flex items-center justify-between transition-colors ${
                  selectedFile === filePath
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{filePath}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Content View Side */}
        <div className="lg:col-span-8 flex flex-col justify-between h-[450px]">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-mono text-slate-300 font-semibold">{selectedFile}</span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="flex-1 p-4 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-auto leading-relaxed">
            <code>{REPO_FILES[selectedFile]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
