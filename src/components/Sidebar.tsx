import React from 'react';
import { LayoutDashboard, UserCheck, PieChart, Sliders, Download, Server } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'predictor' | 'segment' | 'model' | 'export';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onDownloadZip,
  isDownloadingZip
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictor' as ActiveTab, label: 'Single Predictor', icon: UserCheck },
    { id: 'segment' as ActiveTab, label: 'Segment Analysis', icon: PieChart },
    { id: 'model' as ActiveTab, label: 'Model Config', icon: Sliders },
    { id: 'export' as ActiveTab, label: 'Export Service', icon: Download }
  ];

  return (
    <aside className="w-[240px] bg-[#0F172A] flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3 shrink-0 shadow-sm">
          <div className="w-4 h-4 border-2 border-white"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-tight text-lg leading-tight">ChurnGuard</span>
          <span className="text-[10px] text-blue-400 font-mono tracking-wider">v1.4 PROD</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-bold text-slate-500">
          Core Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-3.5 py-2.5 rounded-md flex items-center text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Box */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/50">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5 font-bold flex items-center justify-between">
            <span>System Status</span>
            <Server className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center text-xs text-emerald-400 font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            Model: Active [94% Acc]
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between font-mono">
            <span>Lat: 12ms</span>
            <span>Batch: Ready</span>
          </div>
        </div>

        {/* Quick ZIP Export Button in Sidebar */}
        <button
          onClick={onDownloadZip}
          disabled={isDownloadingZip}
          className="mt-3 w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded font-medium border border-slate-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>{isDownloadingZip ? 'Building ZIP...' : 'Source Archive (.zip)'}</span>
        </button>
      </div>
    </aside>
  );
};
