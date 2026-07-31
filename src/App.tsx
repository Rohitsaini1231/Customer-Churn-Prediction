import React, { useState } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PredictorView } from './components/PredictorView';
import { SegmentView } from './components/SegmentView';
import { ModelConfigView } from './components/ModelConfigView';
import { ExportView } from './components/ExportView';
import { SAMPLE_CUSTOMERS, RETENTION_TASKS } from './data/mockDatabase';
import { Customer } from './types';
import { generateProjectZip, downloadBlob } from './utils/zipGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const zipBlob = await generateProjectZip();
      downloadBlob(zipBlob, 'Customer-Churn-Prediction.zip');
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleSelectCustomerForScoring = (cust: Customer) => {
    setSelectedCustomer(cust);
    setActiveTab('predictor');
  };

  return (
    <div className="w-full h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-hidden select-none">
      {/* Sidebar with Geometric Balance styling */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onDownloadZip={handleDownloadZip}
          isDownloadingZip={isDownloadingZip}
        />

        {/* View Switcher */}
        {activeTab === 'dashboard' && (
          <DashboardView
            customers={SAMPLE_CUSTOMERS}
            tasks={RETENTION_TASKS}
            onSelectCustomer={handleSelectCustomerForScoring}
            onNavigateToPredictor={() => setActiveTab('predictor')}
            onNavigateToSegment={() => setActiveTab('segment')}
          />
        )}

        {activeTab === 'predictor' && (
          <PredictorView initialCustomer={selectedCustomer} />
        )}

        {activeTab === 'segment' && <SegmentView />}

        {activeTab === 'model' && <ModelConfigView />}

        {activeTab === 'export' && (
          <ExportView
            onDownloadZip={handleDownloadZip}
            isDownloadingZip={isDownloadingZip}
          />
        )}
      </main>
    </div>
  );
}
