/**
 * 夹宫格局与新增 DSL 条件(neighborsHaveBoth / soulHasMutagen / oppositeHasOne / allOf)测试。
 */
import { describe, expect, test } from 'vitest';
import { evaluatePatterns, JIA_PATTERNS, CLASSIC_PATTERNS } from '@ziwei/core';
import { makeChart, makeStar } from './helpers.js';

const ids = (chart: ReturnType<typeof makeChart>, defs = JIA_PATTERNS) => evaluatePatterns(chart, defs).map((p) => p.id);
const minor = (key: Parameters<typeof makeStar>[0], extra = {}) => makeStar(key, { type: 'soft', ...extra });

describe('羊陀夹忌', () => {
  test('命宫化忌且擎羊陀罗分居两邻宫 → 成格(不分左右)', () => {
    const a = makeChart(5, {
      5: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaJi' })], minors: [minor('lucunMin')] },
      4: { minors: [minor('qingyangMin')] },
      6: { minors: [minor('tuoluoMin')] },
    });
    expect(ids(a)).toContain('yangtuo-jiaji');
    const b = makeChart(5, {
      5: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaJi' })] },
      4: { minors: [minor('tuoluoMin')] },
      6: { minors: [minor('qingyangMin')] },
    });
    expect(ids(b)).toContain('yangtuo-jiaji');
  });

  test('只有一侧、或命宫无化忌 → 不成格', () => {
    const oneSide = makeChart(5, {
      5: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaJi' })] },
      4: { minors: [minor('qingyangMin')] },
    });
    expect(ids(oneSide)).not.toContain('yangtuo-jiaji');
    const noJi = makeChart(5, {
      5: { majors: [makeStar('jumenMaj')] },
      4: { minors: [minor('qingyangMin')] },
      6: { minors: [minor('tuoluoMin')] },
    });
    expect(ids(noJi)).not.toContain('yangtuo-jiaji');
  });

  test('跨越索引 0/11 的邻宫也正确', () => {
    const c = makeChart(0, {
      0: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaJi' })] },
      11: { minors: [minor('qingyangMin')] },
      1: { minors: [minor('tuoluoMin')] },
    });
    expect(ids(c)).toContain('yangtuo-jiaji');
  });
});

describe('火铃夹命 / 空劫夹命', () => {
  test('火铃分夹 → 成格;贪狼坐命计入化解', () => {
    const c = makeChart(3, {
      3: { majors: [makeStar('tanlangMaj')] },
      2: { minors: [minor('huoxingMin')] },
      4: { minors: [minor('lingxingMin')] },
    });
    const hit = evaluatePatterns(c, JIA_PATTERNS).find((p) => p.id === 'huoling-jiaming');
    expect(hit).toBeDefined();
    expect(hit!.brokenBy).toContain('贪狼坐命,火铃反为所用');
  });

  test('空劫分夹 → 成格;同宫不算夹', () => {
    const jia = makeChart(7, { 6: { minors: [minor('dikongMin')] }, 8: { minors: [minor('dijieMin')] } });
    expect(ids(jia)).toContain('kongjie-jiaming');
    const tong = makeChart(7, { 7: { minors: [minor('dikongMin'), minor('dijieMin')] } });
    expect(ids(tong)).not.toContain('kongjie-jiaming');
  });
});

describe('刑忌夹印 / 财荫夹印', () => {
  test('天相守命,擎羊与化忌星分夹 → 刑忌夹印', () => {
    const c = makeChart(9, {
      9: { majors: [makeStar('tianxiangMaj')] },
      8: { minors: [minor('qingyangMin')] },
      10: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaJi' })] },
    });
    expect(ids(c)).toContain('xingji-jiayin');
    expect(ids(c)).not.toContain('caiyin-jiayin');
  });

  test('天相守命,化禄星与天梁分夹 → 财荫夹印', () => {
    const c = makeChart(9, {
      9: { majors: [makeStar('tianxiangMaj')] },
      8: { majors: [makeStar('tianliangMaj')] },
      10: { majors: [makeStar('tiantongMaj', { mutagen: 'sihuaLu' })] },
    });
    expect(ids(c)).toContain('caiyin-jiayin');
  });

  test('非天相守命不成格', () => {
    const c = makeChart(9, {
      9: { majors: [makeStar('tianfuMaj')] },
      8: { minors: [minor('qingyangMin')] },
      10: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaJi' })] },
    });
    expect(ids(c)).not.toContain('xingji-jiayin');
  });
});

describe('坐贵向贵 / 禄合鸳鸯(allOf + oppositeHasOne + soulHasMutagen)', () => {
  test('魁钺分守命宫与对宫 → 天乙拱命 bonus 命中', () => {
    const c = makeChart(2, {
      2: { minors: [minor('tiankuiMin')] },
      8: { minors: [minor('tianyueMin')] },
    });
    const hit = evaluatePatterns(c, CLASSIC_PATTERNS).find((p) => p.id === 'tianyi-gongming');
    expect(hit).toBeDefined();
    expect(hit!.bonusHits).toContain('魁钺分守命宫与对宫,坐贵向贵');
  });

  test('魁钺同宫命宫(非分守)→ 成格但无坐贵向贵 bonus', () => {
    const c = makeChart(2, { 2: { minors: [minor('tiankuiMin'), minor('tianyueMin')] } });
    const hit = evaluatePatterns(c, CLASSIC_PATTERNS).find((p) => p.id === 'tianyi-gongming');
    expect(hit).toBeDefined();
    expect(hit!.bonusHits).not.toContain('魁钺分守命宫与对宫,坐贵向贵');
  });

  test('禄存与化禄同守命宫 → 双禄朝垣 bonus 禄合鸳鸯', () => {
    const c = makeChart(4, {
      4: { majors: [makeStar('wuquMaj', { mutagen: 'sihuaLu' })], minors: [minor('lucunMin')] },
    });
    const hit = evaluatePatterns(c, CLASSIC_PATTERNS).find((p) => p.id === 'shuanglu-chaoyuan');
    expect(hit).toBeDefined();
    expect(hit!.bonusHits).toContain('禄存与化禄同守命宫,禄合鸳鸯');
  });
});
