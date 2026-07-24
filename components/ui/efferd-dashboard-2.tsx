import React, { useState } from 'react';
import { AppShell, DashboardMode } from '@/components/app-shell';
import { Dashboard } from '@/components/dashboard';
import { WebsiteBuilderEditor } from "@/components/website-builder-editor";
import type { SiteRecord } from '@/components/ui/onboarding-wizard';

interface EfferdDashboard2Props {
  onLogout?: () => void;
  site: SiteRecord;
  onUpdateSite?: (site: SiteRecord) => void;
}

export function EfferdDashboard2({ onLogout, site, onUpdateSite }: EfferdDashboard2Props) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const initialMode = (site.theme?.mode as DashboardMode) || 'business';
  const [dashboardMode] = useState<DashboardMode>(initialMode);

  // If the active tab is 'builder' (Website Builder), render the full screen website builder workspace
  if (activeTab === 'builder') {
    return (
      <WebsiteBuilderEditor 
        site={site}
        onUpdateSite={onUpdateSite}
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
      onLogout={onLogout}
      site={site}
    >
      <Dashboard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dashboardMode={dashboardMode}
        site={site}
      />
    </AppShell>
  );
}

export default EfferdDashboard2;

