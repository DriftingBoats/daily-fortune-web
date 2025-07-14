// Cloudflare Pages Functions API for Constellation
// TypeScript implementation for constellation fortune API

interface Env {
  TIANAPI_KEY?: string;
}

interface ConstellationData {
  sign: string;
  date: string;
  overall: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
  lucky_number: number;
  lucky_color: string;
}

// 缓存管理
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000; // 12小时

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

const cache = new SimpleCache();

// 星座名称映射
const constellationMap: { [key: string]: string } = {
  '白羊座': 'aries',
  '金牛座': 'taurus', 
  '双子座': 'gemini',
  '巨蟹座': 'cancer',
  '狮子座': 'leo',
  '处女座': 'virgo',
  '天秤座': 'libra',
  '天蝎座': 'scorpio',
  '射手座': 'sagittarius',
  '摩羯座': 'capricorn',
  '水瓶座': 'aquarius',
  '双鱼座': 'pisces'
};

// 获取备用星座数据
function getFallbackConstellationData(sign: string): ConstellationData {
  const today = new Date().toISOString().split('T')[0];
  
  const overallFortunes = [
    '今日运势不错，适合积极行动，把握机会',
    '运势平稳，保持平常心，稳步前进',
    '今日能量充沛，适合挑战新事物',
    '运势略有波动，建议谨慎行事',
    '今日运势上升，适合做重要决定'
  ];
  
  const loveFortunes = [
    '感情运势良好，单身者有机会遇到心仪对象',
    '恋爱运势平稳，适合与伴侣深入交流',
    '桃花运旺盛，注意把握缘分',
    '感情需要耐心经营，避免冲动',
    '爱情运势上升，适合表达心意'
  ];
  
  const careerFortunes = [
    '工作运势良好，适合推进重要项目',
    '事业发展平稳，保持专注和努力',
    '职场表现出色，容易获得认可',
    '工作中可能遇到挑战，需要冷静应对',
    '事业运势上升，适合展示才能'
  ];
  
  const wealthFortunes = [
    '财运一般，建议理性消费',
    '偏财运不错，可适当投资',
    '财运平稳，适合储蓄理财',
    '投资需谨慎，避免冲动决定',
    '财运上升，有意外收获的可能'
  ];
  
  const healthFortunes = [
    '身体状况良好，注意适当休息',
    '健康运势平稳，保持规律作息',
    '精力充沛，适合运动锻炼',
    '注意身体信号，避免过度劳累',
    '健康运势上升，心情愉悦'
  ];
  
  const colors = ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色', '粉色', '白色'];
  
  return {
    sign,
    date: today,
    overall: overallFortunes[Math.floor(Math.random() * overallFortunes.length)],
    love: loveFortunes[Math.floor(Math.random() * loveFortunes.length)],
    career: careerFortunes[Math.floor(Math.random() * careerFortunes.length)],
    wealth: wealthFortunes[Math.floor(Math.random() * wealthFortunes.length)],
    health: healthFortunes[Math.floor(Math.random() * healthFortunes.length)],
    lucky_number: Math.floor(Math.random() * 100) + 1,
    lucky_color: colors[Math.floor(Math.random() * colors.length)]
  };
}

// 处理CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

// 星座运势API
export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }
  
  try {
    const sign = url.searchParams.get('sign') || '白羊座';
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `constellation_${sign}_${today}`;
    
    // 检查缓存
    let constellationData = cache.get(cacheKey);
    
    if (!constellationData) {
      // 尝试调用天行数据API
      if (env.TIANAPI_KEY) {
        try {
          const englishSign = constellationMap[sign] || 'aries';
          const apiUrl = `https://apis.tianapi.com/star/index?key=${env.TIANAPI_KEY}&astro=${englishSign}`;
          const response = await fetch(apiUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            cf: { cacheTtl: 3600 } // Cloudflare缓存1小时
          });
          
          if (response.ok) {
            const data = await response.json() as any;
            if (data.code === 200 && data.result) {
              const result = data.result;
              constellationData = {
                sign,
                date: today,
                overall: result.comprehensive || '',
                love: result.love || '',
                career: result.career || '',
                wealth: result.wealth || '',
                health: result.health || '',
                lucky_number: parseInt(result.number) || Math.floor(Math.random() * 100) + 1,
                lucky_color: result.color || '蓝色'
              };
            }
          }
        } catch (error) {
          console.error('天行数据API调用失败:', error);
        }
      }
      
      // 如果API调用失败，使用备用数据
      if (!constellationData) {
        constellationData = getFallbackConstellationData(sign);
      }
      
      // 缓存数据
      cache.set(cacheKey, constellationData);
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: constellationData
    }), {
      headers: corsHeaders()
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: `获取星座运势失败: ${error instanceof Error ? error.message : String(error)}`
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}