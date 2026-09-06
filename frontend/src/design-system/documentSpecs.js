// Document Repository, Chunking Presets, Folders & Tags Specifications for Knowva

export const documentSpecs = {
  // Folder Collections
  collections: [
    {
      id: 'f-all',
      name: 'All Knowledge Files',
      count: 1428,
      color: 'text-brand-400',
      icon: 'Folder'
    },
    {
      id: 'f-eng',
      name: 'Engineering Specs',
      count: 14,
      color: 'text-indigo-400',
      icon: 'Code2',
      description: 'API schemas, architecture blueprints, and vector search pipelines'
    },
    {
      id: 'f-sec',
      name: 'Security & Compliance',
      count: 12,
      color: 'text-emerald-400',
      icon: 'Shield',
      description: 'SOC2 Type II audits, ISO 27001 certifications, and GDPR policies'
    },
    {
      id: 'f-prod',
      name: 'Product Roadmaps',
      count: 8,
      color: 'text-purple-400',
      icon: 'Layers',
      description: 'Feature specs, user journey maps, and quarterly OKRs'
    },
    {
      id: 'f-fin',
      name: 'Financial Audits',
      count: 6,
      color: 'text-sky-400',
      icon: 'FileSpreadsheet',
      description: 'Revenue forecasts, AWS cluster cost reports, and Q3 actuals'
    },
    {
      id: 'f-cust',
      name: 'Customer Intelligence',
      count: 18,
      color: 'text-amber-400',
      icon: 'MessageSquare',
      description: 'Meeting transcripts, customer interviews, and QBR decks'
    }
  ],

  // Predefined Tags & Classifications
  tags: [
    { id: 'tag-soc2', label: 'SOC2-Type-II', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'tag-arch', label: 'Architecture', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'tag-rag', label: 'RAG-Pipeline', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'tag-fin', label: 'Finance-Q3', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    { id: 'tag-gdpr', label: 'GDPR-Privacy', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { id: 'tag-api', label: 'API-Schema', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  ],

  classifications: [
    { id: 'confidential', label: 'Confidential (Tenant Only)', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    { id: 'internal', label: 'Internal Shared', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'public', label: 'Public Knowledge', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
  ],

  // Chunking Strategy Profiles
  chunkingProfiles: [
    {
      id: 'balanced',
      name: 'Balanced (Standard RAG)',
      chunkSize: 512,
      overlap: 64,
      model: 'text-embedding-3-large (1536-dim)',
      description: 'Optimal for whitepapers, documentation, and general Q&A with conversational context.'
    },
    {
      id: 'dense-code',
      name: 'Dense Code & AST Schemas',
      chunkSize: 256,
      overlap: 32,
      model: 'text-embedding-3-large (1536-dim)',
      description: 'Preserves function signatures, TypeScript interfaces, and SQL schema blocks without truncation.'
    },
    {
      id: 'long-context',
      name: 'Long-Form Executive Reports',
      chunkSize: 1024,
      overlap: 128,
      model: 'text-embedding-3-large (1536-dim)',
      description: 'Broad contextual windows capturing full multi-paragraph financial analyses and legal sections.'
    }
  ],

  // Mock Documents Repository with AST Chunks
  documents: [
    {
      id: 'doc-1',
      title: 'SOC2_TypeII_Security_Audit_2026.pdf',
      collectionId: 'f-sec',
      type: 'pdf',
      size: '4.8 MB',
      chunksCount: 142,
      tokensTotal: 72840,
      citationsCount: 48,
      status: 'vectorized', // 'vectorized' | 'indexing' | 'synced'
      classification: 'confidential',
      tags: ['tag-soc2', 'tag-arch'],
      uploadedBy: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      updatedAt: '12 mins ago',
      contentPreview: `# SOC2 Type II Audit & Vector Isolation Report (2026)

## Executive Summary
This independent audit report verifies that Knowva adheres to the American Institute of Certified Public Accountants (AICPA) Trust Services Criteria for Security, Confidentiality, and Processing Integrity.

## Section 4.2: Vector Database Multi-Tenant Isolation
All customer embeddings generated via the 1,536-dimension OpenAI text-embedding-3-large model are stored with partition-level cryptographic separation. Each enterprise organization has a dedicated namespace in the Qdrant vector index. 

1. **Encryption At Rest**: Encrypted using AES-256 with customer-managed keys (CMK) via AWS KMS.
2. **Zero Model Training**: Customer prompts and vector embeddings are never retained or utilized by foundation model providers for model training.
3. **Data Residency**: Cross-region replication is constrained strictly within specified geopolitical regions (e.g. EU-Frankfurt, US-East).`,
      chunks: [
        {
          id: 'c-1',
          index: 1,
          tokens: 498,
          similarity: 0.96,
          heading: 'Executive Summary & Trust Criteria',
          text: 'This independent audit report verifies that Knowva adheres to the American Institute of Certified Public Accountants (AICPA) Trust Services Criteria for Security, Confidentiality, and Processing Integrity.'
        },
        {
          id: 'c-2',
          index: 2,
          tokens: 512,
          similarity: 0.98,
          heading: 'Section 4.2: Vector Database Multi-Tenant Isolation',
          text: 'All customer embeddings generated via the 1,536-dimension OpenAI text-embedding-3-large model are stored with partition-level cryptographic separation. Each enterprise organization has a dedicated namespace in the Qdrant vector index.'
        },
        {
          id: 'c-3',
          index: 3,
          tokens: 468,
          similarity: 0.94,
          heading: 'Encryption At Rest & Zero Retention Policy',
          text: 'Encryption At Rest: Encrypted using AES-256 with customer-managed keys. Customer prompts and vector embeddings are never retained or utilized by foundation model providers for training.'
        }
      ]
    },
    {
      id: 'doc-2',
      title: 'Enterprise_Architecture_Blueprint_v3.notion',
      collectionId: 'f-eng',
      type: 'notion',
      size: '1.2 MB',
      chunksCount: 68,
      tokensTotal: 34820,
      citationsCount: 34,
      status: 'synced',
      classification: 'internal',
      tags: ['tag-arch', 'tag-rag'],
      uploadedBy: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      updatedAt: '45 mins ago',
      contentPreview: `# Knowva Enterprise Architecture Blueprint v3.2

## System Overview
Knowva unifies unstructured knowledge across Google Drive, Notion, GitHub, and local documents through an asynchronous event-driven ingestion pipeline.

## Ingestion Pipeline Stages
1. **Document Ingestion Layer**: Watches webhooks and polling connectors. Normalizes rich text, PDF OCR, and code syntax trees into CommonMark markdown.
2. **Semantic Chunking Engine**: Uses recursive character chunking with custom tokenizers to maintain paragraph semantic cohesion.
3. **Dual-Index Hybrid Search**: Blends Reciprocal Rank Fusion (RRF) between BM25 sparse keyword search and dense 1536-dim cosine similarity.
4. **Cohere Rerank Layer**: Top-50 candidates are re-scored using Cohere Rerank v3 to produce the final top-5 context injection window for foundation models.`,
      chunks: [
        {
          id: 'c-201',
          index: 1,
          tokens: 504,
          similarity: 0.95,
          heading: 'System Overview & Connectors',
          text: 'Knowva unifies unstructured knowledge across Google Drive, Notion, GitHub, and local documents through an asynchronous event-driven ingestion pipeline.'
        },
        {
          id: 'c-202',
          index: 2,
          tokens: 520,
          similarity: 0.97,
          heading: 'Hybrid Search & Cohere Rerank Layer',
          text: 'Dual-Index Hybrid Search blends Reciprocal Rank Fusion (RRF) between BM25 sparse keyword search and dense 1536-dim cosine similarity. Top-50 candidates are re-scored using Cohere Rerank v3.'
        }
      ]
    },
    {
      id: 'doc-3',
      title: 'Q3_Financial_Projections_Actuals.xlsx',
      collectionId: 'f-fin',
      type: 'sheet',
      size: '8.4 MB',
      chunksCount: 215,
      tokensTotal: 108420,
      citationsCount: 29,
      status: 'vectorized',
      classification: 'confidential',
      tags: ['tag-fin'],
      uploadedBy: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      updatedAt: '2 hours ago',
      contentPreview: `# Q3 Financial Performance vs Model Projections

## Summary Financial Metrics
- **Annual Recurring Revenue (ARR)**: $14.2M (+34% YoY)
- **Net Revenue Retention (NRR)**: 128%
- **Gross Margin**: 81.4%
- **Cloud Infrastructure Spend**: $142,000 / month ($0.009 per RAG query)

## Cost Breakdown by Workload
- Vector DB (Qdrant Cloud Cluster): $42,000 / month
- Foundation Model Inference (OpenAI & Anthropic APIs): $64,000 / month
- Document OCR & Parsing (LlamaParse / Unstructured): $18,000 / month
- Core AWS App Services & Edge CDN: $18,000 / month`,
      chunks: [
        {
          id: 'c-301',
          index: 1,
          tokens: 490,
          similarity: 0.93,
          heading: 'Summary Financial Metrics (Q3 ARR & Margins)',
          text: 'Annual Recurring Revenue: $14.2M (+34% YoY). Net Revenue Retention: 128%. Cloud Infrastructure Spend: $142,000 / month ($0.009 per RAG query).'
        },
        {
          id: 'c-302',
          index: 2,
          tokens: 512,
          similarity: 0.96,
          heading: 'Infrastructure Cost Breakdown by Workload',
          text: 'Vector DB (Qdrant Cloud): $42,000 / mo. Foundation Model Inference: $64,000 / mo. Document OCR: $18,000 / mo. Core AWS App Services: $18,000 / mo.'
        }
      ]
    },
    {
      id: 'doc-4',
      title: 'vector-search-embeddings-pipeline.ts',
      collectionId: 'f-eng',
      type: 'code',
      size: '340 KB',
      chunksCount: 28,
      tokensTotal: 14200,
      citationsCount: 18,
      status: 'indexing',
      classification: 'internal',
      tags: ['tag-arch', 'tag-api'],
      uploadedBy: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      updatedAt: '3 hours ago',
      contentPreview: `/**
 * Knowva Vector Search & Embedding Ingestion Pipeline
 * Integrates OpenAI text-embedding-3-large with Qdrant Vector Engine
 */
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantClient } from '@qdrant/js-client-rest';

export interface ChunkMetadata {
  docId: string;
  tenantId: string;
  chunkIndex: number;
  tokensCount: number;
  classification: 'confidential' | 'internal' | 'public';
}

export async function ingestDocumentChunks(
  chunks: string[],
  metadata: ChunkMetadata
): Promise<{ vectorIds: string[]; durationMs: number }> {
  const startTime = Date.now();
  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
    dimensions: 1536,
  });

  const vectors = await embeddings.embedDocuments(chunks);
  // Batch upsert to tenant isolated Qdrant partition...
  return { vectorIds: ['vec_1', 'vec_2'], durationMs: Date.now() - startTime };
}`,
      chunks: [
        {
          id: 'c-401',
          index: 1,
          tokens: 380,
          similarity: 0.94,
          heading: 'ingestDocumentChunks() Interface & Types',
          text: 'export interface ChunkMetadata { docId: string; tenantId: string; chunkIndex: number; tokensCount: number; classification: confidential | internal | public; }'
        }
      ]
    },
    {
      id: 'doc-5',
      title: 'Customer_Success_QBR_Transcripts.mp4',
      collectionId: 'f-cust',
      type: 'media',
      size: '18.6 MB',
      chunksCount: 320,
      tokensTotal: 160000,
      citationsCount: 12,
      status: 'vectorized',
      classification: 'internal',
      tags: ['tag-rag'],
      uploadedBy: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      updatedAt: '5 hours ago',
      contentPreview: `# Customer Success QBR Audio Transcript: Global Fintech Corp

## Speaker 1 (VP Engineering, Fintech Corp):
"Our developers were spending 2.4 hours every day searching across Confluence, Google Drive, and Slack for architectural decisions. Since deploying Knowva's RAG search with the 180ms latency target, resolution times dropped by 64%."

## Speaker 2 (Chief Information Security Officer):
"The key gating factor for us was SOC2 tenant partition isolation. Knowing our proprietary code and risk models are never trained on by public LLMs gave our compliance committee immediate comfort to sign the multi-year contract."`,
      chunks: [
        {
          id: 'c-501',
          index: 1,
          tokens: 480,
          similarity: 0.92,
          heading: 'VP Engineering Testimonial: Search Latency & Productivity',
          text: 'Our developers were spending 2.4 hours every day searching across Confluence, Google Drive, and Slack. Since deploying Knowva RAG search, resolution times dropped by 64%.'
        },
        {
          id: 'c-502',
          index: 2,
          tokens: 504,
          similarity: 0.97,
          heading: 'CISO Compliance Review: Tenant Isolation & Non-training',
          text: 'The key gating factor was SOC2 tenant partition isolation. Knowing our proprietary code and risk models are never trained on by public LLMs gave our compliance committee comfort.'
        }
      ]
    },
    {
      id: 'doc-6',
      title: 'GDPR_Data_Processing_Agreement.pdf',
      collectionId: 'f-sec',
      type: 'pdf',
      size: '2.4 MB',
      chunksCount: 84,
      tokensTotal: 42000,
      citationsCount: 22,
      status: 'vectorized',
      classification: 'confidential',
      tags: ['tag-gdpr', 'tag-soc2'],
      uploadedBy: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      updatedAt: 'Yesterday',
      contentPreview: `# Data Processing Agreement (DPA) under EU GDPR Regulation 2016/679

## Article 5: Obligations of the Data Processor
1. The Data Processor shall process Personal Data exclusively on documented instructions from the Data Controller.
2. Vector embeddings derived from Customer PII shall be stored within designated European Economic Area (EEA) data centers.
3. Upon written request or termination of service, the Data Processor shall execute complete vector index tombstoning within 72 hours.`,
      chunks: [
        {
          id: 'c-601',
          index: 1,
          tokens: 512,
          similarity: 0.97,
          heading: 'Article 5: Obligations & Documented Instructions',
          text: 'The Data Processor shall process Personal Data exclusively on documented instructions from the Data Controller. Vector embeddings derived from Customer PII shall be stored within designated EEA data centers.'
        }
      ]
    }
  ]
};
