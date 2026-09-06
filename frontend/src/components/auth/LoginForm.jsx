import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, AlertCircle, Sparkles, 
  CheckCircle2, KeyRound 
} from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
import { Input, PasswordInput } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * LoginForm Component - Knowva Enterprise Authentication
 */
export const LoginForm = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchToForgotPassword
}) => {
  const [authMode, setAuthMode] = useState('password'); // 'password' | 'magic'
  const [email, setEmail] = useState('sarah.chen@acme.ai');
  const [password, setPassword] = useState('SuperSecret2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both work email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.({ email, name: 'Sarah Chen' });
    }, 800);
  };

  const handleMagicLink = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMagicLinkSent(true);
    }, 700);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.({ email: `user@${provider.toLowerCase()}.com`, name: `${provider} User` });
    }, 800);
  };

  return (
    <div className="space-y-5">
      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Social SSO Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleSocialLogin('Google')}
          disabled={isLoading}
          leftIcon={<GoogleIcon />}
          className="justify-center text-xs"
        >
          Google SSO
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleSocialLogin('GitHub')}
          disabled={isLoading}
          leftIcon={<GithubIcon />}
          className="justify-center text-xs"
        >
          GitHub SSO
        </Button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <span className="relative px-3 bg-surface text-[10px] uppercase font-mono font-semibold text-muted">
          Or continue with work email
        </span>
      </div>

      {/* Auth Mode Toggle Pill */}
      <div className="flex p-1 rounded-xl bg-surface-hover border border-border-subtle text-xs">
        <button
          type="button"
          onClick={() => { setAuthMode('password'); setMagicLinkSent(false); }}
          className={cn(
            "flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer",
            authMode === 'password' ? "bg-surface text-primary shadow-xs font-semibold" : "text-secondary hover:text-primary"
          )}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode('magic'); setMagicLinkSent(false); }}
          className={cn(
            "flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer",
            authMode === 'magic' ? "bg-surface text-primary shadow-xs font-semibold" : "text-secondary hover:text-primary"
          )}
        >
          Magic Link
        </button>
      </div>

      {/* Mode A: Standard Password Form */}
      {authMode === 'password' && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="space-y-1.5">
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-secondary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-brand-600 accent-brand-600"
                />
                <span>Remember me for 30 days</span>
              </label>

              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-xs text-brand-400 hover:underline cursor-pointer font-medium"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center font-bold"
          >
            Sign In to Workspace
          </Button>
        </form>
      )}

      {/* Mode B: Passwordless Magic Link Form */}
      {authMode === 'magic' && (
        <div>
          {magicLinkSent ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-primary">Magic Link Dispatched</h3>
              <p className="text-xs text-secondary leading-relaxed">
                We sent a secure, one-click sign in link to <span className="font-semibold text-primary">{email}</span>. Click the link in your inbox to sign in instantly.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMagicLinkSent(false)}
                className="text-xs text-brand-400"
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <Input
                label="Work Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We'll send a passwordless login link directly to your inbox."
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full justify-center font-bold"
              >
                Send Magic Link
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Footer: Switch to Register */}
      <div className="text-center pt-2 text-xs text-secondary">
        Don&apos;t have a Knowva workspace yet?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-brand-400 hover:underline font-semibold cursor-pointer"
        >
          Sign Up Free
        </button>
      </div>
    </div>
  );
};
