import React, { useEffect } from 'react';
import { useAppSelector } from './store';
import { Layout } from '../layout/Layout';
import { DashboardView } from '../modules/dashboard/DashboardView';
import { LeadManagementView } from '../modules/leads/LeadManagementView';
import { PipelineBoard } from '../modules/pipeline/PipelineBoard';
import { CustomerList } from '../modules/customers/CustomerList';
import { TaskList } from '../modules/tasks/TaskList';
import { ActivityFeed } from '../modules/activities/ActivityFeed';
import { AnalyticsOverview } from '../modules/analytics/AnalyticsOverview';
import { LeadFormModal } from '../modules/leads/LeadFormModal';
import { LeadDetailModal } from '../modules/leads/LeadDetailModal';
import { DealFormModal } from '../modules/pipeline/DealFormModal';
import { DealDetailModal } from '../modules/pipeline/DealDetailModal';
import { CustomerFormModal } from '../modules/customers/CustomerFormModal';
import { TaskFormModal } from '../modules/tasks/TaskFormModal';
import { LogActivityModal } from '../modules/activities/LogActivityModal';
import { UserProfileModal } from '../modules/auth/UserProfileModal';
import { AuthPage } from '../modules/auth/AuthPage';
import { ToastContainer } from '../core/components/Toast';
import { useTabTitleMarquee } from '../core/hooks/useTabTitleMarquee';

export const App: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);
  const activeTab = useAppSelector((state) => state.ui.activeTab);

  // Smooth moving animation in the browser tab title
  useTabTitleMarquee('VedaFlow - Sales Intelligence Platform', {
    speed: 280,
    separator: '   •   ',
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme || 'sunset-copper');
  }, [colorTheme]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ToastContainer />
        <AuthPage />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadManagementView />;
      case 'pipeline':
        return <PipelineBoard />;
      case 'customers':
        return <CustomerList />;
      case 'tasks':
        return <TaskList />;
      case 'activities':
        return <ActivityFeed />;
      case 'analytics':
        return <AnalyticsOverview />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Layout>
      <div key={activeTab} className="page-view-enter">
        {renderContent()}
      </div>

      {/* Global Quick Action, Detail & Profile Modals */}
      <LeadFormModal />
      <LeadDetailModal />
      <DealFormModal />
      <DealDetailModal />
      <CustomerFormModal />
      <TaskFormModal />
      <LogActivityModal />
      <UserProfileModal />
    </Layout>
  );
};

export default App;
