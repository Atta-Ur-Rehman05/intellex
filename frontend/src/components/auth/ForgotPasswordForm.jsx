import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

/**
 * ForgotPasswordForm Component - Password Recovery Flow
 */
export const ForgotPasswordForm = ({
  onBackToLogin
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {isSubmitted ? (
        <div className="text-center space-y-4 animate-in fade-in">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-primary">Reset Instructions Dispatched</h3>
            <p className="text-xs text-secondary leading-relaxed">
              If an account exists for <span className="font-semibold text-primary">{email}</span>, you will receive a secure password reset link within 2 minutes.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={onBackToLogin}
              className="w-full justify-center"
            >
              Return to Sign In
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center space-y-1 pb-1">
            <h3 className="text-base font-bold text-primary">Reset Your Password</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Enter your registered work email and we will send self-serve reset instructions.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Registered Work Email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoFocus
          />

          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isLoading}
            className="w-full justify-center font-bold"
          >
            Send Recovery Link
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
