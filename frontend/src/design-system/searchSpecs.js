// Search Corpus, Facets & Algorithms Specifications for Knowva Global & Semantic Search

export const searchSpecs = {
  // Search Modes
  modes: [
    {
      id: 'hybrid',
      name: 'Hybrid Search (RRF)',
      badge: 'Recommended',
      description: 'Blends BM25 sparse keyword tokens with 1536-dim dense cosine vectors using Reciprocal Rank Fusion (k=60).'
    },
    {
      id: 'dense',
      name: 'Dense Vector Only',
      badge: 'Semantic',
      description: 'Pure cosine similarity across OpenAI text-embedding-3-large embeddings for conceptual and thematic matching.'
    },
    {
      id: 'keyword',
      name: 'Exact Lexical (BM25)',
      badge: 'Exact Match',
      description: 'BM25 inverted index term matching for precise variable names, error codes, and exact contractual clauses.'
    }
  ],

  // Trending & Recent Searches
  trendingQueries: [
    'SOC2 vector tenant isolation',
    'Reciprocal Rank Fusion constant k=60',
    'Q3 AWS cluster cost variance',
    'Customer SLA breach penalties',
    'AES-256 encryption at rest keys',
    'Cohere Rerank v3 context window'
  ],

  recentSearches: [
    { query: 'vector database multi-tenant isolation', timestamp: '12m ago', count: 4 },
    { query: 'Q3 AWS egress bandwidth costs', timestamp: '1h ago', count: 2 },
    { query: 'customer SLA p99 latency credit', timestamp: '3h ago', count: 3 }
  ],

  // Search Corpus Items (Vector Chunks & Documents)
  corpus: [
    {
      id: 'chunk-soc2-1',
      docId: 'doc-1',
      docTitle: 'SOC2_TypeII_Security_Audit_2026.pdf',
      type: 'pdf',
      collection: 'Security & Compliance',
      collectionId: 'f-sec',
      classification: 'confidential',
      chunkIndex: 2,
      page: 'Page 14, Section 4.2',
      tokens: 512,
      similarity: 0.98,
      citationsCount: 48,
      updatedAt: '12 mins ago',
      author: 'Sarah Chen',
      heading: 'Section 4.2: Vector Database Multi-Tenant Cryptographic Isolation',
      snippet: 'All customer embeddings generated via the 1,536-dimension OpenAI text-embedding-3-large model are stored with partition-level cryptographic separation. Each enterprise organization has a dedicated namespace in the Qdrant vector index. Encryption at rest is enforced using AES-256 with Customer-Managed Keys (CMK) via AWS KMS.'
    },
    {
      id: 'chunk-soc2-2',
      docId: 'doc-1',
      docTitle: 'SOC2_TypeII_Security_Audit_2026.pdf',
      type: 'pdf',
      collection: 'Security & Compliance',
      collectionId: 'f-sec',
      classification: 'confidential',
      chunkIndex: 3,
      page: 'Page 16, Section 4.5',
      tokens: 468,
      similarity: 0.96,
      citationsCount: 48,
      updatedAt: '12 mins ago',
      author: 'Sarah Chen',
      heading: 'Section 4.5: Zero Foundation Model Training Guarantee',
      snippet: 'Customer prompts, uploaded documents, and generated vector embeddings are never retained or utilized by foundation model providers for public model training. All API calls execute under zero-data-retention terms with encrypted ephemeral caching.'
    },
    {
      id: 'chunk-arch-1',
      docId: 'doc-2',
      docTitle: 'Enterprise_Architecture_Blueprint_v3.notion',
      type: 'notion',
      collection: 'Engineering Specs',
      collectionId: 'f-eng',
      classification: 'internal',
      chunkIndex: 2,
      page: 'Section: Dual-Index Hybrid Search',
      tokens: 520,
      similarity: 0.97,
      citationsCount: 34,
      updatedAt: '45 mins ago',
      author: 'David Kim',
      heading: 'Dual-Index Hybrid Search & Reciprocal Rank Fusion (RRF)',
      snippet: 'Dual-Index Hybrid Search blends Reciprocal Rank Fusion (RRF) between BM25 sparse keyword search and dense 1536-dim cosine similarity with smoothing parameter k=60. Top-50 candidates are re-scored using Cohere Rerank v3 to produce the final top-5 context injection window for foundation models.'
    },
    {
      id: 'chunk-code-1',
      docId: 'doc-4',
      docTitle: 'vector-search-embeddings-pipeline.ts',
      type: 'code',
      collection: 'Engineering Specs',
      collectionId: 'f-eng',
      classification: 'internal',
      chunkIndex: 1,
      page: 'Lines 18-42',
      tokens: 380,
      similarity: 0.94,
      citationsCount: 18,
      updatedAt: '3 hours ago',
      author: 'Alex Rivera',
      heading: 'ingestDocumentChunks() Interface & Vector Normalization',
      snippet: 'export interface ChunkMetadata { docId: string; tenantId: string; chunkIndex: number; tokensCount: number; classification: confidential | internal | public; } Embeddings are generated with normalized L2 unit vectors to enable microsecond cosine similarity calculations.'
    },
    {
      id: 'chunk-fin-1',
      docId: 'doc-3',
      docTitle: 'Q3_Financial_Projections_Actuals.xlsx',
      type: 'sheet',
      collection: 'Financial Audits',
      collectionId: 'f-fin',
      classification: 'confidential',
      chunkIndex: 1,
      page: 'Sheet 2: Infrastructure Actuals',
      tokens: 490,
      similarity: 0.95,
      citationsCount: 29,
      updatedAt: '2 hours ago',
      author: 'Elena Rostova',
      heading: 'Cloud Spend Summary & August Variance',
      snippet: 'Summary Cloud Spend: $142,000 / month ($0.009 per RAG query). Vector DB spend rose from $32k to $42k following Frankfurt cluster deployment. Cross-region replication in us-east-1 and embedding batch syncs accounted for the 18% variance in August.'
    },
    {
      id: 'chunk-legal-1',
      docId: 'doc-6',
      docTitle: 'GDPR_Data_Processing_Agreement.pdf',
      type: 'pdf',
      collection: 'Security & Compliance',
      collectionId: 'f-sec',
      classification: 'confidential',
      chunkIndex: 1,
      page: 'Article 5: Obligations',
      tokens: 512,
      similarity: 0.93,
      citationsCount: 22,
      updatedAt: 'Yesterday',
      author: 'David Kim',
      heading: 'Article 5: Obligations & Vector Residency',
      snippet: 'Vector embeddings derived from Customer Personal Data shall be stored exclusively within designated European Economic Area (EEA) data centers. Upon termination of service, complete vector index tombstoning shall be executed within 72 hours.'
    },
    {
      id: 'chunk-cust-1',
      docId: 'doc-5',
      docTitle: 'Customer_Success_QBR_Transcripts.mp4',
      type: 'media',
      collection: 'Customer Intelligence',
      collectionId: 'f-cust',
      classification: 'internal',
      chunkIndex: 1,
      page: '08:42 - 14:15 Timestamp',
      tokens: 480,
      similarity: 0.91,
      citationsCount: 12,
      updatedAt: '5 hours ago',
      author: 'Sarah Chen',
      heading: 'VP Engineering Testimonial on Latency Targets',
      snippet: 'Our developers were spending 2.4 hours every day searching across Confluence, Google Drive, and Slack for architectural decisions. Since deploying Knowvas RAG search with the 180ms latency target, resolution times dropped by 64%.'
    }
  ],

  // Quick Command Actions
  quickActions: [
    { id: 'act-new-chat', label: 'New AI Thread', shortcut: '⌘N', category: 'Action', path: 'chat' },
    { id: 'act-upload', label: 'Upload Documents Wizard', shortcut: '⌘U', category: 'Action', path: 'docs' },
    { id: 'act-dashboard', label: 'Go to Workspace Dashboard', shortcut: '⌘D', category: 'Navigation', path: 'dashboard' },
    { id: 'act-explorer', label: 'Open Document Explorer', shortcut: '⌘E', category: 'Navigation', path: 'docs' },
    { id: 'act-invite', label: 'Invite Team Member', shortcut: '⌘I', category: 'Action', path: 'settings' }
  ]
};
