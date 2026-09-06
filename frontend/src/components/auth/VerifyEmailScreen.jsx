import React, { useState, useRef, useEffect } from 'react';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * VerifyEmailScreen Component - 6-Digit OTP Code Verification
 */
export const VerifyEmailScreen = ({
  email = 'sarah.chen@acme.ai',
  onVerifySuccess,
  onChangeEmail
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Countdown timer for resending OTP code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Advance focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically trigger verification
    if (newOtp.every(digit => digit !== '')) {
      handleCompleteOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      handleCompleteOtp(pasted);
    }
  };

  const handleCompleteOtp = (fullCode) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess?.({ email, verified: true });
    }, 900);
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(45);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
        <Mail className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-primary">Verify Your Email Address</h3>
        <p className="text-xs text-secondary leading-relaxed">
          We sent a 6-digit verification code to{' '}
          <span className="font-semibold text-primary">{email}</span>.
        </p>
      </div>

      {/* 6-Digit OTP Input Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            autoFocus={idx === 0}
            className={cn(
              "w-10 sm:w-12 h-12 sm:h-14 text-center font-mono font-bold text-lg sm:text-xl rounded-xl border bg-surface text-primary outline-none transition-all duration-150",
              digit ? "border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20" : "border-border-default hover:border-border-strong",
              "focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      {/* Verify Action Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => handleCompleteOtp(otp.join(''))}
        isLoading={isVerifying}
        disabled={otp.some(d => d === '')}
        className="w-full justify-center font-bold"
      >
        Confirm & Launch Workspace
      </Button>

      {/* Resend Code Countdown */}
      <div className="text-xs text-secondary pt-2 flex items-center justify-center gap-1.5">
        <span>Didn&apos;t receive the code?</span>
        {countdown > 0 ? (
          <span className="font-mono text-muted">Resend in {countdown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-brand-400 hover:underline font-semibold cursor-pointer"
          >
            Resend Code
          </button>
        )}
      </div>

      {/* Change Email */}
      {onChangeEmail && (
        <div className="pt-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={onChangeEmail}
            className="text-xs text-muted hover:text-primary transition-colors cursor-pointer"
          >
            Entered the wrong email? Click here to change.
          </button>
        </div>
      )}
    </div>
  );
};
