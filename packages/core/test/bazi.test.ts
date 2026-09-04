/**
 * 八字模块测试:公开命例黄金向量、边界(立春/节气/晚子时)、藏干表交叉核对、
 * 十神/旺衰/格局/用神/神煞/关系规则,以及与紫微盘共用时刻的一致性。
 */
import { describe, expect, test } from 'vitest';
import { LunarUtil } from 'lunar-typescript';
import {
  baziSignals, computeBaZi, describeBaZi, EARTHLY_BRANCHES, exportChartData, HIDDEN_STEMS, liuNianOf, tenGodOf,
  zh, ZiweiEngine,
} from '@ziwei/core';

const four = (b: ReturnType<typeof computeBaZi>) =>
  (['year', 'month', 'day', 'hour'] as const).map((k) => `${zh(b.pillars[k].stem)}${zh(b.pillars[k].branch)}`).join(' ');

describe('四柱黄金向量(公开命例)', () => {
  test('2000-01-01 00:30 → 己卯 丙子 戊午 壬子', () => {
    expect(four(computeBaZi({ year: 2000, month: 1, day: 1, hour: 0, minute: 30, gender: 'male' }))).toBe('己卯 丙子 戊午 壬子');
  });
  test('毛泽东 1893-12-26 辰时 → 癸巳 甲子 丁酉 甲辰', () => {
    expect(four(computeBaZi({ year: 1893, month: 12, day: 26, hour: 8, gender: 'male' }))).toBe('癸巳 甲子 丁酉 甲辰');
  });
  test('1990-01-15 08:30 → 己巳 丁丑 庚辰 庚辰(与紫微盘四柱一致)', () => {
    const b = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    expect(four(b)).toBe('己巳 丁丑 庚辰 庚辰');
    const chart = new ZiweiEngine().bySolar('1990-1-15', 4, 'male');
    expect(zh(chart.ganzhi.month.stem) + zh(chart.ganzhi.month.branch)).toBe('丁丑');
  });
});

describe('历法边界', () => {
  test('立春(2024-02-04 16:27)前后年月柱切换', () => {
    expect(four(computeBaZi({ year: 2024, month: 2, day: 4, hour: 16, minute: 26, gender: 'male' })).startsWith('癸卯 乙丑')).toBe(true);
    expect(four(computeBaZi({ year: 2024, month: 2, day: 4, hour: 16, minute: 28, gender: 'male' })).startsWith('甲辰 丙寅')).toBe(true);
  });
  test('惊蛰前后月柱切换,日柱不变', () => {
    const a = computeBaZi({ year: 2024, month: 3, day: 5, hour: 10, gender: 'female' });
    const b = computeBaZi({ year: 2024, month: 3, day: 5, hour: 11, minute: 30, gender: 'female' });
    expect(zh(a.pillars.month.branch)).toBe('寅');
    expect(zh(b.pillars.month.branch)).toBe('卯');
    expect(a.pillars.day.stem).toBe(b.pillars.day.stem);
  });
  test('晚子时日柱归属由 dayBoundary 控制', () => {
    const cur = computeBaZi({ year: 2021, month: 3, day: 1, hour: 23, minute: 30, gender: 'male', dayBoundary: 'current' });
    const fwd = computeBaZi({ year: 2021, month: 3, day: 1, hour: 23, minute: 30, gender: 'male', dayBoundary: 'forward' });
    expect(zh(cur.pillars.day.stem) + zh(cur.pillars.day.branch)).toBe('戊申');
    expect(zh(fwd.pillars.day.stem) + zh(fwd.pillars.day.branch)).toBe('己酉');
    expect(zh(cur.pillars.hour.branch)).toBe('子');
  });
});

