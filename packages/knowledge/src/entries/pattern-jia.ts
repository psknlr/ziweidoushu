/**
 * 夹宫格局解读条目(5 条),与 @ziwei/core JIA_PATTERNS 一一对应。
 * 凶格一律课题化:古断极端语不进入断语,转译为可操作的课题与出路。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const PATTERN_JIA_ENTRIES: KnowledgeEntry[] = [
  entry({
    id: 'pattern.yangtuo-jiaji',
    domain: 'pattern',
    entities: ['pattern', 'yangtuo-jiaji'],
    topics: ['overview', 'wealth', 'career'],
    summary: '羊陀夹忌:禄存与化忌同守命宫而羊陀相夹,资源易耗、进退受制,课题在守成与止损纪律。',
    detail:
      '羊陀恒夹禄存,命宫见化忌又与禄存同宫,便成「羊陀夹忌」——古称败局,实指禄逢冲破:资源在手却留不住、想进被牵制、想退又不甘。成就方向宜求稳:专业技术、体制内岗位、长期复利型资产,少做杠杆与投机。加重(空劫入命、火铃会照)则消耗更快,课题是建立财务防火墙与决策缓冲期。化解(化科会照、魁钺贵人会照)则有贵人与名声托底,困局多能借外力转圜。解读须课题化:说明「哪里易漏、如何堵漏」,严禁一切败局、破财命式断言。',
    source: srcs.quanshu('羊陀夹忌为败局'),
    confidence: 0.75,
    guidance: {
      focus: ['资源留存与止损纪律', '稳健职业与长期资产'],
      nuance: ['本质是禄逢冲破,重在守成策略而非吉凶宣判'],
      avoid: ['严禁「败局/破财命」断言', '不可因化忌泛化为一生困顿'],
    },
  }),
  entry({
    id: 'pattern.huoling-jiaming',
    domain: 'pattern',
    entities: ['pattern', 'huoling-jiaming'],
    topics: ['overview', 'health', 'career'],
    summary: '火铃夹命:外部压力与急躁并存,宜高强度快节奏专业,课题是情绪管理与安全纪律。',
    detail:
      '火星、铃星分居命宫两邻宫相夹,主环境急迫、易受外来压力煎迫,性情偏急。成就方向在需要爆发力与抗压的一线:急诊医护、消防救援、竞技体育、工程攻坚、危机公关,压力愈大愈能激发。加重(命宫化忌、空劫入命)则急躁成本上升,课题在决策前设冷静期、重视安全防护。化解(紫微天府坐命能制煞、贪狼坐命则火铃反为所用、化禄会照)说明煞气可被驾驭甚至转为横发之力。解读一律转译为压力与情绪课题,不作灾厄断言。',
    source: srcs.modern('《紫微斗数全书》格局论(火铃夹命)及中州派通行释义'),
    confidence: 0.7,
    guidance: {
      focus: ['高强度专业的适配', '情绪管理与安全纪律'],
      nuance: ['贪狼坐命时火铃反成助力,须先看命主'],
      avoid: ['不作意外灾厄断言', '不将急躁说成性格缺陷宿命'],
    },
  }),
  entry({
    id: 'pattern.kongjie-jiaming',
    domain: 'pattern',
    entities: ['pattern', 'kongjie-jiaming'],
    topics: ['overview', 'wealth', 'fortune'],
    summary: '空劫夹命:资源留存不易而想法超前,宜创意研发与务虚生实之途,理财课题为止损低杠杆。',
    detail:
      '地空、地劫分居命宫两邻宫相夹,主思维跳脱、不循常规,财务上易有起落。成就方向在把「空」转为「创」:创意设计、研发、哲学宗教人文、新兴行业,靠原创力而非资本积累立足。加重(命宫化忌、煞星会照)则波动更大,课题是分散风险、不押单一大局。化解(化禄或禄存会照、紫府坐命)则虚中能生实,想法可落地为收入。解读须转译为想象力与财务纪律的课题,严禁破财命、飘泊命断言。',
    source: srcs.modern('《紫微斗数全书》格局论(空劫夹命)及中州派通行释义'),
    confidence: 0.7,
    guidance: {
      focus: ['原创力变现路径', '止损与低杠杆的理财纪律'],
      nuance: ['空劫主想法超前,是特质不是缺陷'],
      avoid: ['严禁破财/飘泊断言', '不可劝阻一切投资,应给纪律'],
    },
  }),
  entry({
    id: 'pattern.xingji-jiayin',
    domain: 'pattern',
    entities: ['pattern', 'xingji-jiayin'],
    topics: ['overview', 'career', 'family'],
    summary: '刑忌夹印:天相被擎羊与化忌相夹,主规则、契约与信任课题,正向为法务审计合规之才。',
    detail:
      '天相为印星,被擎羊(刑)与化忌(忌)分夹,印受刑忌所困,古主官非文书之累。现代解读为「规则与契约的一生课题」:签约审慎、程序合规、人际界限清楚,便能把课题化为专业——法律、审计、风控、合规、行政监察皆宜。加重(命宫再见煞、三方再见忌)则文书与人事纠葛更多,课题在留痕与第三方见证。化解(化禄会照得财荫之助、魁钺会照)则有贵人与资源护印。解读严禁牢狱、官非式断言,一律转为守约与谨慎的提示。',
    source: srcs.modern('中州派通行格局:刑忌夹印(擎羊与化忌夹天相)'),
    confidence: 0.7,
    guidance: {
      focus: ['契约与合规的专业化', '人际界限与留痕习惯'],
      nuance: ['与「财荫夹印」互为镜像,须看两邻宫实际星曜'],
      avoid: ['严禁官非牢狱断言', '不可将天相说成受害者'],
    },
  }),
  entry({
    id: 'pattern.caiyin-jiayin',
    domain: 'pattern',
    entities: ['pattern', 'caiyin-jiayin'],
    topics: ['overview', 'career', 'wealth'],
    summary: '财荫夹印:天相得化禄与天梁夹持,贵人庇荫与资源扶助兼备,宜辅佐、财务与协调岗位。',
    detail:
      '天相守命,两邻宫一为化禄(财)、一为天梁(荫),印星得财荫夹持,主受长辈上司庇护、资源自然汇聚,是天相最喜之局。成就方向在辅佐与协调:幕僚、财务、行政管理、人力资源、家族事业承接,以稳健与信誉立身。成格加分(禄存会照、辅弼会照)则财源与助力俱厚。破格(煞空入命、化忌冲照)解读为庇荫打折:助力仍在而须自己多担一些,课题在不过度依赖贵人。断语宜留余地,仍须参看天相亮度与三方四正整体格局。',
    source: srcs.modern('中州派通行格局:财荫夹印(化禄与天梁夹天相)'),
    confidence: 0.72,
    guidance: {
      focus: ['辅佐协调型岗位', '信誉与稳健累积'],
      nuance: ['吉格亦不保证富贵,须看天相亮度与煞忌'],
      avoid: ['不可断言必得贵人成功', '破格不可说成庇荫全失'],
    },
  }),
];
