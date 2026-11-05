import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  openModal,
  toggleMobileMenu,
  setActiveTab,
  addToast,
} from '@/shared/uiSlice';
import { logout, setAuthUserStatus } from '@/modules/auth/authSlice';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  UserPlus,
  DollarSign,
  CheckSquare,
  Activity as ActivityIcon,
  Users,
  Menu,
  Sparkles,
  User,
  Shield,
  Sliders,
  LogOut,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/core/components/Button';
import { Avatar } from '@/core/components/Avatar';
import { formatCurrency, formatRelativeTime } from '@/core/utils/formatters';
import { mockTeamMembers } from '@/data/mockData';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);
  const activities = useAppSelector((state) => state.activities.items);

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive CRM Dashboard', subtitle: 'Real-time sales performance, conversion metrics, and key activities' },
    leads: { title: 'Lead Management', subtitle: 'Capture, score, qualify, and convert enterprise inbound opportunities' },
    pipeline: { title: 'Sales Pipeline Board', subtitle: 'Track deal stages, win probabilities, and contract negotiations' },
    customers: { title: 'Customer Profiles & Accounts', subtitle: 'Client directory, lifetime value metrics, and interaction history' },
    tasks: { title: 'Task & Follow-up Management', subtitle: 'Manage critical deliverables, assignments, priorities, and deadlines' },
    activities: { title: 'Customer Activity Feed', subtitle: 'Real-time log of sales calls, meetings, client emails, and notes' },
    analytics: { title: 'CRM Analytics & Reports', subtitle: 'In-depth pipeline velocity, conversion ratios, and rep quotas' },
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  const statuses: { id: 'online' | 'busy' | 'away' | 'offline'; label: string; color: string }[] = [
    { id: 'online', label: 'Online & Available', color: 'bg-emerald-500' },
    { id: 'busy', label: 'In a Meeting / Busy', color: 'bg-rose-500' },
    { id: 'away', label: 'Away / In Transit', color: 'bg-amber-500' },
    { id: 'offline', label: 'Offline / Stealth', color: 'bg-slate-400' },
  ];

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300 ${
        sidebarCollapsed ? 'left-0 md:left-20' : 'left-0 md:left-64'
      }`}
    >
      <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Mobile toggle & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate max-w-[160px] sm:max-w-xs md:max-w-none">
              {currentTabInfo.title}
            </h1>
            <p className="hidden lg:block text-xs text-slate-400">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Sync Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-700 shadow-2xs hover:shadow-xs transition-shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-glowPulse" />
            <span>Live Sync</span>
          </div>

          {/* Quick Create Dropdown */}
          <div className="relative" ref={createRef}>
            <Button
              onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              rightIcon={<ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            >
              <span className="hidden sm:inline">New Record</span>
              <span className="sm:hidden">New</span>
            </Button>

            {createDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#181210] border border-[#3d271e] shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Create New
                </div>
                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    dispatch(openModal('leadFormOpen'));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] transition-colors text-left"
                >
                  <UserPlus className="w-4 h-4 text-[#ca5e3a]" />
                  <span>Create Lead</span>
                </button>

                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    dispatch(openModal('dealFormOpen'));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] transition-colors text-left"
                >
                  <DollarSign className="w-4 h-4 text-[#e08a68]" />
                  <span>Create Deal / Opportunity</span>
                </button>

                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    dispatch(openModal('customerFormOpen'));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-[#f59e0b]" />
                  <span>Create Customer Account</span>
                </button>

                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    dispatch(openModal('taskFormOpen'));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] transition-colors text-left"
                >
                  <CheckSquare className="w-4 h-4 text-amber-500" />
                  <span>Create Task</span>
                </button>

                <div className="my-1 border-t border-[#2d1b15]" />

                <button
                  onClick={() => {
                    setCreateDropdownOpen(false);
                    dispatch(openModal('activityFormOpen'));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] transition-colors text-left"
                >
                  <ActivityIcon className="w-4 h-4 text-purple-400" />
                  <span>Log Activity / Meeting</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg text-slate-400 hover:bg-[#201613] hover:text-slate-200 transition-colors"
              title="Recent Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ca5e3a] ring-2 ring-[#140e0c]" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-xl bg-[#181210] border border-[#3d271e] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-[#2d1b15] flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Recent Activity Alerts
                  </span>
                  <span className="text-[11px] font-semibold text-[#e08a68] bg-[#2a1711] border border-[#ca5e3a]/40 px-2 py-0.5 rounded-full">
                    {activities.length} new
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#271a15]">
                  {activities.slice(0, 4).map((activity) => (
                    <div
                      key={activity.id}
                      onClick={() => {
                        setNotificationOpen(false);
                        dispatch(setActiveTab('activities'));
                      }}
                      className="p-3 hover:bg-[#201613] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <Avatar name={activity.performedBy} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {activity.title}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {activity.description}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {formatRelativeTime(activity.timestamp)} • {activity.entityName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[#2d1b15] text-center">
                  <button
                    onClick={() => {
                      setNotificationOpen(false);
                      dispatch(setActiveTab('activities'));
                    }}
                    className="text-xs font-medium text-[#ca5e3a] hover:text-[#e08a68]"
                  >
                    View All Activities &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Button & Menu */}
          <div className="relative pl-1" ref={userRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all focus:outline-none cursor-pointer group"
              title="Click to view Profile & Settings"
            >
              <Avatar
                name={currentUser.name}
                src={currentUser.avatar}
                size="sm"
                status={currentUser.status}
                showHoverPhoto={true}
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-sm rounded-2xl bg-[#181210] border border-[#3d271e] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {/* Header: User Info */}
                <div className="px-4 py-3 border-b border-[#2d1b15] flex items-start gap-3">
                  <Avatar
                    name={currentUser.name}
                    src={currentUser.avatar}
                    size="md"
                    status={currentUser.status}
                    showHoverPhoto={true}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-100 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2a1711] text-[#e08a68] border border-[#ca5e3a]/40">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="px-4 py-2.5 border-b border-[#2d1b15]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Presence Status:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {statuses.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          dispatch(setAuthUserStatus(st.id));
                          dispatch(
                            addToast({
                              type: 'info',
                              title: 'Status Updated',
                              message: `You are now marked as ${st.label}`,
                            })
                          );
                        }}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentUser.status === st.id
                            ? 'bg-[#331d15] text-[#f7a379] border border-[#ca5e3a]/50 font-bold'
                            : 'bg-[#201613] text-slate-300 hover:bg-[#2c1d17] border border-transparent'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${st.color} shrink-0`} />
                        <span className="truncate">{st.id.charAt(0).toUpperCase() + st.id.slice(1)}</span>
                        {currentUser.status === st.id && <Check className="w-3 h-3 ml-auto text-[#ca5e3a]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Performance Quick Look (Sunset Copper Styled Quota) */}
                <div className="px-4 py-3 border-b border-[#2d1b15] bg-[#140e0c] text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] font-semibold text-[#c5a89e]">Quarterly Quota:</span>
                    <span className="font-extrabold text-slate-100 tracking-tight">
                      {formatCurrency(currentUser.closedWonAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-[#271b16] border border-[#3b2921]/60 rounded-full h-2 mt-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-[#ca5e3a] via-[#e08a68] to-[#f59e0b] h-full rounded-full shadow-[0_0_10px_rgba(202,94,58,0.55)] transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((currentUser.closedWonAmount / currentUser.quota) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
                    <span className="text-[#e08a68]">
                      {Math.round((currentUser.closedWonAmount / currentUser.quota) * 100)}% Pace Achieved
                    </span>
                    <span>Target: {formatCurrency(currentUser.quota)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      dispatch(openModal('userProfileModalOpen'));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] rounded-lg transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-[#ca5e3a]" />
                    <span>My Profile & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      dispatch(openModal('userProfileModalOpen'));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] rounded-lg transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-[#e08a68]" />
                    <span>Security & 2FA Status</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      dispatch(setActiveTab('analytics'));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#201613] hover:text-[#e08a68] rounded-lg transition-colors text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-[#ca5e3a]" />
                    <span>View Rep Leaderboard</span>
                  </button>
                </div>

                {/* Footer Sign Out */}
                <div className="pt-1 mt-1 border-t border-[#2d1b15] px-1.5">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      dispatch(logout());
                      dispatch(
                        addToast({
                          type: 'info',
                          title: 'Signed Out',
                          message: 'You have been safely signed out. Please sign in to continue.',
                        })
                      );
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
