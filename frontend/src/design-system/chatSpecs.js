// Specifications and Mock Datasets for Knowva AI Chat & RAG Experience

export const chatSpecs = {
  // Foundation Models Available
  models: [
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      contextWindow: '200k tokens',
      badge: 'Recommended for RAG',
      color: 'text-amber-400',
      description: 'Superior reasoning across dense enterprise documentation with zero hallucination guardrails.'
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o Omnimodel',
      provider: 'OpenAI',
      contextWindow: '128k tokens',
      badge: 'High Speed',
      color: 'text-emerald-400',
      description: 'Fast synthesis and table data extraction from spreadsheets and financial models.'
    },
    {
      id: 'deepseek-r1',
      name: 'DeepSeek-R1 (Reasoning)',
      provider: 'DeepSeek',
      contextWindow: '64k tokens',
      badge: 'Deep Reasoning',
      color: 'text-blue-400',
      description: 'Extended chain-of-thought verification for complex codebases and architectural RFCs.'
    },
    {
      id: 'gemini-1-5-pro',
      name: 'Gemini 1.5 Pro',
      provider: 'Google',
      contextWindow: '1M tokens',
      badge: '1M Long Context',
      color: 'text-purple-400',
      description: 'Massive context window capable of ingesting entire multi-repository workspaces in a single prompt.'
    }
  ],

  // Curated Enterprise Prompt Library Templates
  promptLibrary: [
    {
      id: 'p-soc2',
      category: 'Security & Compliance',
      title: 'Audit Multi-Tenant Vector Isolation',
      prompt: 'Analyze our indexed SOC2 Type II report and detail the exact encryption, tenant partitioning, and zero data retention guarantees implemented for our vector database embeddings.',
      tags: ['SOC2', 'Encryption', 'Qdrant']
    },
    {
      id: 'p-code',
      category: 'Engineering & Architecture',
      title: 'Explain Hybrid Reciprocal Rank Fusion',
      prompt: 'Based on our engineering architecture blueprints and TypeScript pipeline files, provide a code example demonstrating how BM25 keyword tokens are blended with 1536-dim dense vector embeddings.',
      tags: ['TypeScript', 'RRF', 'Cosine']
    },
    {
      id: 'p-fin',
      category: 'Finance & Cloud Costs',
      title: 'Q3 Cloud Infrastructure Cost Variance',
      prompt: 'Review our Q3 Financial spreadsheet actuals. What was the exact cost breakdown for vector database clusters vs foundation model inference, and what caused the August cost spike?',
      tags: ['Finance', 'AWS', 'Cost-Opt']
    },
    {
      id: 'p-legal',
      category: 'Legal & Contracts',
      title: 'Customer SLA Breach Penalty Clause',
      prompt: 'Review our GDPR Data Processing Agreement and Customer Master Services Agreement. What are the specific financial and operational penalties if API response times exceed 500ms?',
      tags: ['GDPR', 'SLA', 'Legal']
    },
    {
      id: 'p-exec',
      category: 'Executive Briefing',
      title: 'Summarize Q3 Operational Accomplishments',
      prompt: 'Generate an executive bulleted summary highlighting our top engineering deliverables, customer satisfaction scores, and security certifications achieved in Q3.',
      tags: ['Executive', 'Summary', 'OKRs']
    }
  ],

  // Conversation Threads with Rich Citations & Code
  threads: [
    {
      id: 'th-soc2',
      title: 'SOC2 Type II Vector Encryption & Isolation',
      group: 'today',
      timestamp: '15m ago',
      modelId: 'claude-3-5-sonnet',
      documentScope: 'All Knowledge Base (1,428 files)',
      messages: [
        {
          id: 'm-1',
          role: 'user',
          timestamp: '10:42 AM',
          content: 'What are the SOC2 compliance requirements and tenant isolation guarantees for our vector database embeddings?'
        },
        {
          id: 'm-2',
          role: 'assistant',
          timestamp: '10:42 AM',
          model: 'Claude 3.5 Sonnet',
          reasoning: 'Searched 48 vector chunks across Qdrant tenant partition. Matched 3 citations in SOC2_TypeII_Security_Audit_2026.pdf with 0.98 cosine similarity in 182ms.',
          content: `Based on Section 4.2 of our verified **SOC2 Type II Security Audit (2026)** [1], Knowva implements strict cryptographic and architectural tenant isolation for all vector embeddings:

### 1. Partition-Level Cryptographic Isolation
All customer embeddings generated via the 1,536-dimension OpenAI \`text-embedding-3-large\` model are isolated at the vector database index layer [2]. Each enterprise tenant is assigned a distinct, non-shared cryptographic namespace within the Qdrant cluster:
- **Encryption at Rest**: AES-256 with Customer-Managed Keys (CMK) managed via AWS KMS.
- **Data in Transit**: TLS 1.3 with mandatory mTLS between internal inference nodes and the vector database.

### 2. Zero Foundation Model Training Guarantee
Under our enterprise master agreement [3], **zero customer prompts, documents, or vector embeddings are retained** or utilized for public foundation model training. All vector queries are executed under zero-data-retention APIs.

\`\`\`typescript
// Verified Tenant Isolation Query Filter in Qdrant
const searchResults = await qdrantClient.search('enterprise_vectors', {
  vector: queryEmbedding, // 1536-dim vector
  filter: {
    must: [
      { key: 'tenant_id', match: { value: currentTenant.id } }, // Hard isolation barrier
      { key: 'classification', match: { value: 'confidential' } }
    ]
  },
  limit: 5,
  with_payload: true
});
\`\`\`

Would you like me to generate a compliance audit summary PDF export of these technical controls?`,
          citations: [
            {
              id: 1,
              badge: '[1]',
              docId: 'doc-1',
              title: 'SOC2_TypeII_Security_Audit_2026.pdf',
              page: 'Page 14, Section 4.2',
              similarity: 0.98,
              snippet: 'All customer embeddings generated via the 1,536-dimension OpenAI text-embedding-3-large model are stored with partition-level cryptographic separation. Each enterprise organization has a dedicated namespace.'
            },
            {
              id: 2,
              badge: '[2]',
              docId: 'doc-1',
              title: 'SOC2_TypeII_Security_Audit_2026.pdf',
              page: 'Page 16, Section 4.5',
              similarity: 0.96,
              snippet: 'Encryption At Rest: Encrypted using AES-256 with customer-managed keys (CMK) via AWS KMS. Cross-region vector replication is strictly constrained within specified geopolitical boundaries.'
            },
            {
              id: 3,
              badge: '[3]',
              docId: 'doc-6',
              title: 'GDPR_Data_Processing_Agreement.pdf',
              page: 'Page 6, Article 5',
              similarity: 0.94,
              snippet: 'Zero Customer Data Retention: Customer prompts and vector embeddings are never retained or utilized by foundation model providers for training. All tokens are flushed upon response termination.'
            }
          ]
        }
      ]
    },
    {
      id: 'th-fin',
      title: 'Q3 AWS Cluster Cost Spike Analysis',
      group: 'today',
      timestamp: '1h ago',
      modelId: 'gpt-4o',
      documentScope: 'Q3_Financial_Projections_Actuals.xlsx',
      messages: [
        {
          id: 'm-3',
          role: 'user',
          timestamp: '9:15 AM',
          content: 'What caused our 18% cloud infrastructure cost increase in August according to the Q3 financial actuals?'
        },
        {
          id: 'm-4',
          role: 'assistant',
          timestamp: '9:15 AM',
          model: 'GPT-4o',
          reasoning: 'Parsed 32 table rows in Q3_Financial_Projections_Actuals.xlsx. Identified AWS infrastructure variance in 148ms.',
          content: `According to our **Q3 Financial Actuals & Cost Model** [1], the 18% cloud infrastructure cost increase ($142,000 / month total) was driven by two specific operational factors:

1. **Cross-Region Vector Index Replication**: Expanding vector partition replication to EU-Frankfurt (\`eu-central-1\`) for GDPR compliance added **$18,400** in multi-AZ data egress and node hosting [2].
2. **Batch Embedding Ingestion Surge**: Ingesting 480 new customer whitepapers and customer meeting audio transcripts resulted in **$12,600** in OpenAI batch embedding API calls during the first week of August.

| Infrastructure Workload | July Spend | August Spend | Variance ($) | Variance (%) |
| :--- | :--- | :--- | :--- | :--- |
| **Qdrant Vector Cluster** | $32,000 | $42,000 | +$10,000 | +31.2% |
| **LLM Inference APIs** | $54,000 | $64,000 | +$10,000 | +18.5% |
| **Document OCR & Parsing** | $16,000 | $18,000 | +$2,000 | +12.5% |
| **Core AWS & Edge CDN** | $18,000 | $18,000 | $0 | 0.0% |

**Efficiency Recommendation**: Enabling our local 1,536-dim vector cache (currently running at a 98.6% hit rate) will reduce redundant embedding generation costs by an estimated **$8,200/month**.`,
          citations: [
            {
              id: 1,
              badge: '[1]',
              docId: 'doc-3',
              title: 'Q3_Financial_Projections_Actuals.xlsx',
              page: 'Sheet 2: Infrastructure Actuals',
              similarity: 0.97,
              snippet: 'Summary Cloud Spend: $142,000 / month ($0.009 per RAG query). Vector DB spend rose from $32k to $42k following Frankfurt cluster deployment.'
            },
            {
              id: 2,
              badge: '[2]',
              docId: 'doc-3',
              title: 'Q3_Financial_Projections_Actuals.xlsx',
              page: 'Sheet 3: Vendor Line Items',
              similarity: 0.95,
              snippet: 'AWS Direct Connect & Egress: Frankfurt cross-region vector sync added $18.4k in inter-region VPC peering transfers.'
            }
          ]
        }
      ]
    },
    {
      id: 'th-hybrid',
      title: 'Hybrid Keyword vs Dense Vector Reranking Formula',
      group: 'yesterday',
      timestamp: 'Yesterday',
      modelId: 'deepseek-r1',
      documentScope: 'vector-search-embeddings-pipeline.ts',
      messages: [
        {
          id: 'm-5',
          role: 'user',
          timestamp: 'Yesterday',
          content: 'How does our Reciprocal Rank Fusion (RRF) formula blend BM25 sparse keyword matches with 1536-dim dense cosine vectors?'
        },
        {
          id: 'm-6',
          role: 'assistant',
          timestamp: 'Yesterday',
          model: 'DeepSeek-R1',
          reasoning: 'Extracted AST symbol nodes in vector-search-embeddings-pipeline.ts and search architecture blueprint in 194ms.',
          content: `Our search pipeline utilizes **Reciprocal Rank Fusion (RRF)** with a constant of $k = 60$ to combine rank lists from BM25 sparse lexical search and Qdrant dense vector search [1].

### Reciprocal Rank Fusion Mathematical Formula
$$\\text{RRF Score}(d) = \\sum_{m \\in \\{BM25, \\text{Dense}\\}} \\frac{1}{k + r_m(d)}$$

Where:
- $k = 60$ (smoothing constant preventing high-ranking outliers from dominating)
- $r_{BM25}(d)$ is the 1-indexed position of document $d$ in keyword search
- $r_{Dense}(d)$ is the 1-indexed position of document $d$ in 1536-dim cosine similarity

\`\`\`typescript
/**
 * Computes Reciprocal Rank Fusion (RRF) for hybrid search
 */
export function reciprocalRankFusion(
  bm25Results: SearchResult[],
  denseResults: SearchResult[],
  k = 60
): ScoredDocument[] {
  const scores = new Map<string, number>();

  // Accumulate BM25 reciprocal ranks
  bm25Results.forEach((doc, rank) => {
    const current = scores.get(doc.id) || 0;
    scores.set(doc.id, current + 1 / (k + rank + 1));
  });

  // Accumulate Dense Vector reciprocal ranks
  denseResults.forEach((doc, rank) => {
    const current = scores.get(doc.id) || 0;
    scores.set(doc.id, current + 1 / (k + rank + 1));
  });

  return Array.from(scores.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}
\`\`\`

The top 50 candidates from this RRF output are subsequently passed to **Cohere Rerank v3** for final semantic scoring [2].`,
          citations: [
            {
              id: 1,
              badge: '[1]',
              docId: 'doc-2',
              title: 'Enterprise_Architecture_Blueprint_v3.notion',
              page: 'Section: Dual-Index Hybrid Search',
              similarity: 0.98,
              snippet: 'Dual-Index Hybrid Search blends Reciprocal Rank Fusion (RRF) between BM25 sparse keyword search and dense 1536-dim cosine similarity with smoothing parameter k=60.'
            },
            {
              id: 2,
              badge: '[2]',
              docId: 'doc-4',
              title: 'vector-search-embeddings-pipeline.ts',
              page: 'Lines 45-68',
              similarity: 0.95,
              snippet: 'Top-50 candidates are re-scored using Cohere Rerank v3 to produce the final top-5 context injection window for foundation models.'
            }
          ]
        }
      ]
    },
    {
      id: 'th-sla',
      title: 'Customer Onboarding API SLA Penalties',
      group: 'previous-7-days',
      timestamp: '3 days ago',
      modelId: 'claude-3-5-sonnet',
      documentScope: 'GDPR_Data_Processing_Agreement.pdf',
      messages: [
        {
          id: 'm-7',
          role: 'user',
          timestamp: '3 days ago',
          content: 'What are our contractual SLA penalty thresholds if API latency exceeds 500ms?'
        },
        {
          id: 'm-8',
          role: 'assistant',
          timestamp: '3 days ago',
          model: 'Claude 3.5 Sonnet',
          reasoning: 'Analyzed Master Services Agreement and GDPR SLA schedules. Found 2 contractual clauses in 165ms.',
          content: `According to **Schedule C of our Master Services Agreement** [1], API latency benchmarks are strictly enforced based on monthly 99th percentile (p99) performance:

1. **p99 Latency between 500ms - 1,000ms**: Triggers a **5% service credit** on the customer's Monthly Recurring Revenue (MRR).
2. **p99 Latency > 1,000ms for > 15 consecutive minutes**: Triggers a **15% service credit** and requires a formal RCA (Root Cause Analysis) delivered within 48 hours [2].
3. **Current Workspace Performance**: Our active cluster average is currently **182ms**, providing a comfortable 63.6% safety margin below the initial 500ms penalty tier.`,
          citations: [
            {
              id: 1,
              badge: '[1]',
              docId: 'doc-6',
              title: 'GDPR_Data_Processing_Agreement.pdf',
              page: 'Schedule C: Service Levels',
              similarity: 0.97,
              snippet: 'Response times exceeding 500ms at p99 over a monthly billing cycle entitle the Customer to a 5% credit applied against subsequent invoice periods.'
            },
            {
              id: 2,
              badge: '[2]',
              docId: 'doc-6',
              title: 'GDPR_Data_Processing_Agreement.pdf',
              page: 'Section 8: Incident Reporting',
              similarity: 0.94,
              snippet: 'In the event of critical degradation exceeding 1,000ms for more than 15 continuous minutes, vendor shall submit a root cause analysis within 48 business hours.'
            }
          ]
        }
      ]
    }
  ]
};
