import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Square, Sparkles, BookOpen, Paperclip, 
  Layers, ChevronDown, Check, ArrowUp 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { chatSpecs } from '../../design-system/chatSpecs';
import { cn } from '../../lib/utils';

export const ChatComposer = ({
  onSendMessage,
  isStreaming = false,
  onStopStreaming,
  onOpenPromptLibrary,
  selectedModelId = 'claude-3-5-sonnet',
  onChangeModel,
  documentScope = 'All Knowledge Base (1,428 files)',
  className
}) => {
  const [inputText, setInputText] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const textareaRef = useRef(null);
  const modelDropdownRef = useRef(null);

  const activeModel = chatSpecs.models.find(m => m.id === selectedModelId) || chatSpecs.models[0];

  const quickSuggestions = [
    "Audit SOC2 vector tenant isolation",
    "Explain hybrid Reciprocal Rank Fusion",
    "Analyze Q3 AWS cloud cost variance",
    "Check customer SLA breach penalties"
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  // Click outside listener for model dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim() || isStreaming) return;
    onSendMessage?.(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quick Suggestions Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span>Suggestions:</span>
        </span>
        {quickSuggestions.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage?.(sug)}
            className="px-2.5 py-1 rounded-full bg-surface-hover/80 hover:bg-surface-hover border border-border-subtle hover:border-brand-500/40 text-[11px] text-secondary hover:text-primary transition-all whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Main Composer Box */}
      <div className="rounded-2xl border border-border-default bg-surface shadow-md p-3 space-y-2 focus-within:border-brand-500/80 focus-within:ring-1 focus-within:ring-brand-500/20 transition-all">
        {/* Top Info Bar: Knowledge Scope & Model */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-subtle text-xs">
          {/* Knowledge Scope Indicator */}
          <div className="flex items-center gap-1.5 text-muted truncate">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] text-secondary truncate">
              Scope: <strong>{documentScope}</strong>
            </span>
          </div>

          {/* Model Selector Pill */}
          <div className="relative" ref={modelDropdownRef}>
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-canvas hover:bg-surface-hover border border-border-subtle text-xs text-primary transition-colors cursor-pointer"
            >
              <span className="text-[11px] font-semibold">{activeModel.name}</span>
              <ChevronDown className="w-3 h-3 text-muted" />
            </button>

            {/* Model Dropdown Menu */}
            {isModelDropdownOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-64 p-1.5 rounded-xl bg-surface border border-border-default shadow-xl z-30 space-y-1 animate-in fade-in duration-150">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1 block">
                  Select Reasoning Engine
                </span>
                {chatSpecs.models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChangeModel?.(m.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between",
                      selectedModelId === m.id
                        ? "bg-brand-500/10 text-brand-400 font-semibold"
                        : "text-secondary hover:text-primary hover:bg-surface-hover"
                    )}
                  >
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-[10px] text-muted">{m.contextWindow}</div>
                    </div>
                    {selectedModelId === m.id && <Check className="w-3.5 h-3.5 text-brand-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask Knowva anything across your indexed knowledge... (Shift+Enter for new line)`}
          rows={1}
          className="w-full bg-transparent text-xs text-primary placeholder:text-muted focus:outline-none resize-none max-h-40 font-sans leading-relaxed"
        />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Left Buttons: Templates */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenPromptLibrary}
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-secondary" />}
              className="text-xs h-7 px-2 text-secondary hover:text-primary"
            >
              Prompt Library
            </Button>
          </div>

          {/* Right Button: Send or Stop */}
          {isStreaming ? (
            <Button
              variant="danger"
              size="sm"
              onClick={onStopStreaming}
              leftIcon={<Square className="w-3 h-3 fill-current" />}
              className="text-xs h-8 px-3"
            >
              Stop
            </Button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!inputText.trim()}
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                inputText.trim()
                  ? "bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
                  : "bg-canvas text-muted border border-border-subtle cursor-not-allowed opacity-50"
              )}
              title="Send Prompt (Enter)"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
