/**
 * 命盘参数导出:把星盘 + 分析结果打包为带中文标注的完整 JSON,
 * 供智能体/外部工具直接消费(所有星曜含亮度或星性能量属性)。
 */
import { zh } from './keys.js';
import { starNature } from './data/star-energy.js';
import type { Astrolabe, ChartFeatures, Star } from './types.js';

interface ExportedStar {
  key: string;
  name: string;
  type: string;
  /** 庙旺得利平不陷(有庙陷表的星曜) */
  brightness: { key: string; name: string } | null;
  /** 星性能量(无庙陷表的星曜:恒吉/煞/桃花/科文/中性 + 古籍规则备注) */
  nature: { kind: string; tag: string; note?: string } | null;
  mutagen: { key: string; name: string } | null;
}

function exportStar(star: Star): ExportedStar {
  const nature = starNature(star.key);
  return {
    key: star.key,
    name: zh(star.key),
    type: star.type,
    brightness: star.brightness ? { key: star.brightness, name: zh(star.brightness) } : null,
    nature: nature ? { kind: nature.kind, tag: nature.tag, ...(nature.note ? { note: nature.note } : {}) } : null,
    mutagen: star.mutagen ? { key: star.mutagen, name: zh(star.mutagen) } : null,
  };
}

function ringStar(key: string): ExportedStar {
  const nature = starNature(key as Parameters<typeof starNature>[0]);
  return {
    key,
    name: zh(key),
    type: 'ring',
    brightness: null,
    nature: nature ? { kind: nature.kind, tag: nature.tag, ...(nature.note ? { note: nature.note } : {}) } : null,
    mutagen: null,
  };
}

/** 导出完整命盘参数(可 JSON.stringify 直接落盘) */
export function exportChartData(chart: Astrolabe, features: ChartFeatures, exportedAt?: string) {
  return {
    generator: '紫微斗数工作台 · 医哲未来人工智能研究院(IMPF-AI)',
    engine: chart.meta.engine,
    kernel: chart.meta.kernel,
    chartHash: chart.meta.chartHash,
    exportedAt: exportedAt ?? new Date().toISOString(),
    school: chart.meta.school,
    input: chart.meta.input,
    basics: {
      gender: { key: chart.gender, name: zh(chart.gender) },
      solarDate: chart.solarDate,
      lunarDate: chart.lunarDate,
      ganzhi: Object.fromEntries(
        (['year', 'month', 'day', 'hour'] as const).map((k) => [
          k,
          `${zh(chart.ganzhi[k].stem)}${zh(chart.ganzhi[k].branch)}`,
        ]),
      ),
      fiveElementsClass: { key: chart.fiveElementsClass, name: zh(chart.fiveElementsClass) },
      soul: { key: chart.soul, name: zh(chart.soul) },
      body: { key: chart.body, name: zh(chart.body) },
      soulPalaceBranch: zh(chart.soulPalaceBranch),
      bodyPalaceBranch: zh(chart.bodyPalaceBranch),
      zodiac: chart.zodiac,
      sign: chart.sign,
    },
    palaces: chart.palaces.map((p) => ({
      index: p.index,
      name: { key: p.name, name: zh(p.name) },
      stemBranch: `${zh(p.stem)}${zh(p.branch)}`,
      isBodyPalace: p.isBodyPalace,
      isOriginalPalace: p.isOriginalPalace,
      majorStars: p.majorStars.map(exportStar),
      minorStars: p.minorStars.map(exportStar),
      adjectiveStars: p.adjectiveStars.map(exportStar),
      rings: {
        changsheng12: ringStar(p.changsheng12),
        boshi12: ringStar(p.boshi12),
        jiangqian12: ringStar(p.jiangqian12),
        suiqian12: ringStar(p.suiqian12),
      },
      decadal: { range: p.decadal.range, stemBranch: `${zh(p.decadal.stem)}${zh(p.decadal.branch)}` },
      ages: p.ages,
      borrowed: p.borrowed
        ? { fromBranch: zh(p.borrowed.fromBranch), stars: p.borrowed.stars.map(exportStar) }
        : null,
    })),
    analysis: {
      patterns: features.patterns,
      brightness: features.brightness,
      soulSurround: features.soulSurround,
      topSignals: features.signals.slice(0, 20),
    },
    disclaimer: '命理数据仅供文化研究与自我认知参考,不构成医疗/投资/重大决策建议。',
  };
}
