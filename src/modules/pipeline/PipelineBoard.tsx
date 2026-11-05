import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setSearchQuery,
  setAssignedFilter,
  setSelectedDealId,
} from '@/modules/pipeline/dealsSlice';
import { openModal } from '@/shared/uiSlice';
import { DealStage } from '@/core/types/crm';
import { PipelineColumn } from './PipelineColumn';
import { Button } from '@/core/components/Button';
import { formatCurrency } from '@/core/utils/formatters';
import { mockTeamMembers } from '@/data/mockData';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';

export const PipelineBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, searchQuery, assignedFilter } = useAppSelector((state) => state.deals);

  const stages: DealStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Contract Sent',
    'Closed Won',
    'Closed Lost',
  ];

  // Filtering
  const filteredDeals = items.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssigned =
      assignedFilter === 'All' || deal.assignedTo === assignedFilter;
    return matchesSearch && matchesAssigned;
  });

  // Calculate Pipeline KPIs
  const activeDeals = filteredDeals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);
  const wonDealsValue = filteredDeals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.amount, 0);
  const avgProbability =
    activeDeals.length > 0
      ? Math.round(
          activeDeals.reduce((sum, d) => sum + d.probability, 0) / activeDeals.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Pipeline KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs card-hover-lift flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Pipeline Value
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1">
              {formatCurrency(totalPipelineValue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeDeals.length} deals in flight</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-[#2a1711] text-[#ca5e3a] border border-[#ca5e3a]/30 shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs card-hover-lift flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Closed Won Revenue
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#ca5e3a] mt-0.5 sm:mt-1">
              {formatCurrency(wonDealsValue)}
            </p>
            <p className="text-[11px] text-[#e08a68] font-medium mt-0.5">Quarterly quota pace: 93%</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-[#2a1711] text-[#ca5e3a] border border-[#ca5e3a]/30 shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs card-hover-lift flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Win Confidence
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1">{avgProbability}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Weighted stage average</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-[#271a13] text-amber-500 border border-amber-500/20 shrink-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5 sm:gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search deals by title or account name..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 focus:border-[#ca5e3a]"
            />
          </div>

          <select
            value={assignedFilter}
            onChange={(e) => dispatch(setAssignedFilter(e.target.value))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20"
          >
            <option value="All">All Account Reps</option>
            {mockTeamMembers.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={() => dispatch(openModal('dealFormOpen'))}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          className="w-full sm:w-auto"
        >
          Add Opportunity
        </Button>
      </div>

      {/* Mobile Quick Stage Selector Tabs (< 640px) */}
      <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {stages.map((stage) => {
          const stageCount = filteredDeals.filter((d) => d.stage === stage).length;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => {
                const el = document.getElementById(`pipeline-col-${stage}`);
                el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] text-slate-700 dark:text-slate-300 hover:text-[#ca5e3a] transition-colors"
            >
              {stage} ({stageCount})
            </button>
          );
        })}
      </div>

      {/* Horizontal Pipeline Columns */}
      <div className="overflow-x-auto pb-4 snap-x snap-mandatory sm:snap-none scrollbar-thin">
        <div className="flex items-start gap-3 sm:gap-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            return <PipelineColumn key={stage} stage={stage} deals={stageDeals} />;
          })}
        </div>
      </div>
    </div>
  );
};