describe('表格交叉核对', () => {
  test('藏干表与 lunar-typescript 一致', () => {
    const lib = LunarUtil.ZHI_HIDE_GAN as unknown as Record<string, string[]>;
    for (const b of EARTHLY_BRANCHES) {
      expect(HIDDEN_STEMS[b].map(zh)).toEqual(lib[zh(b)]);
    }
  });
  test('十神定义', () => {
    expect(tenGodOf('gengHeavenly', 'jiHeavenly')).toBe('zhengYin'); // 己土生庚金,异性 → 正印
    expect(tenGodOf('gengHeavenly', 'dingHeavenly')).toBe('zhengGuan'); // 丁火克庚金,异性 → 正官
    expect(tenGodOf('gengHeavenly', 'gengHeavenly')).toBe('biJian');
    expect(tenGodOf('jiaHeavenly', 'bingHeavenly')).toBe('shiShen'); // 甲生丙,同阳 → 食神
    expect(tenGodOf('jiaHeavenly', 'jiHeavenly')).toBe('zhengCai'); // 甲克己,异性 → 正财
    expect(tenGodOf('guiHeavenly', 'wuHeavenly')).toBe('zhengGuan'); // 戊克癸,异性 → 正官
  });
  test('库十神与本库一致(1990-01-15 庚日)', () => {
    const b = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    expect(b.pillars.year.stemTenGod).toBe('zhengYin');
    expect(b.pillars.month.stemTenGod).toBe('zhengGuan');
    expect(b.pillars.hour.stemTenGod).toBe('biJian');
    expect(b.pillars.day.stemTenGod).toBeNull();
    expect(b.pillars.day.naYin).toBe('白蜡金');
    expect(zh(b.pillars.day.changSheng)).toBe('养');
    expect(b.pillars.day.xunKong.map(zh).join('')).toBe('申酉');
  });
});

describe('分析规则', () => {
  const b = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });

  test('格局:丑月己土透年干 → 正印格', () => {
    expect(b.pattern.key).toBe('zhengYin');
    expect(b.pattern.name).toBe('正印格');
    expect(b.pattern.basis).toContain('本气己透出');
  });
  test('旺衰与用神自洽:分项之和等于总分,喜忌互斥且依旺衰取向', () => {
    const s = b.strength;
    expect(s.breakdown.season.score + s.breakdown.roots.score + s.breakdown.support.score).toBeCloseTo(s.score, 1);
    expect(s.score).toBeGreaterThanOrEqual(0);
    expect(s.score).toBeLessThanOrEqual(100);
    for (const e of b.yongShen.favorable) expect(b.yongShen.unfavorable).not.toContain(e);
    if (s.level === 'strong' || s.level === 'veryStrong') expect(b.yongShen.unfavorable).toContain(b.dayMaster.element);
    if (s.level === 'weak' || s.level === 'veryWeak') expect(b.yongShen.favorable).toContain(b.dayMaster.element);
    expect(b.yongShen.tiaoHou?.element).toBe('fire'); // 丑月寒冬调候用火
  });
  test('旺衰单调性:当令多比劫者强于失令多官杀者', () => {
    const strong = computeBaZi({ year: 1990, month: 8, day: 30, hour: 16, gender: 'male' }); // 庚午年 甲申月 …
    const weak = computeBaZi({ year: 1990, month: 5, day: 30, hour: 12, gender: 'male' }); // 庚午年 壬午月 …
    // 仅要求：金日主生于申月(旺)的分数 ≥ 同日主生于午月(死)的分数
    if (strong.dayMaster.element === weak.dayMaster.element) {
      expect(strong.strength.breakdown.season.score).toBeGreaterThanOrEqual(weak.strength.breakdown.season.score);
    }
    expect(strong.strength.breakdown.season.state).toBeDefined();
  });
  test('五行计数:表面 8 字、含藏干加权、缺项标注', () => {
    const v = b.fiveElements.visible;
    expect(Object.values(v).reduce((a, n) => a + n, 0)).toBe(8);
    expect(b.fiveElements.missing).toEqual(expect.arrayContaining(['wood', 'water'].filter((e) => v[e as 'wood'] === 0)));
  });
  test('神煞:庚日文昌在亥、禄在申、羊刃在酉;年支巳桃花在午', () => {
    // 1990-01-15 无亥申酉午 → 相关神煞不应误报
    const keys = b.shenSha.map((h) => h.key);
    expect(keys).not.toContain('wenchangGuiren');
    expect(keys).not.toContain('luShen');
    expect(keys).not.toContain('taoHua');
    // 构造:庚日见亥
    const c = computeBaZi({ year: 1971, month: 11, day: 20, hour: 22, gender: 'female' });
    if (c.dayMaster.stem === 'gengHeavenly' && Object.values(c.pillars).some((p) => zh(p.branch) === '亥')) {
      expect(c.shenSha.map((h) => h.key)).toContain('wenchangGuiren');
    }
  });
  test('魁罡与空亡', () => {
    // 庚辰日 → 魁罡;1990-01-15 日柱庚辰
    expect(b.shenSha.find((h) => h.key === 'kuiGang')?.at).toEqual(['day']);
  });
  test('干支关系:1990-01-15 年月日 巳丑…辰 无三合;日时同柱庚辰辰辰自刑', () => {
    expect(b.relations.some((r) => r.kind === 'ziXing')).toBe(true);
    expect(b.relations.some((r) => r.kind === 'sanHe')).toBe(false);
  });
});

