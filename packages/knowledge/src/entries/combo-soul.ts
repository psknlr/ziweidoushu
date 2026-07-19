/**
 * 经典双主星同宫坐命组合(24 组)。
 *
 * 十四主星依紫微/天府两系排布,双星同宫仅出现于固定地支组合;
 * 本文件每条 detail 首句标注同宫地支供检索参考。吉凶并陈,不作宿命断言。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const COMBO_SOUL_ENTRIES: KnowledgeEntry[] = [
  entry({
    id: 'combo.ziwei-tianfu.soul',
    domain: 'combination',
    entities: ['ziweiMaj', 'tianfuMaj', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '紫府同宫坐命,帝座会库星,气度稳重大器,主终身福厚、宜掌管理财政。',
    detail:
      '紫微天府同宫(寅申)。帝星与库星并坐,统御力与守成力兼备,为人自重体面、组织与理财意识俱强,起点与眼界皆高,古称终身福厚。然两大主星同宫易求全求稳,得辅弼昌曲会照方成大局;无吉扶持则易眼高手低、保守自满,宜以实绩累积配称其格。',
    source: srcs.quanshu('紫府同宫,终身福厚'),
    confidence: 0.75,
  }),
  entry({
    id: 'combo.ziwei-tanlang.soul',
    domain: 'combination',
    entities: ['ziweiMaj', 'tanlangMaj', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '紫贪坐命,桃花犯主之局,才艺魅力与权术兼具,成于人际、亦须防溺于欲望。',
    detail:
      '紫微贪狼同宫(卯酉),古注称桃花犯主,语虽峻,今解为帝星染欲望之气:命主聪明多才艺、审美与社交魅力出众,善借人际与才情上位,宜演艺、公关、艺术、经营等以才会友之途。会昌曲吉化则风雅显达;煞忌交会须防酒色财气分心、因嗜好误事,以专业才艺泄其桃花之气为上策。',
    source: srcs.quanshu('桃花犯主为至淫'),
    confidence: 0.68,
  }),
  entry({
    id: 'combo.ziwei-tianxiang.soul',
    domain: 'combination',
    entities: ['ziweiMaj', 'tianxiangMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '紫相坐命,帝座得印,行事得体重承诺,宰辅之才,一生在稳定与变革间权衡。',
    detail:
      '紫微天相同宫(辰戌),居天罗地网之地。帝星配印星,处事有分寸、重形象与信用,善于居中协调掌实务,宜管理、行政、专业幕僚而渐掌大权。对宫必为破军冲照,内心常有求稳与求变的拉锯;得吉会照可在变革中掌舵,煞重则防决策摇摆、为面子所累。',
    source: srcs.modern('紫相辰戌同宫通行释义(三合诸家)'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.ziwei-qisha.soul',
    domain: 'combination',
    entities: ['ziweiMaj', 'qishaMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '紫杀坐命,化杀为权,魄力决断有威严,宜开创实业掌兵符,防刚愎急进。',
    detail:
      '紫微七杀同宫(巳亥)。帝星驾驭将星,古谓化杀为权:命主有魄力、敢决断、不怒自威,宜开创型事业、实业、工程、军警武职,愈有挑战愈见其才。吉会辅弼禄权则威权并至;无吉而煞重,须防独断专行、急功冒进,课题在纳谏与节奏。',
    source: srcs.modern('紫微七杀化杀为权之通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.ziwei-pojun.soul',
    domain: 'combination',
    entities: ['ziweiMaj', 'pojunMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '紫破坐命,帝星伴耗星,不甘受制、志在改革开创,成败起伏较大。',
    detail:
      '紫微破军同宫(丑未)。帝座与先锋耗星并坐,命主主观强、不耐受人节制,勇于破旧立新,宜自主开创、改革转型、开疆拓土之职。得左右昌曲吉化,则为开创局面的掌舵者;孤君无辅而煞忌重,则劳碌起伏、易与体制相冲,古注语峻处今解为「宜自立门户,不宜屈居人下」。',
    source: srcs.modern('紫破丑未同宫通行释义(三合诸家)'),
    confidence: 0.68,
  }),
  entry({
    id: 'combo.tianji-taiyin.soul',
    domain: 'combination',
    entities: ['tianjiMaj', 'taiyinMaj', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '机阴坐命,智慧配柔情,心思细腻善企划,带驿马迁动之象,宜谋定后动。',
    detail:
      '天机太阴同宫(寅申),为机月同梁格主体之一。谋星会富星,命主聪敏细腻、观察入微,擅企划分析与理财布局,气质清秀内敛;居四马之地,一生多迁动变化,宜外勤、贸易、驻外、企划幕僚。吉会则以智生财、步步为营;煞忌扰动则多思多虑、进退反覆,课题在安顿情绪、择定方向。',
    source: srcs.modern('机阴寅申同宫通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.tianji-jumen.soul',
    domain: 'combination',
    entities: ['tianjiMaj', 'jumenMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '机巨坐命,口才机变、善分析论辩,卯宫尤佳有公卿之誉,须防多学少精与口舌。',
    detail:
      '天机巨门同宫(卯酉)。谋星配暗星,反应快、口才锐利、善拆解问题,宜律师、谈判、教学、评论、研发分析等以口与脑取胜之业;古断卯宫为佳,遇吉化可致清贵之位。心思多变兴趣广,须防多学少精、三分钟热度;巨门之暗易招口舌是非,言语宜留三分余地。',
    source: srcs.gusui('巨机居卯,乙辛己丙人位至公卿'),
    confidence: 0.72,
  }),
  entry({
    id: 'combo.tianji-tianliang.soul',
    domain: 'combination',
    entities: ['tianjiMaj', 'tianliangMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '机梁坐命,善谈兵之局,谋略与荫庇并至,宜军师顾问、宗教哲理,防坐而论道。',
    detail:
      '天机天梁同宫(辰戌)。谋星会荫星,古称善谈兵:命主长于筹谋议论、洞察大势,兼有化解逢凶之荫,宜参谋顾问、法务监察、医卜宗教、学术评论等动脑不动刀之职。吉会昌曲禄存则以智策立身受人敬重;无吉则易流于清谈,课题在把谋略落为执行。',
    source: srcs.quanshu('机梁会合善谈兵'),
    confidence: 0.72,
  }),
  entry({
    id: 'combo.taiyang-taiyin.soul',
    domain: 'combination',
    entities: ['taiyangMaj', 'taiyinMaj', 'soulPalace'],
    topics: ['overview', 'career', 'family'],
    summary: '日月同宫坐命,阴阳并明,性格刚柔双面,情绪与理性交替,格局随昼夜生人而异。',
    detail:
      '太阳太阴同宫(丑未)。日月并坐一垣,命主兼具太阳的开朗进取与太阴的细腻内敛,双面性格、情绪起落较明显,才情丰沛而心境多变。丑宫夜生人月得势、未宫昼生人日得势,发挥各有偏重;古有「日月守命不如照合」之说,同宫者宜借三方吉拱定其光,吉化则文武兼资、名利可期,忌煞扰则阴晴不定、宜安顿作息与心绪。',
    source: srcs.modern('日月丑未同宫通行释义(参《骨髓赋》日月诸断)'),
    confidence: 0.68,
  }),
  entry({
    id: 'combo.taiyang-jumen.soul',
    domain: 'combination',
    entities: ['taiyangMaj', 'jumenMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '阳巨坐命,光明化暗、以口才立身扬名,利涉外传播,寅宫尤佳,防是非缠身。',
    detail:
      '太阳巨门同宫(寅申),古断「巨日同宫,官封三代」。太阳之光化巨门之暗,命主口才与感染力兼具,宜传播、外交、法政、教学、涉外贸易等抛头露面之业,名声常先于财禄。寅宫旭日东升格局为佳;申宫日已偏西,发越稍缓、须防虎头蛇尾。煞忌会则口舌是非随名而至,谨言可保清誉。',
    source: srcs.quanshu('巨日同宫,官封三代'),
    confidence: 0.72,
  }),
  entry({
    id: 'combo.taiyang-tianliang.soul',
    domain: 'combination',
    entities: ['taiyangMaj', 'tianliangMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '阳梁坐命,清贵之局,卯宫为日照雷门,声名荫庇并至,宜公职教育监察。',
    detail:
      '太阳天梁同宫(卯酉)。贵星会荫星,命主正直热心、有长者风与原则感,宜公职、司法监察、教育医疗、公益宗教等受人仰望之途。卯宫为日照雷门,朝阳带荫,声名与贵气俱旺,会昌曲禄星更成阳梁昌禄之贵;酉宫日落西山,清贵仍在而声势内敛,宜专业深耕。两地皆防好管闲事、原则过刚招怨。',
    source: srcs.quanshu('日照雷门,富贵荣华'),
    confidence: 0.73,
  }),
  entry({
    id: 'combo.wuqu-tianfu.soul',
    domain: 'combination',
    entities: ['wuquMaj', 'tianfuMaj', 'soulPalace'],
    topics: ['overview', 'wealth', 'career'],
    summary: '武府坐命,财星入库,理财稳健、务实累积,宜金融管理,防重财轻情。',
    detail:
      '武曲天府同宫(子午)。正财星与库星并坐,命主务实肯干、精于计算与守成,财务嗅觉敏锐,宜金融、会计、管理、置产经营,财富以累积见长而非侥幸横得。吉会禄存化禄则库藏充盈、富而能守;煞忌来扰防因财生纠纷。性格上易务实过头,课题在钱财之外亦经营情义。',
    source: srcs.modern('武府子午同宫通行释义'),
    confidence: 0.72,
  }),
  entry({
    id: 'combo.wuqu-tanlang.soul',
    domain: 'combination',
    entities: ['wuquMaj', 'tanlangMaj', 'soulPalace'],
    topics: ['overview', 'wealth', 'fortune'],
    summary: '武贪坐命,先贫后富之局,三十岁后发,早年历练愈足、中年爆发愈稳。',
    detail:
      '武曲贪狼同宫(丑未),《骨髓赋》断先贫后富。财星配欲望之星,命主企图心与行动力俱强,少年运多蹇宜沉潜习艺,三十岁后渐入佳境,中年常有明显跃升;会火星铃星更成横发之势。此局精华在「后发」:早年打底愈实,发时愈能承接;若少年侥幸早发或煞忌破局,则须防发后不耐久,守成置产为要。',
    source: srcs.gusui('先贫后富,武贪同身命之宫'),
    confidence: 0.75,
  }),
  entry({
    id: 'combo.wuqu-tianxiang.soul',
    domain: 'combination',
    entities: ['wuquMaj', 'tianxiangMaj', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '武相坐命,财印双美、刚柔并济,执行与辅佐兼长,衣食丰足,宜财务专业。',
    detail:
      '武曲天相同宫(寅申)。刚毅财星得印星调和,命主外和内刚、办事牢靠,既能执行又善协调,宜财务、采购、工程管理、专业技术等踏实积功之职,一生衣食丰足之象。吉会禄马则财官双得;煞忌夹冲(尤忌刑忌夹印)则防为人作保、财务背书之失,凡涉钱与章,契约分明为上。',
    source: srcs.modern('武相寅申同宫通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.wuqu-qisha.soul',
    domain: 'combination',
    entities: ['wuquMaj', 'qishaMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '武杀坐命,双金肃杀,刚毅果决行动至上,宜技术军警竞技,财务合作须契约分明。',
    detail:
      '武曲七杀同宫(卯酉)。财星会将星,两金相聚,命主性刚志坚、说做就做、吃苦耐劳,宜军警、外科、机械工程、竞技体育、一线开拓等以硬功夫见真章之业,专业愈精愈能出头。古注有「因财持刀」之诫,今解为钱财纠纷之防:合伙、借贷、担保务必白纸黑字。煞忌重则防冲动伤和气,以纪律与专业泄其锐气最宜。',
    source: srcs.modern('武杀卯酉同宫通行释义(参「因财持刀」古诫)'),
    confidence: 0.68,
  }),
  entry({
    id: 'combo.wuqu-pojun.soul',
    domain: 'combination',
    entities: ['wuquMaj', 'pojunMaj', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '武破坐命,破祖开创、敢闯敢拚,财来财去起伏大,宜技术立身、忌投机。',
    detail:
      '武曲破军同宫(巳亥)。财星伴耗星居四马之地,命主胆识过人、不惧从零开始,常离乡背井白手起家,宜技术专长、工程开发、转型开创之业,愈动愈有机会。财务上大进大出为其常态,吉化禄权可在破立之间累积实力;煞忌会则横发横破,切忌高杠杆投机,以一技防身、分批落袋为守成之道,中晚运多渐入佳境。',
    source: srcs.modern('武破巳亥同宫通行释义'),
    confidence: 0.68,
  }),
  entry({
    id: 'combo.tiantong-taiyin.soul',
    domain: 'combination',
    entities: ['tiantongMaj', 'taiyinMaj', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '同阴坐命,水澄桂萼,温润文雅、审美情感丰富,子宫尤佳主清要之职。',
    detail:
      '天同太阴同宫(子午)。福星会富星,双水相涵,命主温和儒雅、心思细腻、审美与共情力俱佳,人缘亲和,宜文教、艺术设计、公职文书、疗愈服务等清雅之途。子宫二星皆得地,古称水澄桂萼、得清要之职;午宫双星落陷,才情仍在而须防惰性与情绪化,课题在自律与行动力。此局感情丰富,亲密关系宜坦诚沟通免生暗涌。',
    source: srcs.quanshu('太阴居子,号曰水澄桂萼,得清要之职'),
    confidence: 0.73,
  }),
  entry({
    id: 'combo.tiantong-jumen.soul',
    domain: 'combination',
    entities: ['tiantongMaj', 'jumenMaj', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '同巨坐命,福星伴暗星,外圆内思、口才亲和,白手起家,防口舌与情绪内耗。',
    detail:
      '天同巨门同宫(丑未)。福星与暗星并坐,命主外表随和亲切、善用言语暖场,内心却多思虑心事,常少年辛苦、白手起家而后安。宜口才与服务并用之业:客服公关、餐饮民生、教学咨询、传播主持。吉化则以口生财、苦尽甘来;煞忌扰则易陷口舌是非与情绪拉扯,课题在把心事说出口、把是非挡门外。',
    source: srcs.modern('同巨丑未同宫通行释义'),
    confidence: 0.68,
  }),
  entry({
    id: 'combo.tiantong-tianliang.soul',
    domain: 'combination',
    entities: ['tiantongMaj', 'tianliangMaj', 'soulPalace'],
    topics: ['overview', 'career', 'health'],
    summary: '同梁坐命,福荫并临,温和乐助人缘佳,宜公职服务医护教育,防安逸少进取。',
    detail:
      '天同天梁同宫(寅申),为机月同梁格主体之一。福星会荫星,命主心地宽厚、乐于助人、遇难常有化解之缘,气质稳重带长者风,宜公职、医疗护理、教育社福、保险顾问等庇人亦自庇之业,发展以稳健绵长见胜。吉会则清福与声望俱得;其课题在福荫太过易安逸知足,宜自设目标保持冲劲,变动行业非其所长。',
    source: srcs.modern('同梁寅申同宫通行释义(机月同梁格参照)'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.lianzhen-tianfu.soul',
    domain: 'combination',
    entities: ['lianzhenMaj', 'tianfuMaj', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '廉府坐命,外圆内方,善交际亦能守成,公私管理皆宜,防人情与财务纠葛。',
    detail:
      '廉贞天府同宫(辰戌)。次桃花配库星,命主处世灵活、应对得体,既有交际手腕又有理财守成之能,外圆内方,宜行政管理、金融业务、政商公关等人财两经之职。吉会禄存辅弼则名利稳步双收;廉贞之囚性遇煞忌,须防人情往来夹带财务纠葛、公私边界模糊,帐目分明则可趋吉。',
    source: srcs.modern('廉府辰戌同宫通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.lianzhen-tanlang.soul',
    domain: 'combination',
    entities: ['lianzhenMaj', 'tanlangMaj', 'soulPalace'],
    topics: ['overview', 'career', 'marriage'],
    summary: '廉贪坐命,双桃花居四马地,魅力欲望皆强、起伏大,才艺公关可大放异彩。',
    detail:
      '廉贞贪狼同宫(巳亥)。正副桃花星并坐驿马之地,命主感染力强、多才多艺、敢爱敢拚,人生节奏快而波动大,古称陷地、语多峻厉,今解为激情与欲望的管理课题。吉会吉化则演艺、公关、营销、餐旅时尚皆能出众,多属中晚发之局;煞忌交会须防酒色赌与法律边界、感情多波折,以舞台与专业承接其热力,则魅力即是资产。',
    source: srcs.modern('廉贪巳亥同宫通行释义(古注语峻处从宽解)'),
    confidence: 0.65,
  }),
  entry({
    id: 'combo.lianzhen-tianxiang.soul',
    domain: 'combination',
    entities: ['lianzhenMaj', 'tianxiangMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '廉相坐命,囚星得印制化,循规做事、掌章掌印,宜公职法务行政,防刑忌夹印。',
    detail:
      '廉贞天相同宫(子午)。囚星得印星制化,廉贞的机变收敛为守规矩的干才:命主敬业尽责、按制度办事,宜公职、法务合规、行政管理、品质监理等掌章印之职,吉会禄权则于体制内稳步掌实权。须留意天相受夹之局:刑忌夹印防官非文书之失、为人背书之累;煞重则防原则与人情两难,守好签核底线即是护身符。',
    source: srcs.modern('廉相子午同宫通行释义'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.lianzhen-qisha.soul',
    domain: 'combination',
    entities: ['lianzhenMaj', 'qishaMaj', 'soulPalace'],
    topics: ['overview', 'career', 'wealth'],
    summary: '廉杀坐命,庙旺反为积富之人,执行力狠、吃苦耐劳,宜实业技术高压行业。',
    detail:
      '廉贞七杀同宫(丑未)。囚星会将星,命主意志坚韧、敢承重压、执行力强悍,古断庙旺者反为积富之人:以血汗与胆识累积实财,宜实业制造、工程营造、军警消防、外科急救等高强度行业,愈是硬仗愈显其能。煞忌重则古注有凶语,今解为风险行业与冲动之防:安全规范与情绪出口不可少,张弛有度方能长久。',
    source: srcs.quanshu('廉贞七杀反为积富之人'),
    confidence: 0.7,
  }),
  entry({
    id: 'combo.lianzhen-pojun.soul',
    domain: 'combination',
    entities: ['lianzhenMaj', 'pojunMaj', 'soulPalace'],
    topics: ['overview', 'career'],
    summary: '廉破坐命,冲劲与颠覆兼具,敢破成规,宜开创改革武职技术,防冲动招是非。',
    detail:
      '廉贞破军同宫(卯酉)。囚星伴耗星,命主性烈敢言、不畏权威、乐于打破旧局,常在变动中找到出路,宜改革开创、武职纪律部队、竞争性强的技术与业务领域,逆境反能激发其斗志。吉化会照则于破立之间建功、武职尤能显达;煞忌交会则波动加剧,防冲动决裂、是非官讼,学会留后路与缓冲,其破坏力即转为开创力。',
    source: srcs.modern('廉破卯酉同宫通行释义'),
    confidence: 0.65,
  }),
];
