/**
 * 知识条目 Schema(L3)—— 知识可溯源(Provenance-First)。
 *
 * 每条断语/格局解读必须携带:来源、来源等级、可信度、审核状态。
 * 综合紫微知道 knowledge-db/schema.ts 与王多鱼分层格局库的字段设计。
 * zod 校验在 CI 中对全库执行(知识库 lint,设计文档 §10.5)。
 */
import { z } from 'zod';

export const TOPICS = ['overview', 'career', 'wealth', 'marriage', 'health', 'family', 'fortune'] as const;
export type Topic = (typeof TOPICS)[number];

export const SOURCE_LEVELS = ['classic', 'annotated', 'modern', 'empirical'] as const;
export type SourceLevel = (typeof SOURCE_LEVELS)[number];

export const REVIEW_STATUSES = ['draft', 'reviewed', 'verified'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const KnowledgeEntrySchema = z.object({
  id: z.string().min(1),
  domain: z.enum(['star', 'palace', 'mutagen', 'pattern', 'combination', 'horoscope']),
  /** 关联实体 key 组合(与 ChartFeatures.signals[].entities 对齐做交集匹配) */
  entities: z.array(z.string().min(1)).min(1),
  topics: z.array(z.enum(TOPICS)).min(1),
  content: z.object({
    /** 一句话断语 */
    summary: z.string().min(1),
    /** 展开解释 */
    detail: z.string().min(1),
    /** 给 LLM 的导向:强调什么/如何拿捏/避免什么 */
    guidance: z
      .object({
        focus: z.array(z.string()).default([]),
        nuance: z.array(z.string()).default([]),
        avoid: z.array(z.string()).default([]),
      })
      .optional(),
  }),
  source: z.object({
    /** classic=古籍原文 annotated=古籍注解 modern=近人著述 empirical=经验总结 */
    level: z.enum(SOURCE_LEVELS),
    /** 出处,如《紫微斗数全书·骨髓赋》 */
    ref: z.string().min(1),
    /** 流派归属(三合/飞星/中州…),缺省为通用 */
    school: z.string().optional(),
  }),
  /** 0-1 */
  confidence: z.number().min(0).max(1),
  reviewStatus: z.enum(REVIEW_STATUSES),
});

export type KnowledgeEntry = z.infer<typeof KnowledgeEntrySchema>;

/** 全库校验:非法条目直接抛错(用于 CI 知识库 lint) */
export function validateEntries(entries: unknown[]): KnowledgeEntry[] {
  const seen = new Set<string>();
  return entries.map((raw, i) => {
    const entry = KnowledgeEntrySchema.parse(raw);
    if (seen.has(entry.id)) {
      throw new Error(`[@ziwei/knowledge] 条目 id 重复: "${entry.id}" (index ${i})`);
    }
    seen.add(entry.id);
    return entry;
  });
}