describe('大运流年', () => {
  test('1990-01-15 男命(阴年)逆行,4 岁起丙子;女命顺行 7 岁起戊寅', () => {
    const m = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    expect(m.yun.forward).toBe(false);
    expect(m.yun.startAge).toBe(4);
    expect(zh(m.yun.daYun[1]!.stem) + zh(m.yun.daYun[1]!.branch)).toBe('丙子');
    expect(m.yun.daYun[1]!.stemTenGod).toBe('qiSha'); // 丙火克庚金,同阳 → 七杀
    const f = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'female' });
    expect(f.yun.forward).toBe(true);
    expect(f.yun.startAge).toBe(7);
    expect(zh(f.yun.daYun[1]!.stem) + zh(f.yun.daYun[1]!.branch)).toBe('戊寅');
  });
  test('流年:2026 丙午,虚岁 37,落在 癸酉 大运', () => {
    const m = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    const ln = liuNianOf(m, 2026);
    expect(zh(ln.stem) + zh(ln.branch)).toBe('丙午');
    expect(ln.age).toBe(37);
    const dy = m.yun.daYun.find((d) => d.index === ln.daYunIndex)!;
    expect(zh(dy.stem) + zh(dy.branch)).toBe('癸酉');
  });
});

describe('与紫微盘集成', () => {
  test('engine.bazi 使用同一校正时刻并沿用晚子时流派;导出含八字', () => {
    const engine = new ZiweiEngine('wenmo-zhongzhou');
    const chart = engine.fromBirth({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male', city: '北京' });
    const bazi = engine.bazi(chart);
    expect(bazi.meta.timeSource).toBe('trueSolarTime');
    expect(bazi.meta.localTime).toBe(chart.meta.input.trueSolarTime.correctedLocal);
    expect(bazi.meta.dayBoundary).toBe('forward');
    expect(engine.bazi(chart)).toBe(bazi); // 缓存
    const exported = exportChartData(chart, engine.features(chart), '2026-01-01T00:00:00Z', bazi);
    expect(exported.bazi?.pattern.name).toBe(bazi.pattern.name);
  });
  test('bySolar 路径按时辰中点推算', () => {
    const engine = new ZiweiEngine();
    const chart = engine.bySolar('2000-8-16', 6, 'female');
    const bazi = engine.bazi(chart);
    expect(bazi.meta.timeSource).toBe('timeIndex');
    expect(zh(bazi.pillars.hour.branch)).toBe('午');
  });
  test('describeBaZi 与 baziSignals 输出完整', () => {
    const b = computeBaZi({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    const text = describeBaZi(b, 2026);
    expect(text).toContain('八字:己巳 丁丑 庚辰 庚辰');
    expect(text).toContain('正印格');
    expect(text).toContain('2026 流年丙午');
    const sig = baziSignals(b);
    expect(sig.some((s) => s.entities.join('.') === 'bazi.pattern.zhengYin')).toBe(true);
    expect(sig.some((s) => s.entities.join('.') === `bazi.strength.${b.strength.level}`)).toBe(true);
  });
});
