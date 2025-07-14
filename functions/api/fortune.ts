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
    lunar_festival: string;
    festival: string;
    lmonthname: string;
    lubarmonth: string;
    lunarday: string;
    jieqi: string;
  };
  fortune_info: {
    fitness: string;
    taboo: string;
    shenwei: string;
    taishen: string;
    chongsha: string;
    suisha: string;
    pengzu: string;
    jianshen: string;
  };
  wuxing_info: {
    wuxingjiazi: string;
    wuxingnayear: string;
    wuxingnamonth: string;
  };
  xingsu_info: {
    xingsu: string;
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
              // 天行数据API字段映射 - 根据实际API响应调整
              const lunarFormatted = result.lubarmonth && result.lunarday ? 
                                   `${result.lubarmonth}${result.lunarday}` : 
                                   (result.lunardate || '农历信息获取中...');
              
              fortuneData = {
                date_info: {
                  gregorian_date: result.gregoriandate || today,
                  lunar_date: result.lunardate || '',
                  lunar_formatted: lunarFormatted,
                  year_ganzhi: result.tiangandizhiyear || '',
                  month_ganzhi: result.tiangandizhimonth || '',
                  day_ganzhi: result.tiangandizhiday || '',
                  zodiac: result.shengxiao || '',
                  lunar_festival: result.lunar_festival || '',
                  festival: result.festival || '',
                  lmonthname: result.lmonthname || '',
                  lubarmonth: result.lubarmonth || '',
                  lunarday: result.lunarday || '',
                  jieqi: result.jieqi || ''
                },
                fortune_info: {
                  fitness: result.fitness || '',
                  taboo: result.taboo || '',
                  shenwei: result.shenwei || '',
                  taishen: result.taishen || '',
                  chongsha: result.chongsha || '',
                  suisha: result.suisha || '',
                  pengzu: result.pengzu || '',
                  jianshen: result.jianshen || ''
                },
                wuxing_info: {
                  wuxingjiazi: result.wuxingjiazi || '',
                  wuxingnayear: result.wuxingnayear || '',
                  wuxingnamonth: result.wuxingnamonth || ''
                },
                xingsu_info: {
                  xingsu: result.xingsu || ''
                }
              };
              console.log('成功解析天行API数据:', fortuneData);
            }
          }
        } catch (error) {
          console.error('天行数据API调用失败:', error);
        }
      } else {
        console.log('使用兜底数据：未配置TIANAPI_KEY环境变量');
      }
      
      // 如果没有配置API key或API调用失败，返回错误
      if (!fortuneData) {
        if (!env.TIANAPI_KEY) {
          return new Response(JSON.stringify({
            success: false,
            error: '未配置天行数据API密钥，请联系管理员配置TIANAPI_KEY环境变量'
          }), {
            status: 400,
            headers: corsHeaders()
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: '天行数据API调用失败，请稍后重试'
          }), {
            status: 500,
            headers: corsHeaders()
          });
        }
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