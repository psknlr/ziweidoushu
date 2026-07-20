/**
 * 星性能量与导出测试:全星曜能量属性覆盖、禄存恒庙规则、导出完整性。
 */
import { describe, expect, test } from 'vitest';
import {
  ADJECTIVE_STARS,
  BOSHI_12,
  CHANGSHENG_12,
  exportChartData,
  JIANGQIAN_12,
  MINOR_STARS,
  starNature,
  SUIQIAN_12,
  ZiweiEngine,
} from '@ziwei/core';

describe('星性能量表覆盖', () => {
  test('14 辅星、37 杂曜、四套十二神全部有星性', () => {
    const all = [...MINOR_STARS, ...ADJECTIVE_STARS, ...CHANGSHENG_12, ...BOSHI_12, ...JIANGQIAN_12, ...SUIQIAN_12];
    for (const key of all) {
      expect(starNature(key), `${key} 缺星性`).toBeDefined();
    }
  });

  test('古籍规则正确编码:辅弼魁钺恒吉、空劫为煞、桃花星标桃', () => {
    for (const key of ['zuofuMin', 'youbiMin', 'tiankuiMin', 'tianyueMin'] as const) {
      expect(starNature(key)!.kind).toBe('auspicious');
      expect(starNature(key)!.note).toContain('无庙陷');
    }
    expect(starNature('dikongMin')!.kind).toBe('inauspicious');
    expect(starNature('hongluan')!.kind).toBe('flower');
    expect(starNature('xianchi')!.kind).toBe('flower');
    expect(starNature('longde')!.kind).toBe('auspicious');
    expect(starNature('baihu')!.kind).toBe('inauspicious');
  });

  test('主星不用吉凶标签(以庙陷表与星情论)', () => {
    expect(starNature('ziweiMaj')).toBeUndefined();
  });
});

describe('禄存恒庙规则(全书:禄存无落陷)', () => {
  test('任意命盘中禄存必带 miao 亮度', () => {
    const engine = new ZiweiEngine();
    for (const date of ['2000-8-16', '1990-1-15', '1984-2-4']) {
      const chart = engine.bySolar(date, 4, 'male');
      const lucun = chart.palaces.flatMap((p) => p.minorStars).find((s) => s.key === 'lucunMin');
      expect(lucun, `${date} 盘无禄存?`).toBeDefined();
      expect(lucun!.brightness).toBe('miao');
    }
  });
});

describe('命盘参数导出', () => {
  const engine = new ZiweiEngine();
  const chart = engine.bySolar('2000-8-16', 2, 'female');
  const data = exportChartData(chart, engine.features(chart), '2026-07-19T00:00:00Z');

  test('结构完整:12 宫、四柱、格局、亮度汇总、免责声明', () => {
    expect(data.palaces).toHaveLength(12);
    expect(Object.keys(data.basics.ganzhi)).toEqual(['year', 'month', 'day', 'hour']);
    expect(data.analysis.patterns.length).toBeGreaterThan(0);
    expect(data.analysis.brightness.exalted.length).toBeGreaterThan(0);
    expect(data.disclaimer).toContain('仅供');
    expect(data.generator).toContain('IMPF-AI');
  });

  test('所有星曜均携带亮度或星性能量属性', () => {
    for (const palace of data.palaces) {
      for (const star of [...palace.majorStars, ...palace.minorStars, ...palace.adjectiveStars]) {
        const hasEnergy = star.brightness !== null || star.nature !== null;
        expect(hasEnergy, `${palace.name.name} 的 ${star.name} 既无亮度也无星性`).toBe(true);
      }
      for (const ring of Object.values(palace.rings)) {
        expect(ring.nature, `十二神 ${ring.name} 缺星性`).not.toBeNull();
      }
    }
  });

  test('可 JSON 序列化且中文标注齐备', () => {
    const json = JSON.stringify(data);
    expect(json).toContain('紫微');
    expect(json).toContain('庙');
    expect(json.length).toBeGreaterThan(10000);
  });
});
