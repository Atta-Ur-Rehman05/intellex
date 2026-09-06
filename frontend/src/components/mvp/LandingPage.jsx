import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, UploadCloud, Cpu, MessageSquare,
  FileText, CheckCircle2, Sun, Moon
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const steps = [
  {
    icon: UploadCloud,
    title: '1. Upload Documents',
    desc: 'Drag in your PDFs or text files. Knowva securely stores and indexes them in seconds.',
  },
  {
    icon: Cpu,
    title: '2. AI Processes Your Knowledge',
    desc: 'Documents are chunked, embedded, and indexed so the AI understands every page.',
  },
  {
    icon: MessageSquare,
    title: '3. Ask Questions',
    desc: 'Chat with your knowledge base and get precise answers with clickable source citations.',
  },
];

export const LandingPage = () => {
  const { user } = useAuth();
  const { resolved, setMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-brand-600/15 via-purple-600/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative px-4 sm:px-6 lg:px-10 py-5 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-primary tracking-tight">Knowva</div>
            <div className="text-[10px] text-muted font-mono">AI Knowledge Workspace</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {resolved === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          {user ? (
            <Button variant="primary" size="sm" onClick={() => navigate('/app/dashboard')}>
              Open App
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="secondary" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-16 sm:py-24 max-w-6xl mx-auto w-full text-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI-powered knowledge management
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Your AI{' '}
            <span className="ai-gradient-text">Knowledge Workspace</span>
          </h1>

          <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mx-auto">
            Upload your documents and ask AI questions about them. Knowva reads your
            knowledge base and answers with verified sources — no more digging through files.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="ai"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-bold shadow-xl shadow-brand-500/25"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted font-mono pt-2">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> PDF & TXT support</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Source-cited answers</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 pb-20 sm:pb-28 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4 hover:border-brand-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted hidden md:block" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary">{step.title}</h3>
                  <p className="text-xs text-secondary leading-relaxed mt-1.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border-default px-4 py-6 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          <span>© 2026 Knowva — Your AI Knowledge Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};
