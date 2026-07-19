/**
 * 格局解读补充条目(8 条):对应 @ziwei/core patterns.ts 起步格局库中
 * 除 huo-tan、jiyue-tongliang(curated.ts 已收)之外的 8 个格局。
 *
 * 内容三段式:成就方向 / 成格条件下的发挥 / 破格时如何解读。
 * 破格 = 打折与课题提示,不作凶断。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const PATTERN_EXTRA_ENTRIES: KnowledgeEntry[] = [
  entry({
    id: 'pattern.zifu-tonggong',
    domain: 'pattern',
    entities: ['pattern', 'zifu-tonggong'],
    topics: ['overview', 'career', 'wealth'],
    summary: '紫府同宫格:福厚稳贵之局,宜大机构掌管理财政,成格者步步高升、终身有靠。',
    detail:
      '紫微天府同守命宫(寅申),帝座与库星并临,古断终身福厚。成就方向在管理与财政:大机构、公职、金融地产,以稳步累积成其厚福。成格(辅弼昌曲会照、三方见化禄)则统御与守成兼备,位望与家底同步增长,是典型的「大树型」人生。破格(空劫入命、三方见忌)解读为福厚打折:资源仍在而留存不易、位高而实权虚,课题在避免自满守旧、慎防理想化投资掏空库藏,宜以制度与专业守其成。',
    source: srcs.quanshu('紫府同宫,终身福厚'),
    confidence: 0.8,
    guidance: {
      focus: ['大平台管理与财务方向', '稳健累积型的发展节奏'],
      nuance: ['成格与否看辅弼昌曲禄之会照,福厚是倾向不是保证'],
      avoid: ['不可断言必大富大贵', '破格不可说成福尽或败局'],
    },
  }),
  entry({
    id: 'pattern.ling-tan',
    domain: 'pattern',
    entities: ['pattern', 'ling-tan'],
    topics: ['wealth', 'fortune', 'career'],
    summary: '铃贪格:暗燃型爆发之局,将相之名,蓄力持久、发则功成名就,防发后松懈。',
    detail:
      '贪狼守命而铃星同宫或会照,古称将相之名。与火贪之明爆不同,铃贪是暗燃蓄力型爆发:成就方向在需要长期布局后一举而起的领域——竞争性事业、武职纪律部队、市场卡位战。成格(同宫、贪狼庙旺)则韧性与爆发兼具,发迹常在蛰伏多年之后,且较火贪更能持盈。破格(空劫同宫)解读为蓄力易泄:布局常被打断、临门差一脚,课题在分段兑现成果、不押单一大局,爆发力仍在,须配风险缓冲。',
    source: srcs.quanshu('铃贪相遇,将相之名'),
    confidence: 0.8,
    guidance: {
      focus: ['长期蓄力后的爆发窗口', '发后持盈与阶段性落袋'],
      nuance: ['铃贪较火贪沉稳,同宫强于会照'],
      avoid: ['不可解读为投机暴富暗示', '破格不可断为一事无成'],
    },
  }),
  entry({
    id: 'pattern.shizhong-yinyu',
    domain: 'pattern',
    entities: ['pattern', 'shizhong-yinyu'],
    topics: ['career', 'overview'],
    summary: '石中隐玉格:巨门子午守命,才华内蕴、大器晚成,以专业口才琢玉成器。',
    detail:
      '巨门守命于子午,如玉藏石中,须经琢磨方显光华。成就方向在以口与脑立业:法律、教学、传播评论、医药研究,才华早年不显、随资历发酵,属典型晚成之局。成格(巨门化禄化权、禄存会照)则暗曜转明,言语生财、以专业权威服众,中年后声价日隆。破格(巨门化忌、四煞同宫)解读为琢玉受阻:才华仍在而口舌是非增多、被认可的周期更长,课题在谨言慎行、把锋芒收进专业里,玉不弃琢终能成器,勿因早年不遇而自弃。',
    source: srcs.gusui('子午巨门,石中隐玉'),
    confidence: 0.8,
    guidance: {
      focus: ['专业深耕与口才立业', '晚成节奏的心理建设'],
      nuance: ['「隐玉」重在琢磨过程,早年平淡属格局常态'],
      avoid: ['不可因化忌断言是非缠身一生', '避免催促早发的功利话术'],
    },
  }),
  entry({
    id: 'pattern.rizhao-leimen',
    domain: 'pattern',
    entities: ['pattern', 'rizhao-leimen'],
    topics: ['career', 'overview', 'fortune'],
    summary: '日照雷门格:太阳卯宫守命,朝阳东升,名声贵显之局,宜公众舞台与清贵之途。',
    detail:
      '太阳守命于卯,旭日照于雷门(卯为震位),古断富贵荣华。成就方向在名声与公众事务:政务公职、传媒讲台、品牌代言人型角色,以光与声望带动利禄,贵先于富。成格(阳梁同宫、昌曲会照、太阳化禄)则声名与实利兼收,愈公开透明的舞台愈能发挥,并有荫人之量。破格(空劫同宫、太阳化忌)解读为光耀打折:名声仍有而是非随之、施多得少,课题在避免过度曝光与揽事,聚光灯下立好边界,光热用于照人而不灼己。',
    source: srcs.quanshu('日照雷门,富贵荣华'),
    confidence: 0.8,
    guidance: {
      focus: ['公众性舞台与名声资产', '以名带利的路径'],
      nuance: ['此格贵重于富,收入未必与名声同步'],
      avoid: ['不可断言必然大贵', '破格不可说成身败名裂'],
    },
  }),
  entry({
    id: 'pattern.yangliang-changlu',
    domain: 'pattern',
    entities: ['pattern', 'yangliang-changlu'],
    topics: ['career', 'overview'],
    summary: '阳梁昌禄格:考试功名第一格,利学历考铨与专业资格,以文取贵之正途。',
    detail:
      '太阳、天梁、文昌会于三方四正,再得禄存或化禄,古谓胪传第一名。成就方向在以考试与学术资格晋身:升学深造、公职考铨、专业执照(法、医、会计)、学术研究,是斗数中最利「正途功名」之格。成格(俱全会照,命居卯位尤佳)则逢考有利、以文凭与专业清誉步步高升,宜终身学习持续兑现此格。破格(化忌冲破)解读为功名多一番波折:考运起伏、文书专业易出纰漏,课题在多留备案、重视复核,格局底子仍在,失利属延迟而非无缘,再试常有转机。',
    source: srcs.gusui('阳梁昌禄,胪传第一名'),
    confidence: 0.8,
    guidance: {
      focus: ['考试深造与专业资格路线', '以学历执照为杠杆的晋升'],
      nuance: ['禄之来源(禄存/化禄)与会照完整度决定成色'],
      avoid: ['不可保证考试必中', '破格不可断为与功名无缘'],
    },
  }),
  entry({
    id: 'pattern.shapolang',
    domain: 'pattern',
    entities: ['pattern', 'shapolang'],
    topics: ['career', 'fortune', 'overview'],
    summary: '杀破狼格:变动开创之局,人生起伏节奏鲜明,宜在变局中建功,忌以静求安。',
    detail:
      '七杀、破军、贪狼守命,三方必成杀破狼之局,主变动与开创,是动局而非凶局。成就方向在变动性强的领域:创业开拓、业务市场、军警武职、技术转型,人生以数次大转折推进,每逢大运引动常换跑道再上层楼。成格(化禄会照动中得财、辅弼相助)则每次变动皆是跃升,愈动愈旺。所谓破格(三方会四煞)解读为波动加剧而非格局被毁:转折更频、成本更高,课题在为每次变动预留粮草、变前谋定,切忌因怕动而强守静态安稳,那反违此格之性。',
    source: srcs.quanshu(),
    confidence: 0.8,
    guidance: {
      focus: ['变动窗口的主动运用', '转折期的资源与退路规划'],
      nuance: ['杀破狼主动不主凶,会煞是波动放大器'],
      avoid: ['不可渲染一生动荡的恐吓话术', '不可劝其一味求稳压抑开创性'],
    },
  }),
  entry({
    id: 'pattern.junchen-qinghui',
    domain: 'pattern',
    entities: ['pattern', 'junchen-qinghui'],
    topics: ['career', 'overview'],
    summary: '君臣庆会格:紫微得辅弼朝拱,才擅经邦,统御大局之贵格,成在得人。',
    detail:
      '紫微守命而左辅右弼会于三方四正,君得良臣,古断才擅经邦。成就方向在统领组织与经营大局:企业经营、机构首长、政务领导,其才不在单打独斗而在聚人成事。成格(再得魁钺昌曲会照)则文武百官齐备,决策有谋、执行有人,格局随平台放大,是十四主星格局中最重「团队」者。破格(煞星空劫入命)解读为君在而臣散有扰:领导欲仍强而助力打折、易遇用人之失,课题在识人授权与自我节制,先修带人之德,庆会之局仍可后天补足于择伴择将。',
    source: srcs.quanshu('君臣庆会,才擅经邦'),
    confidence: 0.8,
    guidance: {
      focus: ['组织统御与团队建设', '平台选择对格局的放大作用'],
      nuance: ['此格成色全看辅佐之众寡与忠良'],
      avoid: ['不可断言必居高位', '破格不可说成众叛亲离'],
    },
  }),
  entry({
    id: 'pattern.qisha-chaodou',
    domain: 'pattern',
    entities: ['pattern', 'qisha-chaodou'],
    topics: ['career', 'fortune'],
    summary: '七杀朝斗格:七杀寅申子午守命,爵禄荣昌,将星得位,宜独当一面攻坚建功。',
    detail:
      '七杀守命于寅申子午,朝斗仰斗,将星得位,古断爵禄荣昌。成就方向在独当一面的开拓与攻坚:创业统兵、开疆型高管、工程实业、纪律部队,人生常以一场硬仗定江山,大器可期而路径带锋。成格(禄存或化禄会照)则杀得禄养,冲劲有了粮草与回报,攻坚之功转为爵禄之实,威权与实利并至。破格(空劫同宫、化忌冲照)解读为将在阵而粮道受扰:冲劲仍烈而成果易漏损、起伏加大,课题在选对战场、控制杠杆、一次只打一场硬仗,锋刃配上纪律,朝斗之势依然可用。',
    source: srcs.gusui('七杀朝斗,爵禄荣昌'),
    confidence: 0.8,
    guidance: {
      focus: ['攻坚型事业与关键一役', '禄之会照决定成果留存'],
      nuance: ['朝斗以得禄为贵,无禄则功大赏薄'],
      avoid: ['不可渲染刀光血光式恐吓', '破格不可断为劳而无功一生'],
    },
  }),
];
