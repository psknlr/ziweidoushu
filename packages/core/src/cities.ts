/**
 * 离线城市经纬度库(L2)。
 *
 * 策略:本地优先、网络兜底(参考 dart_iztro `geo_lookup_service.dart`)。
 * 此处内置中国主要城市;完整库可后续替换为 88250/city-geo 数据集,
 * 海外城市由应用层接地理编码 API 兜底。
 */

export interface City {
  name: string;
  pinyin: string;
  /** 东经 */
  longitude: number;
  /** 北纬 */
  latitude: number;
}

export const CITIES: readonly City[] = [
  { name: '北京', pinyin: 'beijing', longitude: 116.41, latitude: 39.9 },
  { name: '上海', pinyin: 'shanghai', longitude: 121.47, latitude: 31.23 },
  { name: '天津', pinyin: 'tianjin', longitude: 117.2, latitude: 39.08 },
  { name: '重庆', pinyin: 'chongqing', longitude: 106.55, latitude: 29.56 },
  { name: '广州', pinyin: 'guangzhou', longitude: 113.26, latitude: 23.13 },
  { name: '深圳', pinyin: 'shenzhen', longitude: 114.06, latitude: 22.55 },
  { name: '杭州', pinyin: 'hangzhou', longitude: 120.16, latitude: 30.29 },
  { name: '南京', pinyin: 'nanjing', longitude: 118.8, latitude: 32.06 },
  { name: '苏州', pinyin: 'suzhou', longitude: 120.58, latitude: 31.3 },
  { name: '成都', pinyin: 'chengdu', longitude: 104.07, latitude: 30.57 },
  { name: '武汉', pinyin: 'wuhan', longitude: 114.31, latitude: 30.59 },
  { name: '西安', pinyin: 'xian', longitude: 108.94, latitude: 34.34 },
  { name: '长沙', pinyin: 'changsha', longitude: 112.94, latitude: 28.23 },
  { name: '郑州', pinyin: 'zhengzhou', longitude: 113.63, latitude: 34.75 },
  { name: '济南', pinyin: 'jinan', longitude: 117.12, latitude: 36.65 },
  { name: '青岛', pinyin: 'qingdao', longitude: 120.38, latitude: 36.07 },
  { name: '沈阳', pinyin: 'shenyang', longitude: 123.43, latitude: 41.8 },
  { name: '大连', pinyin: 'dalian', longitude: 121.61, latitude: 38.91 },
  { name: '哈尔滨', pinyin: 'haerbin', longitude: 126.53, latitude: 45.8 },
  { name: '长春', pinyin: 'changchun', longitude: 125.32, latitude: 43.82 },
  { name: '石家庄', pinyin: 'shijiazhuang', longitude: 114.51, latitude: 38.04 },
  { name: '太原', pinyin: 'taiyuan', longitude: 112.55, latitude: 37.87 },
  { name: '呼和浩特', pinyin: 'huhehaote', longitude: 111.75, latitude: 40.84 },
  { name: '合肥', pinyin: 'hefei', longitude: 117.28, latitude: 31.86 },
  { name: '南昌', pinyin: 'nanchang', longitude: 115.86, latitude: 28.68 },
  { name: '福州', pinyin: 'fuzhou', longitude: 119.3, latitude: 26.08 },
  { name: '厦门', pinyin: 'xiamen', longitude: 118.09, latitude: 24.48 },
  { name: '昆明', pinyin: 'kunming', longitude: 102.83, latitude: 24.88 },
  { name: '贵阳', pinyin: 'guiyang', longitude: 106.63, latitude: 26.65 },
  { name: '南宁', pinyin: 'nanning', longitude: 108.37, latitude: 22.82 },
  { name: '海口', pinyin: 'haikou', longitude: 110.35, latitude: 20.02 },
  { name: '兰州', pinyin: 'lanzhou', longitude: 103.83, latitude: 36.06 },
  { name: '西宁', pinyin: 'xining', longitude: 101.78, latitude: 36.62 },
  { name: '银川', pinyin: 'yinchuan', longitude: 106.23, latitude: 38.49 },
  { name: '乌鲁木齐', pinyin: 'wulumuqi', longitude: 87.62, latitude: 43.83 },
  { name: '拉萨', pinyin: 'lasa', longitude: 91.11, latitude: 29.65 },
  { name: '香港', pinyin: 'xianggang', longitude: 114.17, latitude: 22.32 },
  { name: '澳门', pinyin: 'aomen', longitude: 113.55, latitude: 22.19 },
  { name: '台北', pinyin: 'taibei', longitude: 121.56, latitude: 25.03 },
  { name: '宁波', pinyin: 'ningbo', longitude: 121.55, latitude: 29.88 },
  { name: '温州', pinyin: 'wenzhou', longitude: 120.7, latitude: 28.0 },
  { name: '东莞', pinyin: 'dongguan', longitude: 113.75, latitude: 23.02 },
  { name: '佛山', pinyin: 'foshan', longitude: 113.12, latitude: 23.02 },
] as const;

/** 按中文名或拼音查询(前缀匹配),找不到返回 undefined → 应用层走网络兜底 */
export function lookupCity(query: string): City | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    CITIES.find((c) => c.name === q || c.pinyin === q) ??
    CITIES.find((c) => c.name.startsWith(q) || q.startsWith(c.name) || c.pinyin.startsWith(q))
  );
}
