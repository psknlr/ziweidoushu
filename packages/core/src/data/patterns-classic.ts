/**
 * 古籍经典格局库(24 格),补充 STARTER_PATTERNS 之外的《紫微斗数全书》
 * 《骨髓赋》《太微赋》名格。三层条件模型:required / bonus / broken。
 *
 * 判定口径总说明:
 * - 三方四正判定含本宫(trineIndexes 含 target),故「同宫或会照」一律用 trine 条件;
 * - DSL 无法表达「夹宫」(左右邻宫)与「命无正曜」,涉及此类严格口径的格局
 *   (羊陀夹忌、火铃夹命、日月夹命、明珠出海、命无正曜)按「宁缺毋滥」原则未收录;
 * - 凶格统一约定:bonus = 凶象加重条件,broken = 得吉化解、凶性缓解条件,
 *   且 note 中注明「解读须课题化」——凶格只作风险课题与修炼方向,不作宿命断言。
 */
import type { PatternDef } from '../analyzer/patterns.js';

const SHA_STARS = ['qingyangMin', 'tuoluoMin', 'huoxingMin', 'lingxingMin'] as const;
const KONG_JIE = ['dikongMin', 'dijieMin'] as const;

export const CLASSIC_PATTERNS: readonly PatternDef[] = [
  // ---------------------------------------------------------------- 吉格
  {
    id: 'fuxiang-chaoyuan',
    name: '府相朝垣',
    source: '《骨髓赋》:「府相同来会命宫,全家食禄。」《紫微斗数全书》:「府相朝垣,千钟食禄。」',
    required: [
      { kind: 'trineHasAll', stars: ['tianfuMaj', 'tianxiangMaj'], desc: '天府、天相会于命宫三方四正' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照,禄库充盈' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼会照,佐贵之力' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞入命,朝垣带瑕' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,禄库有漏' },
    ],
    note: '简化判定:以三方四正同会府相为准;严格口径须府相分守财帛、官禄二宫朝命,后续版本细化。',
  },
  {
    id: 'zifu-chaoyuan',
    name: '紫府朝垣',
    source: '《骨髓赋》:「紫府朝垣,食禄万钟。」(命安寅申,紫微天府三方来朝)',
    required: [
      { kind: 'soulBranchIn', branches: ['yinEarthly', 'shenEarthly'], desc: '命宫居寅或申' },
      { kind: 'trineHasAll', stars: ['ziweiMaj', 'tianfuMaj'], desc: '紫微、天府会于三方四正' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼来朝' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺来朝' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,朝拱成虚' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
    note: '若紫微天府同坐寅申命宫,则同时命中「紫府同宫」格,以同宫格为主论。',
  },
  {
    id: 'rili-zhongtian',
    name: '日丽中天',
    source: '《紫微斗数全书》:「太阳居午,谓之日丽中天,有专权之贵,敌国之富。」',
    required: [
      { kind: 'soulHasOne', stars: ['taiyangMaj'], desc: '太阳守命' },
      { kind: 'soulBranchIn', branches: ['wuEarthly'], desc: '命宫居午,日在中天' },
    ],
    bonus: [
      { kind: 'soulStarBrightnessIn', star: 'taiyangMaj', brightness: ['miao', 'wang'], desc: '太阳庙旺,光华正盛' },
      { kind: 'starHasMutagen', star: 'taiyangMaj', mutagen: 'sihuaLu', desc: '太阳化禄' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照,贵而有文' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,光而不实' },
      { kind: 'starHasMutagen', star: 'taiyangMaj', mutagen: 'sihuaJi', desc: '太阳化忌,名誉之累' },
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞入命' },
    ],
  },
  {
    id: 'yuelang-tianmen',
    name: '月朗天门',
    source: '《紫微斗数全书》:「太阴居亥,号曰月朗天门,入庙化吉,蟾宫折桂。」',
    required: [
      { kind: 'soulHasOne', stars: ['taiyinMaj'], desc: '太阴守命' },
      { kind: 'soulBranchIn', branches: ['haiEarthly'], desc: '命宫居亥,月照天门' },
    ],
    bonus: [
      { kind: 'soulStarBrightnessIn', star: 'taiyinMaj', brightness: ['miao', 'wang'], desc: '太阴庙旺' },
      { kind: 'starHasMutagen', star: 'taiyinMaj', mutagen: 'sihuaLu', desc: '太阴化禄,富局' },
      { kind: 'starHasMutagen', star: 'taiyinMaj', mutagen: 'sihuaKe', desc: '太阴化科,清贵之名' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,月华被掩' },
      { kind: 'starHasMutagen', star: 'taiyinMaj', mutagen: 'sihuaJi', desc: '太阴化忌' },
    ],
  },
  {
    id: 'yuesheng-canghai',
    name: '月生沧海',
    source: '《骨髓赋》:「太阴居子,号曰水澄桂萼,得清要之职,忠谏之材。」',
    required: [
      { kind: 'soulHasOne', stars: ['taiyinMaj'], desc: '太阴守命' },
      { kind: 'soulBranchIn', branches: ['ziEarthly'], desc: '命宫居子,月生沧海' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['taiyinMaj', 'tiantongMaj'], desc: '同阴同守,水澄月皎' },
      { kind: 'starHasMutagen', star: 'taiyinMaj', mutagen: 'sihuaKe', desc: '太阴化科,清要之职' },
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞入命,清辉受扰' },
      { kind: 'starHasMutagen', star: 'taiyinMaj', mutagen: 'sihuaJi', desc: '太阴化忌' },
    ],
    note: '古籍另有以田宅宫论「月生沧海」者;本库采命宫口径(太阴子宫守命)。',
  },
  {
    id: 'riyue-tonglin',
    name: '日月同临',
    source: '《紫微斗数全书》:「日月同临,官居侯伯。」(太阳太阴同守丑未)',
    required: [
      { kind: 'soulHasAll', stars: ['taiyangMaj', 'taiyinMaj'], desc: '太阳、太阴同守命宫(必在丑未)' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照,日月增辉' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼会照' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
    note: '丑未日月必有一曜失辉,阴阳并济而各有明暗面,断语宜留余地。',
  },
  {
    id: 'juji-jumao',
    name: '巨机居卯',
    source: '《骨髓赋》:「巨机居卯,公卿之位。」(又称巨机同临)',
    required: [
      { kind: 'soulHasAll', stars: ['jumenMaj', 'tianjiMaj'], desc: '巨门、天机同守命宫' },
      { kind: 'soulBranchIn', branches: ['maoEarthly'], desc: '命宫居卯(居酉则减力,不入正格)' },
    ],
    bonus: [
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaLu', desc: '巨门化禄,以言得禄' },
      { kind: 'starHasMutagen', star: 'tianjiMaj', mutagen: 'sihuaQuan', desc: '天机化权,谋而能断' },
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞入命,口舌风波加重' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
  },
  {
    id: 'tanwu-tongxing',
    name: '贪武同行',
    source: '《骨髓赋》:「贪武同行,威镇边夷。」又云:「先贫而后富,武贪同身命之宫。」',
    required: [
      { kind: 'soulHasAll', stars: ['wuquMaj', 'tanlangMaj'], desc: '武曲、贪狼同守命宫(必在丑未)' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['huoxingMin', 'lingxingMin'], desc: '会火铃,兼成火贪/铃贪之势' },
      { kind: 'starHasMutagen', star: 'wuquMaj', mutagen: 'sihuaLu', desc: '武曲化禄,财权并至' },
      { kind: 'starHasMutagen', star: 'tanlangMaj', mutagen: 'sihuaQuan', desc: '贪狼化权' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,发而难守' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
    note: '古诀明言「先贫后富」——此格发迹多在三十岁后,少年期解读应导向蓄力与专业打底。',
  },
  {
    id: 'lianzhen-wenwu',
    name: '廉贞文武',
    source: '《紫微斗数全书》:「廉贞文武格:命中文武喜朝垣,入庙平生福气全。」',
    required: [
      { kind: 'soulHasOne', stars: ['lianzhenMaj'], desc: '廉贞守命' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '文昌或文曲会照,文武相济' },
    ],
    bonus: [
      { kind: 'soulStarBrightnessIn', star: 'lianzhenMaj', brightness: ['miao', 'wang'], desc: '廉贞入庙' },
      { kind: 'trineHasAll', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲齐会' },
      { kind: 'starHasMutagen', star: 'lianzhenMaj', mutagen: 'sihuaLu', desc: '廉贞化禄' },
    ],
    broken: [
      { kind: 'starHasMutagen', star: 'lianzhenMaj', mutagen: 'sihuaJi', desc: '廉贞化忌,文武之才受阻' },
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞入命' },
    ],
  },
  {
    id: 'xiongsu-chaoyuan',
    name: '雄宿朝元',
    source: '《紫微斗数全书》:「廉贞寅申宫,无杀,富贵声扬播远名」,古称雄宿朝元格。',
    required: [
      { kind: 'soulHasOne', stars: ['lianzhenMaj'], desc: '廉贞守命' },
      { kind: 'soulBranchIn', branches: ['yinEarthly', 'shenEarthly'], desc: '命宫居寅或申,廉贞入庙' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞入命,古诀「无杀」之条件即破' },
      { kind: 'starHasMutagen', star: 'lianzhenMaj', mutagen: 'sihuaJi', desc: '廉贞化忌' },
    ],
  },
  {
    id: 'yingxing-rumiao',
    name: '英星入庙',
    source: '《紫微斗数全书》:「破军子午宫,无杀,官资清显至三公」,古称英星入庙格。',
    required: [
      { kind: 'soulHasOne', stars: ['pojunMaj'], desc: '破军守命' },
      { kind: 'soulBranchIn', branches: ['ziEarthly', 'wuEarthly'], desc: '命宫居子或午,破军入庙' },
    ],
    bonus: [
      { kind: 'starHasMutagen', star: 'pojunMaj', mutagen: 'sihuaLu', desc: '破军化禄,破而后立' },
      { kind: 'starHasMutagen', star: 'pojunMaj', mutagen: 'sihuaQuan', desc: '破军化权,开创得势' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin'], desc: '辅弼会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲同宫(古诀破军畏昌曲,水中作冢)' },
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
  },
  {
    id: 'tianyi-gongming',
    name: '天乙拱命',
    source: '《骨髓赋》:「魁钺命身多折桂。」《太微赋》:「天魁天钺,盖世文章。」',
    required: [
      { kind: 'trineHasAll', stars: ['tiankuiMin', 'tianyueMin'], desc: '天魁、天钺俱会于命宫三方四正' },
    ],
    bonus: [
      { kind: 'soulHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺坐命,近「坐贵向贵」之义' },
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照,贵而有文' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaKe', desc: '化科会照,科名贵人相得' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS, ...KONG_JIE], desc: '煞空入命,贵人之力打折' },
    ],
    note: '「坐贵向贵」(魁钺分守命宫与对宫)因 DSL 无对宫专用条件,以 bonus「魁钺坐命且双星会齐」近似表达。',
  },
  {
    id: 'wengui-wenhua',
    name: '文桂文华',
    source: '《骨髓赋》:「文桂文华,九重贵显。」(文昌文曲同会命垣)',
    required: [
      { kind: 'trineHasAll', stars: ['wenchangMin', 'wenquMin'], desc: '文昌、文曲俱会于命宫三方四正' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲同守命宫,才华外显' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaKe', desc: '化科会照,科名之应' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺会照' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,文华虚浮' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照' },
    ],
  },
  {
    id: 'fubi-gongzhu',
    name: '辅弼拱主',
    source: '《骨髓赋》:「左辅右弼,秉性克宽克厚。」《紫微斗数全书》:「辅弼拱主为上品。」',
    required: [
      { kind: 'trineHasAll', stars: ['zuofuMin', 'youbiMin'], desc: '左辅、右弼俱会于命宫三方四正' },
      {
        kind: 'soulHasOne',
        stars: ['ziweiMaj', 'tianfuMaj', 'tianxiangMaj', 'taiyangMaj', 'wuquMaj'],
        desc: '命有可拱之主(紫微/天府/天相/太阳/武曲等领导型主星)',
      },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '再会魁钺,助力成网' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaQuan', desc: '化权会照,得众而能任事' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...SHA_STARS, ...KONG_JIE], desc: '煞空入命' },
    ],
    note: '紫微守命而辅弼拱者与「君臣庆会」并存,以君臣庆会为主论;本格泛论辅弼拱诸领导型主星。',
  },
  {
    id: 'shuanglu-chaoyuan',
    name: '双禄朝垣',
    source: '《骨髓赋》:「双禄朝垣,富比陶朱。」(禄存与化禄同会命垣三方)',
    required: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会于三方四正' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会于三方四正' },
    ],
    bonus: [
      { kind: 'soulHasOne', stars: ['lucunMin'], desc: '禄存坐命,近「禄合鸳鸯」之义' },
      { kind: 'trineHasOne', stars: ['tianmaMin'], desc: '再会天马,禄马交驰兼得' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin', 'wenchangMin', 'wenquMin'], desc: '吉星护禄,方为正格' },
    ],
    broken: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫入命,双禄成虚(古诀最忌)' },
      { kind: 'trineHasOne', stars: [...KONG_JIE], desc: '空劫会照,禄有漏卮' },
    ],
    note: '「禄合鸳鸯」(禄存与化禄同守命宫)因 DSL 无「命宫见四化」条件,以 bonus「禄存坐命」近似;source 末句陶朱语出全书格局论。',
  },
  {
    id: 'luma-jiaochi',
    name: '禄马交驰',
    source: '《紫微斗数全书》:「禄马最喜交驰。」《骨髓赋》:「禄马交驰,发财远郡。」',
    required: [
      { kind: 'trineHasOne', stars: ['tianmaMin'], desc: '天马会于三方四正' },
      {
        kind: 'anyOf',
        desc: '禄存或化禄会照',
        conds: [
          { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照' },
          { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照' },
        ],
      },
    ],
    bonus: [
      { kind: 'soulBranchIn', branches: ['yinEarthly', 'shenEarthly', 'siEarthly', 'haiEarthly'], desc: '命居四马之地,动象最真' },
      { kind: 'trineHasOne', stars: ['tianfuMaj', 'wuquMaj'], desc: '财星同会,动中聚财' },
    ],
    broken: [
      { kind: 'trineHasOne', stars: [...KONG_JIE], desc: '空劫会照,马落空亡,奔忙无功' },
      { kind: 'trineHasOne', stars: ['tuoluoMin'], desc: '陀罗会照,折足之马' },
    ],
  },

  // -------------------------------------------------- 特殊格(贵险并存/中性)
  {
    id: 'matou-daijian',
    name: '马头带箭',
    source: '《紫微斗数全书》:「马头带箭,威镇边疆。」(擎羊守命午宫)',
    required: [
      { kind: 'soulHasOne', stars: ['qingyangMin'], desc: '擎羊守命' },
      { kind: 'soulBranchIn', branches: ['wuEarthly'], desc: '命宫居午(马头)' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['tiantongMaj', 'taiyinMaj'], desc: '同阴同宫加擎羊,为经典正格' },
      { kind: 'trineHasOne', stars: ['qishaMaj', 'pojunMaj', 'tanlangMaj'], desc: '会杀破狼,冲锋之力有所用' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺会照,险中得贵人' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌冲照,箭反伤己' },
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '空劫同宫' },
    ],
    note: '贵险并存之格:解读须课题化——宜外派开拓、异地攻坚、高强度专业(运动/外科/工程一线),同时明示冲动与安全课题,不作「大贵/凶险」单边断言。',
  },
  {
    id: 'jiju-maoyou',
    name: '极居卯酉',
    source: '《骨髓赋》:「极居卯酉,多为脱俗僧人。」(紫微贪狼同守卯酉)',
    required: [
      { kind: 'soulHasAll', stars: ['ziweiMaj', 'tanlangMaj'], desc: '紫微、贪狼同守命宫' },
      { kind: 'soulBranchIn', branches: ['maoEarthly', 'youEarthly'], desc: '命宫居卯或酉' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['wenchangMin', 'wenquMin'], desc: '昌曲会照,才艺哲思并具' },
      { kind: 'starHasMutagen', star: 'tanlangMaj', mutagen: 'sihuaLu', desc: '贪狼化禄,才艺可变现' },
    ],
    broken: [
      { kind: 'trineHasOne', stars: [...SHA_STARS], desc: '四煞会照,欲念与理想相扰' },
    ],
    note: '中性格:「僧人」古断须现代化转译为哲学修行气质、艺术宗教人文领域之才;解读课题为欲望与超脱的整合,不作出家、孤独类断言。',
  },

  // ---------------------------------------------------------------- 凶格
  {
    id: 'riyue-fanbei',
    name: '日月反背',
    source: '《紫微斗数全书》:「日月最嫌反背。」(日落西山、月出沧海之反,失辉之地)',
    required: [
      {
        kind: 'anyOf',
        desc: '命宫太阳或太阴落陷失辉',
        conds: [
          { kind: 'soulStarBrightnessIn', star: 'taiyangMaj', brightness: ['xian', 'bu'], desc: '太阳守命落陷' },
          { kind: 'soulStarBrightnessIn', star: 'taiyinMaj', brightness: ['xian', 'bu'], desc: '太阴守命落陷' },
        ],
      },
    ],
    bonus: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌会照,反背之象加重' },
      { kind: 'trineHasOne', stars: [...SHA_STARS], desc: '四煞会照,劳象加重' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,失辉得禄,先劳后成' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin', 'tiankuiMin', 'tianyueMin'], desc: '吉星会照,得人相助补光' },
    ],
    note: '凶格,解读须课题化:反背主「劳而后得、大器晚成」,宜幕后深耕与异地发展,严禁「劳碌命」宿命话术。严格口径为日月俱处反背之地,此处以命宫日/月落陷近似;日月同宫丑未者另以「日月同临」并参。bonus=加重条件,broken=化解条件。',
  },
  {
    id: 'liangma-piaodang',
    name: '梁马飘荡',
    source: '《紫微斗数全书》:「天梁天马陷,飘荡无疑。」',
    required: [
      { kind: 'soulHasOne', stars: ['tianliangMaj'], desc: '天梁守命' },
      { kind: 'soulBranchIn', branches: ['siEarthly', 'haiEarthly'], desc: '命居巳亥,天梁落陷之地' },
      { kind: 'trineHasOne', stars: ['tianmaMin'], desc: '天马同宫或会照' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: [...KONG_JIE], desc: '空劫会照,飘荡之象加重' },
    ],
    broken: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照,飘荡转为禄马交驰之用' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,动中得禄' },
      { kind: 'starHasMutagen', star: 'tianliangMaj', mutagen: 'sihuaKe', desc: '天梁化科,荫星得名,漂泊有归' },
    ],
    note: '凶格偏中性,解读须课题化:飘荡转译为高流动性职业适配(外派、航旅、跨境、自由职业),课题是建立锚点与长期积累,不作「无根漂泊」断言。bonus=加重条件,broken=化解条件。',
  },
  {
    id: 'zhensha-tonggong',
    name: '贞杀同宫',
    source: '《紫微斗数全书》:「七杀廉贞同位,路上埋尸。」(廉贞七杀同守丑未;古断取其戒,不取其断)',
    required: [
      { kind: 'soulHasAll', stars: ['lianzhenMaj', 'qishaMaj'], desc: '廉贞、七杀同守命宫(必在丑未)' },
    ],
    bonus: [
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞同宫,刚烈之性加重' },
      { kind: 'starHasMutagen', star: 'lianzhenMaj', mutagen: 'sihuaJi', desc: '廉贞化忌,是非与安全课题最须警觉' },
    ],
    broken: [
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照,古诀「遇帝禄而解其厄」之义' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,刚性得润' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺会照,险处有贵人' },
    ],
    note: '凶格,解读须课题化:古断惨烈语一律不引入断语,转译为「高风险场景的安全纪律与守法课题」,并指出其纪律性、执行力可用于军警、外科、风控等刚性专业。bonus=加重条件,broken=化解条件。',
  },
  {
    id: 'xingqiu-yinju',
    name: '刑囚印聚',
    source: '《紫微斗数全书》:「刑囚夹印,刑杖惟司。」(廉贞天相与擎羊同聚)',
    required: [
      { kind: 'soulHasAll', stars: ['lianzhenMaj', 'tianxiangMaj'], desc: '廉贞(囚)、天相(印)同守命宫' },
      { kind: 'soulHasOne', stars: ['qingyangMin'], desc: '擎羊(刑)同宫' },
    ],
    bonus: [
      { kind: 'starHasMutagen', star: 'lianzhenMaj', mutagen: 'sihuaJi', desc: '廉贞化忌,官非文书课题加重' },
      { kind: 'trineHasOne', stars: [...SHA_STARS], desc: '三方再会煞星' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,刑印得禄而转司法执法之才' },
      { kind: 'trineHasOne', stars: ['tiankuiMin', 'tianyueMin'], desc: '魁钺会照,讼事有贵人' },
    ],
    note: '凶格,解读须课题化:主与规则、契约、法务纠葛的一生课题,正向发挥即法律、审计、合规、执法之才;严禁「牢狱之灾」式断言,一律转为守约合规与文书谨慎的提示。「夹印」原义为羊(或陀)夹天相,DSL 无夹宫条件,此处采「刑囚印三曜同聚命宫」通行简化口径。bonus=加重条件,broken=化解条件。',
  },
  {
    id: 'jufeng-sisha',
    name: '巨逢四煞',
    source: '《骨髓赋》:「巨门陀罗,必生异痣;巨火擎羊,防罹缧绁。」(巨逢四煞;古断取其戒,不取其断)',
    required: [
      { kind: 'soulHasOne', stars: ['jumenMaj'], desc: '巨门守命' },
      { kind: 'soulHasOne', stars: [...SHA_STARS], desc: '四煞之一同宫' },
    ],
    bonus: [
      { kind: 'trineHasOne', stars: ['huoxingMin'], desc: '再会火星,巨火相激,口舌是非之象最烈' },
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaJi', desc: '巨门化忌,暗曜之忌加重' },
    ],
    broken: [
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaLu', desc: '巨门化禄,以口生财反成其用' },
      { kind: 'starHasMutagen', star: 'jumenMaj', mutagen: 'sihuaQuan', desc: '巨门化权,言语有权柄' },
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照解其暗' },
    ],
    note: '凶格,解读须课题化:古断极端语绝不进入断语,转译为「言语风波与情绪管理课题」,正向出路为以言语专业化解——谈判、法务、评论、危机公关。bonus=加重条件,broken=化解条件。',
  },
  {
    id: 'mingfeng-kongjie',
    name: '命里逢空',
    source: '《骨髓赋》:「命里逢空,不飘流即主疾苦。」「生逢天空,犹如半天折翅。」',
    required: [
      { kind: 'soulHasOne', stars: [...KONG_JIE], desc: '地空或地劫守命' },
    ],
    bonus: [
      { kind: 'soulHasAll', stars: ['dikongMin', 'dijieMin'], desc: '空劫双守命宫,古喻「半天折翅」,起落之象最著' },
      { kind: 'trineHasMutagen', mutagen: 'sihuaJi', desc: '化忌会照,虚耗加重' },
    ],
    broken: [
      { kind: 'trineHasMutagen', mutagen: 'sihuaLu', desc: '化禄会照,空处得实' },
      { kind: 'trineHasOne', stars: ['zuofuMin', 'youbiMin', 'tiankuiMin', 'tianyueMin'], desc: '吉星会照,有人托底' },
      { kind: 'trineHasOne', stars: ['lucunMin'], desc: '禄存会照,库中有根' },
    ],
    note: '凶格,解读须课题化:空劫主「不落俗套的想象力」与「财务波动课题」并存——宜哲学、创意、研发等务虚生实之路,理财课题是止损纪律与低杠杆;严禁「破财命/飘泊命」断言。bonus=加重条件,broken=化解条件。',
  },
];
