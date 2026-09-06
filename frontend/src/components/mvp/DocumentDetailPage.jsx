import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Trash2, FileText, AlertCircle, RefreshCw, Clock, HardDrive, Type
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Card, CardHeader, CardContent } from '../ui/Card.jsx';
import { ConfirmDialog } from '../ui/Modal.jsx';
import { SkeletonBlock, SkeletonCircle } from '../ui/Skeleton.jsx';
import { useToast } from '../ui/Toast.jsx';
import { documentsApi } from '../../api/services.js';
import { DocumentStatusBadge, DocumentTypeIcon, formatDate, formatBytes } from './documentShared.jsx';

export const DocumentDetailPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doc, setDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const d = await documentsApi.get(documentId);
      setDoc(d);
    } catch (err) {
      setError(err.message || 'Could not load this document.');
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { load(); }, [load]);

  // Poll while processing
  useEffect(() => {
    if (!doc || (doc.status !== 'processing' && doc.status !== 'uploading')) return;
    const t = setInterval(load, 1500);
    return () => clearInterval(t);
  }, [doc, load]);

  const handleDelete = async () => {
    try {
      await documentsApi.remove(documentId);
      toast({ title: 'Document deleted', description: `"${doc.name}" was removed.`, type: 'success' });
      navigate('/app/documents', { replace: true });
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, type: 'error' });
      setIsDeleteOpen(false);
    }
  };

  const handleAskAi = () => {
    navigate(`/app/chat?doc=${encodeURIComponent(doc.id)}&name=${encodeURIComponent(doc.name)}`);
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5" role="status" aria-busy="true">
        <SkeletonBlock className="h-8 w-40 rounded-lg" />
        <div className="p-6 rounded-2xl bg-surface border border-border-default space-y-5">
          <div className="flex items-center gap-4">
            <SkeletonCircle className="w-12 h-12" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-3 w-1/3" />
            </div>
          </div>
          <SkeletonBlock className="h-24 w-full rounded-xl" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-9 w-36 rounded-lg" />
            <SkeletonBlock className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="py-14">
          <div className="flex flex-col items-center gap-3 text-center">
            <FileText className="w-10 h-10 text-amber-500" />
            <div>
              <h2 className="text-lg font-bold text-primary">Document not found</h2>
              <p className="text-xs text-secondary mt-1.5">{error}</p>
            </div>
            <div className="flex gap-2.5 mt-2">
              <Button variant="secondary" size="sm" onClick={load} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                Retry
              </Button>
              <Link to="/app/documents">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  Back to Documents
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isReady = doc.status === 'ready';

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb back */}
      <button
        type="button"
        onClick={() => navigate('/app/documents')}
        className="flex items-center gap-2 text-xs font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Documents</span>
      </button>

      {/* Main card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/25 text-brand-400 shrink-0">
              <DocumentTypeIcon type={doc.file_type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-primary break-all">{doc.name}</h1>
                <DocumentStatusBadge status={doc.status} />
              </div>
              <p className="text-xs text-secondary mt-1">
                Uploaded {formatDate(doc.created_at)} · Updated {formatDate(doc.updated_at)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Processing banner */}
          {doc.status === 'processing' && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/25 flex items-center gap-3" role="status">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Processing in progress</p>
                <p className="text-xs text-secondary mt-0.5">
                  Knowva is extracting text and building embeddings. This usually takes under a minute — the page updates automatically.
                </p>
              </div>
            </div>
          )}

          {/* Failed banner */}
          {doc.status === 'failed' && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/25 flex items-start gap-3" role="alert">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Processing failed</p>
                <p className="text-xs text-secondary mt-0.5">
                  {doc.error_message || 'Something went wrong while processing this document. Try deleting and re-uploading it.'}
                </p>
              </div>
            </div>
          )}

          {/* File information */}
          <div className="p-4 rounded-xl bg-canvas border border-border-default">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted mb-3">File Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Type, label: 'File type', value: doc.file_type.toUpperCase() },
                { icon: HardDrive, label: 'Size', value: formatBytes(doc.size_bytes) },
                { icon: Clock, label: 'Uploaded', value: formatDate(doc.created_at) },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <f.icon className="w-4 h-4 text-secondary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted">{f.label}</p>
                    <p className="text-xs font-semibold text-primary">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button
              variant="ai"
              onClick={handleAskAi}
              disabled={!isReady}
              leftIcon={<Sparkles className="w-4 h-4" />}
              title={isReady ? 'Open AI Chat with this document' : 'Available once processing completes'}
            >
              Ask AI About This Document
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="hover:border-red-500/40 hover:text-red-500"
            >
              Delete
            </Button>
          </div>
          {!isReady && doc.status !== 'failed' && (
            <p className="text-[11px] text-muted">
              &quot;Ask AI&quot; unlocks as soon as processing completes.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`"${doc.name}" will be permanently removed from your knowledge base, including its AI index. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};
