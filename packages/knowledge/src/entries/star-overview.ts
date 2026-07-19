/**
 * 十四主星本质总述(14 条):五行、化气、象义、人物象。
 *
 * 出处统一取《紫微斗数全书》卷二·诸星问答论(annotated),confidence 0.75。
 * 不落宫位吉凶,仅述星曜本体之性,供各宫条目合成时作底色。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const STAR_OVERVIEW_ENTRIES: KnowledgeEntry[] = [
  entry({
    id: 'star.ziwei.overview',
    domain: 'star',
    entities: ['ziweiMaj'],
    topics: ['overview'],
    summary: '紫微:己土,化气为尊,北斗帝座,官禄主,象征统御格局与自尊。',
    detail:
      '紫微五行属己土,南北斗中天帝座,化气为尊,为官禄主。象义为权威、体面、格局与担当,能制化解厄、统领百曜;人物象为君主、领袖、机构首长与长官。其成色最重辅佐:得百官朝拱则尊而有为,孤君无辅则尊而少成,自尊心与面子亦是其一体两面。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.tianji.overview',
    domain: 'star',
    entities: ['tianjiMaj'],
    topics: ['overview'],
    summary: '天机:乙木,化气为善,智慧谋略之星,兄弟主,象征机变企划与善心。',
    detail:
      '天机五行属乙木,南斗第三星,化气为善,为兄弟主。象义为智慧、机变、企划与流转:心思灵动、举一反三,长于分析谋略与随机应变,亦主宗教哲思之缘;人物象为军师、幕僚、企划师、工程师与僧道。其才在动脑而不在掌权,过动则多思多虑、心绪不宁,是其两面。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.taiyang.overview',
    domain: 'star',
    entities: ['taiyangMaj'],
    topics: ['overview'],
    summary: '太阳:丙火,化气为贵,中天之曜,象征光明博爱、名声权贵,人物象为父与夫。',
    detail:
      '太阳五行属丙火,中天之主曜,化气为贵,司官禄。象义为光明、博爱、施而不受:热心公义、乐于照拂他人,主名声地位重于财禄;人物象为父亲、丈夫、儿子等阳性亲缘,以及长官、公众人物。其光随宫位昼夜盛衰:庙旺则贵显有为,失辉则劳心费力、施多得少,光耀与操劳一体两面。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.wuqu.overview',
    domain: 'star',
    entities: ['wuquMaj'],
    topics: ['overview'],
    summary: '武曲:辛金,化气为财,正财星、将星,象征刚毅执行与务实生财。',
    detail:
      '武曲五行属辛金,北斗第六星,化气为财,为财帛主,亦称将星。象义为刚毅、果决、务实、行动:短虑而勇于执行,以劳力与专业取财,理财观念强;人物象为财务人员、军警武职、工程技术与实业家,亦为寡宿之星,女命传统谓其刚。刚与孤为其课题,刚而有谋则财权并掌,刚而失衡则孤克少缘。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.tiantong.overview',
    domain: 'star',
    entities: ['tiantongMaj'],
    topics: ['overview'],
    summary: '天同:壬水,化气为福,福德主,象征安享协调、知足乐天,先难后易。',
    detail:
      '天同五行属壬水,南斗第四星,化气为福,为福德主。象义为福气、安享、协调、情趣:性情温和、与人无争,能解厄制化、逢凶化吉,重生活品味与精神安适;人物象为孩童、和事佬、服务与福利之人。福星之两面在「安逸」:得激发(如遇煞适度)则白手兴家而后享福,过安则少年志薄、坐享等成。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.lianzhen.overview',
    domain: 'star',
    entities: ['lianzhenMaj'],
    topics: ['overview'],
    summary: '廉贞:丁火,化气为囚,次桃花兼官禄主,象征是非权谋与才艺公关。',
    detail:
      '廉贞五行属丁火,北斗第五星,化气为囚,为官禄主,又号次桃花。象义最为多面:主权谋机变、是非官非、感情欲望与才艺公关,能邪能正,全视组合而定;人物象为政客、公关、纪律部队、电子与法务人员。得吉制化则精明干练、公门显达;失制则囚性外露,防是非纠缠与感情困扰,是十四主星中可塑性最大的一颗。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.tianfu.overview',
    domain: 'star',
    entities: ['tianfuMaj'],
    topics: ['overview'],
    summary: '天府:戊土,南斗主星,化气为令,财库之星,象征守成包容与稳健领导。',
    detail:
      '天府五行属戊土,南斗延寿之主星,化气为令,为财帛田宅之主,号为禄库。象义为库藏、守成、包容、秩序:领导风格稳健怀柔,与紫微之开创威权相对,主收纳与保有;人物象为财务主管、银行家、大管家与守成之主。库星之两面在「守」:有禄有吉则库实身安,空库无禄则外稳内虚,过守则趋于保守惜财。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.taiyin.overview',
    domain: 'star',
    entities: ['taiyinMaj'],
    topics: ['overview'],
    summary: '太阴:癸水,化气为富,田宅主,象征阴柔积蓄、洁净审美,人物象为母与妻。',
    detail:
      '太阴五行属癸水,中天之曜,与太阳相对,化气为富,为田宅主。象义为富藏、阴柔、洁净、审美:心思细腻、感受力强,主不动产与静态积蓄之财,重情调与内在世界;人物象为母亲、妻子、女儿等阴性亲缘。其光亦分盈亏:入庙(夜、亥子丑)则温润富足,失辉则多愁善感、与阴性亲缘之情较费经营。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.tanlang.overview',
    domain: 'star',
    entities: ['tanlangMaj'],
    topics: ['overview'],
    summary: '贪狼:甲木,化气为桃花,第一桃花星兼寿星,象征欲望多才、交际应酬。',
    detail:
      '贪狼五行属甲木(气化兼水),北斗第一星,化气为桃花,为祸福之主,亦是寿星。象义为欲望、才艺、交际、投机:多才多艺、八面玲珑,求知欲与物欲情欲俱盛,兼通神秘玄学之缘;人物象为公关、演艺、业务、玩家与酒国英豪。欲望为其引擎:得火铃激发则横发建功,逢煞忌失制则流连酒色财气,升降全在欲望之驾驭。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.jumen.overview',
    domain: 'star',
    entities: ['jumenMaj'],
    topics: ['overview'],
    summary: '巨门:癸水,化气为暗,口舌之星,象征言语是非、深究怀疑,以口为业。',
    detail:
      '巨门五行属癸水,北斗第二星,化气为暗,主是非。象义为口舌、怀疑、深究、遮蔽:口才犀利、观察入微、凡事追根究柢,暗曜之性使其易见事情阴暗面;人物象为律师、教师、评论者、主持、中医药与侦察人员。一口两用为其枢机:化禄化权则以口生财、以言立业,失制则口舌招尤、多疑寡信,善用其疑则成洞察。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.tianxiang.overview',
    domain: 'star',
    entities: ['tianxiangMaj'],
    topics: ['overview'],
    summary: '天相:壬水,化气为印,官禄主,宰相之星,象征辅佐公正、掌印重信。',
    detail:
      '天相五行属壬水,南斗第五星,化气为印,为官禄主,号为宰相之星。象义为印信、辅佐、公正、服务:处事持平、重承诺与形象,乐于扶弱济困,掌印而不僭主,是执行制度的干才;人物象为宰辅、秘书长、法官、管家与专业经理人。印星品质极受邻宫影响:财荫夹印则贵而得助,刑忌夹印则受制担过,故论天相必看其夹。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.tianliang.overview',
    domain: 'star',
    entities: ['tianliangMaj'],
    topics: ['overview'],
    summary: '天梁:戊土,化气为荫,寿星兼父母主,象征庇荫化解、清高监察。',
    detail:
      '天梁五行属戊土,南斗第二星,化气为荫,主寿,为父母主。象义为荫庇、化解、原则、清名:遇难呈祥、逢凶化吉是其本领,性喜照顾人、讲原则、好月旦人物,带宗教哲思与医药之缘;人物象为长者、监察官、法官、医者、师长。荫星之两面在「先历后解」:有灾方显其荫,故人生常见先经波折而后化解,清高过甚则孤芳少和。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.qisha.overview',
    domain: 'star',
    entities: ['qishaMaj'],
    topics: ['overview'],
    summary: '七杀:庚金,化气为杀(将星),象征肃杀威权、独当一面,成败起伏分明。',
    detail:
      '七杀五行属庚金(带火炼之性),南斗第六星,遇帝为权,号上将之星,化气为杀。象义为威权、肃杀、冲锋、独立:性刚急、目标明确、敢于独当一面,人生多亲力亲为、起伏分明,一生常有一次重大转折;人物象为大将、开拓者、外科医师、纪律部队。杀星之枢机在「有主无主」:得紫微同会则化杀为权,失制逢煞则劳碌冲撞,其威宜用于攻坚。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
  entry({
    id: 'star.pojun.overview',
    domain: 'star',
    entities: ['pojunMaj'],
    topics: ['overview'],
    summary: '破军:癸水,化气为耗,先锋之星,象征破旧立新、先破后成,主夫妻子女奴仆。',
    detail:
      '破军五行属癸水,北斗第七星,化气为耗,司夫妻、子女、奴仆之宿。象义为破坏、开创、变动、消耗:凡事先破后立,敢弃旧局、投入未知,体力行动力皆强,与七杀贪狼永成杀破狼之局;人物象为先锋、拆迁改革者、军警、创业者与海员。耗星之两面在「破与成」:得禄(化禄或禄存)则破中有建、开创有成,无禄逢煞则破耗劳碌,故破军喜禄最明。',
    source: srcs.wenda,
    confidence: 0.75,
  }),
];
