/**
 * 解读结果缓存(L4)。
 *
 * 键 = stableHash({chart 全量内容, topics, question, provider, model, promptVersion})
 * —— 用星盘**内容**而非客户端上报的 meta.chartHash 计算,杜绝跨用户缓存投毒;
 * chart 内容 → chartHash 是确定性的,同一张盘天然命中。
 * Prompt 或知识库版本变更须升 PROMPT_VERSION,旧缓存自动失效。
 *
 * 实现:LRU + TTL,进程内 Map(命中即续位)。多实例部署时可换 Redis,
 * 接口保持 get/set/stats 即可平滑替换。
 */
import { stableHash } from '@ziwei/core';
import type { Topic } from '@ziwei/knowledge';

export interface CacheKeyParts {
  chart: unknown;
  topics?: Topic[];
  question?: string;
  provider: string;
  model: string;
  promptVersion: string;
}

export interface CacheStats {
  entries: number;
  hits: number;
  misses: number;
}

export class InterpretCache {
  private readonly store = new Map<string, { text: string; expiresAt: number }>();
  private hits = 0;
  private misses = 0;

  constructor(
    private readonly maxEntries = 500,
    private readonly ttlMs = 24 * 60 * 60 * 1000,
  ) {}

  static key(parts: CacheKeyParts): string {
    return stableHash(parts);
  }

  get(key: string): string | undefined {
    const hit = this.store.get(key);
    if (!hit) {
      this.misses += 1;
      return undefined;
    }
    if (hit.expiresAt < Date.now()) {
      this.store.delete(key);
      this.misses += 1;
      return undefined;
    }
    // LRU:命中续位
    this.store.delete(key);
    this.store.set(key, hit);
    this.hits += 1;
    return hit.text;
  }

  set(key: string, text: string): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { text, expiresAt: Date.now() + this.ttlMs });
  }

  stats(): CacheStats {
    return { entries: this.store.size, hits: this.hits, misses: this.misses };
  }
}
