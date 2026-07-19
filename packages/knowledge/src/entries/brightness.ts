/**
 * 亮度规则条目(庙旺得利平不陷)——18 条。
 * 依据:《紫微斗数全书》诸星问答论、通行亮度歌诀;
 * 核心规则:吉星庙旺力宏、落陷力微;煞星庙旺化煞为权、落陷为害烈;
 * 陷而有救(会禄/科/禄存)课题可解;落陷化忌双重课题。
 * entities 形态 [星, 亮度],与分析器亮度信号 [星, 亮度, 宫] 全覆盖匹配。
 */
import { entry, srcs } from './builder.js';
import type { KnowledgeEntry } from '../schema.js';

export const BRIGHTNESS_ENTRIES: KnowledgeEntry[] = [
  // ---- 煞星入庙:化煞为权 ----
  entry({
    id: 'bright.huoxing.miao', domain: 'star', entities: ['huoxingMin', 'miao'], topics: ['career', 'fortune'],
    summary: '火星入庙,煞化为权,行动力与爆发力可堪大用。',
    detail: '火星庙旺(寅午戌方)时烈性转为魄力,利竞争性行业与快节奏赛道;会贪狼成火贪,横发之势更真。落陷时方主急躁虚耗,庙旺不可按凶星断。',
    source: srcs.quanshu('火星庙旺,指日立边功'), confidence: 0.75,
  }),
  entry({
    id: 'bright.lingxing.miao', domain: 'star', entities: ['lingxingMin', 'miao'], topics: ['career', 'fortune'],
    summary: '铃星入庙,沉着的爆发力,利谋定后动的开创。',
    detail: '铃星庙旺其性由阴燥转为坚韧,主暗中蓄力一击而中;会贪狼成铃贪格。庙旺之铃星宜断为「有城府的行动派」,不作凶论。',
    source: srcs.quanshu('铃贪相遇,将相之名'), confidence: 0.72,
  }),
  entry({
    id: 'bright.qingyang.miao', domain: 'star', entities: ['qingyangMin', 'miao'], topics: ['career'],
    summary: '擎羊入庙(辰戌丑未),刚烈成执行利刃,宜武职技术。',
    detail: '擎羊庙于四墓之地,锋芒得鞘,主决断力与开刀见血的执行力,宜外科/工程/竞技/纪检类「带刃」行业;午宫遇天同太阴另成马头带箭。落陷时方主刑伤是非。',
    source: srcs.quanshu('擎羊入庙,富贵声扬'), confidence: 0.75,
  }),
  entry({
    id: 'bright.tuoluo.miao', domain: 'star', entities: ['tuoluoMin', 'miao'], topics: ['career'],
    summary: '陀罗入庙,磨性成韧性,利需要长期打磨的深功夫。',
    detail: '陀罗庙于四墓,拖延纠缠之性转为沉潜钻研,宜研发、工艺、长周期项目;断语从「阻滞」转为「厚积」。落陷时才主进退失据。',
    source: srcs.modern('通行亮度释义:陀罗庙旺主沉毅'), confidence: 0.68,
  }),
  // ---- 煞星落陷:为害较烈,课题化表述 ----
  entry({
    id: 'bright.qingyang.xian', domain: 'star', entities: ['qingyangMin', 'xian'], topics: ['health', 'overview'],
    summary: '擎羊落陷,刚烈失控之象,须以规则与运动泄其锐。',
    detail: '陷地擎羊主冲动、外伤与口舌官非倾向,断语应落到「建立规则感、以竞技运动泄压、重要决定过夜再定」的经营建议,不作恐吓。',
    source: srcs.quanshu('擎羊…陷地则残伤带疾'), confidence: 0.7,
  }),
  entry({
    id: 'bright.huoxing.xian', domain: 'star', entities: ['huoxingMin', 'xian'], topics: ['overview', 'health'],
    summary: '火星落陷,急躁虚火,宜慢事缓办、忌情绪化决策。',
    detail: '陷地火星主性急多变、虎头蛇尾与燥热之扰;建议表述为节奏管理与情绪冷却机制,得吉化会照可减。',
    source: srcs.modern('通行亮度释义'), confidence: 0.66,
  }),
  // ---- 主星庙旺:取断语上限 ----
  entry({
    id: 'bright.taiyang.miao', domain: 'star', entities: ['taiyangMaj', 'miao'], topics: ['career', 'overview'],
    summary: '太阳入庙,光明博爱能量全开,声名与担当并至。',
    detail: '太阳庙旺(卯至午方)主热忱、公众缘与领导担当,利公职、教育、传播等抛头露面之业;男命父子缘厚,女命旺夫。断语可取上限。',
    source: srcs.wenda, confidence: 0.8,
  }),
  entry({
    id: 'bright.taiyin.miao', domain: 'star', entities: ['taiyinMaj', 'miao'], topics: ['wealth', 'family'],
    summary: '太阴入庙,静水深流,富而能藏,田宅母妻缘皆厚。',
    detail: '太阴庙旺(酉至子方)主细腻审美与积蓄之力,利置产理财与幕后掌财;情感表达温润。断语可取上限。',
    source: srcs.wenda, confidence: 0.8,
  }),
  entry({
    id: 'bright.wuqu.miao', domain: 'star', entities: ['wuquMaj', 'miao'], topics: ['wealth', 'career'],
    summary: '武曲入庙,正财之力全开,执行与财务能力过人。',
    detail: '武曲庙旺(辰戌丑未)刚毅化为干练,主以专业与执行力生财,利金融、实业、工程;孤克之性亦减。',
    source: srcs.wenda, confidence: 0.78,
  }),
  entry({
    id: 'bright.tianliang.miao', domain: 'star', entities: ['tianliangMaj', 'miao'], topics: ['career', 'health'],
    summary: '天梁入庙,荫星力宏,逢凶可解,长者贵人缘深。',
    detail: '天梁庙旺主化解之力与清望,利医药、法律、监察、公益;遇灾病常有转圜。断语强调「先经波折后得解」的荫庇模式。',
    source: srcs.wenda, confidence: 0.78,
  }),
  // ---- 主星落陷:保守口径 + 给解法 ----
  entry({
    id: 'bright.taiyang.xian', domain: 'star', entities: ['taiyangMaj', 'xian'], topics: ['career', 'family'],
    summary: '太阳落陷,光而不耀,付出多回报缓,宜幕后发光。',
    detail: '太阳陷(酉至寅方)主热忱内敛、名大于利、易操劳;男命注意父缘沟通,女命择偶宜重责任感。会禄科则「陷而有救」,可在专业圈内立声名。断语取保守口径并给出「深耕专业、延迟回报」的路径。',
    source: srcs.quanshu('太阳落陷,劳心费力'), confidence: 0.78,
  }),
  entry({
    id: 'bright.taiyin.xian', domain: 'star', entities: ['taiyinMaj', 'xian'], topics: ['wealth', 'family'],
    summary: '太阴落陷,月隐云后,财宜稳守,情绪须有出口。',
    detail: '太阴陷(卯至未方)主积蓄力减、情绪暗涌与母系缘分课题;理财宜保守配置,忌高杠杆。会禄存化禄则守成可期。',
    source: srcs.quanshu('太阴落陷,伤母克妻'), confidence: 0.75,
  }),
  entry({
    id: 'bright.jumen.xian', domain: 'star', entities: ['jumenMaj', 'xian'], topics: ['career', 'family'],
    summary: '巨门落陷,口舌是非放大,慎言即是开运。',
    detail: '陷地巨门疑心与是非之性凸显,断语落到「书面沟通、留痕办事、不传话」的纪律;得太阳庙旺会照或化禄权则口才反成利器。',
    source: srcs.quanshu('巨门落陷,多招是非'), confidence: 0.75,
  }),
  entry({
    id: 'bright.tanlang.xian', domain: 'star', entities: ['tanlangMaj', 'xian'], topics: ['overview', 'marriage'],
    summary: '贪狼落陷,欲望失焦,多学少精,宜立取舍纪律。',
    detail: '陷地贪狼兴趣广而难深,交际与情感须防泛滥;断语给「聚焦一艺、设社交边界」之法。会火铃时爆发力仍在,唯更需守成。',
    source: srcs.wenda, confidence: 0.72,
  }),
  entry({
    id: 'bright.lianzhen.xian', domain: 'star', entities: ['lianzhenMaj', 'xian'], topics: ['career', 'marriage'],
    summary: '廉贞落陷,囚星性显,情理纠缠,最忌再逢化忌。',
    detail: '陷地廉贞主感情与制度的双重纠缠(情感执念/文书官非倾向),断语落到「重要文件多审、感情课题求疏不求堵」;落陷又化忌为双重课题,须重点经营。',
    source: srcs.quanshu('廉贞落陷…官非之扰'), confidence: 0.74,
  }),
  entry({
    id: 'bright.tianji.xian', domain: 'star', entities: ['tianjiMaj', 'xian'], topics: ['career', 'overview'],
    summary: '天机落陷,机谋过转,想多行少,宜借外部节奏落地。',
    detail: '陷地天机聪明反被聪明误,计划多变难定;断语给「设截止日、找执行搭档」的落地机制。会化科则思虑转为条理。',
    source: srcs.modern('通行亮度释义'), confidence: 0.68,
  }),
  // ---- 文星落陷 ----
  entry({
    id: 'bright.wenchang.xian', domain: 'star', entities: ['wenchangMin', 'xian'], topics: ['career'],
    summary: '文昌落陷,文书科名多波折,细节校对即是护身符。',
    detail: '陷地文昌主考试文书易出纰漏,断语落到「重要文书三校、考试重基本盘」;化科会照可解。',
    source: srcs.modern('通行亮度释义'), confidence: 0.66,
  }),
  entry({
    id: 'bright.wenqu.xian', domain: 'star', entities: ['wenquMin', 'xian'], topics: ['career', 'marriage'],
    summary: '文曲落陷,口才桃花两失焦,表达宜求准不求巧。',
    detail: '陷地文曲主言辞易生歧义、异性缘纷扰;断语给「书面确认、关系透明」的经营建议。',
    source: srcs.modern('通行亮度释义'), confidence: 0.65,
  }),
];
