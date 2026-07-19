/**
 * 十四辅曜/煞曜坐命宫(14 条)。
 *
 * 辅星写其助力与才性;煞星(羊陀火铃空劫)写成「课题与动力」——
 * 指出能量的正用出口,不作恐吓式凶断。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const MINOR_SOUL_ENTRIES: KnowledgeEntry[] = [
  entry({
    id: 'minor.zuofu.soul',
    domain: 'star',
    entities: ['zuofuMin', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '左辅坐命,敦厚稳重、乐于助人,善居辅佐高位,得众人之力。',
    detail:
      '左辅为帝极主宰之辅善之星,坐命者性情敦厚、行事稳当,天生有成人之美的气质,人缘与助力俱佳,宜居副手、幕僚长、营运统筹等一人之下的关键位置,愈能成事。与右弼对照同会更增气势;若命宫主星孱弱而仅辅星独守,则须防一生多为他人作嫁,宜择明主良台而辅之。',
    source: srcs.wenda,
    confidence: 0.72,
  }),
  entry({
    id: 'minor.youbi.soul',
    domain: 'star',
    entities: ['youbiMin', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '右弼坐命,机智圆融、热心慷慨,多暗中贵人,人缘中略带桃花。',
    detail:
      '右弼与左辅同为辅弼之曜,坐命者聪明机变、待人热忱,擅长在幕后疏通协调,常得不显山露水的贵人之助,宜公关协调、人资幕僚、跨部门整合之职。其助力偏「暗中成事」,与左辅之明助相映;人缘佳而稍带桃花之缘,感情上宜专注经营,避免暧昧不明。',
    source: srcs.wenda,
    confidence: 0.72,
  }),
  entry({
    id: 'minor.wenchang.soul',
    domain: 'star',
    entities: ['wenchangMin', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '文昌坐命,科甲正途之星,聪明好学、条理清晰,利考试文凭与文书。',
    detail:
      '文昌属金,司科甲文墨,坐命者反应敏捷、学习力强,长于文字、逻辑与规范化表达,考试运与文书缘俱佳,宜学术、文职、法务合约、编辑出版等正途晋身。庙旺遇吉则金榜题名之象;落陷或化忌则须防文书疏失、证照合约出错,以及聪明外露而流于形式,治学贵在深耕。',
    source: srcs.wenda,
    confidence: 0.72,
  }),
  entry({
    id: 'minor.wenqu.soul',
    domain: 'star',
    entities: ['wenquMin', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '文曲坐命,异途才艺之星,口才表达与艺术天分俱佳,人缘桃花并至。',
    detail:
      '文曲属水,司异途功名与口舌才艺,坐命者能言善道、感受力强,音乐、表演、书画、口语传播等才艺易见亮点,宜以口才与才艺立身之业。与文昌之「正途笔墨」相对,文曲偏灵感与表达;吉会则辩才无碍名声远播,煞忌扰则防巧言招怨、感情多彩多折,才艺沉淀为专业方是长久之计。',
    source: srcs.wenda,
    confidence: 0.72,
  }),
  entry({
    id: 'minor.lucun.soul',
    domain: 'star',
    entities: ['lucunMin', 'soulPalace'],
    topics: ['overview', 'wealth'],
    summary: '禄存坐命,天禄之星,勤俭稳健、善聚财自守,羊陀相夹主自立。',
    detail:
      '禄存为天禄之星,坐命者踏实勤勉、量入为出,理财保守而能积少成多,一生衣食有靠,宜稳健行业与长期累积型的财务路径。禄存必为擎羊陀罗所夹,主早年多靠自己、亲缘助力有限,性格独立而略显谨慎;吉会化禄或天马(禄马交驰)则财源活络,须防之处在过度节俭与守财固执,财活则人活。',
    source: srcs.wenda,
    confidence: 0.72,
  }),
  entry({
    id: 'minor.tianma.soul',
    domain: 'star',
    entities: ['tianmaMin', 'soulPalace'],
    topics: ['overview', 'career', 'fortune'],
    summary: '天马坐命,驿马好动、志在远方,利外出发展与流通之业,逢禄则禄马交驰。',
    detail:
      '天马为驿动之星,只入寅申巳亥四马之地,坐命者闲不住、乐于走动求变,离乡背井反得发展,宜贸易物流、外派差旅、运输旅游等流通行业。会禄存或化禄成禄马交驰,愈动愈发财;逢空亡或空劫则防为动而动、奔波无功,行前定目标、动中有章法,是此星正用之诀。',
    source: srcs.modern('天马四马之地驿动通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'minor.qingyang.soul',
    domain: 'star',
    entities: ['qingyangMin', 'soulPalace'],
    topics: ['overview', 'career', 'health'],
    summary: '擎羊坐命,行动力强带刚烈,竞争心是其动力,宜技术、竞技、外科泄其锐。',
    detail:
      '擎羊为刑星,坐命者性刚果决、敢冲敢抢、不服输,这股锐气正是其成事的引擎——课题在于出口:宜军警、外科、机械技术、竞技体育、开拓型业务等「见真章」的领域,让刀锋向事不向人。庙地(辰戌丑未)其力尤能建功,古有权刑之贵;失陷或煞忌迭并时须防冲动伤人伤己、意外磕碰,学会踩刹车与复盘,刚烈即成担当。',
    source: srcs.wenda,
    confidence: 0.68,
  }),
  entry({
    id: 'minor.tuoluo.soul',
    domain: 'star',
    entities: ['tuoluoMin', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '陀罗坐命,能磨能扛、沉得住气,课题在拖延与纠结,宜深功夫领域见长。',
    detail:
      '陀罗为忌星,性主暗耗与缠磨,坐命者外静内韧、耐力过人,能在别人放弃处继续打磨,宜研发、工艺、精密技术、长期研究等需要「十年磨一剑」的深功夫领域,大器多晚成。其课题是拖延反覆、旧事萦怀:决策易在心里空转,情绪易翻旧帐;练习设期限、当断则断,把缠劲全数用在功夫上,便是此星最好的出路。',
    source: srcs.wenda,
    confidence: 0.68,
  }),
  entry({
    id: 'minor.huoxing.soul',
    domain: 'star',
    entities: ['huoxingMin', 'soulPalace'],
    topics: ['overview', 'career', 'fortune'],
    summary: '火星坐命,性急如火、爆发力强,速度是资产,会贪狼则成火贪横发之局。',
    detail:
      '火星为大杀将之一,坐命者反应快、行动烈、点火就着,这份爆发力在快节奏行业是稀缺资产:宜业务开拓、竞技、急救消防、抢时效的创意与媒体行业。与贪狼同会成火贪格,主机遇型爆发。其课题在耐性与善后:三分钟热度、发完即退是常见损耗,配以流程与团队补其收尾,快而能稳则百事可为。',
    source: srcs.wenda,
    confidence: 0.68,
  }),
  entry({
    id: 'minor.lingxing.soul',
    domain: 'star',
    entities: ['lingxingMin', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '铃星坐命,阴火沉燃,外冷内热、韧性持久,会贪狼成铃贪,宜专业深耕。',
    detail:
      '铃星与火星同为杀将而性质有别:火星明爆,铃星暗燃。坐命者外表沉静、内里炽热,记性久、韧性强,能打持久战,宜需要长期蓄力的技术、研究、纪律部队与幕后攻坚工作;与贪狼同会成铃贪格,有将相之名。其课题在情绪积压与记仇:火在心里烧久了伤己,宜有固定的宣泄与表达渠道,让暗火转为持续输出的功率。',
    source: srcs.wenda,
    confidence: 0.68,
  }),
  entry({
    id: 'minor.tiankui.soul',
    domain: 'star',
    entities: ['tiankuiMin', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '天魁坐命,天乙贵人,气质端正,多得长辈明面提携,考试求职常遇机缘。',
    detail:
      '天魁为阳贵之星,坐命者仪表端正、自带让人信任的气场,一生多逢明处的贵人:考试遇良师、求职遇伯乐、关键时刻有人开门引路,少年至中年应验尤明显。宜正规体系与讲声望的行业,善用师承与推荐之力。中年后贵人之力渐转为自身声望,届时提携后进,贵气方能续存;须防之处仅在习惯等贵人而怠于自强。',
    source: srcs.modern('天魁天钺贵人星通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'minor.tianyue.soul',
    domain: 'star',
    entities: ['tianyueMin', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '天钺坐命,玉堂贵人,亲和有魅力,机会多经人引荐暗中相助而来。',
    detail:
      '天钺为阴贵之星,与天魁相对:魁主明贵,钺主暗贵。坐命者温和亲切、人见人缓,机会常以介绍、内推、私下关照的形式到来,女性长辈与前辈之助尤多,宜重人脉口碑的行业如顾问、医护、服务与文教。其人缘中带柔性魅力,异性缘佳,分寸拿捏得宜则处处逢源;课题在避免过度依赖引荐,实力到位,贵人才引得动。',
    source: srcs.modern('天魁天钺贵人星通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'minor.dikong.soul',
    domain: 'star',
    entities: ['dikongMin', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '地空坐命,思想超脱不落俗套,精神性与原创力强,课题在落地与财务稳健。',
    detail:
      '地空为空亡之星,坐命者思维跳脱框架、不以世俗标准自缚,常于哲学、玄学、宗教、创意研发、前沿理论等「无中生有」的领域见其天分,精神世界丰盛。古有「半空折翅」之诫,今解为目标管理课题:构想多而落地少、财物易于无形中流失;学会把灵感写成计划、把收入设自动储蓄,空灵之才即成原创之器,不必以「命带空亡」自限。',
    source: srcs.modern('空劫二星通行释义(正用取其超脱创发)'),
    confidence: 0.65,
  }),
  entry({
    id: 'minor.dijie.soul',
    domain: 'star',
    entities: ['dijieMin', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '地劫坐命,反潮流的颠覆思维,敢逆势独行,课题在理财纪律与风险评估。',
    detail:
      '地劫为劫耗之星,坐命者天生反骨、不随大流,看法常与众相左,而这正是其价值所在:在创新创业、改革破局、另类艺术与新兴领域,颠覆性思维往往先人一步。其课题在财务与决策的波动:易大进大出、为理念孤注一掷;宜设风险上限、留安全垫,重大决定找一位务实的对照者把关。劫去浮财、留下真章,历练后常是独树一帜的开创者。',
    source: srcs.modern('空劫二星通行释义(正用取其颠覆开创)'),
    confidence: 0.65,
  }),
];
