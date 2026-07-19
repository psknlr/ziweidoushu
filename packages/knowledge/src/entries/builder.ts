/**
 * 知识条目构建器:为批量内容编写提供紧凑写法与默认值。
 * 默认 reviewStatus='draft'(批量初稿必须经人工审核才可升级 reviewed/verified)。
 */
import type { KnowledgeEntry, ReviewStatus, SourceLevel, Topic } from '../schema.js';

export interface EntryInit {
  id: string;
  domain: KnowledgeEntry['domain'];
  entities: string[];
  topics: Topic[];
  summary: string;
  detail: string;
  source?: { level?: SourceLevel; ref?: string; school?: string };
  confidence?: number;
  reviewStatus?: ReviewStatus;
  guidance?: { focus?: string[]; nuance?: string[]; avoid?: string[] };
}

const DEFAULT_REF = '综合《紫微斗数全书》诸星问答与近人通行释义';

export function entry(init: EntryInit): KnowledgeEntry {
  const out: KnowledgeEntry = {
    id: init.id,
    domain: init.domain,
    entities: init.entities,
    topics: init.topics,
    content: {
      summary: init.summary,
      detail: init.detail,
    },
    source: {
      level: init.source?.level ?? 'modern',
      ref: init.source?.ref ?? DEFAULT_REF,
      ...(init.source?.school ? { school: init.source.school } : {}),
    },
    confidence: init.confidence ?? 0.6,
    reviewStatus: init.reviewStatus ?? 'draft',
  };
  if (init.guidance) {
    out.content.guidance = {
      focus: init.guidance.focus ?? [],
      nuance: init.guidance.nuance ?? [],
      avoid: init.guidance.avoid ?? [],
    };
  }
  return out;
}

/** 常用出处速记 */
export const srcs = {
  quanshu: (quote?: string) =>
    ({ level: 'classic', ref: quote ? `《紫微斗数全书》:「${quote}」` : '《紫微斗数全书》' }) as const,
  wenda: { level: 'annotated', ref: '《紫微斗数全书》卷二·诸星问答论' } as const,
  gusui: (quote: string) => ({ level: 'classic', ref: `《骨髓赋》:「${quote}」` }) as const,
  modern: (ref: string = DEFAULT_REF) => ({ level: 'modern', ref }) as const,
  empirical: (ref: string) => ({ level: 'empirical', ref }) as const,
};
