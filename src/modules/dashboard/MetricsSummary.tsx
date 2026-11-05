import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveTab } from '@/shared/uiSlice';
import { StatCard } from '@/core/components/StatCard';
import { formatCurrency, formatCompactCurrency } from '@/core/utils/formatters';
import {
  DollarSign,
  TrendingUp,
  UserPlus,
  Users,
  Target,
  Award,
} from 'lucide-react';

export const MetricsSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads.items);
  const deals = useAppSelector((state) => state.deals.items);
  const customers = useAppSelector((state) => state.customers.items);

  // Calculations
  const activeDeals = deals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);

  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);

  const winRate =
    deals.length > 0
      ? Math.round((wonDeals.length / (wonDeals.length + deals.filter(d => d.stage === 'Closed Lost').length || 1)) * 100)
      : 0;

  const qualifiedLeads = leads.filter(
    (l) => l.status === 'Qualified' || l.status === 'Proposal' || l.status === 'Negotiation'
  ).length;

  const avgDealSize =
    deals.length > 0
      ? Math.round(deals.reduce((sum, d) => sum + d.amount, 0) / deals.length)
      : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard
        title="Total ARR Revenue"
        value={formatCurrency(totalRevenue)}
        change={18.4}
        changePeriod="vs previous quarter"
        icon={<DollarSign className="w-5 h-5" />}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        onClick={() => dispatch(setActiveTab('customers'))}
      />

      <StatCard
        title="Active Pipeline Value"
        value={formatCurrency(pipelineValue)}
        change={12.6}
        changePeriod="vs last month"
        icon={<TrendingUp className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        onClick={() => dispatch(setActiveTab('pipeline'))}
      />

      <StatCard
        title="Deal Win Rate"
        value={`${winRate}%`}
        change={4.2}
        changePeriod="vs benchmark"
        icon={<Award className="w-5 h-5" />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        onClick={() => dispatch(setActiveTab('pipeline'))}
      />

      <StatCard
        title="Qualified Inbound Leads"
        value={qualifiedLeads}
        change={25.0}
        changePeriod="conversion velocity"
        icon={<UserPlus className="w-5 h-5" />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        onClick={() => dispatch(setActiveTab('leads'))}
      />
    </div>
  );
};

