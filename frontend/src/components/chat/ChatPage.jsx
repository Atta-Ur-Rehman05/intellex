import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, MessageSquare, Share2, Plus, 
  Menu, X, SlidersHorizontal, BookOpen, ShieldCheck 
} from 'lucide-react';
import { ThreadHistorySidebar } from './ThreadHistorySidebar';
import { MessageList } from './MessageList';
import { ChatComposer } from './ChatComposer';
import { CitationDrawer } from './CitationDrawer';
import { PromptLibraryModal } from './PromptLibraryModal';
import { chatSpecs } from '../../design-system/chatSpecs';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export const ChatPage = ({
  initialDocContext = null,
  onNavigateToDocs
}) => {
  const [threads, setThreads] = useState(chatSpecs.threads);
  const [activeThreadId, setActiveThreadId] = useState('th-soc2');
  const [selectedModelId, setSelectedModelId] = useState('claude-3-5-sonnet');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals & Drawers
  const [activeCitation, setActiveCitation] = useState(null);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, isStreaming]);

  // Handle New Thread Creation
  const handleNewThread = () => {
    const newId = `th-${Date.now()}`;
    const newThread = {
      id: newId,
      title: 'New Investigation',
      group: 'today',
      timestamp: 'Just now',
      modelId: selectedModelId,
      documentScope: initialDocContext ? initialDocContext.title : 'All Knowledge Base (1,428 files)',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          role: 'assistant',
          timestamp: 'Just now',
          model: 'Claude 3.5 Sonnet',
          content: initialDocContext
            ? `I have initialized vector context focused on **${initialDocContext.title}** (${initialDocContext.chunksCount || 142} chunks). How can I assist you with this document?`
            : "Hello Sarah! I am your Knowva AI Knowledge Assistant. Ask me anything across your enterprise documents, vector embeddings, and cloud workspaces."
        }
      ]
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
    setIsSidebarOpen(false);
  };

  // Handle Delete Thread
  const handleDeleteThread = (threadId) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      const remaining = threads.filter(t => t.id !== threadId);
      if (remaining.length > 0) {
        setActiveThreadId(remaining[0].id);
      }
    }
    toast({
      title: "Thread Deleted",
      description: "Conversation history removed.",
      type: "info"
    });
  };

  // Handle Rename Thread
  const handleRenameThread = (threadId, newTitle) => {
    setThreads(prev => prev.map(t => 
      t.id === threadId ? { ...t, title: newTitle } : t
    ));
    toast({
      title: "Thread Renamed",
      description: `Updated title to "${newTitle}".`,
      type: "success"
    });
  };

  // Simulated Streaming AI Response
  const handleSendMessage = (userText) => {
    const userMsgId = `msg-${Date.now()}-u`;
    const aiMsgId = `msg-${Date.now()}-a`;

    const userMessage = {
      id: userMsgId,
      role: 'user',
      timestamp: 'Just now',
      content: userText
    };

    // Append user message immediately
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          title: t.title === 'New Investigation' ? userText.slice(0, 38) + '...' : t.title,
          messages: [...t.messages, userMessage]
        };
      }
      return t;
    }));

    // Start streaming simulation
    setIsStreaming(true);
    setStreamingMsgId(aiMsgId);

    const fullResponse = `Based on Section 4 of our indexed knowledge documentation [1], here is the verified architectural breakdown for **"${userText}"**:

### Analysis & Synthesized Insights
Our vector retrieval engine matched multiple high-similarity chunks across tenant partitions [2]. The cryptographic isolation guarantees that customer data remains isolated within your dedicated Qdrant cluster namespace.

\`\`\`typescript
// Automated vector query trace
const vectorResult = await knowva.hybridSearch({
  query: "${userText.slice(0, 32)}",
  similarityThreshold: 0.94,
  zeroDataRetention: true
});
\`\`\`

Would you like me to inspect deeper or export a summary report?`;

    let currentText = '';
    let charIndex = 0;

    // Place initial empty assistant message
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: aiMsgId,
              role: 'assistant',
              timestamp: 'Just now',
              model: selectedModelId === 'gpt-4o' ? 'GPT-4o' : selectedModelId === 'deepseek-r1' ? 'DeepSeek-R1' : 'Claude 3.5 Sonnet',
              reasoning: `Retrieved 42 vector chunks in 174ms across Qdrant cluster. Zero data retention active.`,
              content: '',
              citations: [
                {
                  id: 1,
                  badge: '[1]',
                  docId: 'doc-1',
                  title: 'SOC2_TypeII_Security_Audit_2026.pdf',
                  page: 'Page 14, Section 4.2',
                  similarity: 0.98,
                  snippet: 'All customer embeddings generated via the 1,536-dimension OpenAI text-embedding-3-large model are stored with partition-level cryptographic separation.'
                },
                {
                  id: 2,
                  badge: '[2]',
                  docId: 'doc-2',
                  title: 'Enterprise_Architecture_Blueprint_v3.notion',
                  page: 'Section: Dual-Index Hybrid Search',
                  similarity: 0.96,
                  snippet: 'Dual-Index Hybrid Search blends Reciprocal Rank Fusion (RRF) between BM25 sparse keyword search and dense 1536-dim cosine similarity.'
                }
              ]
            }
          ]
        };
      }
      return t;
    }));

    // Interval to stream tokens smoothly
    const interval = setInterval(() => {
      charIndex += 14;
      if (charIndex >= fullResponse.length) {
        currentText = fullResponse;
        clearInterval(interval);
        setIsStreaming(false);
        setStreamingMsgId(null);
      } else {
        currentText = fullResponse.slice(0, charIndex);
      }

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: t.messages.map(m => 
              m.id === aiMsgId ? { ...m, content: currentText } : m
            )
          };
        }
        return t;
      }));
    }, 45);
  };

  const handleShareThread = () => {
    navigator.clipboard?.writeText(window.location.origin + `/chat/${activeThreadId}`);
    toast({
      title: "Thread Link Copied",
      description: "Encrypted discussion link copied to clipboard.",
      type: "success"
    });
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-4 animate-in fade-in duration-200">
      {/* Desktop / Mobile Slide-out Thread Sidebar */}
      <ThreadHistorySidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={(id) => {
          setActiveThreadId(id);
          setIsSidebarOpen(false);
        }}
        onNewThread={handleNewThread}
        onDeleteThread={handleDeleteThread}
        onRenameThread={handleRenameThread}
        className={cn(
          "h-full",
          isSidebarOpen ? "fixed inset-y-16 left-0 z-40 w-72 shadow-2xl" : "hidden md:flex"
        )}
      />

      {/* Main Conversational Canvas */}
      <div className="flex-1 flex flex-col justify-between bg-surface rounded-2xl border border-border-default shadow-xs overflow-hidden h-full">
        {/* Chat Header Bar */}
        <div className="p-4 px-5 border-b border-border-default flex items-center justify-between gap-3 bg-surface/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1.5 rounded-lg border border-border-default text-secondary hover:text-primary"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-primary truncate">
                  {activeThread?.title}
                </h2>
                <Badge variant="brand" dot className="hidden sm:inline-flex">
                  {selectedModelId === 'gpt-4o' ? 'GPT-4o' : selectedModelId === 'deepseek-r1' ? 'DeepSeek-R1' : 'Claude 3.5 Sonnet'}
                </Badge>
              </div>
              <p className="text-[11px] text-muted truncate font-mono">
                Scope: {activeThread?.documentScope}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShareThread}
              leftIcon={<Share2 className="w-3.5 h-3.5 text-secondary" />}
              className="text-xs h-8"
            >
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Message List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2 no-scrollbar">
          <MessageList
            messages={activeThread?.messages || []}
            isStreaming={isStreaming}
            streamingMessageId={streamingMsgId}
            onCitationClick={(citation) => setActiveCitation(citation)}
            onRegenerate={() => {
              const lastUser = [...activeThread.messages].reverse().find(m => m.role === 'user');
              if (lastUser) handleSendMessage(lastUser.content);
            }}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Composer Bar */}
        <div className="p-4 pt-2 border-t border-border-default bg-surface/90 backdrop-blur-md">
          <ChatComposer
            onSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            onStopStreaming={() => setIsStreaming(false)}
            onOpenPromptLibrary={() => setIsPromptLibraryOpen(true)}
            selectedModelId={selectedModelId}
            onChangeModel={setSelectedModelId}
            documentScope={activeThread?.documentScope}
          />
        </div>
      </div>

      {/* Citation Slide-over Drawer */}
      <CitationDrawer
        isOpen={!!activeCitation}
        onClose={() => setActiveCitation(null)}
        citation={activeCitation}
        onNavigateToDocs={onNavigateToDocs}
      />

      {/* Enterprise Prompt Library Modal */}
      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelectPrompt={(text) => handleSendMessage(text)}
      />
    </div>
  );
};
