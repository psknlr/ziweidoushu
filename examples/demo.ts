/**
 * 端到端演示:出生信息 → 真太阳时校正 → 排盘 → 盘面分析 → 知识检索 → LLM Prompt。
 * 运行:npm run demo
 */
import { PRESET_WENMO_ZHONGZHOU, sihuaOverlay, zh, ZiweiEngine } from '@ziwei/core';
import { buildSystemPrompt, retrieve, ALL_ENTRIES } from '@ziwei/knowledge';

const engine = new ZiweiEngine(PRESET_WENMO_ZHONGZHOU);

// ① 出生信息(北京出生 → 自动查离线城市库并做真太阳时校正)
const chart = engine.fromBirth({
  year: 1990,
  month: 1,
  day: 15,
  hour: 8,
  minute: 30,
  gender: 'male',
  city: '北京',
});

console.log('═══ ① 归一化与真太阳时 ═══');
const tst = chart.meta.input.trueSolarTime;
console.log(`原始时刻: ${tst.originalLocal}  校正后: ${tst.correctedLocal}`);
console.log(`偏移: ${tst.totalOffsetMinutes} 分钟(经度 ${tst.longitudeMinutes} + 均时差 ${tst.eotMinutes})`);
console.log(`时辰是否改变: ${tst.timeIndexChanged ? '是(UI 须显著提示)' : '否'}`);

console.log('\n═══ ② 星盘(可序列化,语言无关 key) ═══');
console.log(`流派: ${chart.meta.school.preset}  内核: ${chart.meta.kernel}  chartHash: ${chart.meta.chartHash}`);
console.log(
  `农历 ${chart.lunarDate} | 年柱 ${zh(chart.ganzhi.year.stem)}${zh(chart.ganzhi.year.branch)} | ` +
    `${zh(chart.fiveElementsClass)} | 命主${zh(chart.soul)} 身主${zh(chart.body)}`,
);
for (const p of chart.palaces) {
  const majors = p.majorStars
    .map((s) => `${zh(s.key)}${s.brightness ? `(${zh(s.brightness)})` : ''}${s.mutagen ? `[${zh(s.mutagen)}]` : ''}`)
    .join(' ');
  const borrowed = p.borrowed ? ` ←借${p.borrowed.stars.map((s) => zh(s.key)).join('/')}` : '';
  console.log(
    `  ${zh(p.branch)} ${zh(p.name)}${p.isBodyPalace ? '(身)' : ''} 大限${p.decadal.range[0]}-${p.decadal.range[1]}: ${majors || '(空)'}${borrowed}`,
  );
}

console.log('\n═══ ③ 盘面分析(格局 / 信号 Top5) ═══');
const features = engine.features(chart);
for (const pat of features.patterns) {
  console.log(`  格局【${pat.name}】${pat.brokenBy.length > 0 ? `破格:${pat.brokenBy.join(';')}` : '成格'}`);
}
for (const sig of features.signals.slice(0, 5)) {
  console.log(`  [${sig.weight}] ${sig.note}`);
}

console.log('\n═══ ④ 流年四化叠加(2026 丙午年 → 丙干) ═══');
const horoscope = engine.horoscope(chart, '2026-6-1 12:00');
console.log(`  大限第${horoscope.decadal.index}宫 ${zh(horoscope.decadal.stem)}${zh(horoscope.decadal.branch)},虚岁 ${horoscope.age.nominalAge}`);
for (const hit of sihuaOverlay(chart, horoscope.yearly.stem)) {
  console.log(
    `  流年${zh(hit.mutagen)} → ${zh(hit.star)}${hit.palaceIndex !== null ? ` 落${zh(chart.palaces[hit.palaceIndex]!.name)}` : '(盘面无此星)'}`,
  );
}

console.log('\n═══ ⑤ 知识检索 → System Prompt(节选) ═══');
const retrieved = retrieve(features, ALL_ENTRIES, { limit: 6 });
for (const r of retrieved) {
  console.log(`  [${r.score}] ${r.entry.id} ← ${r.entry.source.ref}`);
}
const prompt = buildSystemPrompt(chart, features, retrieved);
console.log('\n' + prompt.split('\n').slice(0, 14).join('\n'));
console.log(`  …(共 ${prompt.length} 字,promptVersion 随缓存 key)`);
