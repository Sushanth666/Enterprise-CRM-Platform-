import { describe, it, expect } from 'vitest';
import authReducer, {
  login,
  signup,
  logout,
  updateAuthUser,
  setAuthUserStatus,
} from '@/modules/auth/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    isAuthenticated: true,
    user: {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex.r@apexcrm.io',
      company: 'Apex Technologies',
      role: 'Enterprise Admin',
      title: 'Strategic Accounts Lead',
      status: 'online' as const,
      quota: 900000,
      closedWonAmount: 840000,
      activeDealsCount: 18,
    },
    isLoading: false,
    error: null,
  };

  it('handles logout action', () => {
    const state = authReducer(initialState, logout());
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles login action', () => {
    const loggedOutState = { ...initialState, isAuthenticated: false };
    const state = authReducer(
      loggedOutState,
      login({ email: 'sarah.c@apexcrm.io', name: 'Sarah Connor', role: 'Enterprise AE' })
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('sarah.c@apexcrm.io');
    expect(state.user?.name).toBe('Sarah Connor');
  });

  it('handles signup action and sets up new user', () => {
    const loggedOutState = { ...initialState, isAuthenticated: false };
    const state = authReducer(
      loggedOutState,
      signup({ name: 'John Doe', email: 'john@newcorp.com', company: 'NewCorp Global' })
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('John Doe');
    expect(state.user?.email).toBe('john@newcorp.com');
    expect(state.user?.company).toBe('NewCorp Global');
  });

  it('handles updateAuthUser and setAuthUserStatus', () => {
    let state = authReducer(initialState, updateAuthUser({ phone: '+1 555 4321' }));
    expect(state.user?.phone).toBe('+1 555 4321');

    state = authReducer(state, setAuthUserStatus('away'));
    expect(state.user?.status).toBe('away');
  });

  it('persists authentication session to localStorage and clears on logout', () => {
    const loggedOutState = { ...initialState, isAuthenticated: false };
    authReducer(
      loggedOutState,
      login({ email: 'priya.n@vedaflow.in', name: 'Priya Nair', role: 'Enterprise AE' })
    );

    const saved = localStorage.getItem('vedaflow_auth');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved!);
    expect(parsed.isAuthenticated).toBe(true);
    expect(parsed.user.email).toBe('priya.n@vedaflow.in');

    authReducer(initialState, logout());
    expect(localStorage.getItem('vedaflow_auth')).toBeNull();
  });
});

