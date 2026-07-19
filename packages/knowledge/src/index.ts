/**
 * @ziwei/knowledge —— 可溯源知识库(L3)+ RAG 检索与 Prompt 装配(L4 的确定性部分)。
 * LLM 网关(多模型流式适配)属应用服务端,见设计文档 §7.1。
 */
export {
  KnowledgeEntrySchema,
  validateEntries,
  TOPICS,
  SOURCE_LEVELS,
  REVIEW_STATUSES,
  type KnowledgeEntry,
  type Topic,
  type SourceLevel,
  type ReviewStatus,
} from './schema.js';
export {
  STARTER_ENTRIES,
  CURATED_ENTRIES,
  ALL_ENTRIES,
  RAW_ENTRIES,
  REVIEW_LEDGER,
  REVIEW_APPLY_RESULT,
} from './entries/index.js';
export { entry, srcs, type EntryInit } from './entries/builder.js';
export {
  applyReviewLedger,
  entryContentHash,
  type ReviewRecord,
  type ReviewLedger,
  type ApplyResult,
} from './review.js';
export { READING_SKILLS, buildSkillBlock, type ReadingSkill, type SkillId } from './skills.js';
export {
  compareCharts,
  branchRelation,
  buildSynastryPrompt,
  type SynastryFeatures,
  type SihuaFlight,
  type BranchRelation,
} from './synastry.js';
export { retrieve, type RetrievalOptions, type RetrievedEntry } from './retrieval.js';
export {
  buildSystemPrompt,
  buildGuidanceBlock,
  describeChart,
  DISCLAIMER,
  PROMPT_VERSION,
  type PromptOptions,
} from './prompt.js';
