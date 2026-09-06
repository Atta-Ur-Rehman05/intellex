import React, { useState, useEffect } from 'react';
import { 
  Activity, UploadCloud, Search, RefreshCw, 
  Share2, Shield, Play, Pause, Sparkles, 
  CheckCircle2, Clock, ArrowRight 
} from 'lucide-react';
import { dashboardSpecs } from '../../design-system/dashboardSpecs';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const ActivityFeed = () => {
  const [events, setEvents] = useState(dashboardSpecs.initialActivity);
  const [filter, setFilter] = useState('all'); // 'all' | 'upload' | 'query' | 'sync'
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const simulatedPool = [
    {
      actor: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      action: 'indexed new document',
      target: 'Q4_Cloud_Security_Roadmap.pdf',
      type: 'upload',
      details: '94 vector chunks generated via OpenAI embed-3'
    },
    {
      actor: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      action: 'queried RAG assistant',
      target: '"What are our vector DB replication SLAs?"',
      type: 'query',
      details: 'Matched 3 citations with 99.1% confidence score'
    },
    {
      actor: 'System Bot',
      avatar: null,
      action: 're-indexed stale vector partition',
      target: 'API_Gateway_Documentation.md',
      type: 'sync',
      details: 'Zero downtime incremental embeddings flush'
    }
  ];

  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        const randomEvent = simulatedPool[Math.floor(Math.random() * simulatedPool.length)];
        const newEvent = {
          ...randomEvent,
          id: `act-${Date.now()}`,
          time: 'Just now'
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 7)]);
        toast({
          title: "New Workspace Activity",
          description: `${newEvent.actor} ${newEvent.action} ${newEvent.target}`,
          type: "info"
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    return e.type === filter;
  });

  const getEventBadge = (type) => {
    switch (type) {
      case 'upload':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Upload</span>;
      case 'query':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">RAG Query</span>;
      case 'sync':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">Auto Sync</span>;
      case 'share':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Share</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-hover text-secondary border border-border-subtle font-medium">Audit</span>;
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-default shadow-xs p-5 sm:p-6 space-y-5">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-primary tracking-tight">Workspace Audit & Activity Stream</h3>
            {isSimulating && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Stream
              </span>
            )}
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Immutable chronological log of document ingestion, queries, and team security actions.
          </p>
        </div>

        {/* Live Simulation Control */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsSimulating(!isSimulating)}
          leftIcon={isSimulating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          className="text-xs self-start sm:self-auto"
        >
          {isSimulating ? "Stop Live Simulation" : "Simulate Live Events"}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'upload', 'query', 'sync'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors",
              filter === f
                ? "bg-brand-600 text-white font-semibold"
                : "bg-surface-hover text-secondary hover:text-primary"
            )}
          >
            {f === 'all' ? 'All Activity' : `${f}s`}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {filteredEvents.map((act) => (
          <div
            key={act.id}
            className="p-3 rounded-xl bg-canvas border border-border-subtle hover:border-border-default transition-all flex items-start gap-3"
          >
            {/* Actor Avatar / System Bot */}
            {act.avatar ? (
              <Avatar src={act.avatar} alt={act.actor} size="sm" className="mt-0.5 shrink-0" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5 border border-brand-500/30">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Event Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="font-semibold text-primary">{act.actor}</span>
                  <span className="text-secondary">{act.action}</span>
                  <span className="font-medium text-brand-400 font-mono text-[11px] truncate max-w-xs">{act.target}</span>
                </div>
                <span className="text-[11px] text-muted whitespace-nowrap">{act.time}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-secondary truncate">{act.details}</p>
                {getEventBadge(act.type)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
