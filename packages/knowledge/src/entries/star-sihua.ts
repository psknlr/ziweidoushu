/**
 * 十天干四化"星×化"通论条目(与宫位无关),共 39 条:
 * 化禄 10、化权 10、化科 9、化忌 10。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

const SRC = srcs.modern('十干四化通行释义(综合诸家)');

export const STAR_SIHUA_ENTRIES: KnowledgeEntry[] = [
  // ---------------------------------------------------------------- 化禄 10
  entry({
    id: 'sihua.lianzhen.lu',
    domain: 'mutagen',
    entities: ['lianzhenMaj', 'sihuaLu'],
    topics: ['marriage', 'career'],
    summary: '廉贞化禄,人际魅力与公关缘分俱增,交际场中得利。',
    detail:
      '廉贞为次桃花兼官禄主,化禄后魅力与社交手腕加分,公关、政商往来、艺文娱乐领域得缘,亦利偏财与人脉变现;感情机会增多是双面刃,应酬饮宴宜有节制,免因桃花与玩兴误事。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianji.lu',
    domain: 'mutagen',
    entities: ['tianjiMaj', 'sihuaLu'],
    topics: ['career', 'wealth'],
    summary: '天机化禄,智慧点子生财,企划谋略有变现之缘。',
    detail:
      '天机为智多星,化禄主以脑力进财:企划、咨询、设计、流通买卖皆宜,点子多且落地机会好,财源带流动性、宜动中取财;惟机禄财来自转动,少有一次到位的大财,防想法太多而分散,选定主线深做方能积累。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tiantong.lu',
    domain: 'mutagen',
    entities: ['tiantongMaj', 'sihuaLu'],
    topics: ['fortune'],
    summary: '天同化禄,福星添禄安享有缘,人缘口福生活顺心。',
    detail:
      '天同为福星,化禄主福上加福:心宽人缘好,生活情趣与口福俱佳,遇难常有转圜,亦有白手兴家、苦尽甘来之象;惟福禄易生安逸,进取心是短板,宜借兴趣与服务性质工作把福气转成事业。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.taiyin.lu',
    domain: 'mutagen',
    entities: ['taiyinMaj', 'sihuaLu'],
    topics: ['wealth', 'family'],
    summary: '太阴化禄,财星得禄细水长流,积蓄置产女性贵人缘。',
    detail:
      '太阴为财星、田宅主,化禄主财源稳定、善积蓄理财,与不动产缘分佳,置产保值有利;多得女性贵人相助,气质亦添温润魅力。财性属静,重规划与长期复利,不宜急功近利,夜间与幕后事业亦得此禄。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tanlang.lu',
    domain: 'mutagen',
    entities: ['tanlangMaj', 'sihuaLu'],
    topics: ['wealth', 'fortune'],
    summary: '贪狼化禄,交际应酬得财,多才多艺机遇型进财。',
    detail:
      '贪狼为欲望星、第一偏财星,化禄主人脉与欲望转化为财:善应酬、路子广,才艺兴趣皆可变现,机遇来时进财快,会火铃更添爆发力;桃花人缘同步增旺。课题在节制——欲望是引擎也是漏洞,横发须守成。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wuqu.lu',
    domain: 'mutagen',
    entities: ['wuquMaj', 'sihuaLu'],
    topics: ['wealth', 'career'],
    summary: '武曲化禄,正财星得禄进账实在,执行变现能力强。',
    detail:
      '武曲为正财星,化禄为财星归位:进财凭实干与专业,账目清楚、落袋为安,金融、财务、实业、技术变现皆宜,亦利创业收现金;财来正路、积累扎实。惟重财务效率易显现实,谈钱之余留些人情温度更圆满。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.taiyang.lu',
    domain: 'mutagen',
    entities: ['taiyangMaj', 'sihuaLu'],
    topics: ['career', 'fortune'],
    summary: '太阳化禄,名声带财贵气外显,施而后得博爱得众。',
    detail:
      '太阳主贵不主富,化禄之财随名声与曝光而来:适合公众性、传播性、领导性质事业,知名度即财源,多得男性长辈贵人;其财施而后得,肯照亮别人则回报自来。惟光芒外放开销亦大,防重面子而虚耗。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.jumen.lu',
    domain: 'mutagen',
    entities: ['jumenMaj', 'sihuaLu'],
    topics: ['career', 'wealth'],
    summary: '巨门化禄,口才生财以口为业,说服力与食禄俱佳。',
    detail:
      '巨门主口舌,化禄则口舌成金:教学、销售、法律、传媒、餐饮等以口为业者得天独厚,说话让人信服,是非亦化为人缘;兼主食禄口福。宜把表达力打磨成专业招牌,惟话多仍须守信,承诺出口便是契约。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianliang.lu',
    domain: 'mutagen',
    entities: ['tianliangMaj', 'sihuaLu'],
    topics: ['fortune', 'career'],
    summary: '天梁化禄,荫星得禄逢凶有解,长辈庇荫化难呈祥。',
    detail:
      '天梁为荫星寿星,化禄主庇荫之福:常在关键时刻得长辈贵人解围,遇难呈祥,宜医疗、保险、公益、顾问等济人之业,声望与实惠兼得;惟梁禄之财常伴人情馈赠,取用宜清,防清誉受累,亦防好排解他人事而揽责过多。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.pojun.lu',
    domain: 'mutagen',
    entities: ['pojunMaj', 'sihuaLu'],
    topics: ['career', 'wealth'],
    summary: '破军化禄,破旧立新得利,变动开创中进财。',
    detail:
      '破军主破耗开创,化禄则破中有得:转型、改革、开拓新市场皆能带来机会与回报,旧的放下新的自来,宜创新产业与变动性强的领域;其财先破后得、大进大出,须预留周转与止损线,变动本身即是其财源。',
    source: SRC,
    confidence: 0.65,
  }),

  // ---------------------------------------------------------------- 化权 10
  entry({
    id: 'sihua.pojun.quan',
    domain: 'mutagen',
    entities: ['pojunMaj', 'sihuaQuan'],
    topics: ['career'],
    summary: '破军化权,破坏重建魄力加倍,变革开创强而有力。',
    detail:
      '破军化权是最强的变革组合:敢推倒重来、敢啃硬骨头,开疆拓土与危机处理能力出众,驿马变动力强,宜创业、改革、工程、军警武职一路;惟破坏易、收拾难,行动前须想好重建方案,防冲动性的推翻与人事冲撞。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianliang.quan',
    domain: 'mutagen',
    entities: ['tianliangMaj', 'sihuaQuan'],
    topics: ['career'],
    summary: '天梁化权,监督裁决之权,原则鲜明宜专业权威。',
    detail:
      '天梁主荫主纪律,化权则成监督者与裁决者:原则性强、敢言敢管,宜法务、稽核、医疗、公职督导等凭专业与公信掌权的领域,长者风范让人信服;惟易流于说教与固执,得理宜饶人,权威须以服务之心行使。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianji.quan',
    domain: 'mutagen',
    entities: ['tianjiMaj', 'sihuaQuan'],
    topics: ['career'],
    summary: '天机化权,谋略化为决断,企划运筹掌控力增强。',
    detail:
      '天机善谋而多虑,化权补其决断:想得多也拿得定,企划、运营、参谋角色能实际掌盘,应变机敏、善于调度流程与资源;变动皆经计算,是谋定而后动之权。惟防机变过度、策略反复,方案定案后宜给执行留出稳定期。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tiantong.quan',
    domain: 'mutagen',
    entities: ['tiantongMaj', 'sihuaQuan'],
    topics: ['fortune', 'career'],
    summary: '天同化权,福星激起行动力,化安逸为忙中有福。',
    detail:
      '天同性喜安逸,化权恰是良性激发:懒散被点燃为行动力,享福之余能承担、能创业,先劳后逸、忙中带福,福气因作为而落实;此权温和不霸道,以亲和力服众。惟仍带随和底色,须防虎头蛇尾,立目标与期限可补其恒。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.taiyin.quan',
    domain: 'mutagen',
    entities: ['taiyinMaj', 'sihuaQuan'],
    topics: ['wealth', 'family'],
    summary: '太阴化权,理财置产之权,内敛沉稳掌实权。',
    detail:
      '太阴化权是柔中带刚之权:不动声色而握实权,善于理财布局、置产运作,财务与不动产上有主导力,宜幕后掌盘、财务管理;女性得之当家有成,男性得之多得女性助力亦重家庭。其权贵在绵密,防暗自较劲积压情绪。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tanlang.quan',
    domain: 'mutagen',
    entities: ['tanlangMaj', 'sihuaQuan'],
    topics: ['career', 'fortune'],
    summary: '贪狼化权,欲望化为进取心,交际场域有主导力。',
    detail:
      '贪狼化权把欲望升级为竞争力:目标感强、敢要敢争,交际应酬中能主导局面,才艺、业务、公关领域出头快,学习新事物的胃口与速度俱佳;惟所欲愈多所争愈广,须防强求硬上与多头并进,聚焦所长方能真正出众。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wuqu.quan',
    domain: 'mutagen',
    entities: ['wuquMaj', 'sihuaQuan'],
    topics: ['career', 'wealth'],
    summary: '武曲化权,财权在握刚毅果决,执行开创之将才。',
    detail:
      '武曲刚毅务实,化权则财权与执行力双强:决策快、敢拍板,管钱管事皆有魄力,宜财务主管、实业创业、金融操盘与武职,是冲锋陷阵的将才;惟刚上加刚,易显孤断强硬,沟通宜留余地,防因刚硬在钱财人事上结怨。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.taiyang.quan',
    domain: 'mutagen',
    entities: ['taiyangMaj', 'sihuaQuan'],
    topics: ['career'],
    summary: '太阳化权,公众场域话语权强,事业扩张光芒外放。',
    detail:
      '太阳主贵主博爱,化权则光而有威:公众场合有号召力与话语权,事业心旺、扩张积极,宜领导、政务、传播等抛头露面的舞台,男性长辈亦多助力;惟阳权外放耗能大,防强势过头与操劳伤身,懂得下放与休息方能长明。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.ziwei.quan',
    domain: 'mutagen',
    entities: ['ziweiMaj', 'sihuaQuan'],
    topics: ['career', 'overview'],
    summary: '紫微化权,帝星加权威仪更盛,领导统御欲望强烈。',
    detail:
      '紫微本为帝座,化权则权威加冕:领导欲与格局感俱增,长于统筹全局、发号施令,组织中天然往核心走;然帝星之权最须辅佐,得左右昌曲魁钺朝拱方成大局,孤君加权易流于独断专行、好大喜功,纳谏是此权的修养。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.jumen.quan',
    domain: 'mutagen',
    entities: ['jumenMaj', 'sihuaQuan'],
    topics: ['career'],
    summary: '巨门化权,言语有份量,辩才成为专业竞争力。',
    detail:
      '巨门化权使言语带权威:说话有条理有份量,辩才与批判力出众,宜律师、谈判、评论、教学等以言语服人的专业,是非之星转为论述之权;惟舌锋锐利,须防言语压人、祸从口出,对事不对人、留三分口德,权威更稳。',
    source: SRC,
    confidence: 0.65,
  }),

  // ---------------------------------------------------------------- 化科 9
  entry({
    id: 'sihua.wuqu.ke',
    domain: 'mutagen',
    entities: ['wuquMaj', 'sihuaKe'],
    topics: ['wealth', 'career'],
    summary: '武曲化科,财务信誉之名,理财专业口碑与信用佳。',
    detail:
      '武曲化科是财星挂上名声:以理财专业、财务信誉立名,融资信用好、金钱往来有口皆碑,宜金融、会计、财务顾问等凭专业声誉执业;科主平顺,进财不求暴利而求稳当。惟名在财务,账目清白更须自律爱惜。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.ziwei.ke',
    domain: 'mutagen',
    entities: ['ziweiMaj', 'sihuaKe'],
    topics: ['overview', 'career'],
    summary: '紫微化科,帝星添清誉,形象体面名望地位俱增。',
    detail:
      '紫微化科主贵气与名望:形象端庄体面,处世有格调,名声地位随资历自然抬升,危难时更有解厄之力——贵人多来自高层与体制;宜走名望路线、以专业地位立身。惟重视排场颜面,防为维持形象而打肿脸充胖子。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wenchang.ke',
    domain: 'mutagen',
    entities: ['wenchangMin', 'sihuaKe'],
    topics: ['career'],
    summary: '文昌化科,科甲本色文名得显,考试文凭著述皆利。',
    detail:
      '文昌为文魁之星,化科是其本色当行:读书考运佳,考试、证照、论文、著述皆易出成绩,文笔与谈吐为人称道,利学术、文教、文书幕僚发展;名声由笔下功夫累积。惟科名场上竞争者众,持续输出方能守住文名。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianji.ke',
    domain: 'mutagen',
    entities: ['tianjiMaj', 'sihuaKe'],
    topics: ['career'],
    summary: '天机化科,智谋获誉,企划才华被看见,利学术研究。',
    detail:
      '天机化科使才智有了名分:企划、分析、研究能力受肯定,点子与方案常被采纳,宜学术研究、智库参谋、技术专业等以智取名的路线;思考获得舞台后更愿深耕。惟名在于智,防卖弄聪明与纸上谈兵,成果落地名声方实。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.youbi.ke',
    domain: 'mutagen',
    entities: ['youbiMin', 'sihuaKe'],
    topics: ['overview', 'career'],
    summary: '右弼化科,贵人暗助之名,人缘辅佐成事有口碑。',
    detail:
      '右弼为辅佐之星,化科主暗贵人:常有人在看不见处替你说话铺路,以乐于助人、协调圆融得名,幕僚、副手、协作角色最能发光,群体中是受欢迎的润滑剂;其名不在台前而在口碑。惟防好心揽事过多,助人亦须量力。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianliang.ke',
    domain: 'mutagen',
    entities: ['tianliangMaj', 'sihuaKe'],
    topics: ['fortune', 'career'],
    summary: '天梁化科,名士清誉逢凶有解,宜医道顾问之名。',
    detail:
      '天梁化科主清贵之名:以正直、学识与长者风范立誉,宜医疗、法务、宗教哲理、顾问咨询等受人请益的角色,兼有荫星化解之力,险处常得声望相护;名士气质重原则轻名利。惟防清高孤芳与好为人师,谦和则誉久。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.taiyin.ke',
    domain: 'mutagen',
    entities: ['taiyinMaj', 'sihuaKe'],
    topics: ['overview', 'wealth'],
    summary: '太阴化科,才情内秀之名,文艺审美与女性贵人缘。',
    detail:
      '太阴化科主内秀之誉:才情、审美与细腻心思受赏识,宜文艺创作、设计美学、幕后企划等以质感立名的领域,多得女性贵人提携,理财上亦有稳健口碑;其名温润不张扬,靠作品与品味积累。防过于低调而错失展示机会。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wenqu.ke',
    domain: 'mutagen',
    entities: ['wenquMin', 'sihuaKe'],
    topics: ['career'],
    summary: '文曲化科,口才才艺获科名,辩才表演文艺得誉。',
    detail:
      '文曲主口才异艺,化科使其登堂入室:能言善道、才艺出众而获名声,宜演说、表演、音乐、命理数术等以口与艺立身的领域,考运人缘俱佳;与文昌之正统文书相比,文曲之名更重临场魅力。防恃才而流于炫技。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.zuofu.ke',
    domain: 'mutagen',
    entities: ['zuofuMin', 'sihuaKe'],
    topics: ['overview', 'career'],
    summary: '左辅化科,稳重辅佐得贵,平辈贵人相助成名。',
    detail:
      '左辅为正辅之星,化科主明贵人:做事稳重可靠、乐于成人之美,因辅佐之功而得名,平辈同侪与合作伙伴是主要助力来源,宜副座、执行长才、团队核心等角色;其誉建立在被信任之上。防甘居幕后太久,当仁时亦可不让。',
    source: SRC,
    confidence: 0.65,
  }),

  // ---------------------------------------------------------------- 化忌 10
  entry({
    id: 'sihua.taiyang.ji',
    domain: 'mutagen',
    entities: ['taiyangMaj', 'sihuaJi'],
    topics: ['career', 'family'],
    summary: '太阳化忌,名声是非课题,与父、夫、男性缘分须经营。',
    detail:
      '太阳主贵主男亲,化忌则光芒受遮:易招名声是非、劳而少功,与父亲、丈夫或男性上司的缘分是一生课题,男命尤须留意事业起伏与过劳,女命则多应在男亲缘上;并非无成,而是宜实至名归、少争虚名,兼防眼目心血之疾。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.taiyin.ji',
    domain: 'mutagen',
    entities: ['taiyinMaj', 'sihuaJi'],
    topics: ['wealth', 'family'],
    summary: '太阴化忌,情绪暗涌财务暗耗,与母、妻、女性缘课题。',
    detail:
      '太阴主财主女亲主内心,化忌则暗处生波:情绪易积压内耗,财务多暗漏——借出难回、投资失察,与母亲、妻子或女性之缘须用心经营;不动产交易与相关文书宜谨慎核实。课题在把暗处摊开:记账、直说、早睡,忌自己闷着。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.lianzhen.ji',
    domain: 'mutagen',
    entities: ['lianzhenMaj', 'sihuaJi'],
    topics: ['marriage', 'career'],
    summary: '廉贞化忌,感情纠葛与官非课题,合规守法是护身符。',
    detail:
      '廉贞为囚星次桃花,化忌双题并至:感情上易陷纠葛烂账,拖泥带水伤人伤己;行事上须防行政疏失、合约纠纷与官非,亦留意血光意外。课题在守规矩、明界限——感情果断清爽、做事合规留痕,囚星之忌便困不住人。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.jumen.ji',
    domain: 'mutagen',
    entities: ['jumenMaj', 'sihuaJi'],
    topics: ['career', 'family'],
    summary: '巨门化忌,口舌是非缠身,慎言远谤沟通须修炼。',
    detail:
      '巨门主口舌暗曜,化忌则是非放大:说者无心听者有意,易因言语生误会、招毁谤,亦易疑心生暗鬼;课题全在沟通——话说三分留证据、少论人非、疑处直接求证。此忌磨到深处反成深研考据之才,以专业发言则口舌成名。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tianji.ji',
    domain: 'mutagen',
    entities: ['tianjiMaj', 'sihuaJi'],
    topics: ['health', 'career'],
    summary: '天机化忌,思虑过度钻牛角尖,计划反复神经紧绷。',
    detail:
      '天机主智,化忌则智者过虑:想得太多做得太少,方案反复推翻、选择困难,夜里停不下脑,易失眠与神经紧张,亦防聪明反被聪明误的小算计;课题在收敛选项——定策略、设期限、想两轮就行动,把过剩的思考力交给专业研究去消化。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wenqu.ji',
    domain: 'mutagen',
    entities: ['wenquMin', 'sihuaJi'],
    topics: ['marriage', 'wealth'],
    summary: '文曲化忌,口才反成是非,感情表错情、数字单据易疏失。',
    detail:
      '文曲主口才异艺桃花,化忌则才情走偏:能言反招怨、幽默被当轻浮,感情上易表错情会错意、陷入暧昧误会;实务上须防数字、单据、票券差错与口头承诺无凭。课题在收敛表达:书面确认、核对再三,情感表达贵在真不在巧。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tiantong.ji',
    domain: 'mutagen',
    entities: ['tiantongMaj', 'sihuaJi'],
    topics: ['fortune', 'health'],
    summary: '天同化忌,福星蒙尘享受不易,情绪福分是重整课题。',
    detail:
      '天同主福,化忌则福气打折:想放松总有事来磨,情绪化与惰性交替,福分须先劳后享;并非无福,而是福要自己挣——此忌常倒逼安逸之人建立能力,先苦后甘。课题在情绪管理与生活重整,兼留意脾胃、水肿等安逸病。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wenchang.ji',
    domain: 'mutagen',
    entities: ['wenchangMin', 'sihuaJi'],
    topics: ['career', 'wealth'],
    summary: '文昌化忌,文书契约疏失课题,签核背书须再三核对。',
    detail:
      '文昌主文书科甲,化忌专应文墨之失:合约、支票、证件、报表易出纰漏,签名背书保证之事尤须谨慎,考试文凭亦多波折反复;课题在建立核对习惯——白纸黑字逐条读、重要文件留底、不轻易作保,细心即可化解大半。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.wuqu.ji',
    domain: 'mutagen',
    entities: ['wuquMaj', 'sihuaJi'],
    topics: ['wealth', 'marriage'],
    summary: '武曲化忌,财务周转课题,金钱压力与孤克须化解。',
    detail:
      '武曲为正财星,化忌则财路多磨:周转紧、进财辛苦,投资冒进易折损,与人多因钱起隙;武曲兼有寡宿之性,化忌后个性更显刚硬直接,感情表达生涩。课题在稳字诀——控杠杆、留现金、不轻易担保,谈钱之外多给身边人软话。',
    source: SRC,
    confidence: 0.65,
  }),
  entry({
    id: 'sihua.tanlang.ji',
    domain: 'mutagen',
    entities: ['tanlangMaj', 'sihuaJi'],
    topics: ['fortune', 'marriage'],
    summary: '贪狼化忌,欲望受挫强求不得,桃花应酬宜节制转化。',
    detail:
      '贪狼主欲,化忌则所求多阻:愈想要愈难到手,酒色财气与应酬场易生困扰,桃花多带纠缠;此忌的出路在转化——把欲望从外求转向内修,深耕才艺、玄学、研究反能成家,所谓贪狼忌反主专。课题是节制与聚焦,戒贪则安。',
    source: SRC,
    confidence: 0.65,
  }),
];
