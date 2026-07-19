/**
 * 十四主星 × 十一非命宫宫位条目(贪狼×财帛除外,已有 curated 条目 star.tanlang.wealth)。
 * 共 153 条;初稿 draft,升级须人工审核。
 */
import { entry } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const STAR_PALACE_ENTRIES: KnowledgeEntry[] = [
  // ── 紫微 ──────────────────────────────────────────
  entry({
    id: 'star.ziwei.siblings',
    domain: 'star',
    entities: ['ziweiMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '紫微在兄弟,手足有能者气度高,相处宜敬重其主见。',
    detail:
      '紫微入兄弟宫,兄弟姊妹中易有能力强、气派高之人,或长兄姊在家中有分量;手足自尊心强,相处以敬为先,硬压则生隙。会左辅右弼则得手足实质助力;孤君无辅或加煞,则各行其是、名分虽在而实助有限。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.ziwei.spouse',
    domain: 'star',
    entities: ['ziweiMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '紫微在夫妻,配偶气度佳主见强,相处易以对方为尊。',
    detail:
      '紫微入夫妻宫,配偶多自尊心强、有能力有气派,持家有主导欲;婚姻中易形成以对方为尊之势,己方须防被管束之感。宜配成熟稳重者或稍晚婚。会辅弼魁钺则配偶有成、婚姻得助;加煞则彼此争主导,宜先议分工。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.ziwei.children',
    domain: 'star',
    entities: ['ziweiMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '紫微在子女,子女聪慧主见强有领导气,教养忌高压。',
    detail:
      '紫微入子女宫,子女自尊心与主见俱强,聪慧而有领导气质,期望被尊重;高压式管教易硬碰硬。宜以商量代命令、给舞台立规则。会吉则子女有成、光耀门庭;加煞则防亲子间权力拉扯,青春期尤须留意沟通方式。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.ziwei.wealth',
    domain: 'star',
    entities: ['ziweiMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '紫微在财帛,财随地位职权而来,稳中求贵不主横财。',
    detail:
      '紫微入财帛宫,财源与地位、职权、体面相连,善统筹管钱,进财稳健而气派,不以横财论;好面子致排场开销亦大。会禄存化禄则财源厚实、愈居高位愈丰;逢空劫则名大于实、虚耗排场,理财宜落袋为安。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.ziwei.health',
    domain: 'star',
    entities: ['ziweiMaj', 'healthPalace'],
    topics: ['health'],
    summary: '紫微在疾厄,体质中平,注意脾胃消化与压力积劳。',
    detail:
      '紫微入疾厄宫,先天底子中上,少大凶之疾;传统应脾胃、消化系统与头面之症,凡事自扛的性格易致压力积劳、虚火上升。会吉扶则调养得宜、病来有医;加煞忌则防慢性肠胃病与劳累引发之疾,定期休整胜于硬撑。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.ziwei.surface',
    domain: 'star',
    entities: ['ziweiMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '紫微在迁移,出外得敬重有提携,宜大平台大城市发展。',
    detail:
      '紫微入迁移宫,出外受人敬重,易得上位者提携,离乡往大城市、大平台发展反开格局;在外重体面,交际开销不小。会辅弼魁钺则他乡显达、贵人成局;无辅弼相佐则在外虽有架子而少实援,宜主动经营人脉。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.ziwei.friends',
    domain: 'star',
    entities: ['ziweiMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '紫微在仆役,交友层次高遇强者,须防反受强友牵制。',
    detail:
      '紫微入仆役宫,朋友部属素质与地位偏高,能结识强者得其提点;然强人环伺,己方易居辅位、反受牵制,领导下属宜恩威并施。会左右昌曲则得得力班底与贵友;加煞则防功高之友夺主导,或为撑场面而多应酬破费。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.ziwei.career',
    domain: 'star',
    entities: ['ziweiMaj', 'careerPalace'],
    topics: ['career'],
    summary: '紫微在官禄,事业心强宜管理统筹,格局视辅佐会照。',
    detail:
      '紫微入官禄宫,事业企图心与责任感强,宜管理、统筹、公职或大企业发展,重职位名分。得左右魁钺昌曲会照则百官朝拱,位高权重可期;孤君无辅则易位高权轻、大志难伸,宜深耕专业实绩以补名分,忌好大喜功。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.ziwei.property',
    domain: 'star',
    entities: ['ziweiMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '紫微在田宅,喜体面居所置产运稳,家宅气派开销亦大。',
    detail:
      '紫微入田宅宫,置产眼光偏好地段与体面,家宅讲究气派整洁,不动产运稳健,亦主任职机构有规模。会禄存化禄则产业能置能守、家底渐厚;逢空劫则易为面子置产、维护开销沉重,买卖决策宜量力而为。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.ziwei.spirit',
    domain: 'star',
    entities: ['ziweiMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '紫微在福德,自尊自重求品位,好掌控致操心劳神。',
    detail:
      '紫微入福德宫,精神生活重品位与格调,自视高、求掌控,凡事想亲自过问,故心常操劳难得清闲;享受偏高消费亦讲派头。会吉则气定神闲、福厚有威仪;加煞忌则好胜心与完美主义致心神不宁,宜学授权与放手。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.ziwei.parents',
    domain: 'star',
    entities: ['ziweiMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '紫微在父母,父母有威严地位,家教严格易敬而生距。',
    detail:
      '紫微入父母宫,父母多有地位或威严,家教规矩重,能给资源亦给标准;子女对其常敬而远之,亲近感是课题。会吉则得父母荫助、家风有格;加煞则防两代主导权之争、以孝之名行控制,成年后立界限反能修好。',
    confidence: 0.62,
  }),

  // ── 天机 ──────────────────────────────────────────
  entry({
    id: 'star.tianji.siblings',
    domain: 'star',
    entities: ['tianjiMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '天机在兄弟,手足聪明各有主意,情缘多变宜智不宜合。',
    detail:
      '天机入兄弟宫,兄弟姊妹机敏各有盘算,往来时密时疏、聚散随人生阶段而变;以智相交可互为参谋,深度绑定的合伙则易生变数。会吉则手足有才、点拨互益;逢化忌加煞则防兄弟间口舌算计,钱财往来宜明算。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianji.spouse',
    domain: 'star',
    entities: ['tianjiMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '天机在夫妻,配偶机敏心思多,感情多虑宜晚婚勤沟通。',
    detail:
      '天机入夫妻宫,配偶聪明善谋、心思灵动,婚姻中双方皆易多想:小事反复推敲、情绪随念转。传统宜晚婚、或配年龄心性有差距者以增稳定。会吉则夫妻能共谋共进、以智持家;逢化忌则猜疑内耗升级,定期开诚沟通是解方。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianji.children',
    domain: 'star',
    entities: ['tianjiMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '天机在子女,子女聪明好动点子多,心性不定重在引导。',
    detail:
      '天机入子女宫,子女头脑灵活、好奇好问,点子层出;心性不定、兴趣转换快,教养重在引导专注而非压制好动。会昌曲则聪慧利学、举一反三;逢煞忌则防注意力分散与亲子多辩,宜以启发式对话代替说教。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianji.wealth',
    domain: 'star',
    entities: ['tianjiMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '天机在财帛,财由智取善企划生财,起伏流动不聚横财。',
    detail:
      '天机入财帛宫,以脑力、企划、技术与流通生财,财源灵活但进出快、起伏多,非稳积厚聚之象。宜以专业智财为本,忌频繁短线投机。会禄存化禄则智慧稳定变现、动中有积;逢空劫化忌则谋多成少、财来财去,须建立强制储蓄纪律。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianji.health',
    domain: 'star',
    entities: ['tianjiMaj', 'healthPalace'],
    topics: ['health'],
    summary: '天机在疾厄,注意肝胆神经与四肢,思虑过度损眠为源。',
    detail:
      '天机入疾厄宫,传统应肝胆、神经系统与四肢筋骨;用脑过度、思虑不休为主要病源,易见失眠、焦虑、头晕目涩。规律作息与放空练习可解大半。会吉则劳而能复;加煞忌则防肝气郁结、神经衰弱缠绵,宜及早调理勿硬撑。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianji.surface',
    domain: 'star',
    entities: ['tianjiMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '天机在迁移,出外多动多机遇,宜差旅外勤流动生计。',
    detail:
      '天机入迁移宫,主动中求变:离乡、差旅、外勤、流动性质的营生反得机会,环境变化是其养分;久守一地反闷。会吉化禄权则动中得财得名、越走越活;逢化忌则奔波劳碌而决策反复、劳多获少,出行前谋定方向再动。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianji.friends',
    domain: 'star',
    entities: ['tianjiMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '天机在仆役,交游广而流动快,益友多智囊合作宜明算。',
    detail:
      '天机入仆役宫,朋友圈流动性大,来往者多聪明善谋之士,可为智囊参谋;然交情深浅多变,共事宜先明规则。会吉昌曲则得谋士之助、集思广益;逢化忌则防被小聪明之人所误、或计划因人多口杂而反复,核心圈宜精不宜滥。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianji.career',
    domain: 'star',
    entities: ['tianjiMaj', 'careerPalace'],
    topics: ['career'],
    summary: '天机在官禄,宜企划技术咨询文教,职涯多变换跑道。',
    detail:
      '天机入官禄宫,才在动脑:企划、技术研发、咨询顾问、文教传播皆适性;职涯轨迹多转折,换跑道、跨领域是常态。会化权化禄昌曲则谋略见用、以智升迁;逢化忌则多谋寡断、频繁跳槽而根基难固,宜设最短深耕年限再论去留。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.tianji.property',
    domain: 'star',
    entities: ['tianjiMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '天机在田宅,家宅多迁动装修频,祖业难守宜自置。',
    detail:
      '天机入田宅宫,居所多变动:搬迁、换屋、装修改造频率高,祖业不易久守,置产宜靠自力且偏好机能灵活之居。会吉会禄则以眼光智选房产、越换越好;逢煞忌则家宅不宁、进出频繁徒耗成本,大宗交易宜多方查证缓决。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianji.spirit',
    domain: 'star',
    entities: ['tianjiMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '天机在福德,好学多思难安闲,福在求知须防虑多。',
    detail:
      '天机入福德宫,头脑不肯休息,好学好思、兴趣多元,精神之乐在求知与解题;但念头纷飞、难享清闲,睡前尤易翻搅。会昌曲化科则精神生活丰盈、以学养心;逢化忌则多虑失眠、自我怀疑,福分打折,静坐与运动是有效对治。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianji.parents',
    domain: 'star',
    entities: ['tianjiMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '天机在父母,两代缘分多变聚少,以理沟通可化分歧。',
    detail:
      '天机入父母宫,与父母缘分多变:或早年聚少离多,或两代想法多歧、各有道理;父母多为心思细、操心型。以理性沟通与定期问候维系,胜过朝夕相处的摩擦。会吉则父母明智开明、能给点拨;逢化忌则防代沟加深、彼此多虑,报喜也报忧反增互信。',
    confidence: 0.6,
  }),

  // ── 太阳 ──────────────────────────────────────────
  entry({
    id: 'star.taiyang.siblings',
    domain: 'star',
    entities: ['taiyangMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '太阳在兄弟,手足热心互动热络,己方多为付出一方。',
    detail:
      '太阳入兄弟宫,兄弟姊妹开朗热心、往来热络,传统尤应男性手足之缘;相处中己方常是出钱出力的付出方,施多受少。庙旺则兄弟有成、能相互提携增光;落陷或逢化忌则为手足操劳而回报有限,付出宜量力并留界限。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.taiyang.spouse',
    domain: 'star',
    entities: ['taiyangMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '太阳在夫妻,配偶开朗事业心强,光芒外露聚少防口角。',
    detail:
      '太阳入夫妻宫,配偶热情大方、事业心强、爱面子重形象,家中常一方光芒外露、一方配合;因忙于外务,易有聚少离多之感。庙旺则配偶有为、婚姻有光彩;落陷则防对方劳碌委屈、口角渐生,会吉可解,经营之道在把舞台也留给对方。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.taiyang.children',
    domain: 'star',
    entities: ['taiyangMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '太阳在子女,子女阳光外向好表现,为其付出甚多。',
    detail:
      '太阳入子女宫,子女性格开朗外向、好动好表现,有正义感与领袖气;父母为子女教育与前途投入甚多心力财力。庙旺则子女有出息、名声可期;落陷或逢忌则防热面冷心——付出多而互动浅,宜以陪伴代替供给。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.taiyang.wealth',
    domain: 'star',
    entities: ['taiyangMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '太阳在财帛,先名后利取财光明,施出多聚财力平平。',
    detail:
      '太阳入财帛宫,财因名声、公众形象与专业曝光而来,先有名后有利,取财路径光明磊落;然性喜慷慨、为人破费,聚财力一般。庙旺会禄则名利双收、财随声望水涨船高;落陷或逢化忌则劳多利少、防财务是非与滥慷慨,预算制可守成。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.taiyang.health',
    domain: 'star',
    entities: ['taiyangMaj', 'healthPalace'],
    topics: ['health'],
    summary: '太阳在疾厄,注意心血管血压眼目,劳碌透支为病源。',
    detail:
      '太阳入疾厄宫,传统应心血管、血压、头部与眼目之疾;性急劳碌、燃烧自己是主要病源,易见心火上炎、用眼过度。庙旺则体气旺盛、恢复力佳;落陷或逢化忌则须防眼疾、偏头痛与血压波动,规律作息与定期眼科心血管检查为要。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.taiyang.surface',
    domain: 'star',
    entities: ['taiyangMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '太阳在迁移,出外活跃得名声,宜抛头露面广结人缘。',
    detail:
      '太阳入迁移宫,出外比在家有舞台:人面广、名声扬,贵人多在外结识,宜业务、公关、传播等抛头露面之职,离乡发展有利。庙旺则他乡显达、声名远播;落陷则外务奔波劳碌、名声起落,会吉可减,宜择定主场深耕而非四处放光。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.taiyang.friends',
    domain: 'star',
    entities: ['taiyangMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '太阳在仆役,朋友众多往来热络,付出型人缘防好心遭怨。',
    detail:
      '太阳入仆役宫,朋友部属众多、往来热闹,己方乐于为友出力、照亮他人,是典型付出型人缘;帮忙成习惯后,边界感是课题。会吉则得众人拥戴、登高一呼有应;逢化忌加煞则防好心遭怨、替人扛责,帮急不帮穷、先说清再出手。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyang.career',
    domain: 'star',
    entities: ['taiyangMaj', 'careerPalace'],
    topics: ['career'],
    summary: '太阳在官禄,宜公职传播教育公众事务,重名多于重利。',
    detail:
      '太阳入官禄宫,事业属性向公众:公职、传播、教育、能源、公共事务皆适性,重名声成就感多于计较薪酬,做事有使命感。庙旺会权禄则事业显达、名位俱进;落陷则位与劳不相称、光环打折,宜转幕后专业或深耕小众领域立口碑。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.taiyang.property',
    domain: 'star',
    entities: ['taiyangMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '太阳在田宅,宜明亮向阳之居,祖业易散自兴为主。',
    detail:
      '太阳入田宅宫,居家宜采光充足、向阳明亮,家中人气旺、进出访客多;祖业易分易散,置产多靠自力更生。庙旺则自置有成、家宅兴旺;落陷或逢化忌则防不动产文书是非与家中男性长辈健康之忧,产权登记务求清楚。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyang.spirit',
    domain: 'star',
    entities: ['taiyangMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '太阳在福德,精神外放闲不住,以付出与被肯定为乐。',
    detail:
      '太阳入福德宫,精神能量外放,闲不下来,快乐来自付出、成就与被肯定,常为公众之事、他人之事操心;独处静养反觉空虚。庙旺则福气昂扬、越忙越有神采;落陷或逢化忌则心火重、操劳不安而乐少,宜练习把光也照向自己。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyang.parents',
    domain: 'star',
    entities: ['taiyangMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '太阳在父母,父母开明热心,与父缘之深浅视庙陷。',
    detail:
      '太阳入父母宫,父母开朗热心、管教开明,传统以太阳应父星,与父亲的缘分深浅尤看亮度:庙旺得父荫提携、两代相处有光;落陷则易与父聚少离多、或意见相左而少深谈,会吉可解。主动创造相处场合、认可父辈付出,是修缘之道。',
    confidence: 0.62,
  }),

  // ── 武曲 ──────────────────────────────────────────
  entry({
    id: 'star.wuqu.siblings',
    domain: 'star',
    entities: ['wuquMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '武曲在兄弟,手足刚直寡言各自独立,钱财往来宜明算。',
    detail:
      '武曲入兄弟宫,兄弟姊妹个性刚直、话少务实,各自独立少倚赖,情分实在但缺温言软语;最忌金钱纠葛伤和气。会禄则手足可共财共业、互为金援;加煞逢忌则易因财起摩擦,宜分产分明、亲兄弟明算账。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.wuqu.spouse',
    domain: 'star',
    entities: ['wuquMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '武曲在夫妻,配偶刚毅能干务实,宜晚婚防硬碰硬。',
    detail:
      '武曲入夫妻宫,配偶精明能干、行动力强而少浪漫,相处直来直往,两强相遇易硬碰硬;传统宜晚婚,或以聚少离多式的空间感(如两地、各忙事业)作缓冲。会吉则夫妻同心创业、家计殷实;逢化忌加煞则防因财失和与冷战,柔性表达是必修课。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.wuqu.children',
    domain: 'star',
    entities: ['wuquMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '武曲在子女,子女倔强独立早熟,身教胜于说教。',
    detail:
      '武曲入子女宫,子女个性刚强、独立早熟,不爱撒娇、行动派,亲子对话直来直往少甜言。教养宜以身作则、给任务不给唠叨。会吉则子女务实有成、早能自立;加煞则防管教冲突升级为对抗,硬碰不如约法三章。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.wuqu.wealth',
    domain: 'star',
    entities: ['wuquMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '武曲在财帛,正财星得位善赚善守,财路重实业金融。',
    detail:
      '武曲为正财星,入财帛宫为得位:赚钱意志坚定、理财执行力强,善赚亦善守,财路偏实业、金融、技术等实打实领域。会禄存化禄则财源丰稳、积富可期;逢化忌空劫则防周转吃紧与破耗,忌高杠杆冒进,现金流管理是命脉。',
    confidence: 0.7,
  }),
  entry({
    id: 'star.wuqu.health',
    domain: 'star',
    entities: ['wuquMaj', 'healthPalace'],
    topics: ['health'],
    summary: '武曲在疾厄,注意肺呼吸道牙骨,须防金创外伤。',
    detail:
      '武曲属金,入疾厄宫传统应肺部、呼吸道、鼻与牙齿骨骼之疾,并有金创之象——利器、机械之伤须防;性刚耐痛,易拖延就医。会吉则体健耐劳、小恙即愈;加煞逢忌则防外伤开刀之应,操作器械、运动防护宜到位,咳嗽久延勿轻忽。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.wuqu.surface',
    domain: 'star',
    entities: ['wuquMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '武曲在迁移,出外凭实力立足,宜外地经商技术营生。',
    detail:
      '武曲入迁移宫,出外靠真本事吃饭,宜离乡经商、技术营生或派驻财务要职,动中求财有成;人面欠圆融,在外朋友重质不重量。会禄化禄则他乡进财、越走越旺;加煞逢忌则防在外争财起纠纷,谈判宜留余地、契约先行。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.wuqu.friends',
    domain: 'star',
    entities: ['wuquMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '武曲在仆役,交友重实干情面淡,防因财与友反目。',
    detail:
      '武曲入仆役宫,交友重实不重虚言,身边多实干型伙伴,部属执行力强;人情往来偏淡,聚会应酬非其所好。会吉则得实干班底、合作成事;逢化忌加煞则防因财与友反目、合伙拆伙之争,凡合作先立字据、账目透明为上。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.wuqu.career',
    domain: 'star',
    entities: ['wuquMaj', 'careerPalace'],
    topics: ['career'],
    summary: '武曲在官禄,宜金融军警工程刚性行业,执行强于协调。',
    detail:
      '武曲入官禄宫,事业才干在执行与财务:金融、军警、工程、制造等刚性行业适性,做事果决负责,升迁靠实绩累积。会化权化禄则掌财掌实权、事业步步高;逢化忌则财务与业绩压力大、防刚愎自用误事,补强协调沟通可上一层楼。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.wuqu.property',
    domain: 'star',
    entities: ['wuquMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '武曲在田宅,置产欲强守产有方,不动产宜稳扎稳打。',
    detail:
      '武曲入田宅宫,视不动产为财富压舱石,置产意愿强、守产有方,偏好实打实的房产田土而非虚拟资产;家风勤俭。会禄存化禄则田产丰厚、以产养财;逢空劫化忌则防抵押周转之失与置产时机误判,大额房贷杠杆宜保守。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.wuqu.spirit',
    domain: 'star',
    entities: ['wuquMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '武曲在福德,务实少闲情劳碌自苦,以做事进账为安。',
    detail:
      '武曲入福德宫,精神世界务实少浪漫,安全感来自做事与进账,闲下来反而不安,属劳碌自苦型;物欲不奢但对钱敏感。会吉则忙而有成、心安理得;逢化忌加煞则求财心切致焦虑紧绷,宜刻意培养与钱无关的兴趣以松弛身心。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.wuqu.parents',
    domain: 'star',
    entities: ['wuquMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '武曲在父母,亲子严肃话少重规矩,孝行重实质供养。',
    detail:
      '武曲入父母宫,父母勤俭刚直、管教重规矩,亲子相处严肃话少,情感表达皆不擅长,关怀多藏在实质供养里。会吉则父母有产有为、家教扎实;加煞逢忌则防两代固执相持、久冷不语,主动的柔性问候常能破冰。',
    confidence: 0.6,
  }),

  // ── 天同 ──────────────────────────────────────────
  entry({
    id: 'star.tiantong.siblings',
    domain: 'star',
    entities: ['tiantongMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '天同在兄弟,手足温和相处融洽,互助心有余力不足。',
    detail:
      '天同入兄弟宫,兄弟姊妹性情温和、相处少争执,情分绵长以和为贵;然手足多安逸随和,遇大事互助心有余而力不足。会吉则手足和乐、往来有情趣;逢煞忌则防彼此依赖或情面难却之累,帮衬量力、期望放平。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tiantong.spouse',
    domain: 'star',
    entities: ['tiantongMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '天同在夫妻,配偶温和重情趣,防安逸互让无人担事。',
    detail:
      '天同入夫妻宫,配偶温和体贴、重生活情趣,婚姻氛围甜而不烈;课题在安逸:遇事互相礼让反致无人拍板,激情亦易被日常磨平。传统有宜晚婚、先友后婚之说以固情感基础。会吉则琴瑟和鸣、家庭温馨;逢化忌加煞则防情绪化的冷热反复,须共同承担而非一味退让。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tiantong.children',
    domain: 'star',
    entities: ['tiantongMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '天同在子女,子女乖巧讨喜心性温软,抗压须磨炼。',
    detail:
      '天同入子女宫,子女性情温顺、乖巧讨喜,亲子间少激烈冲突,家庭气氛轻松;然孩子心性偏软,抗压与独立性须刻意磨炼。会吉则亲子融洽、子女有福气人缘;加煞则防溺爱养成依赖,宜早立规矩、放手让其历练。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tiantong.wealth',
    domain: 'star',
    entities: ['tiantongMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '天同在财帛,白手起家财来平顺,享受先行防存不住。',
    detail:
      '天同入财帛宫,进财平顺不暴、多属白手兴家而晚发之局;赚钱动机常为享受生活,消费随心,积蓄力偏弱。会禄存化禄则安稳聚财、福中生财;逢空劫则随手散财、及时行乐存不住钱,宜设强制储蓄与自动转存机制。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tiantong.health',
    domain: 'star',
    entities: ['tiantongMaj', 'healthPalace'],
    topics: ['health'],
    summary: '天同在疾厄,福星体质尚可,注意泌尿代谢与发胖少动。',
    detail:
      '天同属水,为福星,入疾厄宫先天体质尚可、大病能得善治;传统应膀胱泌尿、水液代谢与耳部之疾,安逸少动、饮食享受致发胖是主要病源。规律运动可解大半。会吉则少病少灾;加煞逢忌则防肾水、耳鸣与代谢症候,忌久坐晚睡。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tiantong.surface',
    domain: 'star',
    entities: ['tiantongMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '天同在迁移,出外人缘佳得现成之福,开创性稍不足。',
    detail:
      '天同入迁移宫,出外人缘好、常得现成之福:他乡有贵人接应,环境适应力强,到哪都能安顿;然开创冲劲不足,机会多靠人给。会吉则出外安乐、贵人成行;逢煞反成激发、先劳后逸而有成,宜主动争取而非等待安排。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tiantong.friends',
    domain: 'star',
    entities: ['tiantongMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '天同在仆役,朋友缘厚同乐居多,防滥好人难拒请托。',
    detail:
      '天同入仆役宫,朋友缘厚、相处轻松,往来以吃喝同乐、休闲同好居多,知心闲友多而利害之交少。会吉则得温情之助、人和事顺;逢化忌加煞则防滥好人性格难拒请托,被友情绑架而耗时耗财,学会说不是功课。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tiantong.career',
    domain: 'star',
    entities: ['tiantongMaj', 'careerPalace'],
    topics: ['career'],
    summary: '天同在官禄,宜服务文教福利行业,进取心为升迁课题。',
    detail:
      '天同入官禄宫,做事重气氛与兴趣,宜服务业、餐饮休闲、文教、社福等与人为善之业,职场人和是其资产;进取心不足致升迁平缓。会化权则安中有进、以和致胜;无吉冲激则易安于现状,宜以兴趣驱动设阶段目标,借外力课责推进。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tiantong.property',
    domain: 'star',
    entities: ['tiantongMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '天同在田宅,有现成家业之福,居家重舒适置产随缘。',
    detail:
      '天同入田宅宫,多有祖荫或现成家业可承,居家布置重舒适温馨,家中气氛和乐;置产态度随缘不积极,守成心亦松。会禄则晚岁田宅丰盈、安享家福;逢空劫则防产业渐减而不自觉,家产盘点与保值配置宜定期为之。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tiantong.spirit',
    domain: 'star',
    entities: ['tiantongMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '天同在福德,福星得地知足常乐,能享清福防安逸生怠。',
    detail:
      '天同为福星,入福德宫为得地:心境知足常乐,懂吃懂玩懂生活,压力自我消化力强,是能真正享清福之象。会吉昌曲则精神愉悦有品味、老运安然;逢煞忌则福中藏懒、乐极生怠,志趣流于消遣,宜以一门长期爱好养志。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.tiantong.parents',
    domain: 'star',
    entities: ['tiantongMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '天同在父母,父母慈和少苛责,家庭温暖荫庇平顺。',
    detail:
      '天同入父母宫,父母性情慈和、少苛责重感情,家庭气氛温暖轻松,两代关系平顺少冲突,荫庇属细水长流型。会吉则亲子亲厚、家有福气;加煞逢忌则防父母过于纵容宽松致管教不足,或须多留心父母安逸少动的健康习惯。',
    confidence: 0.6,
  }),

  // ── 廉贞 ──────────────────────────────────────────
  entry({
    id: 'star.lianzhen.siblings',
    domain: 'star',
    entities: ['lianzhenMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '廉贞在兄弟,手足个性鲜明爱恨分明,热时亲冷时僵。',
    detail:
      '廉贞入兄弟宫,兄弟姊妹个性鲜明、有才有脾气,相处爱恨分明:投缘时亲密无间,意见相左则冷战僵持。会吉则手足各有专才、能量互补;逢化忌加煞则防口角结怨、久不往来,争执后主动递台阶是保全情分之道。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.lianzhen.spouse',
    domain: 'star',
    entities: ['lianzhenMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '廉贞在夫妻,配偶有魅力占有欲强,感情浓烈易起波澜。',
    detail:
      '廉贞为次桃花入夫妻宫,配偶多有魅力、手腕灵活,感情浓烈而占有欲强,爱之深责之切,婚前婚后皆易起波澜;传统宜婚前长考、慎选对象。会吉则夫妻有情有义共进退;廉贞化忌则防感情纠纷、旧情牵扯与醋海生波,信任与界限须早约定。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.lianzhen.children',
    domain: 'star',
    entities: ['lianzhenMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '廉贞在子女,子女聪明个性强早熟,管教宜疏不宜堵。',
    detail:
      '廉贞入子女宫,子女聪明早熟、个性强烈,感受力敏锐、爱憎分明,吃软不吃硬;高压禁令易激起逆反。会吉昌曲则子女才艺出众、有人缘;加煞逢忌则防叛逆期激烈对抗,管教宜疏导给出口,并留意其交友圈影响。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.lianzhen.wealth',
    domain: 'star',
    entities: ['lianzhenMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '廉贞在财帛,以人际手腕权变取财,财欲强务须走正路。',
    detail:
      '廉贞入财帛宫,善以人际经营与权变手腕取财,宜公家、大机构或竞争性市场之财;财欲强、路子活,正偏财界线是最大考验。会禄则名利兼收、人脉即钱脉;廉贞化忌则防因财涉讼、灰色地带失足,凡近红线之财一律不取方能长久。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.lianzhen.health',
    domain: 'star',
    entities: ['lianzhenMaj', 'healthPalace'],
    topics: ['health'],
    summary: '廉贞在疾厄,注意心火血液炎症,情志郁结为病源。',
    detail:
      '廉贞属火主血,入疾厄宫传统应心火、血液循环与发炎之症;情绪压抑、欲望与压力交织致情志郁结,是主要病源。会吉则体质有韧性、病能得治;加煞逢忌则防湿热暗疾、意外血光,烟酒应酬宜节,情绪宜有出口,体检从血项看起。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.lianzhen.surface',
    domain: 'star',
    entities: ['lianzhenMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '廉贞在迁移,出外善交际应酬,人脉即机会防卷入是非。',
    detail:
      '廉贞入迁移宫,出外活跃、善交际应酬,人脉网络就是机会来源,离乡发展多得人和之利;然活跃圈子亦近是非,酒局饭局暗藏风险。会吉则他乡得志、政商通吃;逢化忌则防在外官非口舌、酒色之累,场面上留三分清醒。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.lianzhen.friends',
    domain: 'star',
    entities: ['lianzhenMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '廉贞在仆役,关系网经营有术,友情带利害宜辨损益。',
    detail:
      '廉贞入仆役宫,交游层面广、善经营关系网,朋友多能办事之人,往来常带利害计算,纯友谊较少。会吉则得有力人脉、关键时刻有人递梯;逢化忌加煞则防损友引入是非、合伙生怨,识人宜观其行而非听其言,利字当头先立约。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.lianzhen.career',
    domain: 'star',
    entities: ['lianzhenMaj', 'careerPalace'],
    topics: ['career'],
    summary: '廉贞在官禄,官禄主得位,宜公职政商竞争行业。',
    detail:
      '廉贞在数司品职权令,入官禄宫为得位:善权变、耐竞争,宜公职、政商公关、业务开拓等讲手腕与胜负之场,职场嗅觉敏锐。会禄化禄则如鱼得水、名位双进;廉贞化忌则防职场斗争缠身与法纪红线,行事守正、留痕合规是护身符。',
    confidence: 0.7,
  }),
  entry({
    id: 'star.lianzhen.property',
    domain: 'star',
    entities: ['lianzhenMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '廉贞在田宅,置产有企图心喜增值题材,防产权纠纷。',
    detail:
      '廉贞入田宅宫,置产带企图心,偏好有增值题材、可运作的物业,家宅装点讲究格调品味;买卖运作多则纠纷点亦多。会禄则产业渐丰、运作得利;逢化忌加煞则防产权纠纷、买卖生讼,合约条款与产权调查务必做足。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.lianzhen.spirit',
    domain: 'star',
    entities: ['lianzhenMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '廉贞在福德,多欲多思求刺激,心火旺难得清闲。',
    detail:
      '廉贞入福德宫,精神多欲多思,追求刺激、成就与情趣,生活要过得精彩,平淡即觉无味;心火旺、情绪张力大,难得清闲。会吉则志趣广泛、活得有声有色;逢化忌则情绪起伏剧烈、欲求不满而自耗,静心之习与运动泄压是良方。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.lianzhen.parents',
    domain: 'star',
    entities: ['lianzhenMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '廉贞在父母,两代情浓易拉锯,家规与个性相抗须磨合。',
    detail:
      '廉贞入父母宫,父母有个性有主张,亲子感情浓烈却易拉锯:家规与子女个性相抗,亲近与冲突交替上演。会吉则得父母助力、家教中有真情;逢化忌加煞则防两代心结积深、口角翻旧账,沟通宜先退半步、就事论事不翻案。',
    confidence: 0.6,
  }),

  // ── 天府 ──────────────────────────────────────────
  entry({
    id: 'star.tianfu.siblings',
    domain: 'star',
    entities: ['tianfuMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '天府在兄弟,手足稳重顾家可倚靠,各有算盘少浓烈。',
    detail:
      '天府入兄弟宫,兄弟姊妹稳重务实、顾家惜缘,遇事可为倚靠,是家中定盘星;然各有算盘、感情平稳少浓烈,互动重实际。会吉则手足有产有为、互相帮衬;加煞则防因家产计较生嫌隙,分产之事宜早议明、留情面。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianfu.spouse',
    domain: 'star',
    entities: ['tianfuMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '天府在夫妻,配偶稳重持家有方,婚姻求安稳防平淡。',
    detail:
      '天府入夫妻宫,配偶稳重务实、持家理财有方,婚姻以安稳为基调,是耐走长路之象;然求稳少激情,日久易觉平淡如水。会吉则家道殷实、夫妻互信;加煞则配偶趋保守固执、凡事求稳难商量,宜主动制造变化与仪式感保温。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianfu.children',
    domain: 'star',
    entities: ['tianfuMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '天府在子女,子女稳健早懂事能守成,闯劲稍弱。',
    detail:
      '天府入子女宫,子女性情稳健、早懂事有分寸,让父母省心,长成后能守成继业;然求稳性格使开创闯劲偏弱,怕试错。会吉则子女有成、可托家业;加煞则防过度求稳错失锻炼,宜刻意给其冒险试错的空间与容错额度。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianfu.wealth',
    domain: 'star',
    entities: ['tianfuMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '天府在财帛,库星坐财善积善管,求稳防错失机会。',
    detail:
      '天府为财库之星,入财帛宫善积蓄、善管理,量入为出,财务稳健少大破;然过度保守,易错失增值机会,财富成长平缓。得禄存化禄则库中有实、积富可观;无禄又逢空劫为空库,防外强中干、守成反失,配置宜稳中留一分进取。',
    confidence: 0.7,
  }),
  entry({
    id: 'star.tianfu.health',
    domain: 'star',
    entities: ['tianfuMaj', 'healthPalace'],
    topics: ['health'],
    summary: '天府在疾厄,体质平和少大疾,注意脾胃湿滞与三高。',
    detail:
      '天府属土,入疾厄宫体质平和、少大凶之疾,病多与口福有关:传统应脾胃、消化与湿滞,饮食丰美安逸少动,须防体重与三高问题。会吉则健康平顺、病有善治;加煞逢忌则防胃疾与代谢缓滞成慢病,节饮食、勤走动即是良医。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianfu.surface',
    domain: 'star',
    entities: ['tianfuMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '天府在迁移,出外稳扎稳打得信任,宜随平台不宜单干。',
    detail:
      '天府入迁移宫,出外行事稳重得体,易获长辈上司信任,他乡可安身立业;然开拓性不足,适合跟着建制平台外派发展,不宜赤手空拳闯荡。会吉则外地得位、越守越厚;加煞则防守成心态错失外缘,宜给自己设定主动出击的节奏。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianfu.friends',
    domain: 'star',
    entities: ['tianfuMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '天府在仆役,交友重信用圈子稳固,少新血各有保留。',
    detail:
      '天府入仆役宫,交友重信用与长久,身边多稳当可靠之人,老友老部属居多,合作以稳见长;然圈子固定少新血,视野易同温。会吉则得可靠帮手、患难有靠;加煞则防表面和气、实各有保留,重大合作仍宜制度先行不全凭交情。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianfu.career',
    domain: 'star',
    entities: ['tianfuMaj', 'careerPalace'],
    topics: ['career'],
    summary: '天府在官禄,宜财务行政管理守成之职,大机构安身。',
    detail:
      '天府入官禄宫,才干在治理与守成:财务、行政、营运管理皆适性,处事有条理、能扛责任,大机构中步步为营向上走;开创冒险非其所长。会吉会禄则掌库掌权、位稳而丰;无禄吉相佐则位稳功名平,宜以专业认证与治理实绩积累升阶筹码。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianfu.property',
    domain: 'star',
    entities: ['tianfuMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '天府在田宅,库星入田宅得位,置产守产俱佳家底渐厚。',
    detail:
      '天府为库星,入田宅宫为得位:置产守产俱佳,视房产田土为根本,家底随岁月渐厚,居家重安稳齐整。会禄则不动产丰盈、家业可传;逢空劫化忌则防继承分配与产权文件之琐纷,契约凭证宜妥存,家产宜早规划传承。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.tianfu.spirit',
    domain: 'star',
    entities: ['tianfuMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '天府在福德,心安自足重生活品质,防守财心重怕变。',
    detail:
      '天府入福德宫,精神安稳自足,重视生活品质与安全感,不为无谓之事焦虑,是心宽体泰之象;然偏保守怕变,乐趣易囿于熟悉圈。会吉则福厚心宽、晚景安泰;加煞逢忌则患得患失、守财心重反成心累,学习放手与尝新可增福感。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianfu.parents',
    domain: 'star',
    entities: ['tianfuMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '天府在父母,父母稳重有家底,荫庇实在家风偏保守。',
    detail:
      '天府入父母宫,父母稳重厚道、多有家底或安稳营生,对子女的荫庇实实在在:供给、置产、兜底皆可靠;家风偏保守求稳。会吉则得庇荫承家业、两代和睦;加煞则防两代观念新旧之争,子女求变时宜以成绩说服而非顶撞。',
    confidence: 0.6,
  }),

  // ── 太阴 ──────────────────────────────────────────
  entry({
    id: 'star.taiyin.siblings',
    domain: 'star',
    entities: ['taiyinMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '太阴在兄弟,手足温文细心,姊妹缘深情感内敛。',
    detail:
      '太阴入兄弟宫,兄弟姊妹温文细心、感情内敛,尤应姊妹之缘深;彼此关怀多放在心里、体现在小事,少直白表达。庙旺则手足体己互助、如水长流;落陷或逢化忌则防暗生心结、面和心疏,有话直说反能亲近。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyin.spouse',
    domain: 'star',
    entities: ['taiyinMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '太阴在夫妻,配偶温柔细腻顾家,防情绪暗涌少直言。',
    detail:
      '太阴入夫妻宫,配偶温柔细腻、恋家顾家,重情调与默契;传统男命应娶得贤内助,女命则配偶性偏柔、家中大事或需己方拿主意。庙旺则婚姻温润、家宅安宁;落陷或逢化忌则防情绪暗涌——不说破的委屈积成心结,定期交心胜过猜心。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.taiyin.children',
    domain: 'star',
    entities: ['taiyinMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '太阴在子女,子女文静敏感贴心,内向宜鼓励表达。',
    detail:
      '太阴入子女宫,子女文静秀气、心思敏感而贴心,尤应女儿缘;情绪细腻不外露,受了委屈易闷在心里。庙旺则子女秀慧有成、亲子情深;落陷逢忌则防多愁善感、情绪内伤,教养之道在多倾听多肯定,鼓励其把感受说出来。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyin.wealth',
    domain: 'star',
    entities: ['taiyinMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '太阴在财帛,富星坐财细水长流,善储蓄理财置产生财。',
    detail:
      '太阴为富星,入财帛宫主财来细水长流:善储蓄、善规划,靠纪律与复利积富,并宜以不动产、稳健理财蓄财,不求暴利。庙旺会禄则积富可观、越晚越丰;落陷或逢化忌则财进暗耗——隐性支出、代垫代付侵蚀积蓄,记账明细可堵漏。',
    confidence: 0.7,
  }),
  entry({
    id: 'star.taiyin.health',
    domain: 'star',
    entities: ['taiyinMaj', 'healthPalace'],
    topics: ['health'],
    summary: '太阴在疾厄,注意阴分内分泌眼目,情绪与睡眠是关键。',
    detail:
      '太阴属水,入疾厄宫传统应阴分不足、内分泌、水液代谢与眼目之疾,女命兼看妇科;情绪内敛压抑与夜眠品质是健康枢纽。庙旺则体质温润、调养见效;落陷逢忌则防虚劳、失眠、水肿与情绪性疾患,滋阴养眠、情绪疏泄为保健要旨。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.taiyin.surface',
    domain: 'star',
    entities: ['taiyinMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '太阴在迁移,出外温和得人缘,宜静态境外之缘冲劲缓。',
    detail:
      '太阴入迁移宫,出外以柔得人缘,贵人多为女性或温和长者;宜文教、金融、境外事务等静态斯文之缘,亦主离乡后渐入佳境。庙旺则他乡得贵得财、越走越润;落陷则防漂泊思乡、进退迟疑,重大迁徙宜设停损时点、勿拖延观望。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyin.friends',
    domain: 'star',
    entities: ['taiyinMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '太阴在仆役,朋友多温和之交,女性贵人缘佳情谊绵长。',
    detail:
      '太阴入仆役宫,交友温和绵长,重质不重量,女性贵人与知性之交尤多;情谊如细水,不喧哗但耐久。会吉则得体己之友、暗中相助;逢化忌加煞则防所托非人、暗中受累,交浅勿言深,财物代管之托宜婉拒。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.taiyin.career',
    domain: 'star',
    entities: ['taiyinMaj', 'careerPalace'],
    topics: ['career'],
    summary: '太阴在官禄,宜金融地产文教幕僚,稳中求成功在幕后。',
    detail:
      '太阴入官禄宫,才在细腻与规划:金融理财、不动产、文教出版、幕僚企划皆适性,做事绵密稳妥,功多在幕后。庙旺会化禄化权则事业清贵、以静制动步步高;落陷则劳心于内务、功劳易被隐没,宜定期让成果被看见,勿只埋头。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.taiyin.property',
    domain: 'star',
    entities: ['taiyinMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '太阴在田宅,田宅主得位置产运佳,喜明净安居之所。',
    detail:
      '太阴为田宅主,入田宅宫为得位:与不动产缘深,置产眼光稳,喜明净清幽、近水绿意之居,家宅是其安全感来源,亦多得母系家荫。庙旺则不动产丰、以房蓄富;落陷逢忌则防房产暗损——漏水潮湿、瑕疵物件,购屋验屋宜细。',
    confidence: 0.7,
  }),
  entry({
    id: 'star.taiyin.spirit',
    domain: 'star',
    entities: ['taiyinMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '太阴在福德,好静重审美享独处,多思多感须防内耗。',
    detail:
      '太阴入福德宫,精神细腻好静,乐在独处、阅读与审美生活,内心世界丰富,是清福之象;然多思多感,夜深人静时思绪易翻涌。庙旺则福雅心安、气质温润;落陷逢化忌则多虑失眠、情绪内耗,写字倾诉与规律睡前仪式可安神。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.taiyin.parents',
    domain: 'star',
    entities: ['taiyinMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '太阴在父母,与母缘深家教温润,落陷宜多陪伴母系。',
    detail:
      '太阴入父母宫,传统以太阴应母星,与母亲及女性长辈缘分深,父母管教温和细致、以情感人,家风斯文。庙旺则得母荫、家教温润有滋养;落陷或逢化忌则防与母聚少、或母亲操劳多病之忧,多陪伴、分担家务即是修缘。',
    confidence: 0.62,
  }),

  // ── 贪狼(财帛除外)──────────────────────────────
  entry({
    id: 'star.tanlang.siblings',
    domain: 'star',
    entities: ['tanlangMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '贪狼在兄弟,手足多才交游广,往来热闹知心偏浅。',
    detail:
      '贪狼入兄弟宫,兄弟姊妹多才多艺、各有交游圈,聚时热闹尽兴,散时各奔精彩,知心深谈偏少。会吉则手足人脉互通、资源共享;逢化忌加煞则防流于酒肉之谊,或因玩乐借贷生怨,财物往来宜慎、点到为止。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tanlang.spouse',
    domain: 'star',
    entities: ['tanlangMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '贪狼在夫妻,配偶多才有魅力社交活跃,信任须经营。',
    detail:
      '贪狼为桃花星入夫妻宫,配偶多才多艺、有魅力、社交活跃,婚姻生活有情趣不沉闷;然烂桃花之扰与应酬之多,使信任成为长期课题,传统有宜迟婚之说。会吉则夫妻多情趣、共享人脉;逢化忌加煞则防感情复杂化,交友界限与透明度须早约定。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tanlang.children',
    domain: 'star',
    entities: ['tanlangMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '贪狼在子女,子女活泼多才兴趣广,定性不足宜导专注。',
    detail:
      '贪狼入子女宫,子女活泼讨喜、多才多艺,兴趣广泛学什么像什么;然定性不足,浅尝辄止是通病。会吉昌曲则才艺出众、人缘早发;逢化忌加煞则防贪玩分心、受同侪玩乐文化影响,教养重在护其广度同时立一门深入之约。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tanlang.health',
    domain: 'star',
    entities: ['tanlangMaj', 'healthPalace'],
    topics: ['health'],
    summary: '贪狼在疾厄,注意肝肾内分泌,应酬熬夜酒色为病源。',
    detail:
      '贪狼属木配水,入疾厄宫传统应肝、肾与内分泌之疾;病源多在生活方式——应酬、熬夜、烟酒与欲望透支。有节制则体质本佳、精力过人。会吉则恢复力强;加煞逢忌则防肝功能、泌尿生殖系统之患,定期肝肾指标检查、应酬设上限为要。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tanlang.surface',
    domain: 'star',
    entities: ['tanlangMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '贪狼在迁移,出外交际如鱼得水,应酬中得机会防迷失。',
    detail:
      '贪狼入迁移宫,出外人缘桃花俱旺,交际应酬如鱼得水,机会多在饭局人脉中孕育,离乡发展反得舞台。会火铃则动中有意外之得、出外横发之象;逢化忌加煞则防在外酒色财气之失、结交非人,热闹场中记得自己为何而来。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tanlang.friends',
    domain: 'star',
    entities: ['tanlangMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '贪狼在仆役,交游满天下三教九流,广而防滥慎择损益。',
    detail:
      '贪狼入仆役宫,朋友遍布各行各业、三教九流皆有缘,人脉是其最大资产,消息灵通路子广。会吉则人脉变现、贵人常在酒酣耳热处;逢化忌加煞则防友引嗜好上身、财色之陷,交游宜广、深交宜择,守住自己的底线圈。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tanlang.career',
    domain: 'star',
    entities: ['tanlangMaj', 'careerPalace'],
    topics: ['career'],
    summary: '贪狼在官禄,宜业务公关娱乐人际行业,多才防不专。',
    detail:
      '贪狼入官禄宫,才艺多元、擅长人际经营,宜业务开拓、公关行销、娱乐餐饮、演艺文创等以人缘与才艺取胜之业,亦能跨界整合。化禄化权则事业得意、左右逢源;逢化忌则防兼差过多分身乏术、虎头蛇尾,选定主轴深耕方能积累。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tanlang.property',
    domain: 'star',
    entities: ['tanlangMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '贪狼在田宅,置产有欲喜投资题材,进出频宜细审契约。',
    detail:
      '贪狼入田宅宫,置产欲望强,偏好有话题、可增值的投资型物业,家中喜宴客热闹,不动产进出较频。会火铃则不动产有意外之得、横发置业之象;逢空劫化忌则防投机置产之损与合建纠纷,契约细节与出场时机须冷静把关。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tanlang.spirit',
    domain: 'star',
    entities: ['tanlangMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '贪狼在福德,欲望多元兴趣广,享乐与修行一线之隔。',
    detail:
      '贪狼入福德宫,精神欲望多元:美食、玩乐、才艺、社交皆其所好,生活多姿多彩闲不住;贪狼亦主玄学缘,享乐与修行常一线之隔。会吉则活得精彩、福在体验;逢空曜反主淡欲向道、转求内在;逢化忌则欲多难足、乐后空虚,宜以长期志趣代替感官刺激。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tanlang.parents',
    domain: 'star',
    entities: ['tanlangMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '贪狼在父母,两代热络聚散随缘,家教宽松防疏于管。',
    detail:
      '贪狼入父母宫,父母开明健谈、社交活跃,家教偏宽松自由,亲子如友相处热络;然聚散随缘,深度关注偏少。会吉则得父母开明相待、家庭多欢聚;逢化忌加煞则防两代价值观分歧、少管束而渐疏,定期的正经对话可补亲缘之实。',
    confidence: 0.6,
  }),

  // ── 巨门 ──────────────────────────────────────────
  entry({
    id: 'star.jumen.siblings',
    domain: 'star',
    entities: ['jumenMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '巨门在兄弟,手足能言各有主见,口角难免宜多倾听。',
    detail:
      '巨门入兄弟宫,兄弟姊妹口才好、各有主见,相处理多于情:讨论易升级为争辩,背后议论亦须防。会吉则以理相争不伤情、互为诤友;逢化忌则口舌成结、旧账反复翻,相处之道在少论断多倾听,家事勿在群里辩。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.jumen.spouse',
    domain: 'star',
    entities: ['jumenMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '巨门在夫妻,配偶口才好心思深,婚姻课题全在言语。',
    detail:
      '巨门入夫妻宫,配偶能言善道、心思深沉,婚姻的甜与伤皆系于言语:起于斗嘴谈笑,伤于恶言冷语。传统宜晚婚、婚前充分磨合沟通模式。会化权化禄则沟通成默契、越谈越亲;逢化忌则防冷嘲热讽积怨成墙,立下不说狠话的家规是护婚之道。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.jumen.children',
    domain: 'star',
    entities: ['jumenMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '巨门在子女,子女伶牙俐齿好发问,顶嘴与雄辩一线间。',
    detail:
      '巨门入子女宫,子女口齿伶俐、好问好辩,凡事要个说法,顶嘴与思辨常在一线之间;压制其言只会转为暗抗。会昌曲则口才成学、辩才出众;逢化忌加煞则防亲子争执不休、恶言相伤,以家庭辩论代替权威压制,反能化顶嘴为才华。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.jumen.wealth',
    domain: 'star',
    entities: ['jumenMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '巨门在财帛,以口生财凭专业话语权,财路带竞争是非。',
    detail:
      '巨门入财帛宫,财从口出:教学、销售、法务、传媒、中介等凭口才与专业话语权进账,费尽唇舌而后得,财路常伴竞争与是非。化禄则口才即财源、越讲越旺;逢化忌则防因言破财、口头承诺之失,交易务求白纸黑字,勿赚口舌是非之财。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.jumen.health',
    domain: 'star',
    entities: ['jumenMaj', 'healthPalace'],
    topics: ['health'],
    summary: '巨门在疾厄,注意消化道咽喉之疾,病从口入忧思伤脾。',
    detail:
      '巨门入疾厄宫,传统应消化道、食道胃部与咽喉呼吸之疾,病从口入:饮食不节与忧思多虑并为病源,讲话耗气者兼防喉疾。会吉则病浅易治;逢化忌加煞则防胃疾缠绵、咽喉气管之患,三餐定时、少冷言少冷食,郁结之思宜有出口。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.jumen.surface',
    domain: 'star',
    entities: ['jumenMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '巨门在迁移,出外凭口才开路,名随辩出谤亦随之。',
    detail:
      '巨门入迁移宫,出外靠口才与专业发言立足,离乡以言路谋生反有天地;然名随辩出、谤亦随之,人生地不熟处口舌是非尤多。会化权化禄则他乡成名、一言重于九鼎;逢化忌则防在外招谤惹讼,出门在外谨言慎行、不传闲话。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.jumen.friends',
    domain: 'star',
    entities: ['jumenMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '巨门在仆役,交友重言谈投机,防流言中伤代人受过。',
    detail:
      '巨门入仆役宫,交友以言谈投机为准,圈内谈锋甚健、消息流通快;然言多必失,流言误会亦易生于友朋之间。会吉则得直言诤友、集思广益;逢化忌加煞则防遭口舌中伤、代人受过,是非之言止于己,群组闲话少接少传。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.jumen.career',
    domain: 'star',
    entities: ['jumenMaj', 'careerPalace'],
    topics: ['career'],
    summary: '巨门在官禄,宜教学法律传媒销售,以口为业话语权立身。',
    detail:
      '巨门入官禄宫,天赋在言语与钻研:教学、法律、传媒、销售、谈判中介皆适性,专业话语权是最深的护城河,靠一张嘴一支笔立身。化权化禄则言重九鼎、以辩才升迁成名;逢化忌则防祸从口出、卷入职场口舌,发言凭数据、评人对事不对人。',
    confidence: 0.7,
  }),
  entry({
    id: 'star.jumen.property',
    domain: 'star',
    entities: ['jumenMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '巨门在田宅,家宅防口舌邻里之扰,产权合同务必厘清。',
    detail:
      '巨门入田宅宫,家中言语交锋多,邻里、家人间易起口角误会;宅忌阴暗闭塞,明亮通风可减郁气。会吉会禄则置产稳当、以专业眼光挑好房;逢化忌则防产权、租赁、装修合同之纠纷,凡涉不动产的约定务必书面厘清、留存凭证。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.jumen.spirit',
    domain: 'star',
    entities: ['jumenMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '巨门在福德,研究欲强心思深,疑心较真防钻牛角尖。',
    detail:
      '巨门入福德宫,心思深、研究欲强,凡事要想通想透,精神之乐在求真;然疑心与较真并存,易翻旧账、钻牛角尖,自我对话常偏严苛。会昌曲化科则思辨成学问、以钻研为乐;逢化忌则多疑寡欢、内心暗流汹涌,以专业输出疏解思虑最见效。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.jumen.parents',
    domain: 'star',
    entities: ['jumenMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '巨门在父母,两代易生代沟口角,各有道理宜先听后说。',
    detail:
      '巨门入父母宫,与父母间言语交锋多:两代各有道理、互不相让,代沟表现为争辩与冷战交替;传统有少年宜离家求学以缓冲之说。会吉则父母明理善教、辩中有情;逢化忌则防长期争执积怨,先听后说、认可再建议,是与父母对话的不二法门。',
    confidence: 0.6,
  }),

  // ── 天相 ──────────────────────────────────────────
  entry({
    id: 'star.tianxiang.siblings',
    domain: 'star',
    entities: ['tianxiangMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '天相在兄弟,手足正派热心可商可托,防为其背书受累。',
    detail:
      '天相入兄弟宫,兄弟姊妹正派热心、有事可商可托,家中常由其出面调停主持公道,手足互信度高。会吉则互为臂膀、同心持家;逢刑忌夹或加煞则防为兄弟背书担保而受累,情义可尽、签字盖章之事宜三思。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.spouse',
    domain: 'star',
    entities: ['tianxiangMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '天相在夫妻,配偶端正体面重承诺,婚姻求平衡互敬。',
    detail:
      '天相入夫妻宫,配偶仪表端正、处事得体、重承诺讲信用,婚姻走互敬互重的平衡路线,门当户对之感较重,长辈意见亦易介入婚事。会吉则夫妻相敬互补、家风端正;逢煞或刑忌夹则防一方长期为对方收拾善后,付出与回报宜常校准。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianxiang.children',
    domain: 'star',
    entities: ['tianxiangMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '天相在子女,子女乖巧懂礼有正义感,略随和欠主见。',
    detail:
      '天相入子女宫,子女乖巧懂礼、有正义感与服务心,在同侪中常任调停者角色,让父母放心;然个性随和易从众,主见与拒绝力稍弱。会吉则品端学正、可靠可托;加煞则防滥好人性格吃亏受欺,宜教其立界限、练习说不。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.wealth',
    domain: 'star',
    entities: ['tianxiangMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '天相在财帛,财随职权服务而来,理财中正防作保受累。',
    detail:
      '天相入财帛宫,财随职位、专业服务与信用而来,进财平稳,理财中正不贪,常有代管众人之财的角色(出纳、财务、家计)。得财荫夹则财源得暗助、稳中有升;逢刑忌夹或空劫则防为人作保、代垫背书而破财,金钱信用可给、连带责任莫扛。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianxiang.health',
    domain: 'star',
    entities: ['tianxiangMaj', 'healthPalace'],
    topics: ['health'],
    summary: '天相在疾厄,注意皮肤水肿泌尿糖代谢,体面下防劳损。',
    detail:
      '天相属水,入疾厄宫传统应皮肤、水肿、泌尿与糖代谢之疾;性好体面、有事自己扛,劳损常被外表的从容掩盖。会吉则体况平稳、病有良医;加煞逢忌则防皮肤过敏、水液代谢失衡与糖分摄取过度,饮食清淡、定期血糖皮肤检查为宜。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.surface',
    domain: 'star',
    entities: ['tianxiangMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '天相在迁移,出外得体受信任,贵人乐引荐宜借平台。',
    detail:
      '天相入迁移宫,出外形象得体、言行有分寸,易获信任与引荐,他乡发展多有贵人铺路;宜依托机构平台外派历练,单打独斗非其所长。会吉则外地得位、步步有人扶;逢煞则防在外为人出头调停反卷入纷争,热心宜有度。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.friends',
    domain: 'star',
    entities: ['tianxiangMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '天相在仆役,人缘正派受托主持公道,人情负担偏重。',
    detail:
      '天相入仆役宫,交友正派,朋友遇纠纷惯找其评理调停,部属忠诚度高,是圈中公道伯;然人情托付多,负担不轻。会吉则得敬重、善缘回流,关键时刻有人挺;逢煞忌则防调解不成两头怨、好心背锅,居中之位宜守程序留纪录。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.career',
    domain: 'star',
    entities: ['tianxiangMaj', 'careerPalace'],
    topics: ['career'],
    summary: '天相在官禄,宜行政幕僚司法辅助掌印之职,忠诚可托。',
    detail:
      '天相为印星,入官禄宫宜掌印信之职:行政管理、幕僚长、司法辅助、稽核人资皆适性,执行力与忠诚度是升迁本钱,居二把手位反能大展。会吉则辅佐大局、步步高升;逢刑忌夹则防代人受过、背黑锅,权责分明、公文留痕是自保之道。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.tianxiang.property',
    domain: 'star',
    entities: ['tianxiangMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '天相在田宅,有承产之缘居家整洁,防代持担保连累。',
    detail:
      '天相入田宅宫,多有承接家产或因职务分配得房之缘,居家整洁重格局,持产平稳少投机。会吉得财荫相夹则田宅稳中增值、家宅安宁;逢煞或刑忌夹则防产权代持、为亲友担保抵押而受连累,不动产文件亲自过目、名实相符为要。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.spirit',
    domain: 'star',
    entities: ['tianxiangMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '天相在福德,心平重公道,见不平难袖手为人操心多。',
    detail:
      '天相入福德宫,心境平和中正,重公道与秩序,生活有仪式感与品味;然见不平难袖手,常为他人之事操心,精神负担多来自热心。会吉则心安理得、有清福有敬重;逢煞则忧人之忧成惯性、自我时间被侵蚀,学课题分离方能真享福。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianxiang.parents',
    domain: 'star',
    entities: ['tianxiangMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '天相在父母,父母正直重教养家风端正,规矩期望偏多。',
    detail:
      '天相入父母宫,父母正直体面、重教养讲规矩,家风端正,对子女言行仪态期望高,荫庇平稳可靠。会吉则两代和睦、得父母信用与人脉之荫;逢煞则防以规矩之名的压力累积,成年后温和立界、以成绩换信任,关系反更松快。',
    confidence: 0.6,
  }),

  // ── 天梁 ──────────────────────────────────────────
  entry({
    id: 'star.tianliang.siblings',
    domain: 'star',
    entities: ['tianliangMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '天梁在兄弟,手足有长者风遇事出头,好相互说教。',
    detail:
      '天梁入兄弟宫,兄弟姊妹中有长兄长姊之风者,遇事肯出头照应,患难时是可靠的伞;然荫星好为人师,手足间互相说教、指点人生是常态。会吉则患难有靠、如师如友;加煞则防大包大揽反生怨怼,关照留三分、尊重各自选择。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianliang.spouse',
    domain: 'star',
    entities: ['tianliangMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '天梁在夫妻,配偶成熟稳重照顾人,宜配年长防唠叨管束。',
    detail:
      '天梁入夫妻宫,配偶成熟稳重、有原则重道义,照顾人如长辈照顾晚辈,传统宜配年长或心性老成者;感情稳定绵长而浪漫偏少。会吉则细水长流、患难与共;加煞则防以关心为名的唠叨管束,把感激说出口、把空间留出来,婚姻更松快。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianliang.children',
    domain: 'star',
    entities: ['tianliangMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '天梁在子女,子女早熟懂事有担当,少年老成失童趣。',
    detail:
      '天梁入子女宫,子女早熟懂事、有责任感,常主动照顾弟妹、体贴父母,是家中小大人;然少年老成,童趣与任性被过早收起。会吉则子女孝顺可托、日后有声望;加煞则防其压抑情绪独自扛事,教养上宜许其做小孩、示弱求助不丢脸。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianliang.wealth',
    domain: 'star',
    entities: ['tianliangMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '天梁在财帛,荫星不主财主贵,财从清誉专业来宜取有道。',
    detail:
      '天梁为荫星,入财帛宫不以聚富论,财从清誉、专业与长辈提携而来,视钱财较淡,亦常为人守财理事而非为己敛财。会禄则名利兼得,但财露反易招是非,宜低调;逢煞忌则防因财惹纷争、为人担财责,君子爱财取之有道最应此星。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.tianliang.health',
    domain: 'star',
    entities: ['tianliangMaj', 'healthPalace'],
    topics: ['health'],
    summary: '天梁在疾厄,有逢凶化吉之荫,注意脾胃与慢性旧疾。',
    detail:
      '天梁为寿星荫星,入疾厄宫主病灾多能遇良医良药、逢凶有解;传统应脾胃、胸乳与慢性旧疾,病常缠绵而不凶险。会吉则小病即愈、底子耐磨;加煞逢忌则防旧疾反复发作、拖延成慢病,定期追踪复查、遵医嘱善后,是把荫用足之道。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianliang.surface',
    domain: 'star',
    entities: ['tianliangMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '天梁在迁移,出外得长辈荫庇遇难有解,防好管闲事。',
    detail:
      '天梁入迁移宫,出外多得长辈贵人荫庇,遇难常有人及时相助化解,他乡受敬重,宜医药、顾问、公益、公职外派之缘。会吉则离乡而声誉起、险处逢生;加煞则先历风波后得解,并防好管闲事惹尘上身,出门在外助人量力、是非少沾。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianliang.friends',
    domain: 'star',
    entities: ['tianliangMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '天梁在仆役,多长者专业之交,受人求助多防承担过重。',
    detail:
      '天梁入仆役宫,交游圈多长者、专业人士与正派之友,常得忘年之交指点提携;自身亦成朋友圈中的求助对象,排忧解难不断。会吉则贵人成网、声望日增;加煞逢忌则防承担他人因果——借贷难收、包揽烂摊,助人以智不以财,借出以能承受为限。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.tianliang.career',
    domain: 'star',
    entities: ['tianliangMaj', 'careerPalace'],
    topics: ['career'],
    summary: '天梁在官禄,宜医药法务公教监察济人行业,名重于利。',
    detail:
      '天梁入官禄宫,事业适性在济人与守正:医药、法务、公职、教育、保险稽核监察皆宜,靠清誉与专业立身,名声重于利禄。化权化禄会吉则清贵有声望、老成掌大局;加煞则防因直言监督得罪当道,守正不阿而讲究方法,方能行稳致远。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.tianliang.property',
    domain: 'star',
    entities: ['tianliangMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '天梁在田宅,有祖荫承产之缘,喜清幽之居防析产纷争。',
    detail:
      '天梁入田宅宫,多有祖荫、老宅旧产之缘,承接长辈产业的机会大,居所喜清幽绿意、近公园学校之地,家宅有长者往来。会吉则家业有靠、住得安稳;逢煞忌则防祖产分配起纷争、旧屋修缮讼累,析产之事宜先议后分、白纸黑字。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianliang.spirit',
    domain: 'star',
    entities: ['tianliangMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '天梁在福德,有长者风好研哲理,操心命热心命兼具。',
    detail:
      '天梁入福德宫,心性豁达有长者风,好研哲理、宗教、医卜之学,精神世界重意义感;然操心是常态——家事国事天下事皆挂心,清福常被热心打断。会吉则福寿之姿、心境越老越通透;加煞则防忧道忧人成杞人之虑,定期抽离独处可养神。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.tianliang.parents',
    domain: 'star',
    entities: ['tianliangMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '天梁在父母,父母荫庇力强多得提携,家教重道理。',
    detail:
      '天梁入父母宫,父母正派有德望,荫庇力强:关键处常有父母或长辈出手相助,家教重道理、以身垂范,与长辈上司亦多善缘。会吉则两代如师如友、得荫深厚;加煞则防说教过多致晚辈生烦,敬而不烦、听而有取,是承荫的功课。',
    confidence: 0.62,
  }),

  // ── 七杀 ──────────────────────────────────────────
  entry({
    id: 'star.qisha.siblings',
    domain: 'star',
    entities: ['qishaMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '七杀在兄弟,手足独立要强各自为战,保持距离反亲。',
    detail:
      '七杀入兄弟宫,兄弟姊妹个性刚强独立、早早各自为战,平日往来不密,有大事才聚首;情分冷硬但关键时刻讲义气。会吉则手足各有成就、遥相呼应;加煞逢忌则防争执决裂、久不相认,相处之道在保持距离的尊重,不共财不硬碰。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.qisha.spouse',
    domain: 'star',
    entities: ['qishaMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '七杀在夫妻,配偶强势独立行动派,聚少离多硬碰为忌。',
    detail:
      '七杀入夫妻宫,配偶个性强势、独立干练、行动力强,婚姻易呈聚少离多之势,两强相遇硬碰硬为大忌;传统宜晚婚、或配事业型伴侣互留空间。会吉会禄则夫妻并肩创业、敬重相守;加煞逢忌则防激烈冲突反复,先约定冷静期机制,给彼此台阶。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.qisha.children',
    domain: 'star',
    entities: ['qishaMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '七杀在子女,子女倔强好动不服管,压制必反弹宜放手。',
    detail:
      '七杀入子女宫,子女性格倔强、精力旺盛、不服管教,有主见敢冒险,打压式教育必遭反弹。会吉则子女开创有成、早早独立成器;加煞则防叛逆冲撞与运动外伤,教养宜立大原则、放小细节,给舞台给挑战,其锋芒自会找到出口。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.qisha.wealth',
    domain: 'star',
    entities: ['qishaMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '七杀在财帛,财靠打拼开创进财猛,大进大出守成难。',
    detail:
      '七杀入财帛宫,赚钱靠冲劲与开创,敢拼敢抢,进财猛烈而起伏亦大,常见大进大出、孤注一掷之象,守成非其所长。会禄存化禄则拼劲有库承接、化杀为财;逢空劫加煞则防豪赌式投入血本无归,设仓位上限与止损线,赚快钱后先落袋。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.qisha.health',
    domain: 'star',
    entities: ['qishaMaj', 'healthPalace'],
    topics: ['health'],
    summary: '七杀在疾厄,注意肺气管筋骨,须防外伤开刀之应。',
    detail:
      '七杀属金,入疾厄宫传统应肺部、气管与筋骨之疾,并主金创外伤:跌打、利器、运动伤害须防,体质刚猛耐操但易硬撑成伤。会吉则体魄强健、恢复力佳;加煞逢忌则防意外伤害与开刀之应,骑车驾车控速、高风险活动护具到位,是最实际的趋避。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.qisha.surface',
    domain: 'star',
    entities: ['qishaMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '七杀在迁移,离乡打拼反开阔,在外冲劲足树敌亦易。',
    detail:
      '七杀入迁移宫,主出外打天下:离乡背井反而海阔天空,在外冲劲十足、敢闯敢抢,机会多在异地战场;然锋芒外露,树敌亦易。会吉会禄则他乡建功立业、闯出名号;加煞逢忌则防出外血光是非与交通意外,车速要收、脾气也要收。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.qisha.friends',
    domain: 'star',
    entities: ['qishaMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '七杀在仆役,交友重义气可共患难,强将难驯宜立章程。',
    detail:
      '七杀入仆役宫,交友重义气不重寒暄,朋友部属多强悍能干之人,可共患难冲锋,却难共安乐细水长流;强将如云,驾驭是课题。会吉则得敢打硬仗的班底、成事迅猛;加煞则防强友夺主、部属犯上,合作宜章程先行、权责先明,义气之外留制度。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.qisha.career',
    domain: 'star',
    entities: ['qishaMaj', 'careerPalace'],
    topics: ['career'],
    summary: '七杀在官禄,宜军警外科工程开创之业,独当一面成败烈。',
    detail:
      '七杀入官禄宫,事业属性刚烈:军警、外科、工程、竞技、开创型事业皆适性,善攻坚开疆、独当一面,不耐文牍与琐碎流程。会禄权吉曜则化杀为权、掌兵符将印,成就可观;加煞逢忌则防冲动决策致大起大落,重大攻势前设退路与复盘机制。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.qisha.property',
    domain: 'star',
    entities: ['qishaMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '七杀在田宅,置产靠自力打拼,进出快祖业难守。',
    detail:
      '七杀入田宅宫,不动产靠自己拼搏置办,买卖决断快、进出节奏猛,祖业多不守而喜亲手挣下的产业;家中气氛偏刚,各忙各的。会吉会禄则白手置产可观、越战越丰;逢煞忌则防急买急卖之损与因产纠纷,大宗交易冷静期不可省。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.qisha.spirit',
    domain: 'star',
    entities: ['qishaMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '七杀在福德,精神紧绷以挑战为乐,肃杀内转易焦躁。',
    detail:
      '七杀入福德宫,精神常处备战状态:好胜好斗、以挑战与征服为乐,闲下来反而不安,独来独往中带孤独感。会吉则志气昂扬、越挫越勇,活得酣畅;加煞逢忌则肃杀之气内转为焦躁失眠、易怒难安,高强度运动泄压与静态嗜好并行,是安顿之道。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.qisha.parents',
    domain: 'star',
    entities: ['qishaMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '七杀在父母,两代硬脾气聚少,早年离家距离生敬。',
    detail:
      '七杀入父母宫,与父母缘分偏淡:两代皆硬脾气,少温言互动,子女多早年离家自立,相处以简短实际为主。会吉则各自安好、遥相敬重,关键时仍互挺;加煞则防正面冲突留疤,成年后拉开距离反生孝敬,逢年过节的问候比朝夕相处更养情分。',
    confidence: 0.6,
  }),

  // ── 破军 ──────────────────────────────────────────
  entry({
    id: 'star.pojun.siblings',
    domain: 'star',
    entities: ['pojunMaj', 'siblingsPalace'],
    topics: ['family'],
    summary: '破军在兄弟,手足各奔前程聚散无常,不共财为宜。',
    detail:
      '破军入兄弟宫,兄弟姊妹各奔前程,人生轨迹差异大,手足情随阶段翻篇:亲疏起落、聚散无常。会吉则分头发展各有天地、偶聚仍有真情;加煞逢忌则防反目或财务相互牵连,兄弟合伙共财为大忌,帮衬以赠与心态、不求回收。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.pojun.spouse',
    domain: 'star',
    entities: ['pojunMaj', 'spousePalace'],
    topics: ['marriage'],
    summary: '破军在夫妻,配偶敢爱敢恨个性烈,婚姻波动宜晚婚磨合。',
    detail:
      '破军入夫妻宫,配偶个性强烈、敢爱敢恨,感情来得快烈,婚姻波动起伏大,分合戏码易反复;婚姻形式亦常不拘一格。传统宜晚婚、充分磨合再定。得化禄会禄则破中有立、愈挫愈合,患难见真情;加煞逢忌则防冲动决裂,重大决定过冷静期再落子。',
    confidence: 0.65,
  }),
  entry({
    id: 'star.pojun.children',
    domain: 'star',
    entities: ['pojunMaj', 'childrenPalace'],
    topics: ['family'],
    summary: '破军在子女,子女主见强敢闯敢破,不走安排放手反得。',
    detail:
      '破军入子女宫,子女主见极强、敢闯敢破,天生不走父母安排之路,越规划越叛逆,人生多半自己蹚出来。会吉则子女开创新局、闯出自己的天地;加煞则防两代路线之争长期拉锯,教养之道在给底线不给路线,放手反而收获惊喜与亲近。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.pojun.wealth',
    domain: 'star',
    entities: ['pojunMaj', 'wealthPalace'],
    topics: ['wealth'],
    summary: '破军在财帛,耗星坐财大破大立,敢投入须设止损线。',
    detail:
      '破军为耗星,入财帛宫主财来财去、大破大立:敢投入敢翻本,常见先破后得、推倒重来的财务曲线,细水长流非其风格。得化禄会禄存则破旧立新、越滚越大,置换资产反生财;逢空劫化忌则耗损剧烈,务必设止损线、留应急金,忌全押一注。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.pojun.health',
    domain: 'star',
    entities: ['pojunMaj', 'healthPalace'],
    topics: ['health'],
    summary: '破军在疾厄,注意消耗性劳损与肾水,防外伤开刀透支。',
    detail:
      '破军属水,入疾厄宫传统应肾水、生殖泌尿与消耗性疾患,拼起来不要命的用身方式易致劳损透支、旧伤复发;亦有外伤开刀之象。会吉则恢复力强、破后能补;加煞逢忌则防慢性消耗积成大症,劳逸有度、旧伤彻底治愈再上场,是保本之道。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.pojun.surface',
    domain: 'star',
    entities: ['pojunMaj', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '破军在迁移,出外变动大破旧开新,他乡闯荡谋定后动。',
    detail:
      '破军入迁移宫,出外变动频仍:换城市、换环境如家常便饭,旧局待不住,新路开在他乡,人生多次砍掉重练。会吉会禄则出外闯出新天地、破后有立;逢煞忌则防颠沛劳碌、屡迁无功,每次转场前先谋定落点与退路,变动才能变成台阶。',
    confidence: 0.62,
  }),
  entry({
    id: 'star.pojun.friends',
    domain: 'star',
    entities: ['pojunMaj', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '破军在仆役,朋友圈汰换快,共始难共终宜先谈退场。',
    detail:
      '破军入仆役宫,朋友圈新陈代谢快:旧雨新知交替,阶段性战友多,长情老友少;共事常轰轰烈烈开场、潦草收场。会吉则得敢冲敢拼的开创伙伴、成事于变局;加煞逢忌则防被拖累断尾、不欢而散,合伙先谈退场机制,散伙也能好聚好散。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.pojun.career',
    domain: 'star',
    entities: ['pojunMaj', 'careerPalace'],
    topics: ['career'],
    summary: '破军在官禄,宜开创改革转型之业,安稳岗位坐不住。',
    detail:
      '破军入官禄宫,事业才干在破局:开创、改革、转型操盘、拆旧建新之业皆适性,军警工程、创业救火亦宜,安稳重复的岗位反而坐不住、易自毁前程式辞职。得禄则先破后成、越战越勇,乱局是其舞台;加煞逢忌则防频繁归零、根基难积,转跑道须带走可迁移的战功。',
    confidence: 0.68,
  }),
  entry({
    id: 'star.pojun.property',
    domain: 'star',
    entities: ['pojunMaj', 'propertyPalace'],
    topics: ['wealth', 'family'],
    summary: '破军在田宅,家产变动大喜拆旧建新,大宗交易多核验。',
    detail:
      '破军入田宅宫,不动产多变动:喜旧屋翻新、拆建重整、以换代守,祖业倾向变现重置而非原样承守,搬迁频率亦高。会禄则以变现增值、越换越好;逢煞忌则防购售损耗、装修超支与频繁搬迁之耗,大宗交易多方核验、翻新预算打足余量。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.pojun.spirit',
    domain: 'star',
    entities: ['pojunMaj', 'spiritPalace'],
    topics: ['fortune', 'overview'],
    summary: '破军在福德,喜新厌旧求变求刺激,破立之间耗心神。',
    detail:
      '破军入福德宫,精神喜新厌旧,求变求刺激,兴趣与生活方式常推倒重来,平静日子过久便自寻波澜;破而后立的循环颇耗心神。会吉则活力充沛、敢想敢干,人生常换常新;加煞逢忌则内在动荡、易生倦怠虚无,在变动中保留几件不变的锚点习惯,心神方有着落。',
    confidence: 0.6,
  }),
  entry({
    id: 'star.pojun.parents',
    domain: 'star',
    entities: ['pojunMaj', 'parentsPalace'],
    topics: ['family'],
    summary: '破军在父母,两代观念断层大,早年多背离期望而行。',
    detail:
      '破军入父母宫,与父母观念断层明显:子女早年多有背离家庭期望之举——离家、转行、婚恋自主,两代磨合成本高。会吉则和而不同、各自成全,岁月与成就终能换来理解;加煞逢忌则防关系一度破裂,留一条问候的线不断,破后有立同样适用于亲情。',
    confidence: 0.6,
  }),
];
