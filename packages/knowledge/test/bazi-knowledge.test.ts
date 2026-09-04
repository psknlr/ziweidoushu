/**
 * 八字知识层:条目合法、信号检索命中、Prompt 装配(纯八字与双系统)。
 */
import { describe, expect, test } from 'vitest';
import { baziSignals, computeBaZi, ZiweiEngine } from '@ziwei/core';
import {
  ALL_ENTRIES, ALL_SKILLS, BAZI_SKILLS, buildBaZiPrompt, buildSystemPrompt, retrieve, retrieveSignals, validateEntries,
} from '@ziwei/knowledge';

const bazi = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });

describe('八字知识条目', () => {
  test('≥ 45 条,zod 合法,id 唯一,实体以 bazi 开头', () => {
    const entries = ALL_ENTRIES.filter((e) => e.domain === 'bazi');
    expect(entries.length).toBeGreaterThanOrEqual(45);
    validateEntries(entries);
    for (const e of entries) expect(e.entities[0]).toBe('bazi');
  });

  test('十干日主、十神、五级旺衰、十一格局全覆盖', () => {
    const ids = new Set(ALL_ENTRIES.map((e) => e.id));
    for (const s of ['jia', 'yi', 'bing', 'ding', 'wu', 'ji', 'geng', 'xin', 'ren', 'gui']) expect(ids.has(`bazi.dayMaster.${s}`)).toBe(true);
    for (const g of ['biJian', 'jieCai', 'shiShen', 'shangGuan', 'pianCai', 'zhengCai', 'qiSha', 'zhengGuan', 'pianYin', 'zhengYin']) {
      expect(ids.has(`bazi.tenGod.${g}`)).toBe(true);
    }
    // 比肩/劫财当令不以十神名取格,而归建禄/羊刃/月劫
    for (const g of ['shiShen', 'shangGuan', 'pianCai', 'zhengCai', 'qiSha', 'zhengGuan', 'pianYin', 'zhengYin']) {
      expect(ids.has(`bazi.pattern.${g}`)).toBe(true);
    }
    for (const l of ['veryStrong', 'strong', 'balanced', 'weak', 'veryWeak']) expect(ids.has(`bazi.strength.${l}`)).toBe(true);
    for (const p of ['jianLu', 'yangRen', 'yueJie']) expect(ids.has(`bazi.pattern.${p}`)).toBe(true);
  });
});

describe('八字检索与 Prompt', () => {
  test('八字信号召回日主/格局/旺衰条目', () => {
    const hits = retrieveSignals(baziSignals(bazi), ALL_ENTRIES, { limit: 20 });
    const ids = hits.map((h) => h.entry.id);
    expect(ids).toContain('bazi.dayMaster.geng');
    expect(ids).toContain('bazi.pattern.zhengYin');
    expect(ids).toContain(`bazi.strength.${bazi.strength.level}`);
    expect(ids).toContain('bazi.tiaohou.fire');
    expect(ids).toContain('bazi.shensha.kuiGang');
    for (const h of hits) expect(h.matchedSignals.length).toBeGreaterThan(0);
  });

  test('纯八字 Prompt 含事实、技法与免责', () => {
    const hits = retrieveSignals(baziSignals(bazi), ALL_ENTRIES, { topics: BAZI_SKILLS.bazi.topics });
    const prompt = buildBaZiPrompt(bazi, hits, { skill: ALL_SKILLS['bazi'], year: 2026 });
    expect(prompt).toContain('八字:己巳 丁丑 庚辰 庚辰');
    expect(prompt).toContain('正印格');
    expect(prompt).toContain('2026 流年丙午');
    expect(prompt).toContain('本次解读技法:八字命理');
    expect(prompt).toContain('不构成医疗');
    expect(prompt).not.toContain('紫微斗数命理师');
  });

  test('双系统 Prompt 同时含紫微与八字事实及互参纪律', () => {
    const engine = new ZiweiEngine();
    const chart = engine.bySolar('1990-1-15', 4, 'male');
    const features = engine.features(chart);
    const b = engine.bazi(chart);
    const hits = retrieveSignals([...features.signals, ...baziSignals(b)], ALL_ENTRIES, { limit: 12 });
    const prompt = buildSystemPrompt(chart, features, hits, { bazi: b, year: 2026 });
    expect(prompt).toContain('兼通子平八字');
    expect(prompt).toContain('# 八字(四柱)结构化事实');
    expect(prompt).toContain('双系统互参');
    expect(prompt).toContain('命宫在');
    // 不传 bazi 时行为不变
    expect(buildSystemPrompt(chart, features, retrieve(features, ALL_ENTRIES))).not.toContain('八字(四柱)');
  });

  test('技法表含八字两技法', () => {
    expect(ALL_SKILLS['bazi']?.name).toBe('八字命理');
    expect(ALL_SKILLS['bazi-dayun']?.name).toBe('八字大运流年');
  });
});
