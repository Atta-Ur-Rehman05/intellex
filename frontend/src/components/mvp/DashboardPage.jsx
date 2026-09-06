import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, MessageSquare, UploadCloud, Sparkles, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { DashboardSkeleton } from '../ui/Skeleton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { dashboardApi } from '../../api/services.js';
import { DocumentStatusBadge, DocumentTypeIcon, formatDate } from './documentShared.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const d = await dashboardApi.get();
      setData(d);
    } catch (err) {
      setError(err.message || 'Could not load your dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <Card>
        <CardContent className="py-14">
          <EmptyState
            illustration="no-search-results"
            title="Could not load dashboard"
            description={error}
            primaryAction={{ label: 'Retry', variant: 'secondary', onClick: load }}
          />
        </CardContent>
      </Card>
    );
  }

  const firstName = (user?.name || 'there').split(' ')[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Welcome header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Welcome back, {firstName}</h1>
          <p className="text-xs text-secondary mt-1">
            Here&apos;s your knowledge workspace at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/documents?upload=1')}
            leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
          >
            Upload Document
          </Button>
          <Button
            variant="ai"
            size="sm"
            onClick={() => navigate('/app/chat')}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Ask AI
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/app/documents" className="group">
          <Card variant="standard" className="p-5 group-hover:border-brand-500/50 group-hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-brand-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary tracking-tight">{data?.total_documents ?? 0}</p>
                <p className="text-xs text-secondary flex items-center gap-1">
                  Documents
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/app/chat" className="group">
          <Card variant="standard" className="p-5 group-hover:border-brand-500/50 group-hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary tracking-tight">{data?.total_conversations ?? 0}</p>
                <p className="text-xs text-secondary flex items-center gap-1">
                  Conversations
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>The latest files you&apos;ve uploaded to your knowledge base</CardDescription>
            </div>
            <Link to="/app/documents">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {(data?.recent_documents || []).length === 0 ? (
            <EmptyState
              size="sm"
              illustration="no-documents"
              title="No documents yet"
              description="Upload your first PDF or TXT file to start asking AI questions about it."
              primaryAction={{
                label: 'Upload Document',
                variant: 'primary',
                onClick: () => navigate('/app/documents?upload=1'),
              }}
            />
          ) : (
            <div className="divide-y divide-border-subtle rounded-xl border border-border-default overflow-hidden">
              {data.recent_documents.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/app/documents/${doc.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-surface hover:bg-surface-hover/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-surface-hover text-secondary shrink-0">
                      <DocumentTypeIcon type={doc.file_type} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary truncate">{doc.name}</p>
                      <p className="text-[10px] text-muted font-mono">
                        {doc.file_type.toUpperCase()} · uploaded {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <DocumentStatusBadge status={doc.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
