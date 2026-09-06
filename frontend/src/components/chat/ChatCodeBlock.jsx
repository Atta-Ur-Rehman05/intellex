import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { useToast } from '../ui/Toast';

export const ChatCodeBlock = ({ language = 'typescript', code = '' }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    toast({
      title: "Code Copied",
      description: `Copied ${language} code block to clipboard.`,
      type: "success"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-xl border border-border-default overflow-hidden my-3 bg-[#0A0E1A] shadow-xs select-text">
      {/* Code Header */}
      <div className="bg-[#111827] px-4 py-2 flex items-center justify-between border-b border-border-default/60">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-[11px] font-mono text-secondary font-semibold uppercase">{language}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="pr-4 select-none text-slate-600 text-right w-8 align-top text-[11px]">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
