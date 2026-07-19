/**
 * 古籍赋文条目库(40 条):
 * - 24 条格局解读,与 CLASSIC_PATTERNS(packages/core/src/data/patterns-classic.ts)一一对应,
 *   entities 采 ['pattern', '<格局id>'] 形态供格局信号命中;
 * - 16 条《骨髓赋》《太微赋》《形性赋》名句的星宫断语,entities 采
 *   单星 [star] / 星+宫 [star,palace] / 双星+宫 [a,b,palace] 形态供星宫信号命中。
 *
 * 全部为现代化转译:僧道→哲学修行气质,威镇边疆→外派开拓,刑讼→合规法务之才;
 * 凶格断语一律课题化,严禁宿命论。初稿 reviewStatus 默认 draft,升级须人工审核。
 */
import type { KnowledgeEntry } from '../schema.js';
import { entry, srcs } from './builder.js';

export const CLASSIC_ENTRIES: KnowledgeEntry[] = [
  // ==================================================== 一、格局条目(24)
  entry({
    id: 'pattern.fuxiang-chaoyuan',
    domain: 'pattern',
    entities: ['pattern', 'fuxiang-chaoyuan'],
    topics: ['overview', 'career', 'wealth'],
    summary: '府相朝垣:库星印星拱命,稳健受托之局,宜大平台管理与资源统筹。',
    detail:
      '天府为禄库、天相为印信,双星朝命,古断「千钟食禄」。此格之才在守成与受托:管钱、管章、管制度,愈大的平台愈能显其价值,宜财务、行政、运营、职业经理人路线。见禄存化禄则库中有物,格局更实;煞空入命或化忌冲照为破格,须先建立个人专业壁垒再谈平台,不宜空守头衔。',
    source: srcs.gusui('府相同来会命宫,全家食禄'),
    confidence: 0.8,
    guidance: {
      focus: ['受托与统筹之才', '平台越大越能兑现'],
      nuance: ['破格时先讲专业壁垒,再讲平台'],
      avoid: ['不可断言必然高位厚禄'],
    },
  }),
  entry({
    id: 'pattern.zifu-chaoyuan',
    domain: 'pattern',
    entities: ['pattern', 'zifu-chaoyuan'],
    topics: ['overview', 'career'],
    summary: '紫府朝垣:帝库双星三方来朝,起点视野高,宜借势成事。',
    detail:
      '命安寅申,紫微天府自三方拱照,古断「食禄万钟」。此格重「朝拱」而非「坐拥」——本人未必自带权柄,但极善借重要人物与大机构之势,宜在头部平台、核心圈层中经营位置。得辅弼魁钺则朝拱成网;空劫入命则朝拱成虚,须防依附而无实,破格处理是尽早沉淀不可替代的实务能力。',
    source: srcs.gusui('紫府朝垣,食禄万钟'),
    confidence: 0.8,
    guidance: {
      focus: ['借势与圈层经营', '头部平台适配'],
      nuance: ['朝拱之贵须自身有实务承接'],
      avoid: ['避免"贵人包办一切"式话术'],
    },
  }),
  entry({
    id: 'pattern.rili-zhongtian',
    domain: 'pattern',
    entities: ['pattern', 'rili-zhongtian'],
    topics: ['overview', 'career'],
    summary: '日丽中天:太阳午宫守命,光热外放,宜公众性、名誉驱动的事业。',
    detail:
      '太阳居午如日中天,古断「有专权之贵」。此格能量在「被看见」:公共事务、品牌、教育、传播等抛头露面的赛道最能兑现,行事光明磊落亦是其信用资产。课题是光热耗散——付出多而不计回收,须学会聚焦;太阳化忌或空劫入命为破格,名誉与口碑管理成为首要功课,宜先做实再扬名。',
    source: srcs.quanshu('太阳居午,谓之日丽中天,有专权之贵,敌国之富'),
    confidence: 0.8,
    guidance: {
      focus: ['公众性事业与名誉资产'],
      nuance: ['光热外放须配聚焦纪律'],
      avoid: ['不可断言必大富大贵'],
    },
  }),
  entry({
    id: 'pattern.yuelang-tianmen',
    domain: 'pattern',
    entities: ['pattern', 'yuelang-tianmen'],
    topics: ['overview', 'wealth', 'career'],
    summary: '月朗天门:太阴亥宫守命,静水深流,宜以专业与积累成富局。',
    detail:
      '太阴居亥入庙,月照天门,古断「蟾宫折桂」。此格之才在沉静深研与细水长流:理财、研究、设计、文教等重积累的路线最适配,财富曲线是复利型而非爆发型。太阴化禄化科则名利双清;化忌或空劫掩月为破格,情绪内耗与优柔是主课题,宜建立定期复盘与决断机制。',
    source: srcs.quanshu('太阴居亥,号曰月朗天门,入庙化吉,蟾宫折桂'),
    confidence: 0.8,
    guidance: {
      focus: ['复利式积累', '沉静深研之才'],
      nuance: ['月主藏,断语宜柔不宜烈'],
      avoid: ['避免"闷声大发财"式投机暗示'],
    },
  }),
  entry({
    id: 'pattern.yuesheng-canghai',
    domain: 'pattern',
    entities: ['pattern', 'yuesheng-canghai'],
    topics: ['overview', 'career'],
    summary: '月生沧海:太阴子宫守命,水澄月皎,宜清要之职与谏议之才。',
    detail:
      '太阴居子,古称「水澄桂萼,得清要之职,忠谏之材」。此格气质清而不争,长于洞察与直言有据,宜研究、审计、参谋、编辑等「清要」岗位——位置不必喧哗,却在关键处有分量。同阴同守则福智相济;煞星入命扰其清辉,课题是在直言与自保之间拿捏分寸。',
    source: srcs.gusui('太阴居子,号曰水澄桂萼,得清要之职,忠谏之材'),
    confidence: 0.8,
    guidance: {
      focus: ['洞察与谏议之才', '清要岗位适配'],
      nuance: ['古籍另有田宅口径,本条从命宫口径'],
      avoid: ['不作"清高不合群"负面标签'],
    },
  }),
  entry({
    id: 'pattern.riyue-tonglin',
    domain: 'pattern',
    entities: ['pattern', 'riyue-tonglin'],
    topics: ['overview', 'career'],
    summary: '日月同临:阴阳双主同守命宫,刚柔并济,宜跨界与双轨发展。',
    detail:
      '太阳太阴同守丑未,古断「官居侯伯」。日主动、月主藏,双主同宫者性格常有两副面孔——对外进取、对内细腻,天然适合需要双重能力的岗位:对外拓展兼内部管理、创作兼经营。丑未日月必有一曜失辉,故一生常在两种节奏间切换,课题是接纳自身的两面而非强行统一;昌曲辅弼会照则两面皆可成器。',
    source: srcs.quanshu('日月同临,官居侯伯'),
    confidence: 0.8,
    guidance: {
      focus: ['刚柔双轨之才', '跨界岗位适配'],
      nuance: ['必有一曜失辉,断语须留余地'],
      avoid: ['不作"性格分裂"式表述'],
    },
  }),
  entry({
    id: 'pattern.juji-jumao',
    domain: 'pattern',
    entities: ['pattern', 'juji-jumao'],
    topics: ['career', 'overview'],
    summary: '巨机居卯:口才与机变同宫,宜以言语与策划立身。',
    detail:
      '巨门天机同守卯宫,古断「公卿之位」。巨门主口才辨析,天机主谋略机变,二者合璧即「会说话的军师」:法务、咨询、谈判、传媒、产品策划皆为正路。巨门化禄天机化权则言谋并显;四煞入命或化忌冲照,口舌是非风险上升,课题是把锋利的表达装进专业的鞘里。',
    source: srcs.gusui('巨机居卯,公卿之位'),
    confidence: 0.8,
    guidance: {
      focus: ['言语专业化路线', '策划谋略之才'],
      nuance: ['居酉减力不入正格'],
      avoid: ['不断言必居高位'],
    },
  }),
  entry({
    id: 'pattern.tanwu-tongxing',
    domain: 'pattern',
    entities: ['pattern', 'tanwu-tongxing'],
    topics: ['wealth', 'career', 'fortune'],
    summary: '贪武同行:财星欲星同宫,先蓄后发,三十而后大展。',
    detail:
      '武曲贪狼同守丑未,古断「威镇边夷」而又明言「先贫后富」。此格是典型的后发格局:年轻时多在打底与试错,中年后执行力(武)与机遇嗅觉(贪)合流,爆发力强,宜实业、市场开拓、外派攻坚。会火铃兼具横发之势,但守成课题随之而来;空劫入命则发而难守,落袋纪律是第一功课。少年期解读应导向蓄力,不宜催促早成。',
    source: srcs.gusui('先贫而后富,武贪同身命之宫'),
    confidence: 0.8,
    guidance: {
      focus: ['后发型曲线', '执行力与机遇嗅觉并用'],
      nuance: ['「威镇边夷」转译为外派开拓之才'],
      avoid: ['不可鼓励投机求快'],
    },
  }),
  entry({
    id: 'pattern.lianzhen-wenwu',
    domain: 'pattern',
    entities: ['pattern', 'lianzhen-wenwu'],
    topics: ['career', 'overview'],
    summary: '廉贞文武:次桃花会文星,才艺纵横,宜文武兼资的复合岗位。',
    detail:
      '廉贞守命而昌曲会照,古断「命中文武喜朝垣」。廉贞本主干练果决,得文星则刚中带秀,典型的多面手:既能冲业务又能写方案,宜项目管理、市场、公关、创意执行等复合岗位。廉贞化忌为破格,感情与是非课题突出,须公私分明;煞聚则才艺流于浮华,深耕一技为解。',
    source: srcs.quanshu('廉贞文武格:命中文武喜朝垣,入庙平生福气全'),
    confidence: 0.8,
    guidance: {
      focus: ['复合型才干', '文武兼资岗位'],
      nuance: ['廉贞次桃花之魅力是职场资产亦是课题'],
      avoid: ['不作感情是非的指控式推断'],
    },
  }),
  entry({
    id: 'pattern.xiongsu-chaoyuan',
    domain: 'pattern',
    entities: ['pattern', 'xiongsu-chaoyuan'],
    topics: ['career', 'overview'],
    summary: '雄宿朝元:廉贞寅申入庙,干练之名远播,宜实权岗位。',
    detail:
      '廉贞居寅申入庙守命,古断「富贵声扬播远名」。廉贞化气为囚而入庙反成「雄宿」——纪律、手腕、执行力俱强,宜带团队、管项目、掌流程的实权路线,军警、工程、运营尤佳。古诀以「无杀」为条件,四煞入命即破格,刚性过头变摩擦,课题是把控制欲转化为制度建设;廉贞化忌则须格外注意合规与文书。',
    source: srcs.quanshu('廉贞寅申宫,无杀,富贵声扬播远名'),
    confidence: 0.8,
    guidance: {
      focus: ['实权与执行路线'],
      nuance: ['「无杀」为古诀硬条件,破格须明示'],
      avoid: ['避免"官运亨通"式断言'],
    },
  }),
  entry({
    id: 'pattern.yingxing-rumiao',
    domain: 'pattern',
    entities: ['pattern', 'yingxing-rumiao'],
    topics: ['career', 'fortune'],
    summary: '英星入庙:破军子午,先破后立,宜开创与转型之才。',
    detail:
      '破军居子午入庙,古断「官资清显至三公」。破军为耗星,入庙则破坏力转为开创力:敢拆旧局、敢立新章,宜创业、改革型岗位、新业务从零到一。得禄权则「破而后立」节奏可控;命见昌曲反为破格(古诀破军畏昌曲),理想化包装与实际执行脱节是其课题,宜以结果说话。一生多有几次主动推倒重来,解读时应把「变动」定调为方法而非灾祸。',
    source: srcs.quanshu('破军子午宫,无杀,官资清显至三公'),
    confidence: 0.8,
    guidance: {
      focus: ['从零到一的开创力', '转型窗口把握'],
      nuance: ['昌曲反成破格是本格特殊处'],
      avoid: ['不将变动渲染为灾祸'],
    },
  }),
  entry({
    id: 'pattern.tianyi-gongming',
    domain: 'pattern',
    entities: ['pattern', 'tianyi-gongming'],
    topics: ['overview', 'career', 'fortune'],
    summary: '天乙拱命:魁钺双贵拱照,关键节点常有人托一把。',
    detail:
      '天魁天钺俱会命垣,古断「魁钺命身多折桂」。此格的资产是「贵人网络」:考试、求职、晋升等关键节点常得师长前辈提携,宜主动经营长辈缘与专业社群。须知贵人只降临在有准备的人身上——自身功课到位,拱贵才有着力点;煞空入命则贵人之力打折,课题是先自立后借力,勿养成依赖心。',
    source: srcs.gusui('魁钺命身多折桂'),
    confidence: 0.8,
    guidance: {
      focus: ['贵人网络经营', '关键节点借力'],
      nuance: ['坐贵向贵为近似口径'],
      avoid: ['避免"躺等贵人"话术'],
    },
  }),
  entry({
    id: 'pattern.wengui-wenhua',
    domain: 'pattern',
    entities: ['pattern', 'wengui-wenhua'],
    topics: ['career', 'overview'],
    summary: '文桂文华:昌曲齐会,文华之贵,宜以作品与文凭立身。',
    detail:
      '文昌文曲同会命垣,古断「九重贵显」。此格才华在表达与审美:文笔、口条、艺术感兼具,考运亦佳,宜学术、创作、文教、内容行业,「作品集」与「资历认证」是其最硬的通货。化科会照则名声有正途;空劫入命文华易流于虚浮,课题是把才气落成可交付的成果,以截稿日期治散漫。',
    source: srcs.gusui('文桂文华,九重贵显'),
    confidence: 0.8,
    guidance: {
      focus: ['作品化与认证路线', '考运优势'],
      nuance: ['才华须以交付物落地'],
      avoid: ['不断言必然科甲连登'],
    },
  }),
  entry({
    id: 'pattern.fubi-gongzhu',
    domain: 'pattern',
    entities: ['pattern', 'fubi-gongzhu'],
    topics: ['career', 'family', 'overview'],
    summary: '辅弼拱主:左右手俱全,得众之局,宜带团队成大事。',
    detail:
      '左辅右弼拱照命中主星,古断「辅弼拱主为上品」。此格最大资产是「有人跟随」:人缘厚、口碑好,交办之事总有人接,宜管理、组织、联盟型事业,成就大小取决于所拱之主星格局。煞空入命则助力打折,课题是识人与授权——帮手多亦须建制度,勿以人情代管理。',
    source: srcs.gusui('左辅右弼,秉性克宽克厚'),
    confidence: 0.8,
    guidance: {
      focus: ['团队与制度建设', '得众之才'],
      nuance: ['成就上限看主星,辅弼是放大器'],
      avoid: ['不作"一呼百应"夸大'],
    },
  }),
  entry({
    id: 'pattern.shuanglu-chaoyuan',
    domain: 'pattern',
    entities: ['pattern', 'shuanglu-chaoyuan'],
    topics: ['wealth', 'fortune'],
    summary: '双禄朝垣:禄存化禄齐会,财源与积蓄双全之局。',
    detail:
      '禄存与化禄同会命垣三方,古断「富比陶朱」。禄存主积蓄之财、化禄主机缘之财,双禄齐会则开源与守成兼备,宜主业深耕加稳健理财的双轮模式。古诀最忌空劫——空劫一冲双禄成虚,杠杆与担保是此格红线;得辅弼昌曲护禄方为正格。解读时富局须落到现金流纪律,不渲染财富数字。',
    source: srcs.gusui('双禄朝垣,富比陶朱'),
    confidence: 0.8,
    guidance: {
      focus: ['开源守成双轮', '现金流纪律'],
      nuance: ['禄合鸳鸯(双禄同宫)为其加强形'],
      avoid: ['严禁财富数字承诺与投机暗示'],
    },
  }),
  entry({
    id: 'pattern.luma-jiaochi',
    domain: 'pattern',
    entities: ['pattern', 'luma-jiaochi'],
    topics: ['wealth', 'career', 'fortune'],
    summary: '禄马交驰:禄随马动,动中生财,宜异地与流动型事业。',
    detail:
      '天马与禄存(或化禄)同会,古断「发财远郡」。此格财气在「动」:离开出生地、跨城跨境、差旅型业务反而财源更旺,宜贸易、物流、外派、跨境电商等流动赛道。命居四马之地动象最真;空劫会照为马落空亡、陀罗会照为折足马,皆主奔忙耗损,课题是选对值得跑的方向,以复盘止住无效奔波。',
    source: srcs.gusui('禄马交驰,发财远郡'),
    confidence: 0.8,
    guidance: {
      focus: ['异地发展与流动型财源'],
      nuance: ['动是手段,复盘定方向'],
      avoid: ['不鼓励盲目迁徙跳槽'],
    },
  }),
  entry({
    id: 'pattern.matou-daijian',
    domain: 'pattern',
    entities: ['pattern', 'matou-daijian'],
    topics: ['career', 'fortune', 'health'],
    summary: '马头带箭:午宫擎羊,锋刃之才,宜外派开拓与高强度专业。',
    detail:
      '擎羊守命午宫,古断「威镇边疆」。此为贵险并存之格:冲劲、胆识、抗压皆过人,放在开疆场景是利器——外派攻坚、军警消防、外科急诊、竞技体育皆其正途;放在安逸场景反成内耗。会杀破狼则锋刃有所用,魁钺照则险中有援。课题化解读:锋利须配安全纪律(交通、运动防护、情绪降温),把「箭」射向目标而非自己人。',
    source: srcs.quanshu('马头带箭,威镇边疆'),
    confidence: 0.8,
    guidance: {
      focus: ['高强度赛道适配', '外派开拓之才'],
      nuance: ['贵与险并陈,缺一即失真'],
      avoid: ['严禁血光意外式恐吓断言'],
    },
  }),
  entry({
    id: 'pattern.jiju-maoyou',
    domain: 'pattern',
    entities: ['pattern', 'jiju-maoyou'],
    topics: ['overview', 'fortune'],
    summary: '极居卯酉:帝星会欲星,宜哲学修行气质与人文艺术之路。',
    detail:
      '紫微贪狼同守卯酉,古断「多为脱俗僧人」——现代转译:此格内在张力在「尊贵感」与「欲望多元」之间,常对世俗成功既投入又疏离,精神性追求强,宜哲学、宗教研究、心理、艺术、文化创意等能安放形而上关怀的领域。昌曲会照才艺哲思并具;四煞会照则欲念与理想相扰,课题是为自己建立修行式的日常秩序(阅读、静坐、创作),在入世与出世间自如切换,而非二选一。',
    source: srcs.gusui('极居卯酉,多为脱俗僧人'),
    confidence: 0.8,
    guidance: {
      focus: ['精神性追求的正向安放', '人文艺术领域适配'],
      nuance: ['「僧人」仅取其超脱气质,非身份预言'],
      avoid: ['严禁出家、孤独终老类断言'],
    },
  }),
  entry({
    id: 'pattern.riyue-fanbei',
    domain: 'pattern',
    entities: ['pattern', 'riyue-fanbei'],
    topics: ['overview', 'career', 'fortune'],
    summary: '日月反背:光辉内敛,先劳后得,大器晚成之局。',
    detail:
      '命宫日月失辉,古称「日月最嫌反背」。课题化解读:反背非无光,而是光不在正面舞台——年轻时易有怀才不遇之感,付出与回报错位;其优势恰在幕后与深耕:研究、技术、运营中台、异地市场,离开聚光灯反而步步为营。得禄得吉则「先劳后成」曲线明确,中年后常有翻盘之应。解读须给出发力方向(幕后、异地、长线),严禁「劳碌命」宿命话术。',
    source: srcs.quanshu('日月最嫌反背'),
    confidence: 0.8,
    guidance: {
      focus: ['幕后深耕与异地发展', '晚成曲线'],
      nuance: ['反背之劳是路径特征,不是判词'],
      avoid: ['严禁劳碌命、苦命等宿命标签'],
    },
  }),
  entry({
    id: 'pattern.liangma-piaodang',
    domain: 'pattern',
    entities: ['pattern', 'liangma-piaodang'],
    topics: ['career', 'fortune', 'family'],
    summary: '梁马飘荡:荫星陷地逢马,高流动人生,课题在建立锚点。',
    detail:
      '天梁陷于巳亥又逢天马,古断「飘荡无疑」。课题化解读:此格人生流动性天然偏高——迁居、转行、跨境的频率高于常人,与其抗拒不如顺势选择流动型职业:航旅、外贸、驻外、自由职业、国际组织。得禄存化禄则飘荡转为禄马交驰,动而有获;空劫会照则须防「为动而动」。核心功课是在流动中建立锚点:一技傍身、一份长期关系、一套随身的生活秩序。',
    source: srcs.quanshu('天梁天马陷,飘荡无疑'),
    confidence: 0.8,
    guidance: {
      focus: ['流动型职业适配', '锚点建设'],
      nuance: ['见禄即化,凶中有用'],
      avoid: ['严禁无根漂泊、六亲缘薄类断言'],
    },
  }),
  entry({
    id: 'pattern.zhensha-tonggong',
    domain: 'pattern',
    entities: ['pattern', 'zhensha-tonggong'],
    topics: ['career', 'health', 'fortune'],
    summary: '贞杀同宫:囚星将星相并,刚烈自律,宜刚性专业并守安全纪律。',
    detail:
      '廉贞七杀同守丑未,古断语惨烈,今取其戒:此格性刚志坚、临事果决,正向出路是纪律性极强的刚性专业——军警、外科、风控、安全工程、竞技体育,愈严苛的规则环境愈能成器。课题化解读:高风险场景的安全纪律与守法意识是终身功课,行车、涉险活动、法律边界须格外自持;廉贞化忌之年尤须谨慎文书与出行。得禄则刚性得润,古有「遇帝禄而解其厄」之说。',
    source: srcs.quanshu('七杀廉贞同位,路上埋尸'),
    confidence: 0.8,
    guidance: {
      focus: ['刚性专业出路', '安全与守法纪律'],
      nuance: ['古断只作警语背景,不进入断语正文'],
      avoid: ['严禁灾祸预言与死亡意象'],
    },
  }),
  entry({
    id: 'pattern.xingqiu-yinju',
    domain: 'pattern',
    entities: ['pattern', 'xingqiu-yinju'],
    topics: ['career', 'fortune'],
    summary: '刑囚印聚:刑星囚星会印星,与规则纠缠一生,正用即法务之才。',
    detail:
      '廉贞(囚)天相(印)擎羊(刑)同聚命宫,古断「刑杖惟司」。课题化解读:此格一生与规则、契约、文书的关系格外紧密——用得好是执法者、用不好是涉讼者。正向发挥即法律、审计、合规、监察、质检之才,把「刑」变成手中的尺;反面课题是签约谨慎、程序意识、远离灰色地带,重大文件必留痕必审阅。得禄魁钺会照,讼事有解且专业路顺。',
    source: srcs.quanshu('刑囚夹印,刑杖惟司'),
    confidence: 0.8,
    guidance: {
      focus: ['法务合规专业适配', '契约与程序意识'],
      nuance: ['「夹印」采三曜同聚之简化口径'],
      avoid: ['严禁牢狱之灾式断言'],
    },
  }),
  entry({
    id: 'pattern.jufeng-sisha',
    domain: 'pattern',
    entities: ['pattern', 'jufeng-sisha'],
    topics: ['career', 'family', 'fortune'],
    summary: '巨逢四煞:暗曜逢煞,言语风波课题,出路在把口才专业化。',
    detail:
      '巨门守命而四煞同宫,古断陷而多咎。课题化解读:巨门之口才本是资产,逢煞则表达易带火气与猜疑,是非、误解、网络争议是此格的高频课题。功课有三:一慢半拍再发言,二重要沟通留文字,三把锋利用在专业处——谈判、辩护、评论、危机公关正是「以言为业」的化解之道。巨门化禄化权则口才登堂入室;化忌加煞之年谨守「少辩多做」。',
    source: srcs.gusui('巨门陀罗,必生异痣;巨火擎羊,防罹缧绁'),
    confidence: 0.8,
    guidance: {
      focus: ['言语专业化出路', '沟通风控三功课'],
      nuance: ['古断极端语一律不引入正文'],
      avoid: ['严禁官非、横祸类恐吓'],
    },
  }),
  entry({
    id: 'pattern.mingfeng-kongjie',
    domain: 'pattern',
    entities: ['pattern', 'mingfeng-kongjie'],
    topics: ['wealth', 'overview', 'fortune'],
    summary: '命里逢空:空劫守命,想象力与财务波动并存,宜务虚生实。',
    detail:
      '地空地劫守命,古断「不飘流即主疾苦」「半天折翅」。课题化解读:空劫的本质是「不按牌理出牌」——想象力、原创性、对虚拟事物的敏感度远超常人,宜哲学、创意、研发、数字内容等务虚生实的领域;其财务面课题是波动大、易破在新奇事物上,理财三纪律:低杠杆、强制储蓄、大额支出冷静期。双空同守波动最著,得禄得吉则空处生实。命理上「空」亦主悟性,引导当事人把损失转为觉察即是正解。',
    source: srcs.gusui('命里逢空,不飘流即主疾苦'),
    confidence: 0.8,
    guidance: {
      focus: ['原创力与务虚生实赛道', '理财三纪律'],
      nuance: ['空主悟性,凶格亦有正用'],
      avoid: ['严禁破财命、飘泊命断言'],
    },
  }),

  // ============================================ 二、赋文星宫断语条目(16)
  entry({
    id: 'classic.gusui.ziwei-wu',
    domain: 'star',
    entities: ['ziweiMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '紫微守命而无刑忌相扰,格局清正,宜居枢纽要位。',
    detail:
      '骨髓赋断紫微居午「无刑忌,位至公卿」——转译为:紫微坐命者若命垣清吉(无煞忌搅局),其统御与担当可直上高阶管理与公共事务枢纽;若见刑忌,则领导欲须先过自我修炼一关,从管好一件小事开始积累威信。',
    source: srcs.gusui('紫微居午,无刑忌,位至公卿'),
    confidence: 0.8,
    guidance: {
      focus: ['清吉与否决定领导力兑现度'],
      nuance: ['「公卿」转译为高阶管理与公共事务'],
      avoid: ['不作官位承诺'],
    },
  }),
  entry({
    id: 'classic.gusui.fuxiang-ming',
    domain: 'combination',
    entities: ['tianfuMaj', 'tianxiangMaj', 'soulPalace'],
    topics: ['overview', 'wealth', 'career'],
    summary: '府相会命,衣禄之神同临,稳健受托,一生用度有根。',
    detail:
      '古云「府相同来会命宫,全家食禄」。天府主库、天相主印,同会命垣者天然带「管家气质」:稳健、可托付、重承诺,适合掌资源、掌流程的位置;财务上倾向保守配置,是家庭与团队的压舱石。课题是求稳有余而开拓不足,宜有意识给自己设突破小目标。',
    source: srcs.gusui('府相同来会命宫,全家食禄'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.taiwei.jiliang',
    domain: 'combination',
    entities: ['tianjiMaj', 'tianliangMaj', 'soulPalace'],
    topics: ['career', 'overview'],
    summary: '机梁同会,善谈兵机,宜策略、教研与顾问之才。',
    detail:
      '《太微赋》云「机梁会合善谈兵」。天机主谋、天梁主荫,同会者长于分析局势、推演方案、指点后进——是天生的策略顾问与老师坯子,宜咨询、教育、参谋、评论。课题是「谈兵」易多于「练兵」,须以实操项目校准纸上推演。',
    source: { level: 'classic', ref: '《太微赋》:「机梁会合善谈兵。」' },
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.wuqu-miao',
    domain: 'star',
    entities: ['wuquMaj', 'soulPalace'],
    topics: ['career', 'wealth'],
    summary: '武曲庙垣守命,执行与理财之名远播,宜财经实业。',
    detail:
      '骨髓赋云「武曲庙垣,威名赫奕」。武曲为财星、将星,入庙守命者行动果决、账目分明,在财务、金融、实业、工程领域最易立起专业威望。课题是刚直少弯——沟通上多给一步台阶,威名会更长久;女命男命同论,不作「孤克」旧断。',
    source: srcs.gusui('武曲庙垣,威名赫奕'),
    confidence: 0.8,
    guidance: { focus: ['财经实业专业威望'], nuance: ['刚直是资产也是课题'], avoid: ['不引孤克旧断'] },
  }),
  entry({
    id: 'classic.xingxing.tiantong',
    domain: 'star',
    entities: ['tiantongMaj', 'soulPalace'],
    topics: ['overview', 'health'],
    summary: '天同守命,福星临垣,亲和知足,宜服务与协调型角色。',
    detail:
      '《形性赋》状天同「肥满,目秀清奇」,为福星之相——转译为:天同坐命者亲和力强、心态松弛、审美好,人缘是其天然资产,宜服务业、协调岗、生活方式领域。课题是安逸倾向:福星要「先劳后享」才守得住福,宜给自己设定阶段性挑战以防温水化。',
    source: { level: 'classic', ref: '《形性赋》:「天同肥满,目秀清奇。」' },
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.liang-wu',
    domain: 'star',
    entities: ['tianliangMaj', 'soulPalace'],
    topics: ['career', 'overview'],
    summary: '天梁守命(午垣尤佳),荫星清显,宜医教法务与公益。',
    detail:
      '骨髓赋云「梁居午位,官资清显」。天梁化气为荫,坐命者有长者风与原则感,遇事能扛能解,宜医疗、教育、法律、监察、公益等「护人」行业,清誉是其一生资本。课题是好为人师与操心过界,学会「被请教再出手」则人缘官声两全。',
    source: srcs.gusui('梁居午位,官资清显'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.changqu-ming',
    domain: 'combination',
    entities: ['wenchangMin', 'wenquMin', 'soulPalace'],
    topics: ['career', 'overview'],
    summary: '昌曲同守命垣,多学多能,宜考试认证与内容创作双线并进。',
    detail:
      '古云「文昌文曲,为人多学多能」。昌主正途文书、曲主口才才艺,同守命垣者学东西快、表达好、考运佳,文凭认证与作品创作是两条都走得通的路。课题是兴趣发散:多能易而专精难,宜以「一主两辅」框定学习版图。',
    source: srcs.quanshu('文昌文曲,为人多学多能'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.fubi-ming',
    domain: 'combination',
    entities: ['zuofuMin', 'youbiMin', 'soulPalace'],
    topics: ['overview', 'family', 'career'],
    summary: '辅弼守命,宽厚得众,天生的副手之才与团队黏合剂。',
    detail:
      '骨髓赋云「左辅右弼,秉性克宽克厚」。辅弼坐命者温厚可靠、乐于成人之美,团队里人人愿与之共事,是极佳的二号人物与跨部门黏合剂;帮衬他人亦常获回流之助。课题是容易替人扛事,学会说不与明确边界,厚道才不被消耗。',
    source: srcs.gusui('左辅右弼,秉性克宽克厚'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.kuiyue-ming',
    domain: 'combination',
    entities: ['tiankuiMin', 'tianyueMin', 'soulPalace'],
    topics: ['career', 'fortune'],
    summary: '魁钺守命,科名贵人之应,关键考核常有师长援手。',
    detail:
      '骨髓赋云「魁钺命身多折桂」。魁为天乙贵人、钺为玉堂贵人,坐命者在考试、答辩、评审等关键场合常遇「懂你的人」,宜主动维系师长与前辈网络,行业社群即福田。转译提醒:折桂之应立足于平时功课,贵人是放大器不是发动机。',
    source: srcs.gusui('魁钺命身多折桂'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.lucun-cai',
    domain: 'star',
    entities: ['lucunMin', 'wealthPalace'],
    topics: ['wealth'],
    summary: '禄存守财帛,积蓄之神入库,细水长流终成丰盈。',
    detail:
      '骨髓赋云「禄存守于田财,堆金积玉」。禄存入财帛者进财未必最快,守财却最稳:记账、储蓄、定投这类「笨功夫」在其手中复利惊人,宜稳健配置忌高杠杆。课题是过俭致机会成本上升——该投资自己时不要吝啬。',
    source: srcs.gusui('禄存守于田财,堆金积玉'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.tianma-qian',
    domain: 'star',
    entities: ['tianmaMin', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '天马居迁移,动象在外,异地与差旅中机会最多。',
    detail:
      '古诀「禄马最喜交驰」,天马入迁移者动能全在外域:换城市、跑市场、跨境协作往往比原地深耕更出成绩,宜把「出差半径」当作事业资源经营。会禄存化禄则动中生财;逢空劫则须先定方向再启程,防无效奔波。',
    source: srcs.quanshu('禄马最喜交驰'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.yanghuo-ming',
    domain: 'combination',
    entities: ['qingyangMin', 'huoxingMin', 'soulPalace'],
    topics: ['career', 'health'],
    summary: '擎羊火星同守命垣,锋火并见,竞争场上的爆发型选手。',
    detail:
      '古云「擎羊火星,威权出众」(庙旺之地)。羊火同宫者胆识与爆发力兼具,在强竞争、快节奏场景(销售冲锋、竞技、急救、创业早期)反而如鱼得水。课题化提醒:锋火伤人先伤己——情绪降温机制、运动泄压与安全防护是标配,庙旺者化煞为权,失地者先修耐性。',
    source: srcs.quanshu('擎羊火星,威权出众'),
    confidence: 0.8,
    guidance: { focus: ['强竞争场景适配'], nuance: ['庙旺失地成色悬殊'], avoid: ['不作血光断言'] },
  }),
  entry({
    id: 'classic.gusui.juri-ming',
    domain: 'combination',
    entities: ['taiyangMaj', 'jumenMaj', 'soulPalace'],
    topics: ['career', 'overview'],
    summary: '巨日同宫守命,光照暗曜,以公开表达立身,声名可及远方。',
    detail:
      '骨髓赋云「巨日同宫,官封三代」。太阳之光化巨门之暗,同宫守命者口才有格局、敢在公开场合发声,宜传媒、外交、教培、涉外业务——尤其利于「对外国人、外地人」的生意与声名。课题是言多必失的风险管理,重大表态先打草稿。',
    source: srcs.gusui('巨日同宫,官封三代'),
    confidence: 0.8,
  }),
  entry({
    id: 'classic.gusui.taiyin-quwenqu',
    domain: 'combination',
    entities: ['taiyinMaj', 'wenquMin', 'spousePalace'],
    topics: ['marriage', 'career'],
    summary: '太阴会文曲于夫妻宫,配偶清雅有文,亦主自身因偶得助成名。',
    detail:
      '骨髓赋云「太阴会文曲于妻宫,蟾宫折桂,文章全盛」。转译为:夫妻宫见太阴文曲者,伴侣多温润有审美、重精神交流,婚姻质量与共同的文化生活高度相关;且配偶常是事业的隐形助力(人脉、见识、后勤)。经营之道在保持共同学习与仪式感,忌把细腻当作理所当然。',
    source: srcs.gusui('太阴会文曲于妻宫,蟾宫折桂,文章全盛'),
    confidence: 0.8,
    guidance: { focus: ['伴侣助力与精神共鸣'], nuance: ['原文限「妻宫」,今男女同论'], avoid: ['不作嫁贵娶贵承诺'] },
  }),
  entry({
    id: 'classic.gusui.tanlang-fanshui',
    domain: 'star',
    entities: ['tanlangMaj', 'soulPalace'],
    topics: ['overview', 'marriage'],
    summary: '贪狼守命于水地,魅力丰沛,情感与社交须立边界。',
    detail:
      '骨髓赋云「贪居亥子,名为泛水桃花」。贪狼坐命(尤在亥子水地)者魅力与社交能量丰沛,是市场、公关、演艺的天然选手;课题化解读:桃花是流量,边界是堤坝——感情上明确承诺、职场上公私分明,则魅力全数转为事业资产;逢空劫反主才艺清雅,欲望转入审美。',
    source: srcs.gusui('贪居亥子,名为泛水桃花'),
    confidence: 0.8,
    guidance: { focus: ['魅力资产化'], nuance: ['水地之象最著,他宫减等'], avoid: ['不作滥情标签与私德指控'] },
  }),
  entry({
    id: 'classic.wenda.jumen-ming',
    domain: 'star',
    entities: ['jumenMaj', 'soulPalace'],
    topics: ['career', 'overview'],
    summary: '巨门守命,化气为暗而长于口才,以言得禄是正路。',
    detail:
      '《诸星问答论》谓巨门「化气为暗,主是非」,而其正用恰是口才与辨析:教师、律师、主播、谈判代表皆以言立业,巨门化禄更是「以口生财」的明证。课题是暗曜之疑——易多想、易与人生隙,功课在把质疑精神用于专业求证,而非人际猜度。',
    source: { level: 'annotated', ref: '《紫微斗数全书》卷二·诸星问答论(巨门章)' },
    confidence: 0.8,
  }),
];
