import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, Sliders, 
  Sparkles, Layers, ShieldCheck, ArrowRight, ArrowLeft, 
  Trash2, Database, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { documentSpecs } from '../../design-system/documentSpecs';

export const UploadWizardModal = ({
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Files, 2: Chunking Strategy, 3: Processing
  const [selectedFiles, setSelectedFiles] = useState([
    { name: 'SOC2_TypeII_Security_Audit_2026.pdf', size: '4.8 MB', type: 'pdf' },
    { name: 'Architecture_Blueprint_v3.notion', size: '1.2 MB', type: 'notion' }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Step 2 Strategy State
  const [selectedProfileId, setSelectedProfileId] = useState('balanced');
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-large (1536-dim)');
  const [targetCollection, setTargetCollection] = useState('f-sec');
  const [classification, setClassification] = useState('confidential');
  const [selectedTags, setSelectedTags] = useState(['tag-soc2']);

  // Step 3 Progress State
  const [processingStage, setProcessingStage] = useState(0); // 0: Parsing, 1: Chunking, 2: Vectorizing, 3: Completed
  const { toast } = useToast();

  const handleProfileChange = (profileId) => {
    setSelectedProfileId(profileId);
    const profile = documentSpecs.chunkingProfiles.find(p => p.id === profileId);
    if (profile) {
      setChunkSize(profile.chunkSize);
      setChunkOverlap(profile.overlap);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      const mapped = files.map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.endsWith('.pdf') ? 'pdf' : f.name.endsWith('.md') ? 'markdown' : 'code'
      }));
      setSelectedFiles(prev => [...prev, ...mapped]);
    }
  };

  const handleStartIngestion = () => {
    setCurrentStep(3);
    setProcessingStage(0);

    // Simulate multi-stage pipeline
    setTimeout(() => setProcessingStage(1), 1200); // Chunking
    setTimeout(() => setProcessingStage(2), 2400); // Embedding
    setTimeout(() => {
      setProcessingStage(3); // Done
      toast({
        title: "Vector Ingestion Succeeded",
        description: `Ingested ${selectedFiles.length} files into tenant vector partition.`,
        type: "success"
      });
      onUploadComplete?.();
    }, 3800);
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setProcessingStage(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Knowledge Ingestion & Vectorization Wizard"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {currentStep > 1 && currentStep < 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetAndClose}
              className="text-xs"
            >
              {currentStep === 3 && processingStage === 3 ? "Done" : "Cancel"}
            </Button>

            {currentStep === 1 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep(2)}
                disabled={selectedFiles.length === 0}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs bg-brand-600 hover:bg-brand-500 text-white"
              >
                Configure Chunking Strategy
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartIngestion}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                className="text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
              >
                Start Vector Ingestion
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stepper Header */}
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          {[
            { step: 1, label: 'Select Files & Sources' },
            { step: 2, label: 'Vector Strategy & Rules' },
            { step: 3, label: 'Embedding Generation' }
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors",
                currentStep === s.step
                  ? "bg-brand-600 text-white ring-4 ring-brand-500/20"
                  : currentStep > s.step
                  ? "bg-emerald-500 text-white"
                  : "bg-surface-hover text-muted"
              )}>
                {currentStep > s.step ? "✓" : s.step}
              </span>
              <span className={cn(
                "text-xs font-medium hidden sm:inline",
                currentStep === s.step ? "text-primary font-bold" : "text-secondary"
              )}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: DROPZONE & CONNECTOR SOURCES */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                isDragging
                  ? "border-brand-500 bg-brand-500/10 scale-[1.01]"
                  : "border-border-default hover:border-brand-500/50 bg-canvas"
              )}
            >
              <div className="h-12 w-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-primary">Drag & drop files or click to browse</h4>
              <p className="text-xs text-secondary mt-1 max-w-sm">
                Supports PDF, DOCX, Notion markdown, TypeScript, Python, CSV, and transcripts up to 100 MB each.
              </p>
            </div>

            {/* Cloud Connectors Bar */}
            <div className="p-3 rounded-xl bg-surface-hover/70 border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-primary">Or connect directly:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast({ title: "Connecting Google Drive", description: "Fetching shared folder metadata...", type: "info" })}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border-default hover:border-brand-500/40 text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="font-medium">Google Drive</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast({ title: "Connecting Notion Workspace", description: "Authorized 18 engineering pages.", type: "success" })}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border-default hover:border-brand-500/40 text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="font-medium">Notion Workspace</span>
                </button>
              </div>
            </div>

            {/* Selected Files Queue */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-secondary">
                  <span className="font-semibold text-primary font-mono">{selectedFiles.length} files queued</span>
                  <span>Ready for parsing</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-surface border border-border-subtle flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                        <span className="font-medium text-primary truncate max-w-xs">{file.name}</span>
                        <span className="text-[10px] font-mono text-muted">({file.size})</span>
                      </div>
                      <button
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                        className="text-muted hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHUNKING STRATEGY & CLASSIFICATION */}
        {currentStep === 2 && (
          <div className="space-y-5">
            {/* Strategy Profiles */}
            <div>
              <label className="block text-xs font-semibold text-primary mb-2">Chunking Preset Profile</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {documentSpecs.chunkingProfiles.map((prof) => {
                  const isSelected = selectedProfileId === prof.id;
                  return (
                    <div
                      key={prof.id}
                      onClick={() => handleProfileChange(prof.id)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between",
                        isSelected
                          ? "bg-brand-500/10 border-brand-500 ring-1 ring-brand-500"
                          : "bg-surface border-border-default hover:bg-surface-hover"
                      )}
                    >
                      <div>
                        <h5 className="text-xs font-bold text-primary mb-1">{prof.name}</h5>
                        <p className="text-[10px] text-secondary leading-snug line-clamp-2">{prof.description}</p>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-brand-400">
                        {prof.chunkSize} tok • {prof.overlap} overlap
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Granular Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-canvas border border-border-subtle">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-primary">Chunk Size (Tokens)</span>
                  <span className="font-mono text-brand-400 font-bold">{chunkSize} tokens</span>
                </div>
                <input
                  type="range"
                  min={128}
                  max={1536}
                  step={64}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-primary">Chunk Overlap</span>
                  <span className="font-mono text-brand-400 font-bold">{chunkOverlap} tokens</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={256}
                  step={16}
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Target Folder & Classification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Destination Collection</label>
                <select
                  value={targetCollection}
                  onChange={(e) => setTargetCollection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
                >
                  {documentSpecs.collections.filter(c => c.id !== 'f-all').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Security Classification</label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-canvas border border-border-default text-xs text-primary focus:outline-none focus:border-brand-500"
                >
                  {documentSpecs.classifications.map((cl) => (
                    <option key={cl.id} value={cl.id}>{cl.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REAL-TIME INGESTION & VECTOR GENERATION */}
        {currentStep === 3 && (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              {[
                { stage: 0, title: 'Document AST & Text Extraction', desc: 'Parsing markdown headers, tables, and PDF pages...' },
                { stage: 1, title: 'Recursive Semantic Chunking', desc: `Splitting into ${chunkSize}-token blocks with ${chunkOverlap}-token overlap...` },
                { stage: 2, title: 'OpenAI 1536-dim Embedding Generation', desc: 'Calling text-embedding-3-large with zero customer data retention...' },
                { stage: 3, title: 'Tenant Vector Partition Upsert', desc: 'Indexed into isolated Qdrant vector database namespace.' }
              ].map((item) => {
                const isPassed = processingStage > item.stage;
                const isCurrent = processingStage === item.stage;

                return (
                  <div
                    key={item.stage}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all flex items-center justify-between",
                      isPassed
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : isCurrent
                        ? "bg-brand-500/10 border-brand-500 text-brand-400 animate-pulse"
                        : "bg-surface border-border-subtle text-muted opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-5 h-5 text-brand-400 animate-spin shrink-0" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-border-default shrink-0" />
                      )}
                      <div>
                        <h5 className="text-xs font-bold">{item.title}</h5>
                        <p className="text-[11px] text-secondary">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold">
                      {isPassed ? "Complete" : isCurrent ? "Processing" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>

            {processingStage === 3 && (
              <div className="p-4 rounded-xl bg-surface border border-border-default shadow-xs text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-primary">All Documents Ready for RAG Search</h4>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Vector index updated with 210 new chunks. Embeddings are immediately searchable via Command-K and AI Assistant.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
