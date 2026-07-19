/**
 * 中国全量城市经纬度库(L2)。
 *
 * 数据:3337 条省/市/区县级条目(源自开源 88250/city-geo 数据集,
 * 经 scripts 压缩为 [名称, 省, 市, 经度, 纬度],坐标保留两位小数,
 * 误差 ≈1km,对真太阳时影响 <4 秒)。
 * 海外城市仍由应用层接地理编码 API 兜底(本地优先、网络兜底策略)。
 */
import rows from './data/cities-cn.json';

export interface City {
  /** 条目名(区县级为区县名,市级为市名) */
  name: string;
  province: string;
  city: string;
  /** 东经 */
  longitude: number;
  /** 北纬 */
  latitude: number;
}

type Row = [string, string, string, number, number];

export const CITIES: readonly City[] = (rows as Row[]).map(([name, province, city, longitude, latitude]) => ({
  name,
  province,
  city,
  longitude,
  latitude,
}));

/** 展示用全名:省·市·区县(去重相邻重复段) */
export function cityLabel(c: City): string {
  const parts = [c.province, c.city, c.name].filter((v, i, arr) => v !== arr[i - 1]);
  return parts.join('·');
}

const strip = (s: string) => s.replace(/(省|市|区|县|自治区|自治州|自治县|地区|盟|旗)$/g, '');

/** 市级条目优先(「北京」应命中北京市,而非某个区) */
function rankLevel(c: City): number {
  if (c.name === c.province || strip(c.name) === strip(c.province)) return 0;
  if (c.name === c.city || strip(c.name) === strip(c.city)) return 1;
  return 2;
}

/**
 * 模糊搜索(UI 联想用):按 精确 > 前缀 > 包含 排序,同分市级优先、名短优先。
 */
export function searchCities(query: string, limit = 20): City[] {
  const q = query.trim();
  if (!q) return [];
  const qs = strip(q);
  const scored: { c: City; score: number }[] = [];
  for (const c of CITIES) {
    const n = c.name;
    const ns = strip(n);
    let score: number;
    if (n === q || ns === qs) score = 0;
    else if (n.startsWith(q) || ns.startsWith(qs)) score = 1;
    else if (n.includes(q) || `${c.province}${c.city}${c.name}`.includes(q)) score = 2;
    else continue;
    scored.push({ c, score });
  }
  return scored
    .sort((a, b) => a.score - b.score || rankLevel(a.c) - rankLevel(b.c) || a.c.name.length - b.c.name.length)
    .slice(0, limit)
    .map((s) => s.c);
}

/** 精确查询(引擎真太阳时用):取搜索结果的最优命中 */
export function lookupCity(query: string): City | undefined {
  return searchCities(query, 1)[0];
}
