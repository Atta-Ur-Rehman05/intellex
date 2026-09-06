// Specifications and Mock Datasets for Knowva Workspace Dashboard & Analytics

export const dashboardSpecs = {
  // 1. Executive Workspace KPI Metrics
  metrics: {
    timeframes: [
      { id: '24h', label: 'Last 24h' },
      { id: '7d', label: 'Last 7 Days' },
      { id: '30d', label: 'Last 30 Days' },
      { id: 'all', label: 'All Time' }
    ],
    items: [
      {
        id: 'docs',
        title: 'Indexed Documents',
        value: '1,428',
        unit: 'files',
        change: '+12.4%',
        trend: 'up',
        subtitle: 'vs 1,270 last month',
        badge: '99.8% Parsed',
        sparkline: [28, 34, 42, 39, 45, 50, 58]
      },
      {
        id: 'vectors',
        title: 'Neural Embeddings',
        value: '842,500',
        unit: 'vectors',
        change: '+18.2k',
        trend: 'up',
        subtitle: '1,536-dim OpenAI text-embed-3',
        badge: '0.94 avg cosine sim',
        sparkline: [620, 680, 710, 750, 780, 810, 842]
      },
      {
        id: 'queries',
        title: 'AI RAG Queries',
        value: '14,892',
        unit: 'queries',
        change: '+24.6%',
        trend: 'up',
        subtitle: '182ms avg latency target',
        badge: '99.4% Accuracy',
        sparkline: [1200, 1450, 1380, 1690, 1920, 2100, 2350]
      },
      {
        id: 'storage',
        title: 'Storage Allocation',
        value: '64.8',
        unit: 'GB / 250 GB',
        change: '25.9%',
        trend: 'neutral',
        subtitle: 'Enterprise Quota Tier',
        badge: '185.2 GB Free',
        sparkline: [52, 55, 57, 60, 62, 63, 64.8]
      }
    ]
  },

  // 2. Storage Breakdown by Category
  storage: {
    totalUsedGb: 64.8,
    totalQuotaGb: 250,
    percentUsed: 25.9,
    categories: [
      {
        id: 'pdf',
        name: 'PDFs & Whitepapers',
        sizeGb: 32.4,
        percentage: 50.0,
        fileCount: 412,
        color: 'bg-indigo-500',
        textColor: 'text-indigo-400',
        borderColor: 'border-indigo-500/30',
        lightBg: 'bg-indigo-500/10'
      },
      {
        id: 'notion',
        name: 'Notion & Markdown Docs',
        sizeGb: 14.2,
        percentage: 21.9,
        fileCount: 620,
        color: 'bg-emerald-500',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        lightBg: 'bg-emerald-500/10'
      },
      {
        id: 'code',
        name: 'Source Code & Schemas',
        sizeGb: 10.8,
        percentage: 16.7,
        fileCount: 284,
        color: 'bg-amber-500',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        lightBg: 'bg-amber-500/10'
      },
      {
        id: 'media',
        name: 'Audio & Meeting Transcripts',
        sizeGb: 4.8,
        percentage: 7.4,
        fileCount: 64,
        color: 'bg-purple-500',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        lightBg: 'bg-purple-500/10'
      },
      {
        id: 'sheets',
        name: 'Spreadsheets & Data Tables',
        sizeGb: 2.6,
        percentage: 4.0,
        fileCount: 48,
        color: 'bg-sky-500',
        textColor: 'text-sky-400',
        borderColor: 'border-sky-500/30',
        lightBg: 'bg-sky-500/10'
      }
    ]
  },

  // 3. Recent Knowledge Documents
  recentFiles: [
    {
      id: 'file-1',
      name: 'SOC2_TypeII_Security_Audit_2026.pdf',
      type: 'pdf',
      size: '4.8 MB',
      chunks: 142,
      citations: 48,
      status: 'vectorized', // 'vectorized' | 'indexing' | 'synced'
      uploadedBy: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      updatedAt: '12 mins ago',
      category: 'Security & Compliance'
    },
    {
      id: 'file-2',
      name: 'Enterprise_Architecture_Blueprint_v3.notion',
      type: 'notion',
      size: '1.2 MB',
      chunks: 68,
      citations: 34,
      status: 'synced',
      uploadedBy: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      updatedAt: '45 mins ago',
      category: 'Engineering Specs'
    },
    {
      id: 'file-3',
      name: 'Q3_Financial_Projections_Actuals.xlsx',
      type: 'sheet',
      size: '8.4 MB',
      chunks: 215,
      citations: 29,
      status: 'vectorized',
      uploadedBy: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      updatedAt: '2 hours ago',
      category: 'Finance & Strategy'
    },
    {
      id: 'file-4',
      name: 'vector-search-embeddings-pipeline.ts',
      type: 'code',
      size: '340 KB',
      chunks: 28,
      citations: 18,
      status: 'indexing',
      uploadedBy: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      updatedAt: '3 hours ago',
      category: 'Source Repos'
    },
    {
      id: 'file-5',
      name: 'Customer_Success_QBR_Transcripts.mp4',
      type: 'media',
      size: '18.6 MB',
      chunks: 320,
      citations: 12,
      status: 'vectorized',
      uploadedBy: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      updatedAt: '5 hours ago',
      category: 'Customer Intelligence'
    },
    {
      id: 'file-6',
      name: 'GDPR_Data_Processing_Agreement.pdf',
      type: 'pdf',
      size: '2.4 MB',
      chunks: 84,
      citations: 22,
      status: 'vectorized',
      uploadedBy: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      updatedAt: 'Yesterday',
      category: 'Legal & Privacy'
    }
  ],

  // 4. Recent AI RAG Conversations
  recentChats: [
    {
      id: 'chat-1',
      title: 'SOC2 Type II Vector Encryption Requirements',
      snippet: 'Vector embeddings are isolated per enterprise tenant with 256-bit encryption at rest. Customer data is never trained on by foundation models.',
      sourcesCount: 3,
      sources: ['SOC2_TypeII_Security_Audit_2026.pdf', 'Architecture_Blueprint_v3.notion'],
      model: 'Claude 3.5 Sonnet RAG',
      messagesCount: 8,
      timestamp: '15m ago',
      confidence: 0.98
    },
    {
      id: 'chat-2',
      title: 'Q3 AWS Cluster Cost Spike Analysis',
      snippet: 'The 18% cost increase in August was driven by cross-region vector replication in us-east-1 and embedding batch syncs.',
      sourcesCount: 4,
      sources: ['Q3_Financial_Projections_Actuals.xlsx', 'Infrastructure_Billing.csv'],
      model: 'GPT-4o RAG',
      messagesCount: 14,
      timestamp: '1h ago',
      confidence: 0.95
    },
    {
      id: 'chat-3',
      title: 'Customer Onboarding API SLA Penalties',
      snippet: 'According to Master Services Agreement Schedule C, response times > 500ms trigger a 5% credit on monthly recurring revenue.',
      sourcesCount: 2,
      sources: ['GDPR_Data_Processing_Agreement.pdf', 'SLA_Terms_2026.pdf'],
      model: 'DeepSeek-R1 RAG',
      messagesCount: 6,
      timestamp: '3h ago',
      confidence: 0.99
    },
    {
      id: 'chat-4',
      title: 'Hybrid Keyword vs Dense Vector Reranking Formula',
      snippet: 'Reciprocal Rank Fusion (RRF) with constant k=60 balances BM25 sparse keyword tokens with 1536-dim cosine similarity.',
      sourcesCount: 3,
      sources: ['vector-search-embeddings-pipeline.ts', 'Search_Architecture.md'],
      model: 'Claude 3.5 Sonnet RAG',
      messagesCount: 11,
      timestamp: 'Yesterday',
      confidence: 0.97
    }
  ],

  // 5. Live Chronological Workspace Activity Feed
  initialActivity: [
    {
      id: 'act-1',
      actor: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      action: 'uploaded and indexed',
      target: 'SOC2_TypeII_Security_Audit_2026.pdf',
      type: 'upload',
      time: '12m ago',
      details: '142 chunks vectorized • 0.94 similarity score'
    },
    {
      id: 'act-2',
      actor: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      action: 'ran neural search query',
      target: '"customer SLA breach penalties"',
      type: 'query',
      time: '28m ago',
      details: '4 citations matched across 2 legal agreements in 178ms'
    },
    {
      id: 'act-3',
      actor: 'System Bot',
      avatar: null,
      action: 'auto-synchronized workspace',
      target: 'Engineering Specs (Notion)',
      type: 'sync',
      time: '45m ago',
      details: '18 pages updated • 68 new vector embeddings created'
    },
    {
      id: 'act-4',
      actor: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      action: 'shared AI RAG thread with',
      target: '#leadership channel',
      type: 'share',
      time: '1h ago',
      details: 'Thread: "Q3 AWS Cluster Cost Spike Analysis"'
    },
    {
      id: 'act-5',
      actor: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      action: 'granted Editor permission to',
      target: 'marcus.vance@acme.ai',
      type: 'security',
      time: '2h ago',
      details: 'Role: Editor (Vector read/write, document ingestion)'
    }
  ],

  // 6. 7-Day Telemetry Trends (Queries & Latency)
  telemetry: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    queries: [1840, 2120, 2480, 2390, 2810, 1420, 1832],
    latencyMs: [194, 182, 178, 185, 172, 168, 175],
    cacheHitRate: '98.6%',
    zeroRetentionVerified: true,
    topCitedDocuments: [
      { name: 'SOC2_TypeII_Security_Audit_2026.pdf', citations: 48, domain: 'Security' },
      { name: 'Architecture_Blueprint_v3.notion', citations: 34, domain: 'Engineering' },
      { name: 'Q3_Financial_Projections_Actuals.xlsx', citations: 29, domain: 'Finance' },
      { name: 'GDPR_Data_Processing_Agreement.pdf', citations: 22, domain: 'Legal' },
      { name: 'Customer_Success_QBR_Transcripts.mp4', citations: 12, domain: 'Operations' }
    ]
  }
};
