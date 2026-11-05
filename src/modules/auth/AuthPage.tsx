import React, { useState } from 'react';
import { useAppDispatch } from '@/app/store';
import { login, signup } from '@/modules/auth/authSlice';
import { addToast, setActiveTab } from '@/shared/uiSlice';
import { Button } from '@/core/components/Button';
import { Input, Select } from '@/core/components/Input';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Briefcase,
} from 'lucide-react';
import { VedaFlowLogo } from '@/core/brand/VedaFlowLogo';

export const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Standard User Login state - starts blank by default
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Preset organizations with corporate domains
  const PRESET_ORGANIZATIONS = [
    { name: '', domain: 'company.com', label: '-- Select Company / Organization --' },
    { name: 'Acme Corp', domain: 'acme.com', label: 'Acme Corp (@acme.com)' },
    { name: 'Tata Consultancy Services', domain: 'tcs.com', label: 'Tata Consultancy Services (@tcs.com)' },
    { name: 'Reliance Retail Digital', domain: 'relianceretail.com', label: 'Reliance Retail Digital (@relianceretail.com)' },
    { name: 'Infosys Technologies', domain: 'infosys.com', label: 'Infosys Technologies (@infosys.com)' },
    { name: 'HDFC Securities Ltd', domain: 'hdfcsec.com', label: 'HDFC Securities Ltd (@hdfcsec.com)' },
    { name: 'Bharti Airtel Enterprise', domain: 'airtel.com', label: 'Bharti Airtel Enterprise (@airtel.com)' },
    { name: 'Wipro Digital', domain: 'wipro.com', label: 'Wipro Digital (@wipro.com)' },
    { name: 'VedaFlow Technologies', domain: 'vedaflow.in', label: 'VedaFlow Technologies (@vedaflow.in)' },
    { name: 'Other / Custom Organization', domain: '', label: '✏️ Other / Custom Organization' },
  ];

  // Signup state - defaults are blank so the user actively selects role and company
  const [signupName, setSignupName] = useState('');
  const [signupEmailUsername, setSignupEmailUsername] = useState('');
  const [hasManuallyEditedEmail, setHasManuallyEditedEmail] = useState(false);
  const [signupCompany, setSignupCompany] = useState('');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [signupDomain, setSignupDomain] = useState('company.com');
  const [signupRole, setSignupRole] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const handleNameChange = (val: string) => {
    setSignupName(val);
    if (!hasManuallyEditedEmail) {
      // Auto-populate email username from full name (e.g. "David Vance" -> "david.vance")
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.');
      setSignupEmailUsername(generated);
    }
  };

  const handleCompanyChange = (companyName: string) => {
    setSignupCompany(companyName);
    if (signupErrors.company) {
      setSignupErrors((prev) => ({ ...prev, company: '' }));
    }
    const preset = PRESET_ORGANIZATIONS.find((o) => o.name === companyName);
    if (preset && preset.domain) {
      setSignupDomain(preset.domain);
    } else if (companyName === 'Other / Custom Organization') {
      const clean = customCompanyName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      setSignupDomain(clean ? `${clean}.com` : 'company.com');
    } else {
      setSignupDomain('company.com');
    }
  };

  const handleCustomCompanyChange = (val: string) => {
    setCustomCompanyName(val);
    const clean = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    setSignupDomain(clean ? `${clean}.com` : 'company.com');
  };

  const handleEmailUsernameChange = (val: string) => {
    setHasManuallyEditedEmail(true);
    // Strip any typed @ or domain, keeping only the user's name handle
    const cleaned = val.replace(/@.*$/, '').replace(/\s+/g, '').toLowerCase();
    setSignupEmailUsername(cleaned);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Email is required');
      return;
    }
    if (!loginPassword) {
      setLoginError('Password is required');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        login({
          email: loginEmail,
          role: 'Enterprise AE',
        })
      );
      dispatch(setActiveTab('dashboard'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Signed in successfully as ${loginEmail}`,
        })
      );
    }, 500);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const effectiveCompany =
      signupCompany === 'Other / Custom Organization'
        ? customCompanyName.trim()
        : signupCompany.trim();

    const effectiveEmail = signupEmailUsername.trim()
      ? `${signupEmailUsername.trim()}@${signupDomain.trim()}`
      : '';

    if (!signupName.trim()) errors.name = 'Full name is required';
    if (!signupRole) {
      errors.role = 'Please select your workspace role';
    }
    if (!effectiveCompany) {
      errors.company = 'Please select your company / organization';
    }
    if (!signupEmailUsername.trim()) {
      errors.email = 'Please type your name / username for the corporate email';
    } else if (!effectiveEmail || !/\S+@\S+\.\S+/.test(effectiveEmail)) {
      errors.email = 'Valid corporate email is required';
    }
    if (!signupPassword || signupPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      errors.terms = 'Please accept the Enterprise Terms of Service';
    }

    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        signup({
          name: signupName,
          email: effectiveEmail,
          company: effectiveCompany,
          role: signupRole,
        })
      );
      dispatch(setActiveTab('dashboard'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Account Created Successfully!',
          message: `Welcome to VedaFlow, ${signupName}! Registered with ${effectiveCompany} (${effectiveEmail}).`,
        })
      );
    }, 600);
  };

  const handleFillDemo = (email: string, password = 'password123') => {
    setLoginEmail(email);
    setLoginPassword(password);
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-float" />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 z-10 animate-scaleIn">
        {/* Left Side: Brand & Visuals */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-5 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <VedaFlowLogo size="lg" subtitle="Sales Intelligence Platform" />

            <div className="space-y-2 pt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Accelerate revenue with unified sales intelligence.
              </h2>
              <p className="text-xs text-[#edd5cb] leading-relaxed">
                Empower your sales, pipeline, and account teams with real-time deal stages, automatic lead scoring, and customer relationship analytics.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-[#3a2016] text-[#e08a68] border border-[#ca5e3a]/40 shadow-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-white font-semibold text-xs tracking-wide">
                  Visual Kanban Pipeline & Deal Stages
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-[#3a2016] text-[#e08a68] border border-[#ca5e3a]/40 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-white font-semibold text-xs tracking-wide">
                  SOC2 Type II Certified & End-to-End Encryption
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-[#3a2016] text-[#e08a68] border border-[#ca5e3a]/40 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-white font-semibold text-xs tracking-wide">
                  Customer Lifetime Value & Health Scoring
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative z-10 pt-6 border-t border-[#3e261c] mt-8">
            <p className="text-xs text-[#edd5cb] italic leading-relaxed">
              "VedaFlow increased our enterprise deal velocity across India by 42% within the first 60 days of rollout."
            </p>
            <p className="text-[11px] font-bold text-white mt-2">
              Priya Nair <span className="text-[#e08a68] font-normal">• VP Enterprise AE, Bengaluru</span>
            </p>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Tab Switcher: Sign In | Create Account */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 mb-8 max-w-xs border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setLoginError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupErrors({});
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* TAB 1: USER SIGN IN */}
            {authMode === 'signin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Welcome back to VedaFlow
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your sales workspace credentials to continue
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {loginError}
                  </div>
                )}

                <div className="space-y-3">
                  <Input
                    label="Corporate Email Address"
                    type="email"
                    placeholder="name@company.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative rounded-lg shadow-2xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                    <span>Remember my session</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Please contact your Enterprise IT administrator to reset your credentials.');
                    }}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Workspace
                </Button>

                {/* Quick Demo Access Bar */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Quick Demo Access:
                    </p>
                    {(loginEmail || loginPassword) && (
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('');
                          setLoginPassword('');
                          setLoginError('');
                        }}
                        className="text-[11px] text-[#ca5e3a] hover:underline font-semibold"
                      >
                        Clear to Blank
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleFillDemo('priya.n@vedaflow.in', 'password123')
                      }
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#ca5e3a]/40 bg-[#251713] hover:bg-[#321e18] text-[#fbf5f2] font-medium transition-colors"
                      title="Fill inputs with Priya Nair's demo credentials"
                    >
                      📝 Fill Demo: <strong>Priya Nair</strong> (AE)
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleFillDemo('rajesh.p@vedaflow.in', 'password123')
                      }
                      className="px-3 py-1.5 text-xs rounded-lg border border-[#ca5e3a]/40 bg-[#251713] hover:bg-[#321e18] text-[#fbf5f2] font-medium transition-colors"
                      title="Fill inputs with Rajesh Patel's demo credentials"
                    >
                      📝 Fill Demo: <strong>Rajesh Patel</strong> (SDR)
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* CREATE ACCOUNT FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Create Enterprise Account
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your avatar will automatically display your name's first letter initial!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    placeholder="e.g. David Vance"
                    value={signupName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    error={signupErrors.name}
                    required
                  />

                  <Select
                    label="Workspace Role"
                    value={signupRole}
                    onChange={(e) => {
                      setSignupRole(e.target.value);
                      if (signupErrors.role) {
                        setSignupErrors((prev) => ({ ...prev, role: '' }));
                      }
                    }}
                    error={signupErrors.role}
                    required
                    options={[
                      { value: '', label: '-- Select Workspace Role --' },
                      { value: 'Enterprise Account Executive (AE)', label: 'Enterprise Account Executive (AE)' },
                      { value: 'Sales Development Rep (SDR)', label: 'Sales Development Rep (SDR)' },
                      { value: 'Sales Director / VP of Sales', label: 'Sales Director / VP of Sales' },
                      { value: 'Customer Success Manager (CSM)', label: 'Customer Success Manager (CSM)' },
                      { value: 'Revenue Operations (RevOps)', label: 'Revenue Operations (RevOps)' },
                      { value: 'Enterprise Administrator', label: 'Enterprise Administrator' },
                      { value: 'Strategic Account Manager', label: 'Strategic Account Manager' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Organization Selector */}
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company / Organization <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-2xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <select
                        value={signupCompany}
                        onChange={(e) => handleCompanyChange(e.target.value)}
                        className={`block w-full rounded-lg border bg-white pl-9 pr-8 py-2 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 cursor-pointer ${
                          signupErrors.company
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                        required
                      >
                        {PRESET_ORGANIZATIONS.map((org) => (
                          <option key={org.name || 'unselected'} value={org.name}>
                            {org.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {signupCompany === 'Other / Custom Organization' && (
                      <div className="mt-2 animate-fadeIn">
                        <input
                          type="text"
                          placeholder="Type custom company (e.g. Acme Industries)"
                          value={customCompanyName}
                          onChange={(e) => handleCustomCompanyChange(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          required
                        />
                      </div>
                    )}
                    {signupErrors.company && (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{signupErrors.company}</p>
                    )}
                  </div>

                  {/* Corporate Email - User only types name / username, domain automatically attached */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Corporate Email <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Auto @{signupDomain}
                      </span>
                    </div>

                    <div
                      className={`relative flex items-center rounded-lg border bg-white transition-all overflow-hidden shadow-2xs ${
                        signupErrors.email
                          ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
                          : 'border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                      }`}
                    >
                      <div className="pl-3 text-slate-400 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Type name / username"
                        value={signupEmailUsername}
                        onChange={(e) => handleEmailUsernameChange(e.target.value)}
                        className="w-full pl-2.5 pr-1 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                        required
                      />
                      <div className="pr-2 shrink-0">
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-[#251713] text-[#ca5e3a] border border-[#ca5e3a]/30 shadow-2xs select-none"
                          title={`Auto-selected domain based on ${signupCompany}`}
                        >
                          @{signupDomain}
                        </span>
                      </div>
                    </div>

                    {signupErrors.email ? (
                      <p className="mt-1 text-xs text-rose-600 font-medium">{signupErrors.email}</p>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <span className="text-slate-400">Selected Email:</span>{' '}
                        <strong className="text-slate-800">
                          {signupEmailUsername
                            ? `${signupEmailUsername}@${signupDomain}`
                            : `[your-name]@${signupDomain}`}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={signupErrors.password}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={signupErrors.confirmPassword}
                    required
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-600 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I agree to the Enterprise Master Subscription Agreement, SLA, and Privacy Policy.
                  </span>
                </label>
                {signupErrors.terms && (
                  <p className="text-xs text-rose-600 font-medium">{signupErrors.terms}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create & Launch Workspace
                </Button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400 mt-6">
            <span>VedaFlow Platform • 256-bit TLS Encrypted • SOC2 Type II Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
