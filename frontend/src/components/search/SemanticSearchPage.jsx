import React, { useState, useMemo } from 'react';
import { 
  Search, Sliders, Sparkles, Filter, RefreshCw, 
  ArrowUpDown, Zap, Database, Cpu, ShieldCheck, 
  Clock, CheckCircle2, ChevronRight, Layers, FileText,
  HelpCircle, MessageSquare
} from 'lucide-react';
import { SearchFacets } from './SearchFacets';
import { SearchResultCard } from './SearchResultCard';
import { ResultPreviewPanel } from './ResultPreviewPanel';
import { searchSpecs } from '../../design-system/searchSpecs';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

/**
 * SemanticSearchPage - Master Search & Vector Retrieval Workbench
 */
export const SemanticSearchPage = ({
  onNavigateToChat,
  onNavigateToDocs,
  initialQuery = '',
  className
}) => {
  const [query, setQuery] = useState(initialQuery || 'vector isolation');
  const [searchMode, setSearchMode] = useState('hybrid'); // 'hybrid' | 'dense' | 'keyword'
  const [similarityThreshold, setSimilarityThreshold] = useState(0.80);
  const [selectedFormats, setSelectedFormats] = useState(['all']);
  const [selectedClassification, setSelectedClassification] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'recency' | 'tokens'
  const [selectedResult, setSelectedResult] = useState(searchSpecs.corpus[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [showMobileFacets, setShowMobileFacets] = useState(false);
  const { toast } = useToast();

  // Reset all filters
  const handleResetFilters = () => {
    setSearchMode('hybrid');
    setSimilarityThreshold(0.80);
    setSelectedFormats(['all']);
    setSelectedClassification('all');
    setSelectedCollection('all');
    setDateRange('all');
    setSortBy('relevance');
    toast({
      title: "Filters Reset",
      description: "Default search parameters restored.",
      type: "info"
    });
  };

  // Toggle format selection
  const handleToggleFormat = (formatId) => {
    if (formatId === 'all') {
      setSelectedFormats(['all']);
      return;
    }

    setSelectedFormats(prev => {
      const withoutAll = prev.filter(f => f !== 'all');
      if (withoutAll.includes(formatId)) {
        const next = withoutAll.filter(f => f !== formatId);
        return next.length === 0 ? ['all'] : next;
      } else {
        return [...withoutAll, formatId];
      }
    });
  };

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let list = [...searchSpecs.corpus];

    // 1. Text Query Filter
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(item => 
        item.docTitle.toLowerCase().includes(q) ||
        item.heading.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.collection.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q)
      );
    }

    // 2. Similarity Threshold (Applied in dense and hybrid modes)
    if (searchMode !== 'keyword') {
      list = list.filter(item => item.similarity >= similarityThreshold);
    }

    // 3. Format Filter
    if (!selectedFormats.includes('all')) {
      list = list.filter(item => selectedFormats.includes(item.type));
    }

    // 4. Security Classification
    if (selectedClassification !== 'all') {
      list = list.filter(item => item.classification === selectedClassification);
    }

    // 5. Collection Filter
    if (selectedCollection !== 'all') {
      list = list.filter(item => item.collectionId === selectedCollection);
    }

    // 6. Sorting
    if (sortBy === 'relevance') {
      list.sort((a, b) => b.similarity - a.similarity);
    } else if (sortBy === 'tokens') {
      list.sort((a, b) => b.tokens - a.tokens);
    } else if (sortBy === 'recency') {
      // Mock recency sort
      list.sort((a, b) => a.id.localeCompare(b.id));
    }

    return list;
  }, [query, searchMode, similarityThreshold, selectedFormats, selectedClassification, selectedCollection, sortBy]);

  // Jump to AI Chat with context
  const handleChatWithResults = () => {
    if (filteredResults.length === 0) return;
    const topItem = filteredResults[0];
    onNavigateToChat?.({
      id: topItem.docId,
      title: topItem.docTitle,
      contextSnippet: `Query: "${query}" - Found ${filteredResults.length} relevant chunks across ${topItem.docTitle}.`
    });
    toast({
      title: "Context Injected into AI Chat",
      description: `Loaded ${filteredResults.length} chunks into conversational RAG memory.`,
      type: "success"
    });
  };

  const handleChatWithSingleResult = (result) => {
    onNavigateToChat?.({
      id: result.docId,
      title: result.docTitle,
      contextSnippet: result.snippet
    });
  };

  return (
    <div className={cn("space-y-6 animate-in fade-in duration-200", className)}>
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Global & Semantic Search
            </h1>
            <Badge variant="primary" className="font-mono text-[10px]">
              Hybrid RRF (k=60)
            </Badge>
          </div>
          <p className="text-xs text-secondary mt-1">
            Dual-index dense vector cosine similarity and BM25 sparse inverted-index retrieval with microsecond reranking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFacets(!showMobileFacets)}
            className="md:hidden"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filters
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleChatWithResults}
            disabled={filteredResults.length === 0}
            className="shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-200" />
            Ask AI About Results ({filteredResults.length})
          </Button>
        </div>
      </div>

      {/* Primary Search Input & Query Suggestions Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-default shadow-xs space-y-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-secondary absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 1,536-dimensional vector embeddings, PDFs, Notion pages, and code..."
            className="w-full pl-12 pr-28 py-3 bg-canvas border border-border-default rounded-xl text-sm text-primary placeholder:text-muted focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-sans"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-secondary hover:text-primary rounded-md text-xs font-mono"
              >
                Clear
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-secondary bg-surface-elevated rounded border border-border-default">
              ↵ Enter
            </kbd>
          </div>
        </div>

        {/* Trending & Quick Query Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-secondary flex items-center gap-1 text-[11px] font-medium shrink-0">
            <Zap className="w-3 h-3 text-amber-400" />
            Trending:
          </span>
          {searchSpecs.trendingQueries.slice(0, 4).map((tq, i) => (
            <button
              key={i}
              onClick={() => setQuery(tq)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border text-left",
                query === tq
                  ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                  : "bg-surface-elevated/70 hover:bg-surface-elevated text-secondary hover:text-primary border-border-subtle"
              )}
            >
              {tq}
            </button>
          ))}
        </div>
      </div>

      {/* Latency & Engine Metrics Banner */}
      <div className="p-3 rounded-xl bg-canvas border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-secondary font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            142ms latency
          </span>
          <span className="hidden sm:inline text-secondary">•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-sky-400" />
            Qdrant Vector Cluster (us-east-1)
          </span>
          <span className="hidden sm:inline text-secondary">•</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            Cohere Rerank v3 active
          </span>
        </div>

        <div className="text-[11px] text-muted">
          Showing {filteredResults.length} of {searchSpecs.corpus.length} chunks ({Math.round(similarityThreshold * 100)}%+ match)
        </div>
      </div>

      {/* Main 3-Column Search Workbench Layout */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left Column: Faceted Filters */}
        <div className={cn("w-full md:w-68 shrink-0", showMobileFacets ? "block" : "hidden md:block")}>
          <SearchFacets
            searchMode={searchMode}
            onChangeSearchMode={setSearchMode}
            similarityThreshold={similarityThreshold}
            onChangeSimilarity={setSimilarityThreshold}
            selectedFormats={selectedFormats}
            onToggleFormat={handleToggleFormat}
            selectedClassification={selectedClassification}
            onChangeClassification={setSelectedClassification}
            selectedCollection={selectedCollection}
            onChangeCollection={setSelectedCollection}
            dateRange={dateRange}
            onChangeDateRange={setDateRange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Center Column: Results Stream */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Results Header & Sort Controls */}
          <div className="flex items-center justify-between gap-2 pb-1 text-xs">
            <span className="font-medium text-primary">
              {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'} found
            </span>

            <div className="flex items-center gap-2">
              <span className="text-secondary text-[11px] font-mono">Sort by:</span>
              <div className="flex items-center bg-surface border border-border-default rounded-lg p-0.5">
                <button
                  onClick={() => setSortBy('relevance')}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                    sortBy === 'relevance' 
                      ? "bg-brand-500/20 text-brand-300 font-semibold" 
                      : "text-secondary hover:text-primary"
                  )}
                >
                  Cosine Score
                </button>
                <button
                  onClick={() => setSortBy('recency')}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                    sortBy === 'recency' 
                      ? "bg-brand-500/20 text-brand-300 font-semibold" 
                      : "text-secondary hover:text-primary"
                  )}
                >
                  Recency
                </button>
                <button
                  onClick={() => setSortBy('tokens')}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                    sortBy === 'tokens' 
                      ? "bg-brand-500/20 text-brand-300 font-semibold" 
                      : "text-secondary hover:text-primary"
                  )}
                >
                  Token Count
                </button>
              </div>
            </div>
          </div>

          {/* Results Cards List */}
          {filteredResults.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-2xl border border-border-default space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-primary">No chunks matched your filters</h3>
              <p className="text-xs text-secondary max-w-md mx-auto">
                No vector embeddings satisfy the current cosine similarity threshold ({Math.round(similarityThreshold * 100)}%) or selected facet filters.
              </p>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Reset Search Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResults.map((result) => (
                <SearchResultCard
                  key={result.id}
                  result={result}
                  searchQuery={query}
                  isSelected={selectedResult?.id === result.id}
                  onSelect={(res) => {
                    setSelectedResult(res);
                    setIsPreviewOpen(true);
                  }}
                  onChatWithResult={handleChatWithSingleResult}
                  onInspectResult={(res) => {
                    setSelectedResult(res);
                    setIsPreviewOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Slide-over / Inspector Panel */}
        {isPreviewOpen && selectedResult && (
          <div className="w-full lg:w-96 shrink-0">
            <ResultPreviewPanel
              result={selectedResult}
              onClose={() => setIsPreviewOpen(false)}
              onChatWithResult={handleChatWithSingleResult}
              onOpenInExplorer={(docId) => onNavigateToDocs?.(docId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
