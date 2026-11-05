import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  deleteLead,
  setSelectedLeadId,
  updateLeadStatus,
} from '@/modules/leads/leadsSlice';
import { openModal, addToast } from '@/shared/uiSlice';
import { Lead, LeadStatus } from '@/core/types/crm';
import {
  formatCurrency,
  formatDate,
  getLeadStatusColor,
} from '@/core/utils/formatters';
import { Avatar } from '@/core/components/Avatar';
import { Button } from '@/core/components/Button';
import { EmptyState } from '@/core/components/EmptyState';
import {
  MoreVertical,
  Eye,
  Trash2,
  Edit,
  UserCheck,
  TrendingUp,
  UserPlus,
} from 'lucide-react';

export const LeadList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, searchQuery, statusFilter, sourceFilter, sortBy, sortOrder } = useAppSelector(
    (state) => state.leads
  );

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter and sort
  const filteredLeads = items.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  filteredLeads.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'score') {
      comparison = a.score - b.score;
    } else if (sortBy === 'estimatedValue') {
      comparison = a.estimatedValue - b.estimatedValue;
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleOpenDetail = (leadId: string) => {
    dispatch(setSelectedLeadId(leadId));
    dispatch(openModal('leadDetailOpen'));
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete lead "${name}"?`)) {
      dispatch(deleteLead(id));
      dispatch(
        addToast({
          type: 'info',
          title: 'Lead Deleted',
          message: `${name} has been removed from your pipeline.`,
        })
      );
    }
  };

  const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
    dispatch(updateLeadStatus({ id: lead.id, status: newStatus }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `${lead.name}'s status changed to ${newStatus}`,
      })
    );
  };

  if (filteredLeads.length === 0) {
    return (
      <EmptyState
        icon={<UserPlus className="w-8 h-8" />}
        title="No Leads Found"
        description="Try adjusting your search terms or filters to find what you're looking for, or add a new lead."
        actionText="Add New Lead"
        onAction={() => dispatch(openModal('leadFormOpen'))}
      />
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Mobile Card View (< 640px) */}
      <div className="sm:hidden divide-y divide-slate-100 dark:divide-[#2e1f18]">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => handleOpenDetail(lead.id)}
            className="p-4 space-y-3 hover:bg-slate-50/80 dark:hover:bg-[#201612] transition-colors cursor-pointer"
          >
            {/* Header: Avatar, Name & Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar name={lead.name} size="md" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-[#fbf5f2]">
                    {lead.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#9f8c83]">
                    {lead.title} • <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.company}</span>
                  </p>
                </div>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                  className={`text-[11px] font-semibold rounded-full px-2 py-0.5 border cursor-pointer ${getLeadStatusColor(
                    lead.status
                  )} focus:outline-none`}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Converted">Converted</option>
                  <option value="Unqualified">Unqualified</option>
                </select>
              </div>
            </div>

            {/* Metrics Row: Est Value, Score & Owner */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-[#2a1b15]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Deal Value</span>
                <span className="font-bold text-slate-900 dark:text-[#fbf5f2]">
                  {formatCurrency(lead.estimatedValue)}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">Score</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs border ${getScoreColor(
                    lead.score
                  )}`}
                >
                  {lead.score}/100
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Owner</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {lead.assignedTo.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop & Tablet Table View (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Lead Contact & Company
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Lead Score
              </th>
              <th scope="col" className="px-4 py-3.5">
                Est. Value
              </th>
              <th scope="col" className="px-4 py-3.5">
                Source
              </th>
              <th scope="col" className="px-4 py-3.5">
                Owner
              </th>
              <th scope="col" className="px-4 py-3.5">
                Created
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-indigo-50/40 transition-all duration-150 group cursor-pointer"
                onClick={() => handleOpenDetail(lead.id)}
              >
                {/* Contact info */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={lead.name} size="md" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {lead.title} • <span className="font-medium text-slate-700">{lead.company}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lead.email}</div>
                    </div>
                  </div>
                </td>

                {/* Status selector */}
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                    className={`text-xs font-semibold rounded-full px-2.5 py-1 border transition-all cursor-pointer ${getLeadStatusColor(
                      lead.status
                    )} focus:outline-none focus:ring-1 focus:ring-indigo-400`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Converted">Converted</option>
                    <option value="Unqualified">Unqualified</option>
                  </select>
                </td>

                {/* Score */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getScoreColor(
                        lead.score
                      )}`}
                    >
                      {lead.score}
                    </span>
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden lg:block overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          lead.score >= 80
                            ? 'bg-emerald-500'
                            : lead.score >= 60
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Estimated Value */}
                <td className="px-4 py-4 font-semibold text-slate-900">
                  {formatCurrency(lead.estimatedValue)}
                </td>

                {/* Source */}
                <td className="px-4 py-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {lead.source}
                  </span>
                </td>

                {/* Assigned Owner */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={lead.assignedTo} src={lead.assignedAvatar} size="xs" />
                    <span className="text-xs text-slate-700 font-medium">{lead.assignedTo}</span>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-4 py-4 text-xs text-slate-500">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenDetail(lead.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="View Lead Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id, lead.name)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-[#2e1f18] bg-slate-50/50 dark:bg-[#1a120e] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 dark:text-[#9f8c83] gap-1">
        <span>Showing {filteredLeads.length} of {items.length} leads</span>
        <span className="hidden sm:inline">Lead scoring updated continuously based on intent signals</span>
      </div>
    </div>
  );
};

