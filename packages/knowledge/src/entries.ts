/**
 * 起步知识条目(示范全字段规范;内容骨架目标 300 条,见设计文档 §6.3)。
 *
 * 入库规范:LLM 可生成初稿(draft),但升为 reviewed/verified 必须过人工审核;
 * verified 条目在 CI 中不可被静默修改。
 */
import type { KnowledgeEntry } from './schema.js';

export const STARTER_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'star.ziwei.soul',
    domain: 'star',
    entities: ['ziweiMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    content: {
      summary: '紫微坐命,气度尊贵,有领导欲与责任感,喜掌权受敬。',
      detail:
        '紫微为帝座,坐命之人自尊心强、有组织统御之才,行事求体面,耐压性好;但需百官朝拱方显格局,孤君无辅则流于自负固执。宜往管理、统筹方向发展。',
      guidance: {
        focus: ['领导与统筹潜质', '责任感与格局大小取决于辅佐会照'],
        nuance: ['需结合左辅右弼、魁钺昌曲会照与否判断成色'],
        avoid: ['不可断言必然大富大贵', '避免"帝王命"式夸大话术'],
      },
    },
    source: { level: 'annotated', ref: '《紫微斗数全书》卷二·诸星问答论', school: 'sanhe' },
    confidence: 0.85,
    reviewStatus: 'reviewed',
  },
  {
    id: 'star.tanlang.wealth',
    domain: 'star',
    entities: ['tanlangMaj', 'wealthPalace'],
    topics: ['wealth'],
    content: {
      summary: '贪狼坐财帛,财源多元善交际取财,得火铃则有横发之象。',
      detail:
        '贪狼为欲望之星、第一偏财星,坐财帛宫者善应酬、路子广,财来路径多元;会火星铃星成火贪/铃贪,主爆发之财,但须防横发横破;会空劫则财来财去。',
      guidance: {
        focus: ['多元收入与人脉变现', '火铃同会时的爆发与回落并陈'],
        nuance: ['横发之后的守成建议要给足'],
        avoid: ['不可鼓动投机赌博'],
      },
    },
    source: { level: 'annotated', ref: '《紫微斗数全书》:「贪狼火星居庙旺,名镇诸邦」', school: 'sanhe' },
    confidence: 0.8,
    reviewStatus: 'reviewed',
  },
  {
    id: 'mutagen.ji.spouse',
    domain: 'mutagen',
    entities: ['sihuaJi', 'spousePalace'],
    topics: ['marriage'],
    content: {
      summary: '生年忌入夫妻宫,感情多有执念与磨合课题,宜晚婚缓进。',
      detail:
        '化忌为执着、亏欠之象,入夫妻宫主对感情在意而易生纠结,相处需刻意经营;并非必然离异之断,重在沟通模式与节奏。看具体何星化忌再细化:如巨门忌重口舌,太阴忌重情绪暗涌。',
      guidance: {
        focus: ['经营与沟通建议', '何星化忌决定课题类型'],
        nuance: ['忌=在意/执着,不等于凶断'],
        avoid: ['严禁"必离婚""婚姻必败"等宿命论断言'],
      },
    },
    source: { level: 'modern', ref: '近人四化释义通说(参考中州派讲义)', school: 'zhongzhou' },
    confidence: 0.7,
    reviewStatus: 'reviewed',
  },
  {
    id: 'pattern.huo-tan',
    domain: 'pattern',
    entities: ['pattern', 'huo-tan'],
    topics: ['wealth', 'fortune'],
    content: {
      summary: '火贪格:横发之局,机遇来时爆发力强,须防发后骤落。',
      detail:
        '贪狼守命而火星同宫或会照,古称"名镇诸邦"。主机遇型爆发——行运引动时进财、成名迅速;但横发格局共同课题是"守成":发后需落袋、置产、降杠杆。见空劫或贪狼化忌则破格,爆发力打折且回落风险高。',
      guidance: {
        focus: ['机遇窗口与行动力', '横发后的守成策略'],
        nuance: ['同宫强于会照;贪狼庙旺者格局更高'],
        avoid: ['不可解读为赌博暴富暗示'],
      },
    },
    source: { level: 'classic', ref: '《紫微斗数全书》:「贪狼火星居庙旺,名镇诸邦」' },
    confidence: 0.9,
    reviewStatus: 'verified',
  },
  {
    id: 'pattern.jiyue-tongliang',
    domain: 'pattern',
    entities: ['pattern', 'jiyue-tongliang'],
    topics: ['career', 'overview'],
    content: {
      summary: '机月同梁格:稳定谋略之局,宜体制、幕僚、专业深耕。',
      detail:
        '机、月、同、梁会于三方四正,古断"作吏人"。此格之才在企划、协调、流程与文书,适合大机构、公职、专业路线稳步晋升;不宜孤注一掷式创业。昌曲会照更利考试文职。',
      guidance: {
        focus: ['体制内/大平台发展路径', '谋定后动的决策风格'],
        nuance: ['"吏人"取其稳定辅佐之义,勿贬义化'],
        avoid: ['不可断言"不能创业",应表述为风格适配'],
      },
    },
    source: { level: 'classic', ref: '《紫微斗数全书》:「机月同梁作吏人」' },
    confidence: 0.9,
    reviewStatus: 'verified',
  },
  {
    id: 'mutagen.lu.career',
    domain: 'mutagen',
    entities: ['sihuaLu', 'careerPalace'],
    topics: ['career', 'wealth'],
    content: {
      summary: '生年禄入官禄宫,事业上得资源缘分,凭本业生财。',
      detail:
        '化禄为缘分与资源之象,入官禄宫者事业路径较顺,易得机会与回报,适合把重心放在主业深耕;何星化禄决定得禄方式:武曲禄重财务与执行,贪狼禄重人际与市场。',
      guidance: {
        focus: ['主业深耕与资源转化', '结合化禄之星细化得禄方式'],
        nuance: ['禄主机会与缘分,不等于不劳而获'],
        avoid: ['避免"躺赢"式表述'],
      },
    },
    source: { level: 'modern', ref: '近人四化释义通说', school: 'zhongzhou' },
    confidence: 0.7,
    reviewStatus: 'reviewed',
  },
  {
    id: 'combination.empty-soul-borrow',
    domain: 'combination',
    entities: ['emptyPalace', 'soulPalace'],
    topics: ['overview'],
    content: {
      summary: '命宫无主星,借对宫论命,性格随环境塑形、可塑性强。',
      detail:
        '命无正曜者以迁移宫主星借入论之,兼看命宫内辅杂曜定基调。此类命主受环境与际遇影响大,早年漂泊感较明显,宜借势平台与贵人;断语强度应整体下调一档。',
      guidance: {
        focus: ['环境选择与平台借力'],
        nuance: ['借宫论断强度弱于本宫坐星,措辞相应放轻'],
        avoid: ['"命弱""无命"等错误概念'],
      },
    },
    source: { level: 'modern', ref: '通行借宫论命口径(各派共识)' },
    confidence: 0.75,
    reviewStatus: 'reviewed',
  },
];
