import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead, LeadStatus, LeadSource } from '@/core/types/crm';
import { mockLeads } from '@/data/mockData';

interface LeadsState {
  items: Lead[];
  selectedLeadId: string | null;
  searchQuery: string;
  statusFilter: LeadStatus | 'All';
  sourceFilter: LeadSource | 'All';
  sortBy: 'score' | 'estimatedValue' | 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  items: mockLeads,
  selectedLeadId: null,
  searchQuery: '',
  statusFilter: 'All',
  sourceFilter: 'All',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isLoading: false,
  error: null,
};

export const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead: (state, action: PayloadAction<Omit<Lead, 'id' | 'createdAt'>>) => {
      const newLead: Lead = {
        ...action.payload,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newLead);
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateLeadStatus: (state, action: PayloadAction<{ id: string; status: LeadStatus }>) => {
      const lead = state.items.find(item => item.id === action.payload.id);
      if (lead) {
        lead.status = action.payload.status;
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedLeadId === action.payload) {
        state.selectedLeadId = null;
      }
    },
    setSelectedLeadId: (state, action: PayloadAction<string | null>) => {
      state.selectedLeadId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<LeadStatus | 'All'>) => {
      state.statusFilter = action.payload;
    },
    setSourceFilter: (state, action: PayloadAction<LeadSource | 'All'>) => {
      state.sourceFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'score' | 'estimatedValue' | 'createdAt' | 'name'>) => {
      state.sortBy = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
});

export const {
  addLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  setSelectedLeadId,
  setSearchQuery,
  setStatusFilter,
  setSourceFilter,
  setSortBy,
  toggleSortOrder,
} = leadsSlice.actions;

export default leadsSlice.reducer;
