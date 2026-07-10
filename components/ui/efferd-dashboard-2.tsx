import React, { useState } from 'react';
import { AppShell, DashboardMode } from '@/components/app-shell';
import { Dashboard } from '@/components/dashboard';
import { WebsiteBuilderEditor } from "@/components/website-builder-editor";

interface EfferdDashboard2Props {
  onLogout?: () => void;
}

export function EfferdDashboard2({ onLogout }: EfferdDashboard2Props) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('salon');

  // If the active tab is 'builder' (Website Builder), render the full screen website builder workspace
  if (activeTab === 'builder') {
    return (
      <WebsiteBuilderEditor 
        onExit={() => {
          // Instead of logging out, return back to the main dashboard workspace Command Center
          setActiveTab('home');
        }} 
      />
    );
  }

  // Otherwise, wrap the active page inside our premium AppShell navigation
  return (
    <AppShell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      dashboardMode={dashboardMode} 
      setDashboardMode={setDashboardMode}
      onLogout={onLogout}
    >
      <Dashboard 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        dashboardMode={dashboardMode} 
      />
    </AppShell>
  );
}

export default EfferdDashboard2;

