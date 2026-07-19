/**
 * 起步格局库(10 个经典格局)。
 *
 * 三层条件模型:required(不满足即不成格)/ bonus(增强)/ broken(冲破)。
 * 每格附古籍出处原句;判定口径若有简化,在 note 中说明。
 * 扩展目标:60-80 格(见设计文档 §12 Phase 2)。
 */
import type { PatternDef } from '../analyzer/patterns.js';

const SHA_STARS = ['qingyangMin', 'tuoluoMin', 'huoxingMin', 'lingxingMin'] as const;
const KONG_JIE = ['dikongMin', 'dijieMin'] as const;

export const STARTER_PATTERNS: readonly PatternDef[] = [
  {
    id: 'zifu-tonggong',
    name: '紫府同宫',
    source: '《紫微斗数全书》:「紫府同宫,终身福厚。」',
    required: [{ kind: 'soulHasAll', stars: ['ziweiMaj', 'tianfuMaj'], desc: '紫微、天府同守命宫' }],
    bonus: [
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '左辅右弼会照' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '文昌文曲会照' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '三方四正见化禄' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '地空地劫同宫' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '三方四正见化忌' },
    ],
  },
  {
    id: 'huo-tan',
    name: '火贪格',
    source: '《紫微斗数全书》:「贪狼火星居庙旺,名镇诸邦。」',
    required: [
      { kind: 'soulHasOne', stars: ['tanlangMaj'], desc: '贪狼守命' },
      { kind: 'trineHasOne', stars: ['huoxingMin'], desc: '火星同宫或三方会照' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['tanlangMaj', 'huoxingMin'], desc: '火贪同宫(横发之势最烈)' },
      { kind: 'soulStarBrightnessIn', star: 'tanlangMaj', brightness: ['miao', 'wang'], desc: '贪狼庙旺' },
      { kind: 'starHasMutagen', star: 'tanlangMaj', mutagen: 'sihuaLu', desc: '贪狼化禄' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫同宫,横发横破' },
      { kind: 'starHasMutagen', star: 'tanlangMaj', mutagen: 'sihuaJi', desc: '贪狼化忌' },
    ],
  },
  {
    id: 'ling-tan',
    name: '铃贪格',
    source: '《紫微斗数全书》:「铃贪相遇,将相之名。」',
    required: [
      { kind: 'soulHasOne', stars: ['tanlangMaj'], desc: '贪狼守命' },
      { kind: 'trineHasOne', stars: ['lingxingMin'], desc: '铃星同宫或三方会照' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['tanlangMaj', 'lingxingMin'], desc: '铃贪同宫' },
      { kind: 'soulStarBrightnessIn', star: 'tanlangMaj', brightness: ['miao', 'wang'], desc: '贪狼庙旺' },
    ],
    broken: [{ kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫同宫' }],
  },
  {
    id: 'shizhong-yinyu',
    name: '石中隐玉',
    source: '《骨髓赋》:「子午巨门,石中隐玉。」',
    required: [
      { kind: 'soulHasOne', stars: ['jumenMaj'], desc: '巨门守命' },
      { kind: 'soulBranchIn', branches: ['ziEarthly', 'wuEarthly'], desc: '命宫居子或午' },
    ],
    bonus: [
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaLu', desc: '巨门化禄' },
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaQuan', desc: '巨门化权' },
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
    ],
    broken: [
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaJi', desc: '巨门化忌' },
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞同宫' },
    ],
  },
  {
    id: 'rizhao-leimen',
    name: '日照雷门',
    source: '《紫微斗数全书》:「日照雷门,富贵荣华。」(太阳卯宫守命)',
    required: [
      { kind: 'soulHasOne', stars: ['taiyangMaj'], desc: '太阳守命' },
      { kind: 'soulBranchIn', branches: ['maoEarthly'], desc: '命宫居卯' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['taiyangMaj', 'tianliangMaj'], desc: '太阳天梁同宫' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照' },
      { kind: 'starHasMutagen', star: 'taiyangMaj', mutagen: 'sihuaLu', desc: '太阳化禄' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫同宫' },
      { kind: 'starHasMutagen', star: 'taiyangMaj', mutagen: 'sihuaJi', desc: '太阳化忌' },
    ],
  },
  {
    id: 'yangliang-changlu',
    name: '阳梁昌禄',
    source: '《骨髓赋》注:「阳梁昌禄,胪传第一名。」',
    required: [
      { kind: 'trineHasAll', stars: ['taiyangMaj', 'tianliangMaj', 'wenchangMin'], desc: '太阳、天梁、文昌会于三方四正' },
      {
        kind: 'anyOf',
        desc: '禄存或化禄会照',
        conds: [
          { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
          { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
        ],
      },
    ],
    bonus: [{ kind: 'soulBranchIn', branches: ['maoEarthly'], desc: '命居卯位,格局尤佳' }],
    broken: [{ kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲破' }],
  },
  {
    id: 'jiyue-tongliang',
    name: '机月同梁',
    source: '《紫微斗数全书》:「机月同梁作吏人。」',
    required: [
      { kind: 'soulBranchIn', branches: ['yinEarthly', 'shenEarthly'], desc: '命宫居寅或申' },
      {
        kind: 'trineHasAll',
        stars: ['tianjiMaj', 'taiyinMaj', 'tiantongMaj', 'tianliangMaj'],
        desc: '机、月、同、梁四星会于三方四正',
      },
    ],
    bonus: [{ kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照,利文职' }],
    broken: [],
    note: '本格主稳定吏职、幕僚之才,吉凶中性偏稳,broken 留空。',
  },
  {
    id: 'shapolang',
    name: '杀破狼',
    source: '《紫微斗数全书》:「杀破狼」三星永在三方,主变动开创。',
    required: [{ kind: 'soulHasOne', stars: ['qishaMaj', 'pojunMaj', 'tanlangMaj'], desc: '七杀/破军/贪狼守命(三方必成杀破狼)' }],
    bonus: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,动中得财' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼会照,有助力' },
    ],
    broken: [{ kind: 'trineHasOne', stars: [...SHA_STARS], desc: '三方会四煞,动荡加剧' }],
    note: '杀破狼为动局而非凶局,broken 表示波动加剧而非格局被毁;解读导向见知识库条目。',
  },
  {
    id: 'junchen-qinghui',
    name: '君臣庆会',
    source: '《紫微斗数全书》:「君臣庆会,才擅经邦。」',
    required: [
      { kind: 'soulHasOne', stars: ['ziweiMaj'], desc: '紫微守命' },
      { kind: 'trineHasAll', stars: ['zuofuMin', 'youbiMin'], desc: '左辅右弼会于三方四正' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺会照' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照' },
    ],
    broken: [{ kind: 'soulHasOne', stars: [...SHA_STARS, ...KONG_JIE], desc: '煞星空劫入命' }],
    note: '简化判定:以紫微守命且辅弼三方会照为准;严格口径(天相天府同会等)后续版本细化。',
  },
  {
    id: 'qisha-chaodou',
    name: '七杀朝斗',
    source: '《骨髓赋》:「七杀朝斗,爵禄荣昌。」(寅申子午,朝斗仰斗)',
    required: [
      { kind: 'soulHasOne', stars: ['qishaMaj'], desc: '七杀守命' },
      { kind: 'soulBranchIn', branches: ['yinEarthly', 'shenEarthly', 'ziEarthly', 'wuEarthly'], desc: '命宫居寅申子午' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫同宫' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
  },
];
