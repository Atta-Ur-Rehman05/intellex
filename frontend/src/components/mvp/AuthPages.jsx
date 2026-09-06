import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, Lock, Sparkles, ShieldCheck, Sun, Moon } from 'lucide-react';
import { Input, PasswordInput } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * Shared minimal auth shell (preserves AuthLayout's premium visual identity)
 */
export const AuthShell = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-brand-600/15 via-purple-600/10 to-transparent blur-[90px] pointer-events-none" />

      <div className="relative p-4 sm:p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowva</span>
        </Link>
        <ThemeToggleButton />
      </div>

      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">{title}</h1>
            <p className="text-xs text-secondary leading-relaxed">{subtitle}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface/95 border border-border-default shadow-2xl backdrop-blur-xl">
            {children}
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] text-muted font-mono">
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure sign-in</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Your documents stay private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeToggleButton = () => {
  const { resolved, setMode } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer shadow-2xs"
      aria-label="Toggle theme"
    >
      {resolved === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
    </button>
  );
};

/**
 * Login Page — MVP email/password against POST /auth/login
 */
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/app/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Sign In" subtitle="Welcome back — sign in to your Knowva workspace.">
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500 animate-in fade-in" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            disabled={isLoading}
            autoComplete="email"
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center font-bold"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-semibold cursor-pointer">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

/**
 * Register Page — MVP name/email/password against POST /auth/register
 */
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Create Account" subtitle="Start building your AI knowledge workspace in minutes.">
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500 animate-in fade-in" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            disabled={isLoading}
            autoComplete="name"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            disabled={isLoading}
            autoComplete="email"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            helperText="Use 8+ characters with a mix of letters and numbers."
            disabled={isLoading}
            autoComplete="new-password"
            required
          />
          <Button
            variant="ai"
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center font-bold"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:underline font-semibold cursor-pointer">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};
