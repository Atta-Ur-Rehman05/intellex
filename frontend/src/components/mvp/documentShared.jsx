import { FileText, File } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';

export const DOC_STATUS = {
  uploading: { label: 'Uploading', variant: 'info' },
  processing: { label: 'Processing', variant: 'warning' },
  ready: { label: 'Ready', variant: 'success' },
  failed: { label: 'Failed', variant: 'error' },
};

export const DocumentStatusBadge = ({ status }) => {
  const meta = DOC_STATUS[status] || DOC_STATUS.processing;
  const showSpinner = status === 'uploading' || status === 'processing';
  return (
    <Badge variant={meta.variant} dot={showSpinner ? undefined : true}>
      {meta.label}
    </Badge>
  );
};

export const DocumentTypeIcon = ({ type }) =>
  type === 'pdf' || type === 'txt' ? (
    <FileText className="w-4 h-4" />
  ) : (
    <File className="w-4 h-4" />
  );

export const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
};

export const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
