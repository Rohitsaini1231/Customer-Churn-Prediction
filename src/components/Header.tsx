import React from 'react';
import { Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onDownloadZip,
  isDownloadingZip
}) => {
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Prediction Overview',
      subtitle: 'Last trained: Today at 04:22 AM (UTC)'
    },
    predictor: {
      title: 'Interactive Churn Predictor',
      subtitle: 'Real-time Machine Learning scoring engine'
    },
    segment: {
      title: 'Segment Analysis & Cohorts',
      subtitle: 'Deep dive into customer churn distribution across categories'
    },
    model: {
      title: 'Model Config & Calibration',
      subtitle: 'Classifier hyperparameters, feature importances & ROC metrics'
    },
    export: {
      title: 'Export Service & Source Package',
      subtitle: 'Full codebase repository archive & standalone Docker setup'
    }
  };

  const { title, subtitle } = titles[activeTab];

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Model Health Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gradient Boosting v1.4</span>
        </div>

        {/* Download Source ZIP CTA */}
        <button
          onClick={onDownloadZip}
          disabled={isDownloadingZip}
          className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-md border border-slate-800 shadow-sm flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-75 cursor-pointer"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>{isDownloadingZip ? 'Generating ZIP...' : 'Download System Source'}</span>
        </button>

        {/* User Badge */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-slate-100 shadow-sm">
            CG
          </div>
        </div>
      </div>
    </header>
  );
};
