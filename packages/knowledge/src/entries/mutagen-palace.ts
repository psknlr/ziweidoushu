/**
 * 生年四化入十二宫条目(禄/权/科/忌 × 12 宫)。
 * 排除 忌×夫妻(mutagen.ji.spouse)与 禄×官禄(mutagen.lu.career),二者已在 curated.ts。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

const SRC = srcs.modern('近人四化释义通说');

export const MUTAGEN_PALACE_ENTRIES: KnowledgeEntry[] = [
  // ---------------------------------------------------------------- 化禄 × 11 宫(官禄见 curated)
  entry({
    id: 'mutagen.lu.soul',
    domain: 'mutagen',
    entities: ['sihuaLu', 'soulPalace'],
    topics: ['overview', 'fortune'],
    summary: '生年禄入命宫,一生资源缘分较足,人缘佳心态乐观。',
    detail:
      '化禄主缘分与资源,入命宫者自带福泽,处事圆融讨喜,机会常主动上门,凡事留有余地;但顺遂易生随缘心态,须防散漫少积累。得禄仍需行动转化,方能落袋为安。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.siblings',
    domain: 'mutagen',
    entities: ['sihuaLu', 'siblingsPalace'],
    topics: ['family'],
    summary: '生年禄入兄弟宫,手足缘厚有情,平辈贵人与合作资源多。',
    detail:
      '化禄入兄弟宫,兄弟姊妹相处融洽、互有帮衬,平辈同侪易成贵人,合伙共事得资源支援;亦主家中经济周转有靠。惟情分与金钱宜分清账目,防因好说话而承担过多。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.spouse',
    domain: 'mutagen',
    entities: ['sihuaLu', 'spousePalace'],
    topics: ['marriage'],
    summary: '生年禄入夫妻宫,配偶缘分佳能得其助,感情相处融洽。',
    detail:
      '化禄入夫妻宫,异性缘与婚恋机会较早较顺,配偶多有资源或旺己之力,婚后彼此滋养;何星化禄决定相处基调,如天同禄重情趣、武曲禄重实惠。异性缘好也是课题,婚后宜守边界。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.children',
    domain: 'mutagen',
    entities: ['sihuaLu', 'childrenPalace'],
    topics: ['family'],
    summary: '生年禄入子女宫,子女缘厚亲子和乐,晚辈下属得力。',
    detail:
      '化禄入子女宫,子女聪敏可爱、亲子关系融洽,教养上舍得投入亦有回报;引申主门生晚辈、合伙股东缘分好,共事得利。桃花人缘亦旺,际遇虽好仍宜有分寸。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.wealth',
    domain: 'mutagen',
    entities: ['sihuaLu', 'wealthPalace'],
    topics: ['wealth'],
    summary: '生年禄入财帛宫,进财机会多财源顺遂,赚钱有缘分。',
    detail:
      '化禄入财帛宫,取财路径顺、机会常在,现金流较宽裕,凭人缘与机遇进财;但禄主流通,来得顺也易花得快,宜建立储蓄与资产转换习惯。看何星化禄定财源性质,如巨门禄凭口才、太阴禄重积蓄。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.health',
    domain: 'mutagen',
    entities: ['sihuaLu', 'healthPalace'],
    topics: ['health'],
    summary: '生年禄入疾厄宫,体质有福泽,病有良医恢复力好。',
    detail:
      '化禄入疾厄宫,先天底子与恢复力较好,遇病痛易得良医良方,心宽体泰;但禄亦主口福享受,饮食应酬过度易发福,代谢、肠胃负担是保养重点。规律作息即可守住这份福泽。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.surface',
    domain: 'mutagen',
    entities: ['sihuaLu', 'surfacePalace'],
    topics: ['fortune', 'career'],
    summary: '生年禄入迁移宫,出外得贵人机遇,越动越旺宜外发展。',
    detail:
      '化禄入迁移宫,机会与资源多在外方,离乡发展、外地外资、出差旅行皆易逢贵人,人在动中运在动中;在家守成反而施展不开。宜主动拓展活动半径,惟在外应酬花费也随之增多。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.friends',
    domain: 'mutagen',
    entities: ['sihuaLu', 'friendsPalace'],
    topics: ['career', 'fortune'],
    summary: '生年禄入交友宫,朋友客户缘旺,人脉即资源之象。',
    detail:
      '化禄入交友宫,交游广阔、朋友多助,客户群与群众缘是重要资源,适合经营人脉型事业;但禄在交友也主为朋友花费、应酬开销大,资源易流向他人,宜筛选往来对象,把人缘转化为正向合作。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.property',
    domain: 'mutagen',
    entities: ['sihuaLu', 'propertyPalace'],
    topics: ['family', 'wealth'],
    summary: '生年禄入田宅宫,置产缘佳家宅丰足,财库有收藏之象。',
    detail:
      '化禄入田宅宫,与不动产缘分好,置产较顺且易增值,家中物质丰足、氛围和乐,亦主祖荫或家族资源可承接;禄入财库为收藏得位之象。惟宜防对居住享受的开销偏高,量力置产为宜。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.spirit',
    domain: 'mutagen',
    entities: ['sihuaLu', 'spiritPalace'],
    topics: ['fortune'],
    summary: '生年禄入福德宫,福报安享心态乐观,懂生活有品味。',
    detail:
      '化禄入福德宫,精神层面有福,兴趣广、心态松,懂得享受生活,花钱重品质品味,财福由心态带动;但安逸感强,须防享乐先行、进取不足,把兴趣经营成专长则福禄两得。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.lu.parents',
    domain: 'mutagen',
    entities: ['sihuaLu', 'parentsPalace'],
    topics: ['family'],
    summary: '生年禄入父母宫,父母缘厚得长辈庇荫,上司公家缘佳。',
    detail:
      '化禄入父母宫,与父母长辈缘分深、能得实质支持,长官上司多提携,与公家机构、证照文书之缘亦顺;此福来自上缘,宜常回馈孝养,勿视庇荫为当然。读书求学阶段多得师长关照。',
    source: SRC,
    confidence: 0.65,
  }),

  // ---------------------------------------------------------------- 化权 × 12 宫
  entry({
    id: 'mutagen.quan.soul',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '生年权入命宫,个性强势有魄力,掌控欲与领导力俱强。',
    detail:
      '化权主掌控与开创,入命宫者主观自信、敢作敢当,遇事习惯自己拿主意,具备管理与开疆的行动力;但强势易显固执,不服输易与人争锋。学会授权与倾听,权星方成大器。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.siblings',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'siblingsPalace'],
    topics: ['family'],
    summary: '生年权入兄弟宫,手足能干个性强,平辈间有主导权课题。',
    detail:
      '化权入兄弟宫,兄弟姊妹多有能之辈、事业心强,能成为有力奥援;但平辈之间谁说了算是长期课题,合伙共事时对方倾向主导。宜明确分工、尊重彼此地盘,化较劲为互补。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.spouse',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'spousePalace'],
    topics: ['marriage'],
    summary: '生年权入夫妻宫,配偶能干有主见,婚内主导权是磨合课题。',
    detail:
      '化权入夫妻宫,伴侣多精明干练、事业心强,能撑起半边天;相处上强弱位阶分明,家中话语权易起拉锯。与其争主导,不如各管一摊、互敬其能,配偶之强反成家庭助力。感情表达偏行动派而少甜言。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.children',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'childrenPalace'],
    topics: ['family', 'career'],
    summary: '生年权入子女宫,对子女教育强势介入,子女个性亦强。',
    detail:
      '化权入子女宫,教养风格偏严格主导,望子成龙心切,而子女自身也主见强、有才干,亲子之间易顶牛,宜以引导代替压制;引申主创业带团队、驾驭下属合伙有魄力,晚辈中出强将。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.wealth',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'wealthPalace'],
    topics: ['wealth'],
    summary: '生年权入财帛宫,掌财有力敢于争取,凭实力专业进财。',
    detail:
      '化权入财帛宫,理财企图心强,收入多凭专业与实力争取而来,敢投资、敢开价,财务上喜欢自己掌盘;格局做大靠此魄力,但须防扩张过猛与借贷杠杆,财权在握更要立规矩。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.health',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'healthPalace'],
    topics: ['health'],
    summary: '生年权入疾厄宫,体力充沛好动不服输,须防过劳损伤。',
    detail:
      '化权入疾厄宫,精力旺盛、抗压耐操,病来也硬扛,恢复靠底子;但权主冲撞,运动伤害、筋骨扭挫与过劳是主要课题,肝气亦易郁而化火。宜给身体设上限,把好胜心用在规律锻炼上。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.surface',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'surfacePalace'],
    topics: ['career', 'fortune'],
    summary: '生年权入迁移宫,出外有威能开拓,外地掌权显能力。',
    detail:
      '化权入迁移宫,在外场面撑得住、镇得住,适合外派开疆、异地创业,离家愈远愈能独当一面;驿马带权,奔波中建功。惟在外锋芒外露,易遇强碰强之局,身段放软可减阻力。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.friends',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'friendsPalace'],
    topics: ['career'],
    summary: '生年权入交友宫,交游多能人强手,人际有竞争角力之象。',
    detail:
      '化权入交友宫,身边聚集有能力有个性的朋友与客户,得强援时如虎添翼;但社交圈内竞争与角力难免,易被强势朋友牵着走,或为出头与人争锋。宜择善而交、保持自主,借力而不受制。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.career',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'careerPalace'],
    topics: ['career'],
    summary: '生年权入官禄宫,事业主导权强,宜管理创业开疆拓土。',
    detail:
      '化权入官禄宫,事业心旺、执行力强,适合掌兵符做管理、开创新局,职场上升迁凭战功;变动力强,常主动求变换跑道。惟强势作风易树敌,宜带人带心,何星化权定其开创方式,如武曲权重执行、天机权重谋略。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.property',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'propertyPalace'],
    topics: ['family', 'wealth'],
    summary: '生年权入田宅宫,家中掌权置产魄力大,不动产运作积极。',
    detail:
      '化权入田宅宫,在家中说话有份量、当家做主,置产企图心强,敢买敢换、以房养房式运作积极;家运有兴旺扩张之象。惟须防为房产家务与家人起争执,大额置产宜留安全边际。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.spirit',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'spiritPalace'],
    topics: ['fortune'],
    summary: '生年权入福德宫,精神自主心气高,兴趣钻研有强度。',
    detail:
      '化权入福德宫,精神世界要自己做主,享受也要照自己的方式来,兴趣爱好投入深、钻研强,闲不下来;但心气高、自我要求重,易把休息过成任务而积压力。学会真正放松,是此权的修行。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.quan.parents',
    domain: 'mutagen',
    entities: ['sihuaQuan', 'parentsPalace'],
    topics: ['family'],
    summary: '生年权入父母宫,父母师长管教强势,与权威磨合是课题。',
    detail:
      '化权入父母宫,父母多强势能干、管教严格,成长中规矩多;出社会后与上司长官、公家权威的相处沿用同一课题,既能得强力提携,也易感压力。学会不卑不亢地沟通,长辈之权反成靠山。',
    source: SRC,
    confidence: 0.65,
  }),

  // ---------------------------------------------------------------- 化科 × 12 宫
  entry({
    id: 'mutagen.ke.soul',
    domain: 'mutagen',
    entities: ['sihuaKe', 'soulPalace'],
    topics: ['overview'],
    summary: '生年科入命宫,气质斯文重形象,有名声缘与贵人缘。',
    detail:
      '化科主名声、贵人与平顺,入命宫者举止得体、爱惜羽毛,处事讲道理有条理,易以才学口碑立身,危难时常逢贵人化解;惟好面子,遇事易顾虑形象而放不开,声名亦须防被放大检视。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.siblings',
    domain: 'mutagen',
    entities: ['sihuaKe', 'siblingsPalace'],
    topics: ['family'],
    summary: '生年科入兄弟宫,手足斯文有涵养,平辈互为贵人。',
    detail:
      '化科入兄弟宫,兄弟姊妹多温和讲理、重教养,彼此相处以和为贵,遇事能互相照应,是文助型贵人;平辈同侪往来重情面口碑,合作以信誉维系。助力偏精神与人脉层面,金钱奥援则不宜高估。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.spouse',
    domain: 'mutagen',
    entities: ['sihuaKe', 'spousePalace'],
    topics: ['marriage'],
    summary: '生年科入夫妻宫,配偶温文有涵养,感情平顺重精神交流。',
    detail:
      '化科入夫妻宫,伴侣多气质斯文、谈吐有涵养,相处细水长流,重沟通与精神契合,婚姻多得体面;感情模式偏理性温和,浓烈度不高,宜主动经营情趣。旧识重逢之缘亦是此科特色,已婚者当守分寸。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.children',
    domain: 'mutagen',
    entities: ['sihuaKe', 'childrenPalace'],
    topics: ['family'],
    summary: '生年科入子女宫,子女聪慧好学有教养,亲子讲理沟通顺。',
    detail:
      '化科入子女宫,子女资质文秀、学习表现易有口碑,亲子之间以理沟通、氛围平和,教养重身教与阅读;引申主晚辈门生成材、下属斯文可用。对子女期望宜重启发而非名次,免科星变成成绩压力。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.wealth',
    domain: 'mutagen',
    entities: ['sihuaKe', 'wealthPalace'],
    topics: ['wealth'],
    summary: '生年科入财帛宫,财源平稳量入为出,凭名声专业进财。',
    detail:
      '化科入财帛宫,进财平稳有序,靠专业、口碑与信用取财,财务观念清楚、量入为出,危急时常有贵人周转;科主平不主旺,富足感来自细水长流而非暴利,宜走专业品牌路线,勿羡快钱。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.health',
    domain: 'mutagen',
    entities: ['sihuaKe', 'healthPalace'],
    topics: ['health'],
    summary: '生年科入疾厄宫,病灾多有贵人良医,小恙化解快。',
    detail:
      '化科入疾厄宫,健康上多逢化解,生病易遇对症之医、及时之助,病情多能大事化小;平日注重养生保健、体面整洁。惟科星力道温和,只是缓冲不是免疫,定期检查与规律作息仍是根本。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.surface',
    domain: 'mutagen',
    entities: ['sihuaKe', 'surfacePalace'],
    topics: ['fortune', 'career'],
    summary: '生年科入迁移宫,出外有名声贵人扶持,形象好利外交。',
    detail:
      '化科入迁移宫,在外风评好、形象加分,出门易遇贵人指路,适合对外交涉、外地求学进修、以名声开路的发展;人在外乡多得敬重。惟名声在外也受检视,言行宜表里如一,免盛名之累。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.friends',
    domain: 'mutagen',
    entities: ['sihuaKe', 'friendsPalace'],
    topics: ['career'],
    summary: '生年科入交友宫,交友多文雅之士,益友居多重质不重量。',
    detail:
      '化科入交友宫,朋友圈多斯文有素养之人,以文会友、以信立交,朋友多能在关键处提点相助,是典型的益友格局;人脉重质不重量,口碑在圈内流传。宜珍惜清流之交,不必强融热闹场子。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.career',
    domain: 'mutagen',
    entities: ['sihuaKe', 'careerPalace'],
    topics: ['career'],
    summary: '生年科入官禄宫,事业凭名声专业立足,考试文书晋升顺。',
    detail:
      '化科入官禄宫,事业走专业与口碑路线,考试、证照、评审、文书作业多顺遂,升迁常凭资历名望水到渠成,宜文教、公职、研究、品牌专业领域;科主平稳,爆发力不强,深耕日久自然显名。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.property',
    domain: 'mutagen',
    entities: ['sihuaKe', 'propertyPalace'],
    topics: ['family'],
    summary: '生年科入田宅宫,家宅雅洁书香,置产平稳文书顺遂。',
    detail:
      '化科入田宅宫,居家环境重整洁品味,有书香气息,家人相处平和讲理;置产步调平稳,重保值胜过投机,产权过户等不动产文书多顺利,亦主家族名声清誉。宜以宜居与保值为置产准则。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.spirit',
    domain: 'mutagen',
    entities: ['sihuaKe', 'spiritPalace'],
    topics: ['fortune'],
    summary: '生年科入福德宫,心态平和有涵养,精神生活重文艺品味。',
    detail:
      '化科入福德宫,内心世界安稳,情绪调节力好,兴趣偏文艺、阅读、美学一路,独处也自得;福分体现在心境从容与生活质感。惟雅致易流于清淡,人生冲劲须由他宫补足,宜以涵养滋养事业而非避世。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ke.parents',
    domain: 'mutagen',
    entities: ['sihuaKe', 'parentsPalace'],
    topics: ['family'],
    summary: '生年科入父母宫,父母有涵养关系温和,长辈上司多贵人。',
    detail:
      '化科入父母宫,父母多明理有教养,亲子以理相待、少疾言厉色;长辈上司常在关键处提携,与公家机关往来平顺,利考试文凭、证照核批等文书之事。此缘宜以敬养回应,师长之言多可参详。',
    source: SRC,
    confidence: 0.65,
  }),

  // ---------------------------------------------------------------- 化忌 × 11 宫(夫妻见 curated)
  entry({
    id: 'mutagen.ji.soul',
    domain: 'mutagen',
    entities: ['sihuaJi', 'soulPalace'],
    topics: ['overview'],
    summary: '生年忌入命宫,对自我要求执着,易钻牛角尖自我省思。',
    detail:
      '化忌主执着与在意,入命宫者凡事往深处想、对自己不轻易放过,常有自省与不安全感;这份执着若导向专业即是深耕之力,导向情绪则成内耗。课题在学会放过自己,允许阶段性的不完美。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.siblings',
    domain: 'mutagen',
    entities: ['sihuaJi', 'siblingsPalace'],
    topics: ['family'],
    summary: '生年忌入兄弟宫,手足缘分有亏欠感,付出多计较是课题。',
    detail:
      '化忌入兄弟宫,对兄弟姊妹在意而多操心,常觉付出与回报不对等,或聚少离多、各自忙碌;并非无情,而是缘分以承担呈现。与平辈合伙、金钱借贷宜界限分明,把心力放在可持续的互助上。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.children',
    domain: 'mutagen',
    entities: ['sihuaJi', 'childrenPalace'],
    topics: ['family'],
    summary: '生年忌入子女宫,为子女操心执着,教养费心是长期课题。',
    detail:
      '化忌入子女宫,对子女极为上心,教养上易紧盯放不下,亲子互动费心费力;或得子较迟、聚少离多,以牵挂呈现缘分。引申主对下属合伙有亏欠感、桃花应酬宜节制。学会得体退出,是亲子双方的功课。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.wealth',
    domain: 'mutagen',
    entities: ['sihuaJi', 'wealthPalace'],
    topics: ['wealth'],
    summary: '生年忌入财帛宫,对钱在意赚钱辛劳,现金流是经营课题。',
    detail:
      '化忌入财帛宫,金钱是一生在意之事,进财多凭辛劳实干,常有现金流紧绷感,花钱精打细算;并非注定缺财,而是财须专注一业、点滴积累而来。忌贪多元投机与借贷冒进,守住本业反能聚财。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.health',
    domain: 'mutagen',
    entities: ['sihuaJi', 'healthPalace'],
    topics: ['health'],
    summary: '生年忌入疾厄宫,健康是一生功课,慢性劳损宜早保养。',
    detail:
      '化忌入疾厄宫,体质上有须长期照看的弱项,多属慢性、劳损、积累型问题,身体对压力情绪也较敏感;何星化忌指向何系统,如太阴忌重阴虚劳倦、廉贞忌防发炎血光。早检查、早保养、劳逸有度即是解法。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.surface',
    domain: 'mutagen',
    entities: ['sihuaJi', 'surfacePalace'],
    topics: ['fortune'],
    summary: '生年忌入迁移宫,出外劳碌际遇多磨,变动宜谋定后动。',
    detail:
      '化忌入迁移宫,在外奔波劳碌,际遇起伏多磨,出门在外诸事须多费心,变动决策易反复纠结;并非不能外出发展,而是外出须带着准备与目标,忌漫无计划的漂泊。行前功课做足,在外亦能磨出历练。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.friends',
    domain: 'mutagen',
    entities: ['sihuaJi', 'friendsPalace'],
    topics: ['career', 'family'],
    summary: '生年忌入交友宫,为友付出多回报少,人际界限是课题。',
    detail:
      '化忌入交友宫,重朋友、肯付出,却常觉真心换不回对等,或为友劳心破费、卷入他人是非;课题在界限——帮忙有度、借贷谨慎、合伙慎选。缘分重质不重量,留住三两知己胜过满座宾朋。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.career',
    domain: 'mutagen',
    entities: ['sihuaJi', 'careerPalace'],
    topics: ['career'],
    summary: '生年忌入官禄宫,对事业执着投入,以磨砺换取专业深度。',
    detail:
      '化忌入官禄宫,把心思押在事业上,责任感重、易成工作狂,过程多磨折反复,却也因此炼出他人难及的专业深度;宜专注一行深耕,忌频繁跳槽兼差分散心力。提醒自己工作是生活的一部分,而非全部。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.property',
    domain: 'mutagen',
    entities: ['sihuaJi', 'propertyPalace'],
    topics: ['family', 'wealth'],
    summary: '生年忌入田宅宫,置产执念守成心重,为家宅甘愿操劳。',
    detail:
      '化忌入田宅宫,对房子与家有强烈执念,一生绕着置产、守产、顾家打转,为家宅操劳而无怨;忌入库藏之地反主守得住财,聚财于不动产。课题在勿因守成而过度节省,与家人相处宜多沟通少硬撑。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.spirit',
    domain: 'mutagen',
    entities: ['sihuaJi', 'spiritPalace'],
    topics: ['fortune', 'health'],
    summary: '生年忌入福德宫,思虑多放不下,精神内耗是修心课题。',
    detail:
      '化忌入福德宫,心思细腻想得深,却易反复咀嚼、自寻烦恼,享受时也难全然放松,福分打折多因心不安;这份深思若用于研究创作反是天赋。课题在修心:建立运动、兴趣等转念出口,学习课题结束就翻篇。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'mutagen.ji.parents',
    domain: 'mutagen',
    entities: ['sihuaJi', 'parentsPalace'],
    topics: ['family'],
    summary: '生年忌入父母宫,与父母缘分多牵挂,沟通隔阂是课题。',
    detail:
      '化忌入父母宫,与父母长辈之间在意而不易表达,或聚少离多、或沟通有隔阂,心中常存亏欠感;与上司权威相处也偏拘谨。此缘宜早尽孝、主动破冰,勿等来日。另主与公家文书证件之事须细心核对。',
    source: SRC,
    confidence: 0.65,
  }),
];
