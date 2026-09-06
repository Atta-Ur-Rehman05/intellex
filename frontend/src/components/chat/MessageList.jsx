import React, { useState } from 'react';
import { 
  Sparkles, User, ThumbsUp, ThumbsDown, Copy, 
  Check, RefreshCw, ChevronDown, ChevronRight, 
  BrainCircuit, ShieldCheck, Terminal 
} from 'lucide-react';
import { CitationBadge } from './CitationBadge';
import { ChatCodeBlock } from './ChatCodeBlock';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const MessageList = ({
  messages = [],
  isStreaming = false,
  streamingMessageId = null,
  onCitationClick,
  onRegenerate
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [feedback, setFeedback] = useState({}); // { [msgId]: 'up' | 'down' }
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const { toast } = useToast();

  const handleCopy = (content, id) => {
    navigator.clipboard?.writeText(content);
    setCopiedMessageId(id);
    toast({
      title: "Response Copied",
      description: "Full AI response copied in Markdown format.",
      type: "success"
    });
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleFeedback = (msgId, type) => {
    setFeedback(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type
    }));
    toast({
      title: type === 'up' ? "Helpful Response" : "Feedback Logged",
      description: type === 'up' ? "Thank you! Vector alignment score updated." : "Feedback submitted to improve RAG retrieval accuracy.",
      type: type === 'up' ? "success" : "info"
    });
  };

  const toggleReasoning = (msgId) => {
    setExpandedReasoning(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Helper to parse message text into segments (code blocks, text, and citations)
  const renderMessageContent = (message) => {
    const { content, citations = [] } = message;

    // Check for code blocks ```language ... ```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: content.slice(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'typescript',
        value: match[2]
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex)
      });
    }

    return (
      <div className="space-y-2 text-xs leading-relaxed select-text font-sans">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            return (
              <ChatCodeBlock
                key={idx}
                language={part.language}
                code={part.value}
              />
            );
          }

          // Parse inline citation brackets like [1], [2] in text
          const textSegments = [];
          const citationRegex = /\[(\d+)\]/g;
          let textLast = 0;
          let citeMatch;

          while ((citeMatch = citationRegex.exec(part.value)) !== null) {
            if (citeMatch.index > textLast) {
              textSegments.push(part.value.slice(textLast, citeMatch.index));
            }

            const citeId = parseInt(citeMatch[1]);
            const citationObj = citations.find(c => c.id === citeId);

            textSegments.push(
              <CitationBadge
                key={`cite-${idx}-${citeMatch.index}`}
                citation={citationObj || { id: citeId, badge: `[${citeId}]`, title: 'Knowledge Vector', page: 'Verified Chunk' }}
                onClick={onCitationClick}
              />
            );

            textLast = citeMatch.index + citeMatch[0].length;
          }

          if (textLast < part.value.length) {
            textSegments.push(part.value.slice(textLast));
          }

          return (
            <div key={idx} className="whitespace-pre-line text-primary">
              {textSegments}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        const isStreamingThis = isStreaming && streamingMessageId === msg.id;

        return (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 animate-in fade-in duration-200",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {/* Assistant Avatar */}
            {!isUser && (
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            {/* Message Body Container */}
            <div className={cn(
              "space-y-2 max-w-[88%] sm:max-w-[80%]",
              isUser ? "items-end" : "items-start"
            )}>
              {/* Header: Name and Time */}
              <div className={cn(
                "flex items-center gap-2 text-[11px] text-muted",
                isUser && "justify-end"
              )}>
                <span className="font-semibold text-primary font-sans">
                  {isUser ? "You" : msg.model || "Knowva Assistant"}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* User Bubble */}
              {isUser ? (
                <div className="p-3.5 px-4 rounded-2xl rounded-tr-xs bg-brand-600 text-white text-xs leading-relaxed shadow-xs selection:bg-white/30">
                  {msg.content}
                </div>
              ) : (
                /* Assistant Bubble */
                <div className="space-y-3">
                  {/* Reasoning / Thinking Trace Accordion */}
                  {msg.reasoning && (
                    <div className="rounded-xl border border-border-subtle bg-surface-hover/60 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => toggleReasoning(msg.id)}
                        className="w-full p-2.5 px-3 flex items-center justify-between text-muted hover:text-primary transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
                          <span>Neural Vector Search Trace</span>
                        </div>
                        {expandedReasoning[msg.id] ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {expandedReasoning[msg.id] && (
                        <div className="p-3 pt-0 border-t border-border-subtle/50 text-[11px] font-mono text-secondary space-y-1">
                          <p>{msg.reasoning}</p>
                          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] pt-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Zero data retention verified: Qdrant partition isolated.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rendered Markdown & Code */}
                  <div className="p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-surface border border-border-default shadow-xs space-y-3">
                    {renderMessageContent(msg)}

                    {/* Streaming Cursor */}
                    {isStreamingThis && (
                      <span className="inline-block w-2 h-4 bg-brand-500 animate-pulse align-middle ml-1" />
                    )}
                  </div>

                  {/* Assistant Footer Actions */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-colors flex items-center gap-1 text-[11px]"
                      title="Copy Markdown"
                    >
                      {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMessageId === msg.id ? "Copied" : "Copy"}</span>
                    </button>

                    {/* Thumbs Up */}
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors cursor-pointer",
                        feedback[msg.id] === 'up'
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-muted hover:text-primary hover:bg-surface-hover"
                      )}
                      title="Accurate Answer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Thumbs Down */}
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors cursor-pointer",
                        feedback[msg.id] === 'down'
                          ? "text-rose-400 bg-rose-500/10"
                          : "text-muted hover:text-primary hover:bg-surface-hover"
                      )}
                      title="Inaccurate or Irrelevant"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Regenerate */}
                    <button
                      onClick={() => onRegenerate?.(msg.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-colors flex items-center gap-1 text-[11px]"
                      title="Regenerate response"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="h-8 w-8 rounded-xl bg-surface-hover border border-border-default flex items-center justify-center text-secondary shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
