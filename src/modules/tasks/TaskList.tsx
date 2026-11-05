import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setTaskSearchQuery,
  setTaskStatusFilter,
  setTaskPriorityFilter,
  setTaskAssignedFilter,
} from '@/modules/tasks/tasksSlice';
import { openModal } from '@/shared/uiSlice';
import { TaskStatus, PriorityLevel } from '@/core/types/crm';
import { TaskCard } from './TaskCard';
import { Button } from '@/core/components/Button';
import { EmptyState } from '@/core/components/EmptyState';
import { mockTeamMembers } from '@/data/mockData';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, searchQuery, statusFilter, priorityFilter, assignedFilter } = useAppSelector(
    (state) => state.tasks
  );

  // Filter
  const filteredTasks = items.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.relatedTo && task.relatedTo.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesAssigned = assignedFilter === 'All' || task.assignedTo === assignedFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  // Calculate metrics
  const totalCount = items.length;
  const completedCount = items.filter((t) => t.status === 'Completed').length;
  const inProgressCount = items.filter((t) => t.status === 'In Progress').length;
  const overdueCount = items.filter(
    (t) =>
      t.status !== 'Completed' &&
      new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const statusTabs: { id: TaskStatus | 'All'; label: string; count?: number }[] = [
    { id: 'All', label: 'All Tasks', count: totalCount },
    { id: 'Todo', label: 'To Do', count: items.filter((t) => t.status === 'Todo').length },
    { id: 'In Progress', label: 'In Progress', count: inProgressCount },
    { id: 'Completed', label: 'Completed', count: completedCount },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Total Tasks</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">In Progress</span>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Completed</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Overdue</span>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">{overdueCount}</p>
        </div>
      </div>

      {/* Tabs and Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setTaskStatusFilter(tab.id))}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          onClick={() => dispatch(openModal('taskFormOpen'))}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          className="w-full sm:w-auto"
        >
          Add Task
        </Button>
      </div>

      {/* Search and Filter Row */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, description, account..."
            value={searchQuery}
            onChange={(e) => dispatch(setTaskSearchQuery(e.target.value))}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => dispatch(setTaskPriorityFilter(e.target.value as any))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={assignedFilter}
            onChange={(e) => dispatch(setTaskAssignedFilter(e.target.value))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Assignees</option>
            {mockTeamMembers.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Cards Grid/List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8" />}
          title="No Tasks Found"
          description="You have no tasks matching this filter criteria. Stay productive by adding a new one."
          actionText="Create Task"
          onAction={() => dispatch(openModal('taskFormOpen'))}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

