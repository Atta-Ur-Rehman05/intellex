import React, { useState } from 'react';
import { Check, Copy, Code2, Terminal } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * CodeBlock Component - Knowva Design System
 * 
 * Features:
 * - Syntax highlighting simulation with color tokens
 * - Line numbers toggle
 * - Copy button with instant checkmark state
 * - Language tag badge
 */
export const CodeBlock = ({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  className
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className={cn("rounded-xl border border-border-default bg-slate-950 text-slate-100 overflow-hidden shadow-lg font-mono text-xs", className)}>
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          {filename ? (
            <span className="font-semibold text-slate-200">{filename}</span>
          ) : (
            <span className="uppercase text-[10px] tracking-wider font-semibold text-slate-400">{language}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto">
        <pre className="m-0 leading-relaxed font-mono">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px]">
                    {idx + 1}
                  </span>
                )}
                <span className="table-cell text-slate-200 whitespace-pre">
                  {line}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

/**
 * Markdown Viewer Component Demo
 * Simulates rich Notion-like / ChatGPT-like formatting with citations
 */
export const MarkdownViewer = ({ content, className }) => {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none space-y-4 text-primary leading-relaxed text-sm", className)}>
      {content}
    </div>
  );
};
