import React from 'react';
import { MetricsSummary } from './MetricsSummary';
import { RevenueChart } from './RevenueChart';
import { PipelineFunnelChart } from './PipelineFunnelChart';
import { LeadSourceChart } from './LeadSourceChart';
import { TopDealsTable } from './TopDealsTable';
import { RecentActivitiesList } from './RecentActivitiesList';
import { UpcomingTasksWidget } from './UpcomingTasksWidget';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 4 Metric Stat Cards */}
      <MetricsSummary />

      {/* Main Charts: Revenue Trend & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <LeadSourceChart />
        </div>
      </div>

      {/* Pipeline Funnel & Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineFunnelChart />
        <TopDealsTable />
      </div>

      {/* Recent Activities & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasksWidget />
        <RecentActivitiesList />
      </div>
    </div>
  );
};

