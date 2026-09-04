/**
 * 夹宫格局(5 格):命宫两邻宫夹持之局。
 * 依赖 DSL 的 neighborsHaveBoth / soulHasMutagen 条件,不再以「同宫」近似夹宫。
 * 凶格一律课题化解读(见知识库条目),bonus=加重条件,broken=化解条件。
 */
import type { PatternDef } from '../analyzer/patterns.js';

const SHA_STARS = ['qingyangMin', 'tuoluoMin', 'huoxingMin', 'lingxingMin'] as const;
const KONG_JIE = ['dikongMin', 'dijieMin'] as const;

export const JIA_PATTERNS: readonly PatternDef[] = [
  {
    id: 'yangtuo-jiaji',
    name: '羊陀夹忌',
    source: '《紫微斗数全书》:「羊陀夹忌为败局。」',
    required: [
      { kind: 'soulHasMutagen', mutagen: 'sihuaJi', desc: '命宫见化忌星' },
      {
        kind: 'neighborsHaveBoth',
        first: { stars: ['qingyangMin'] },
        second: { stars: ['tuoluoMin'] },
        desc: '擎羊、陀罗分居命宫两邻宫相夹',
      },
    ],
    bonus: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫再入命,阻滞加重' },
      { kind: 'trineHasOne', stars: ['huoxingMin', 'lingxingMin'], desc: '火铃会照,四煞交攻' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaKe', desc: '化科会照,有解' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺贵人会照,得援' },
    ],
    note: '羊陀恒夹禄存,故本格实为「禄存与化忌同守命宫而羊陀夹之」——禄逢冲破。凶格,解读转为「资源易被消耗、进退受制」的课题与守成策略,严禁败局式断言。',
  },
  {
    id: 'huoling-jiaming',
    name: '火铃夹命',
    source: '《紫微斗数全书》格局论:火铃夹命(凶格)。',
    required: [
      {
        kind: 'neighborsHaveBoth',
        first: { stars: ['huoxingMin'] },
        second: { stars: ['lingxingMin'] },
        desc: '火星、铃星分居命宫两邻宫相夹',
      },
    ],
    bonus: [
      { kind: 'soulHasMutagen', mutagen: 'sihuaJi', desc: '命宫化忌,煎迫加重' },
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: ['ziweiMaj', 'tianfuMaj'], desc: '紫微/天府坐命,能制煞' },
      { kind: 'soulHasOne', stars: ['tanlangMaj'], desc: '贪狼坐命,火铃反为所用' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,有解' },
    ],
    note: '凶格,解读为「外部压力与急躁课题」:宜高强度、快节奏专业(急诊、消防、竞技、一线工程),课题是情绪管理与安全纪律,不作灾厄断言。',
  },
  {
    id: 'kongjie-jiaming',
    name: '空劫夹命',
    source: '《紫微斗数全书》格局论:空劫夹命(凶格)。',
    required: [
      {
        kind: 'neighborsHaveBoth',
        first: { stars: ['dikongMin'] },
        second: { stars: ['dijieMin'] },
        desc: '地空、地劫分居命宫两邻宫相夹',
      },
    ],
    bonus: [
      { kind: 'soulHasMutagen', mutagen: 'sihuaJi', desc: '命宫化忌' },
      { kind: 'trineHasOne', stars: [...SHA_STARS], desc: '煞星会照' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,虚中生实' },
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
      { kind: 'soulHasOne', stars: ['ziweiMaj', 'tianfuMaj'], desc: '紫微/天府坐命,能镇空劫' },
    ],
    note: '凶格偏中性:空劫夹命主「资源留存不易、想法超前」,正向出路是创意、研发、哲学等务虚生实之途;理财课题为止损与低杠杆,严禁破财命断言。',
  },
  {
    id: 'xingji-jiayin',
    name: '刑忌夹印',
    source: '中州派通行格局:擎羊(刑)与化忌星分夹天相(印)。',
    required: [
      { kind: 'soulHasOne', stars: ['tianxiangMaj'], desc: '天相守命' },
      {
        kind: 'neighborsHaveBoth',
        first: { stars: ['qingyangMin'] },
        second: { mutagen: 'sihuaJi' },
        desc: '擎羊与化忌星分居两邻宫夹天相',
      },
    ],
    bonus: [
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '命宫再见煞' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '三方再见化忌' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,得财荫之助' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺会照' },
    ],
    note: '凶格,解读为「规则、契约、文书与人际信任的一生课题」,正向发挥为法务、审计、合规之才;严禁刑狱式断言。',
  },
  {
    id: 'caiyin-jiayin',
    name: '财荫夹印',
    source: '中州派通行格局:化禄星(财)与天梁(荫)分夹天相(印)。',
    required: [
      { kind: 'soulHasOne', stars: ['tianxiangMaj'], desc: '天相守命' },
      {
        kind: 'neighborsHaveBoth',
        first: { mutagen: 'sihuaLu' },
        second: { stars: ['tianliangMaj'] },
        desc: '化禄星与天梁分居两邻宫夹天相',
      },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照,财荫愈厚' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS, ...KONG_JIE], desc: '煞空入命,荫护打折' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
    note: '吉格:天相得财荫夹持,主贵人扶助与资源庇荫,宜辅佐、幕僚、财务与协调类岗位;成格亦须看天相本身亮度与三方煞忌。',
  },
];
