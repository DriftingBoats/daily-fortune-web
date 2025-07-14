// Cloudflare Pages Functions API
// TypeScript implementation for fortune and constellation APIs

interface Env {
  TIANAPI_KEY?: string;
}

interface FortuneData {
  date_info: {
    gregorian_date: string;
    lunar_date: string;
    lunar_formatted: string;
    year_ganzhi: string;
    month_ganzhi: string;
    day_ganzhi: string;
    zodiac: string;
  };
  fortune_info: {
    fitness: string;
    taboo: string;
    shenwei: string;
    taishen: string;
    chongsha: string;
  };
  festival_info: {
    festival: string;
    holiday: string;
  };
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

// 获取备用运势数据
function getFallbackFortuneData(): FortuneData {
  const today = new Date().toISOString().split('T')[0];
  
  const fitnessOptions = [
    '祈福、出行、会友', '学习、读书、思考', '整理、清洁、收纳',
    '运动、健身、散步', '烹饪、品茶、休息', '创作、写作、绘画'
  ];
  
  const tabooOptions = [
    '加班、熬夜、争吵', '暴饮暴食、冲动消费', '拖延、抱怨、负能量',
    '过度使用电子设备', '忽视健康、不运动', '说话不经大脑'
  ];
  
  return {
    date_info: {
      gregorian_date: today,
      lunar_date: '农历信息获取中...',
      lunar_formatted: '农历信息获取中...',
      year_ganzhi: '甲子',
      month_ganzhi: '丙寅',
      day_ganzhi: '戊辰',
      zodiac: '龙'
    },
    fortune_info: {
      fitness: fitnessOptions[Math.floor(Math.random() * fitnessOptions.length)],
      taboo: tabooOptions[Math.floor(Math.random() * tabooOptions.length)],
      shenwei: '东北',
      taishen: '房床厕外东南',
      chongsha: '冲狗(壬戌)煞南'
    },
    festival_info: {
      festival: '',
      holiday: ''
    }
  };
}

// 获取备用星座数据
function getFallbackConstellationData(sign: string): ConstellationData {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    sign,
    date: today,
    overall: '今日运势不错，适合积极行动',
    love: '感情运势平稳，单身者有机会遇到心仪对象',
    career: '工作运势良好，适合推进重要项目',
    wealth: '财运一般，建议理性消费',
    health: '身体状况良好，注意适当休息',
    lucky_number: Math.floor(Math.random() * 100) + 1,
    lucky_color: ['红色', '蓝色', '绿色', '黄色', '紫色'][Math.floor(Math.random() * 5)]
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

// 老黄历API
export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 处理CORS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `fortune_${today}`;
    
    // 检查缓存
    let fortuneData = cache.get(cacheKey);
    
    if (!fortuneData) {
      // 尝试调用天行数据API
      console.log('TIANAPI_KEY status:', env.TIANAPI_KEY ? 'Available' : 'Not set');
      if (env.TIANAPI_KEY) {
        try {
          const apiUrl = `https://apis.tianapi.com/lunar/index?key=${env.TIANAPI_KEY}&date=${today}`;
          console.log('Calling API:', apiUrl.replace(env.TIANAPI_KEY, '***'));
          const response = await fetch(apiUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            cf: { cacheTtl: 3600 } // Cloudflare缓存1小时
          });
          
          console.log('API Response status:', response.status);
          if (response.ok) {
            const data = await response.json() as any;
            console.log('API Response data:', data.code, data.msg || 'Success');
            if (data.code === 200 && data.result) {
              const result = data.result;
              fortuneData = {
                date_info: {
                  gregorian_date: today,
                  lunar_date: result.lunar_date || '',
                  lunar_formatted: result.lunar_date_cn || '农历信息获取中...',
                  year_ganzhi: result.year_ganzhi || '',
                  month_ganzhi: result.month_ganzhi || '',
                  day_ganzhi: result.day_ganzhi || '',
                  zodiac: result.zodiac || ''
                },
                fortune_info: {
                  fitness: result.fitness || '',
                  taboo: result.taboo || '',
                  shenwei: result.shenwei || '',
                  taishen: result.taishen || '',
                  chongsha: result.chongsha || ''
                },
                festival_info: {
                  festival: result.festival || '',
                  holiday: result.holiday || ''
                }
              };
            }
          }
        } catch (error) {
          console.error('天行数据API调用失败:', error);
        }
      } else {
        console.log('使用兜底数据：未配置TIANAPI_KEY环境变量');
      }
      
      // 如果API调用失败，使用备用数据
      if (!fortuneData) {
        fortuneData = getFallbackFortuneData();
      }
      
      // 缓存数据
      cache.set(cacheKey, fortuneData);
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: fortuneData,
      format: 'structured',
      source: env.TIANAPI_KEY ? 'api' : 'fallback'
    }), {
      headers: corsHeaders()
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: `获取老黄历失败: ${error instanceof Error ? error.message : String(error)}`
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}