/**
 * 解读技法库(Reading Skills)——「怎么看盘」的规范化(L3/L4)。
 *
 * 每个技法定义:体用宫位、分析步骤(传统看盘次第)、断语纪律、专属输出结构。
 * 技法注入 System Prompt 后,LLM 按命理师的方法论看盘,而非自由发挥。
 * 方法论依据:《紫微斗数全书》看法体例、三合派通行技法、
 * 倪海夏《天纪》夫妻宫断语体系(参考王多鱼 heming-knowledge 整理)。
 */
import type { PalaceKey } from '@ziwei/core';
import type { Topic } from './schema.js';

export type SkillId = 'overall' | 'marriage' | 'career' | 'business' | 'education' | 'health' | 'wealth';

export interface ReadingSkill {
  /** 基础技法为 SkillId,进阶技法(skills-advanced.ts)扩展更多 id */
  id: string;
  name: string;
  /** 检索话题过滤 */
  topics: Topic[];
  /** 体用宫位(体=主看,用=参照) */
  corePalaces: PalaceKey[];
  /** 分析步骤(看盘次第) */
  method: string[];
  /** 断语纪律(该主题的红线与分寸) */
  cautions: string[];
  /** 专属输出结构 */
  outputStructure: string[];
}

export const READING_SKILLS: Record<SkillId, ReadingSkill> = {
  overall: {
    id: 'overall',
    name: '整体命格',
    topics: ['overview', 'career', 'wealth', 'marriage', 'health', 'family', 'fortune'],
    corePalaces: ['soulPalace', 'spiritPalace', 'surfacePalace'],
    method: [
      '以命宫及其三方四正定格局高低:主星组合、庙陷、吉煞会照、成格与破格',
      '命无正曜者借对宫论之,断语强度整体下调一档',
      '以生年四化定一生课题:禄=资源缘分所在,权=主导欲发挥处,科=声名贵人处,忌=执念与功课处',
      '福德宫看精神世界与福泽厚薄,迁移宫看外出际遇与环境助力',
      '身宫所落宫位定后天着力点(身在夫妻重情、身在官禄重业、身在财帛重财)',
    ],
    cautions: ['吉凶并陈,不做单边断言', '格局破格时先讲结构,再讲补救'],
    outputStructure: ['命格总断(150字内)', '性格与天赋', '一生课题(依生年四化)', '后天着力方向', '命格金句'],
  },
  marriage: {
    id: 'marriage',
    name: '姻缘婚恋',
    topics: ['marriage', 'family'],
    corePalaces: ['spousePalace', 'spiritPalace', 'childrenPalace'],
    method: [
      '以夫妻宫为体:主星定配偶类型与相处模式(空宫借对宫,借星断语减力)',
      '夫妻宫三方四正(官禄、迁移、福德)会吉会煞定婚姻质量走势',
      '查桃花星系:红鸾天喜主正缘婚庆,天姚咸池主情欲桃花,昌曲入夫妻主情趣',
      '生年四化入夫妻:禄=情缘深厚,权=配偶强势,科=相敬如宾,忌=执念纠结须经营',
      '宜晚婚判断:武曲、七杀、破军、廉贞、孤辰寡宿坐守夫妻宫者,晚婚为宜(30 岁后)',
      '婚期参考:大限流年四化引动夫妻宫、红鸾天喜被流年会照之年',
    ],
    cautions: [
      '严禁「必离婚/必二婚/克夫克妻」等宿命论断言,一律表述为课题与经营建议',
      '生离死别类古断(如廉贪、廉破)只作「须重视聚少离多风险」的现代化转译',
      '涉及第三者话题只讲风险防范,不做指控式推断',
    ],
    outputStructure: ['姻缘总论', '配偶画像与相处模式', '感情课题与经营之道', '婚期与时机参考', '一句叮咛'],
  },
  career: {
    id: 'career',
    name: '事业官禄',
    topics: ['career'],
    corePalaces: ['careerPalace', 'soulPalace', 'surfacePalace'],
    method: [
      '以官禄宫为体、命宫为根:官禄主星定行业气质与职场风格',
      '格局定路径:杀破狼利开创变动、机月同梁利体制幕僚、阳梁昌禄利考试文职公门、紫府武相利管理财经',
      '迁移宫看外出发展与平台,仆役宫看团队与贵人下属',
      '化权入官禄主掌实权,化科主专业名声,禄存化禄入官禄主职务生财,忌入官禄主事业执念与瓶颈课题',
      '大限流年四化引动官禄/命宫之年为事业变动窗口(升迁、转型、创业)',
    ],
    cautions: ['不断言「必升官/必失业」,以窗口期与适配度表述', '创业建议须结合财帛宫与空劫情况给风险提示'],
    outputStructure: ['事业总论', '适配赛道与职场风格', '贵人与团队', '事业窗口期', '行动建议'],
  },
  business: {
    id: 'business',
    name: '生意财运',
    topics: ['wealth', 'career'],
    corePalaces: ['wealthPalace', 'propertyPalace', 'careerPalace'],
    method: [
      '以财帛宫为体(进财方式)、田宅宫为库(守财置产):有财无库则重守成',
      '正财偏财定性:武曲天府太阴主正财稳进,贪狼廉贞主人际偏财,火贪铃贪主横发(须防横破)',
      '禄存天马同会为「禄马交驰」,主动中生财、异地生意',
      '地空地劫入财帛田宅主破耗,宜实业忌金融杠杆;化忌入财帛为守财执念课题',
      '生意合伙看仆役宫与兄弟宫(兄弟为财之库位、合伙气数)',
      '大限流年禄权引动财帛/田宅为进财置产窗口,忌冲为收缩窗口',
    ],
    cautions: ['严禁投机赌博暗示,横发格局必须同时讲守成', '杠杆与担保风险在空劫/忌出现时必须提示'],
    outputStructure: ['财运总论', '进财方式与赛道', '守财与置产', '合伙与风险提示', '财运窗口期'],
  },
  education: {
    id: 'education',
    name: '学业考运',
    topics: ['career', 'overview'],
    corePalaces: ['soulPalace', 'parentsPalace', 'spiritPalace'],
    method: [
      '以命宫三方为体,父母宫为文书宫(与师长缘分、升学文书)',
      '文昌文曲主聪明才学,化科主科甲声名,天魁天钺主考试贵人提携',
      '阳梁昌禄格为经典科甲格局,主考试竞争力强',
      '福德宫看定力与学习心性,天机巨门主思辨,太阴主沉静深研',
      '流年昌曲化科会命/父母之年,为考运佳期',
    ],
    cautions: ['考运佳期是助力不是保票,须落到方法与心态建议'],
    outputStructure: ['学业总论', '天赋科目与学习风格', '考运窗口', '方法建议'],
  },
  health: {
    id: 'health',
    name: '健康养生',
    topics: ['health'],
    corePalaces: ['healthPalace', 'soulPalace'],
    method: [
      '以疾厄宫为体:主星五行对应脏腑气质(如武曲金主肺气管、天同水主膀胱肾、廉贞火主心血循环)',
      '煞星入疾厄提示类型:擎羊主刀伤手术、火铃主炎症燥热、陀罗主慢性缠绵',
      '命宫与五行局定体质底色,福德宫看情志压力',
      '大限流年忌入疾厄之期,宜体检与作息调整',
    ],
    cautions: [
      '本节仅为传统命理的养生参考,严禁诊断疾病、预言病症、替代就医;所有提示均导向「注意体检/作息」',
    ],
    outputStructure: ['体质总论', '易感课题(养生视角)', '情志与作息', '养护建议(非医疗)'],
  },
  wealth: {
    id: 'wealth',
    name: '财帛理财',
    topics: ['wealth'],
    corePalaces: ['wealthPalace', 'propertyPalace', 'spiritPalace'],
    method: [
      '财帛宫定进财格局,田宅宫定库藏,福德宫定财商心态(敢不敢花、会不会享)',
      '化禄所在宫位为财源方向;禄存坐守主积蓄',
      '空劫忌所在为破耗口,理财上对应止损纪律',
    ],
    cautions: ['不构成投资建议,理财表述停留在纪律与结构层面'],
    outputStructure: ['财帛总论', '财源与积蓄', '破耗口与纪律', '理财建议(非投资指导)'],
  },
};

/** 技法 → Prompt 区块 */
export function buildSkillBlock(skill: ReadingSkill): string {
  return [
    `# 本次解读技法:${skill.name}`,
    `分析步骤(严格按次第执行):`,
    ...skill.method.map((m, i) => `${i + 1}. ${m}`),
    `断语纪律(不可违反):`,
    ...skill.cautions.map((c) => `- ${c}`),
  ].join('\n');
}
