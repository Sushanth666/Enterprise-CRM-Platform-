import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setSearchQuery,
  setStatusFilter,
  setSourceFilter,
  setSortBy,
  toggleSortOrder,
} from '@/modules/leads/leadsSlice';
import { openModal } from '@/shared/uiSlice';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/core/components/Button';
import { LeadStatus, LeadSource } from '@/core/types/crm';

export const LeadFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter, sourceFilter, sortBy, sortOrder } = useAppSelector(
    (state) => state.leads
  );

  const statuses: (LeadStatus | 'All')[] = [
    'All',
    'New',
    'Contacted',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Converted',
    'Unqualified',
  ];

  const sources: (LeadSource | 'All')[] = [
    'All',
    'Website',
    'LinkedIn',
    'Referral',
    'Cold Call',
    'Inbound Email',
    'Conference',
    'Partner',
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, company..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full sm:w-auto">
          <Button
            onClick={() => dispatch(openModal('leadFormOpen'))}
            leftIcon={<Plus className="w-4 h-4" />}
            size="sm"
            className="w-full sm:w-auto"
          >
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Filters and Sorting row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value as LeadStatus | 'All'))}
            className="w-full sm:w-auto rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => dispatch(setSourceFilter(e.target.value as LeadSource | 'All'))}
            className="w-full sm:w-auto rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {sources.map((s) => (
              <option key={s} value={s}>
                Source: {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between sm:justify-start gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="flex-1 sm:flex-initial rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 sm:py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="score">Lead Score</option>
              <option value="estimatedValue">Est. Value</option>
              <option value="name">Name</option>
            </select>

            <button
              onClick={() => dispatch(toggleSortOrder())}
              className="p-1.5 sm:p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

