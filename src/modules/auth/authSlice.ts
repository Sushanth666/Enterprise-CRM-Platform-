import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: string;
  title: string;
  department?: string;
  avatar?: string;
  phone?: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  timezone?: string;
  currency?: string;
  quota: number;
  closedWonAmount: number;
  activeDealsCount: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser;
  isLoading: boolean;
  error: string | null;
}

const defaultUser: AuthUser = {
  id: 'usr-1',
  name: 'Aarav Sharma',
  email: 'aarav.s@vedaflow.in',
  company: 'VedaFlow Technologies India Pvt. Ltd.',
  role: 'Enterprise Regional Director',
  title: 'Head of Enterprise Sales & Operations (India)',
  department: 'India Enterprise Growth',
  avatar: '', // Empty by default so it renders First Letter ('A')!
  phone: '+91 98201 44521',
  status: 'online',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  quota: 85000000,
  closedWonAmount: 72000000,
  activeDealsCount: 22,
};

const loadPersistedAuth = (): { isAuthenticated: boolean; user: AuthUser } => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.isAuthenticated === 'boolean' && parsed.user) {
          return {
            isAuthenticated: parsed.isAuthenticated,
            user: { ...defaultUser, ...parsed.user },
          };
        }
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return {
    isAuthenticated: false,
    user: defaultUser,
  };
};

const persistAuth = (isAuthenticated: boolean, user: AuthUser) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (isAuthenticated) {
        window.localStorage.setItem('vedaflow_auth', JSON.stringify({ isAuthenticated, user }));
      } else {
        window.localStorage.removeItem('vedaflow_auth');
      }
    }
  } catch {
    // Ignore storage write error
  }
};

const persistedAuth = loadPersistedAuth();

const initialState: AuthState = {
  isAuthenticated: persistedAuth.isAuthenticated,
  user: persistedAuth.user,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        email: string;
        name?: string;
        role?: string;
        company?: string;
      }>
    ) => {
      const email = action.payload.email;
      const name = action.payload.name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      state.isAuthenticated = true;
      state.user = {
        ...state.user,
        name,
        email,
        company: action.payload.company || 'VedaFlow Technologies India',
        role: action.payload.role || 'Enterprise Account Lead',
        avatar: '', // Uses First letter!
        status: 'online',
      };
      state.error = null;
      persistAuth(true, state.user);
    },
    signup: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        company: string;
        role?: string;
      }>
    ) => {
      state.isAuthenticated = true;
      const role = action.payload.role || 'Enterprise Account Executive';
      state.user = {
        id: `usr-${Date.now()}`,
        name: action.payload.name,
        email: action.payload.email,
        company: action.payload.company,
        role: role,
        title: role === 'Enterprise Admin' ? 'VP of Commercial Strategy' : `${role} Lead`,
        department: 'Enterprise Sales',
        avatar: '', // Uses first letter!
        phone: '+1 (555) 019-2831',
        status: 'online',
        quota: 1000000,
        closedWonAmount: 0,
        activeDealsCount: 0,
      };
      state.error = null;
      persistAuth(true, state.user);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
      persistAuth(false, defaultUser);
    },
    updateAuthUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        persistAuth(state.isAuthenticated, state.user);
      }
    },
    setAuthUserStatus: (state, action: PayloadAction<AuthUser['status']>) => {
      if (state.user) {
        state.user.status = action.payload;
        persistAuth(state.isAuthenticated, state.user);
      }
    },
  },
});

export const {
  login,
  signup,
  logout,
  updateAuthUser,
  setAuthUserStatus,
} = authSlice.actions;

export default authSlice.reducer;
