/**
 * 十四主星坐命宫条目(紫微除外,已有 curated 条目 star.ziwei.soul)。
 * 命宫为重点条目,每条附 guidance 导向;初稿 draft,升级须人工审核。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const SOUL_STAR_ENTRIES: KnowledgeEntry[] = [
  entry({
    id: 'star.tianji.soul',
    domain: 'star',
    entities: ['tianjiMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '天机坐命,思虑敏捷善谋划,心思多变宜动脑行业。',
    detail:
      '天机为智慧之星,坐命者反应快、善企划分析,兴趣广而学习力强;但心思多变,易多谋少决、临事反复。宜技术、企划、咨询、文教等以智取胜之业。会昌曲文思更利;逢化忌则思虑过度钻牛角尖,须防失眠内耗。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['智谋企划之才与学习弹性', '宜动脑不宜纯体力/纯守成的职业方向'],
      nuance: ['多变是弹性也是不定,依会照吉煞定成色', '化忌时重点在思虑内耗的调适'],
      avoid: ['不可断言"一生飘荡无成"', '避免把善变直接贬为不可靠'],
    },
  }),
  entry({
    id: 'star.taiyang.soul',
    domain: 'star',
    entities: ['taiyangMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '太阳坐命,热忱博爱重名声,施多受少,白天生人庙旺尤佳。',
    detail:
      '太阳主光明博爱,坐命者外向热心、乐于付出,重名多于重利,具公众缘与领袖热情;但劳碌闲不住,施而不受易觉委屈。庙旺(白天生人更应)名声事业俱旺;落陷则劳多功少、须防眼目心火之疾。会禄存则名利相济;逢忌防好心招谤。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['公众性行业与名声资产', '付出型人格的边界与回报设计'],
      nuance: ['庙旺落陷差异大,须结合生时昼夜与宫位亮度', '重名轻利是取向而非缺点'],
      avoid: ['落陷不可断为"劳碌命无成"', '避免鼓励无底线燃烧自己'],
    },
  }),
  entry({
    id: 'star.wuqu.soul',
    domain: 'star',
    entities: ['wuquMaj', 'soulPalace'],
    topics: ['overview', 'wealth', 'career'],
    summary: '武曲坐命,刚毅果决行动力强,正财星宜财经技术,须防孤克。',
    detail:
      '武曲为正财星、将星之质,坐命者刚直寡言、执行力与理财力俱强,吃苦耐劳适合财经、军警、工程技术。课题在刚而少柔:人际疏离、遇事硬扛,情感表达不足显孤。会禄存化禄财禄丰盈;逢化忌空劫则财有破耗且更显孤克,宜以合作与沟通调剂。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['务实执行与理财专才', '刚毅底色下的沟通课题'],
      nuance: ['孤克指人际风格偏硬,须辅以吉煞会照细断', '女命武曲重在事业才干,勿套旧时贬语'],
      avoid: ['禁用"克夫克妻"式宿命断语', '不可断言必发财或必孤独终老'],
    },
  }),
  entry({
    id: 'star.tiantong.soul',
    domain: 'star',
    entities: ['tiantongMaj', 'soulPalace'],
    topics: ['overview', 'fortune'],
    summary: '天同坐命,温和知足人缘好,福星安逸,进取心是主要课题。',
    detail:
      '天同为福星,坐命者性情温和、随遇而安,人缘佳少树敌,懂得生活情趣,多属白手兴家而晚发之格。课题在安逸生惰:缺乏危机感,开创冲劲不足。适度逢煞反成激发、先劳后逸;会吉则一生平顺有福;过度安逸无冲激则易安于现状、志业难展。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['亲和力与服务型行业适性', '晚发格局的节奏耐心'],
      nuance: ['逢煞未必凶,常为激发懒散的转机', '福星之福指心境与人缘,非不劳而获'],
      avoid: ['不可讥为"懒人命"', '避免暗示可坐享其成'],
    },
  }),
  entry({
    id: 'star.lianzhen.soul',
    domain: 'star',
    entities: ['lianzhenMaj', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '廉贞坐命,权变机敏善公关,次桃花带囚性,感情与原则多拉扯。',
    detail:
      '廉贞为次桃花兼囚星,坐命者聪明有魅力,交际手腕灵活,竞争心强,宜公职、政商公关等讲人脉与权变之场。囚性使其内在原则与欲望常相拉扯,爱恨分明。会吉化禄则政商得意、感情丰润;廉贞化忌则须防感情纠纷与官非口舌,行事尤须守正。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['公关权变之才与竞争型舞台', '感情课题与法纪底线并提'],
      nuance: ['桃花指人际魅力,不必然指感情混乱', '化忌年防讼防情伤,平时以制度自守'],
      avoid: ['不可断言必有婚外情或官司', '避免污名化桃花特质'],
    },
  }),
  entry({
    id: 'star.tianfu.soul',
    domain: 'star',
    entities: ['tianfuMaj', 'soulPalace'],
    topics: ['overview', 'wealth'],
    summary: '天府坐命,稳健保守善理财,库星气度,守成有余开创不足。',
    detail:
      '天府为南斗令主、财库之星,坐命者稳重宽厚、组织管理力佳,善积蓄善守成,处世重体面与安全感。课题在保守:求稳怕变,易错失开创机会,且爱面子而务虚礼。得禄则库中有实、富足安泰;无禄逢空劫为空库露库,防外强中干、虚有其表。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['管理守成与财务稳健之才', '库星得禄与否定虚实'],
      nuance: ['保守是风格,配置得当亦是优势', '空库之断须见禄存化禄与空劫会照再下'],
      avoid: ['不可断言必富', '避免"平庸无成"的贬断'],
    },
  }),
  entry({
    id: 'star.taiyin.soul',
    domain: 'star',
    entities: ['taiyinMaj', 'soulPalace'],
    topics: ['overview', 'wealth'],
    summary: '太阴坐命,阴柔细腻重审美,富星利积蓄置产,夜生人庙旺尤佳。',
    detail:
      '太阴为富星、田宅主,坐命者温文内敛、心思细腻,有审美与文艺气质,善储蓄理财、与不动产有缘;与母亲、女性长辈缘分深。庙旺(夜生人更应)清秀聪慧、财源细水长流;落陷或逢化忌则多愁善感、情绪内耗,并须留意与母系亲缘的聚散课题。会昌曲更添文雅之才。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['理财置产的细水长流之道', '审美文艺特质的发挥'],
      nuance: ['庙旺落陷与昼夜生人须并看', '内敛多思是深度也是内耗,视会照定调'],
      avoid: ['不可断"与母无缘"之类绝语', '避免把阴柔说成软弱'],
    },
  }),
  entry({
    id: 'star.tanlang.soul',
    domain: 'star',
    entities: ['tanlangMaj', 'soulPalace'],
    topics: ['overview', 'career', 'fortune'],
    summary: '贪狼坐命,多才多艺欲望强,交际桃花俱旺,贵在专注一门。',
    detail:
      '贪狼为欲望之星、第一桃花,坐命者多才多艺、兴趣广博,交际应酬如鱼得水,敢要敢争,机会嗅觉敏锐。课题在贪多不专:样样通样样松,并须节制酒色财气。会火铃成火贪铃贪,主横发爆发力;逢空曜反主淡欲,转向专注与玄学修养;逢化忌则防因欲望与人际生纷扰。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['多元才艺与人脉变现', '专注深耕作为破局关键'],
      nuance: ['桃花主人缘魅力,层次依会照定', '逢空反成脱俗向学,是转化非破败'],
      avoid: ['不可鼓动投机与酒色', '避免"贪"字的道德化批判'],
    },
  }),
  entry({
    id: 'star.jumen.soul',
    domain: 'star',
    entities: ['jumenMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '巨门坐命,口才犀利研究心重,是非随口舌来,宜以口为业。',
    detail:
      '巨门为暗星,主口舌,坐命者口才好、观察入微、研究心与疑心并重,凡事求真不轻信。是非常因言语而起:说者无心听者有意。宜教学、法律、传媒、销售等以口为业,将口舌转为专业话语权。化权化禄则言之有物、以口生财;化忌则防祸从口出、招惹诽谤,谨言为要。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['以口为业的职业转化', '深研求证的专业潜质'],
      nuance: ['是非之断重在沟通习惯,可修正非注定', '疑心一体两面:严谨或多疑,看会照'],
      avoid: ['不可断言"一生是非不断"', '避免把暗星讲成阴暗人格'],
    },
  }),
  entry({
    id: 'star.tianxiang.soul',
    domain: 'star',
    entities: ['tianxiangMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '天相坐命,端正持重乐于辅佐,印星重承诺,受夹环境定成色。',
    detail:
      '天相为印星,主辅佐与公正,坐命者仪表端正、处事持平,重承诺讲信用,有服务与调和之才,宜行政幕僚、司法辅助等掌印之职。性随环境而变是其特质:府相朝垣、财荫夹印则贵而有担当;刑忌夹印则防代人受过、为人作保受累。开创性稍弱,宜借平台成事。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['辅佐执行与公信力', '夹宫与会照对格局的决定性影响'],
      nuance: ['天相如印随主,断语必须结合邻宫与对宫', '忠诚服务是才干,勿贬为没主见'],
      avoid: ['不可脱离夹宫环境孤立论吉凶', '避免"一生为人作嫁"的消极断语'],
    },
  }),
  entry({
    id: 'star.tianliang.soul',
    domain: 'star',
    entities: ['tianliangMaj', 'soulPalace'],
    topics: ['overview', 'career', 'fortune'],
    summary: '天梁坐命,老成持重有荫庇,逢凶化吉,好照顾人亦好说教。',
    detail:
      '天梁为荫星、寿星,坐命者心性老成、有原则重道义,乐于照顾提携他人,遇难常有长辈贵人化解,与医药、法务、公教、公益有缘。荫的代价是先历风波后得解,故人生多有考验;又好为人师,须防说教惹嫌。会太阳则名声清显;加煞则防揽事过多、忧人之忧。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['化解与荫人之才,医药法务公职适性', '先波折后化解的叙事节奏'],
      nuance: ['荫星之吉常以先经事端为前提,勿只报喜', '说教倾向宜温和点出'],
      avoid: ['不可断为"一生多灾"', '避免夸大逢凶化吉为百无禁忌'],
    },
  }),
  entry({
    id: 'star.qisha.soul',
    domain: 'star',
    entities: ['qishaMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '七杀坐命,肃杀果决独当一面,开创将才,人生起伏大宜专精。',
    detail:
      '七杀为将星,坐命者眼神锐利、决断力强,敢冲敢拼、不耐束缚,遇压力反激斗志,宜军警、外科、工程、开创性事业独当一面。课题在起伏与孤克:大起大落、亲缘偏淡、易硬碰硬。会禄存化禄则化杀为权、成就可观;逢煞忌交冲则防冲动决策与意外损伤,谋定后动为要。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['开创决断之才与专业深耕', '波动人生的风控与留后路'],
      nuance: ['孤克指风格独立,亲缘宜距离美学经营', '化杀为权须见禄权吉扶方论'],
      avoid: ['严禁"七杀命硬克亲"式恐吓', '不可断言必大起大落破败'],
    },
  }),
  entry({
    id: 'star.pojun.soul',
    domain: 'star',
    entities: ['pojunMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '破军坐命,敢破敢立冲劲十足,耗星波动大,先破后成之格。',
    detail:
      '破军为耗星,主破旧立新,坐命者胆识过人、不满现状,敢于推翻重来,变动是其常态,宜开创、改革、拆旧建新之业。课题在耗:体力、钱财、人际皆易大进大出,善始而难善终。得化禄或会禄则破中有立、愈挫愈勇,先破后成;逢空劫煞忌则耗损加剧,须设止损、留后路。',
    source: srcs.wenda,
    confidence: 0.7,
    guidance: {
      focus: ['破局开创之才与变革型舞台', '止损机制与善终收尾的修炼'],
      nuance: ['波动是特质,配套风控即成开创优势', '得禄与否是先破后成或屡破难成的分野'],
      avoid: ['不可断言"一生破败六亲无靠"', '避免劝其压抑冲劲的一刀切建议'],
    },
  }),
];
