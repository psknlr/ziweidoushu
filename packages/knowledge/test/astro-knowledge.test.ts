/**
 * 星座知识层:条目合法与覆盖、信号检索命中、Prompt 装配(纯星座 / 三系统 / 群盘附星座)。
 */
import { describe, expect, test } from 'vitest';
import { astroSignals, computeAstro, ZiweiEngine } from '@ziwei/core';
import {
  ALL_ENTRIES, ALL_SKILLS, ASTRO_SKILLS, analyzeGroup, buildAstroPrompt, buildGroupPrompt, buildSystemPrompt, retrieveSignals,
  validateEntries,
} from '@ziwei/knowledge';

const astro = computeAstro({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male', latitude: 39.9, longitude: 116.4 });
const SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

describe('星座知识条目', () => {
  test('≥ 100 条,zod 合法,实体以 astro 开头', () => {
    const entries = ALL_ENTRIES.filter((e) => e.domain === 'astro');
    expect(entries.length).toBeGreaterThanOrEqual(100);
    validateEntries(entries);
    for (const e of entries) expect(e.entities[0]).toBe('astro');
  });

  test('日/月/升/水/金/火 × 12 星座、4 元素偏重与缺失、3 三方、12 太阳宫位、5 日月相位全覆盖', () => {
    const ids = new Set(ALL_ENTRIES.map((e) => e.id));
    for (const dim of ['sun', 'moon', 'asc', 'mercury', 'venus', 'mars']) {
      for (const s of SIGNS) expect(ids.has(`astro.${dim}.${s}`), `缺 astro.${dim}.${s}`).toBe(true);
    }
    for (const el of ['fire', 'earth', 'air', 'water']) {
      expect(ids.has(`astro.element.${el}`)).toBe(true);
      expect(ids.has(`astro.elementLack.${el}`)).toBe(true);
    }
    for (const m of ['cardinal', 'fixed', 'mutable']) expect(ids.has(`astro.modality.${m}`)).toBe(true);
    for (let h = 1; h <= 12; h++) expect(ids.has(`astro.sunHouse.${h}`)).toBe(true);
    for (const t of ['conjunction', 'opposition', 'trine', 'square', 'sextile']) expect(ids.has(`astro.aspect.${t}.moon.sun`)).toBe(true);
  });
});

describe('星座检索与 Prompt', () => {
  test('星座信号召回太阳/月亮/上升/元素条目', () => {
    const hits = retrieveSignals(astroSignals(astro), ALL_ENTRIES, { limit: 30 });
    const ids = hits.map((h) => h.entry.id);
    expect(ids).toContain('astro.sun.capricorn');
    expect(ids).toContain('astro.moon.virgo');
    expect(ids).toContain(`astro.asc.${astro.ascendant!.sign}`);
    expect(ids.some((id) => id.startsWith('astro.element.'))).toBe(true);
    expect(ids).toContain(`astro.sunHouse.${astro.planets[0]!.house}`);
    for (const h of hits) expect(h.matchedSignals.length).toBeGreaterThan(0);
  });

  test('纯星座 Prompt 含事实、技法、免责,不含紫微/八字角色', () => {
    const hits = retrieveSignals(astroSignals(astro), ALL_ENTRIES, { topics: ASTRO_SKILLS.astro.topics });
    const prompt = buildAstroPrompt(astro, hits, { skill: ALL_SKILLS['astro'], year: 2026 });
    expect(prompt).toContain('西洋占星师');
    expect(prompt).toContain('太阳摩羯座');
    expect(prompt).toContain('2026 流年:小限');
    expect(prompt).toContain('本次解读技法:星座命盘');
    expect(prompt).toContain('不构成医疗');
    expect(prompt).not.toContain('紫微斗数命理师');
    expect(prompt).not.toContain('八字');
  });

  test('无上升盘的 Prompt 提示补充出生地', () => {
    const solar = computeAstro({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    const prompt = buildAstroPrompt(solar, []);
    expect(prompt).toContain('缺出生地');
    expect(prompt).toContain('太阳整宫制');
  });

  test('三系统 Prompt 同时含紫微、八字、星座事实与互参纪律', () => {
    const engine = new ZiweiEngine();
    const chart = engine.fromBirth({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male', city: '北京' });
    const features = engine.features(chart);
    const prompt = buildSystemPrompt(chart, features, [], { bazi: engine.bazi(chart), astro: engine.astro(chart), year: 2026 });
    expect(prompt).toContain('兼通子平八字、兼通西洋占星');
    expect(prompt).toContain('# 八字(四柱)结构化事实');
    expect(prompt).toContain('# 星座(西洋占星)结构化事实');
    expect(prompt).toContain('双系统互参');
    expect(prompt).toContain('星座互参');
    expect(prompt).toContain('命宫在');
    // 仅星座 + 紫微
    const two = buildSystemPrompt(chart, features, [], { astro: engine.astro(chart) });
    expect(two).toContain('兼通西洋占星');
    expect(two).not.toContain('兼通子平八字');
    expect(two).not.toContain('八字(四柱)');
  });

  test('群盘附星座:逐人星座事实 + 两两星座比较', () => {
    const engine = new ZiweiEngine();
    const a = engine.fromBirth({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male', city: '北京' });
    const b = engine.fromBirth({ year: 1992, month: 8, day: 16, hour: 11, gender: 'female', city: '上海' });
    const facts = analyzeGroup([
      { label: '甲', chart: a, astro: engine.astro(a) },
      { label: '乙', chart: b, astro: engine.astro(b) },
    ]);
    expect(facts.pairs[0]!.astro).toBeDefined();
    const prompt = buildGroupPrompt(facts, [], { withAstro: true, year: 2026 });
    expect(prompt).toContain('兼通西洋占星');
    expect(prompt).toContain('星座:');
    expect(prompt).toContain('- 星座:太阳:甲摩羯座 × 乙狮子座');
    expect(prompt).toContain('心理契合与摩擦点');
    // 不开 withAstro 时不出现
    expect(buildGroupPrompt(facts, [])).not.toContain('星座:');
  });

  test('技法表含星座两技法', () => {
    expect(ALL_SKILLS['astro']?.name).toBe('星座命盘');
    expect(ALL_SKILLS['astro-year']?.name).toBe('星座流年');
  });
});
