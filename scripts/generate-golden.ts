/**
 * 黄金命例快照生成器。
 *
 * 运行:npx tsx scripts/generate-golden.ts
 * 输出:packages/core/test/golden/cases.json
 *
 * 基准说明:快照取自当前内核(iztro 2.5.8,其官方测试套件经作者与
 * 文墨天机对拍验证)。黄金库的作用是回归保护 —— 适配层改动、内核升级、
 * 未来跨端移植(Dart/Python)都必须逐字段复现这批快照;
 * 首例(2000-8-16)另在 golden.test.ts 中与 iztro 官方期望值硬编码对拍。
 * 重新生成即更新基准,必须在 PR 中说明理由并逐案审查 diff。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZiweiEngine, type Gender } from '../packages/core/src/index.js';

interface CaseInput {
  solarDate: string;
  timeIndex: number;
  gender: Gender;
  preset: 'quanshu-default' | 'wenmo-zhongzhou';
  note?: string;
}

const EDGE_CASES: CaseInput[] = [
  { solarDate: '2000-8-16', timeIndex: 2, gender: 'female', preset: 'quanshu-default', note: 'iztro 官方验证盘' },
  // 春节/立春分界(2023:春节1-22,立春2-4)
  { solarDate: '2023-1-21', timeIndex: 6, gender: 'male', preset: 'quanshu-default', note: '春节前一日' },
  { solarDate: '2023-1-22', timeIndex: 6, gender: 'male', preset: 'quanshu-default', note: '春节当日' },
  { solarDate: '2023-1-25', timeIndex: 6, gender: 'female', preset: 'quanshu-default', note: '初一后立春前(normal 已换年)' },
  { solarDate: '2023-1-25', timeIndex: 6, gender: 'female', preset: 'wenmo-zhongzhou', note: '同日中州派' },
  { solarDate: '1984-2-3', timeIndex: 4, gender: 'male', preset: 'quanshu-default', note: '1984 立春前一日' },
  { solarDate: '1984-2-4', timeIndex: 4, gender: 'male', preset: 'quanshu-default', note: '1984 立春当日' },
  // 早子时/晚子时(dayDivide 差异)
  { solarDate: '1990-6-15', timeIndex: 0, gender: 'male', preset: 'quanshu-default', note: '早子时' },
  { solarDate: '1990-6-15', timeIndex: 12, gender: 'male', preset: 'quanshu-default', note: '晚子时 current' },
  { solarDate: '1990-6-15', timeIndex: 12, gender: 'male', preset: 'wenmo-zhongzhou', note: '晚子时 forward(换日)' },
  { solarDate: '2000-12-31', timeIndex: 12, gender: 'female', preset: 'wenmo-zhongzhou', note: '晚子时跨年' },
  { solarDate: '2001-3-31', timeIndex: 12, gender: 'male', preset: 'quanshu-default', note: '晚子时跨月' },
  // 闰月生人(2004闰二/2017闰六/1995闰八/2020闰四)
  { solarDate: '2004-3-25', timeIndex: 5, gender: 'female', preset: 'quanshu-default', note: '2004 闰二月上半月' },
  { solarDate: '2004-4-15', timeIndex: 5, gender: 'female', preset: 'quanshu-default', note: '2004 闰二月下半月(fixLeap 归下月)' },
  { solarDate: '2017-7-28', timeIndex: 9, gender: 'male', preset: 'quanshu-default', note: '2017 闰六月上半月' },
  { solarDate: '2017-8-15', timeIndex: 9, gender: 'male', preset: 'quanshu-default', note: '2017 闰六月下半月' },
  { solarDate: '1995-9-30', timeIndex: 3, gender: 'female', preset: 'quanshu-default', note: '1995 闰八月上半月' },
  { solarDate: '2020-5-30', timeIndex: 11, gender: 'male', preset: 'quanshu-default', note: '2020 闰四月' },
];

/** 常规多样化命例:1950-2018 均匀铺开,时辰/性别/流派轮转 */
const REGULAR_DATES = [
  '1950-3-8', '1953-11-24', '1957-7-1', '1960-1-27', '1963-9-9', '1966-5-5',
  '1969-12-12', '1972-4-30', '1975-8-18', '1978-2-14', '1981-10-1', '1984-6-6',
  '1987-3-3', '1989-6-4', '1992-11-11', '1994-7-7', '1996-2-29', '1998-9-28',
  '2001-1-1', '2003-12-25', '2006-4-18', '2008-8-8', '2010-10-10', '2012-12-21',
  '2014-5-20', '2015-11-30', '2016-2-8', '2018-7-13', '2019-4-5', '2021-6-1',
  '2022-9-15', '2024-2-10', '1955-8-15', '1961-4-12', '1968-10-16', '1976-9-9',
];

const CASES: CaseInput[] = [
  ...EDGE_CASES,
  ...REGULAR_DATES.map((solarDate, i): CaseInput => ({
    solarDate,
    timeIndex: (i * 5) % 13,
    gender: i % 2 === 0 ? 'male' : 'female',
    preset: i % 3 === 0 ? 'wenmo-zhongzhou' : 'quanshu-default',
  })),
];

const engines = {
  'quanshu-default': new ZiweiEngine('quanshu-default'),
  'wenmo-zhongzhou': new ZiweiEngine('wenmo-zhongzhou'),
};

const cases = CASES.map((input) => {
  const chart = engines[input.preset].bySolar(input.solarDate, input.timeIndex, input.gender);
  return {
    input,
    expected: {
      lunarDate: chart.lunarDate,
      ganzhi: [chart.ganzhi.year, chart.ganzhi.month, chart.ganzhi.day, chart.ganzhi.hour].map(
        (p) => `${p.stem}.${p.branch}`,
      ),
      soulBranch: chart.soulPalaceBranch,
      bodyBranch: chart.bodyPalaceBranch,
      soul: chart.soul,
      body: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      majors: chart.palaces.map((p) =>
        p.majorStars
          .filter((s) => s.type === 'major')
          .map((s) => s.key)
          .join('+'),
      ),
      mutagens: chart.palaces
        .flatMap((p) => [...p.majorStars, ...p.minorStars])
        .filter((s) => s.mutagen)
        .map((s) => `${s.key}:${s.mutagen}`)
        .sort(),
      decadalRanges: chart.palaces.map((p) => `${p.decadal.range[0]}-${p.decadal.range[1]}`),
    },
  };
});

const outPath = join(dirname(fileURLToPath(import.meta.url)), '../packages/core/test/golden/cases.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ kernel: 'iztro@2.5.8', generatedBy: 'scripts/generate-golden.ts', cases }, null, 1));
console.log(`已生成 ${cases.length} 个黄金命例 → ${outPath}`);
