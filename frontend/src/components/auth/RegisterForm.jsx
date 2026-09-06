import React, { useState, useMemo } from 'react';
import { 
  User, Mail, Lock, ArrowRight, ShieldCheck, 
  Check, AlertCircle, Sparkles 
} from 'lucide-react';
import { Input, PasswordInput } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * RegisterForm Component - Knowva Workspace Registration
 */
export const RegisterForm = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate Password Strength Score (0 to 4)
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-border-default' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak (Add numbers & symbols)', color: 'bg-red-500' };
      case 2:
        return { score: 2, label: 'Moderate (Include uppercase & symbols)', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Strong (Great password)', color: 'bg-emerald-500' };
      case 4:
        return { score: 4, label: 'Excellent (Maximum entropy)', color: 'bg-purple-500' };
      default:
        return { score: 0, label: 'Too short (min 8 chars)', color: 'bg-red-500' };
    }
  }, [password]);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    if (passwordStrength.score < 2) {
      setError('Password is too weak. Please include letters, numbers, and symbols.');
      return;
    }

    if (!agreedTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.({ email, name: fullName });
    }, 800);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <Input
        label="Full Name"
        placeholder="Sarah Chen"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        leftIcon={<User className="w-4 h-4" />}
        required
      />

      {/* Work Email */}
      <Input
        label="Work Email"
        type="email"
        placeholder="sarah@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        helperText="We recommend using your work email for instant SSO matching."
        required
      />

      {/* Password with Strength Meter */}
      <div className="space-y-2">
        <PasswordInput
          label="Password"
          placeholder="Create a strong password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Dynamic 4-Bar Strength Meter */}
        {password.length > 0 && (
          <div className="space-y-1 pt-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-full rounded-full transition-all duration-200",
                    step <= passwordStrength.score ? passwordStrength.color : "bg-surface-hover border border-border-subtle"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted">Password Strength:</span>
              <span className={cn("font-semibold", passwordStrength.score >= 3 ? "text-emerald-500" : passwordStrength.score === 2 ? "text-amber-500" : "text-red-500")}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Terms Agreement Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2 text-xs text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-3.5 h-3.5 mt-0.5 rounded text-brand-600 accent-brand-600 shrink-0"
          />
          <span className="leading-snug">
            I agree to the <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span>, including zero customer data retention for AI training.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        variant="ai"
        size="lg"
        type="submit"
        isLoading={isLoading}
        className="w-full justify-center font-bold shadow-md shadow-brand-500/20"
      >
        Create Enterprise Account
      </Button>

      {/* Switch to Login */}
      <div className="text-center pt-2 text-xs text-secondary">
        Already have a Knowva account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-brand-400 hover:underline font-semibold cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};
