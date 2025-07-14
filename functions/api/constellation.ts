// Cloudflare Pages Functions API for Constellation
// TypeScript implementation for constellation fortune API

interface Env {
  TIANAPI_KEY?: string;
}

interface ConstellationData {
  sign: string;
  date: string;
  overall_fortune: string;
  love_fortune: string;
  career_fortune: string;
  wealth_fortune: string;
  health_fortune: string;
  lucky_number: number;
  lucky_color: string;
  // 添加运势指数
  indices?: {
    comprehensive: number;
    love: number;
    work: number;
    money: number;
    health: number;
  };
  // 兼容字段
  comprehensive?: number;
  love?: number;
  work?: number;
  money?: number;
  health?: number;
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

// 英文到中文星座名称映射
const englishToChineseMap: { [key: string]: string } = {
  'aries': '白羊座',
  'taurus': '金牛座',
  'gemini': '双子座',
  'cancer': '巨蟹座',
  'leo': '狮子座',
  'virgo': '处女座',
  'libra': '天秤座',
  'scorpio': '天蝎座',
  'sagittarius': '射手座',
  'capricorn': '摩羯座',
  'aquarius': '水瓶座',
  'pisces': '双鱼座'
};



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
    const inputSign = url.searchParams.get('sign') || 'aries';
    // 转换为中文星座名称
    const sign = englishToChineseMap[inputSign] || inputSign;
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `constellation_${sign}_${today}`;
    
    console.log(`星座运势请求: ${inputSign} -> ${sign}`);
    
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
            if (data.code === 200 && data.result && data.result.list) {
              const list = data.result.list;
              // 解析天行API返回的list格式数据
              const getContentByType = (type: string) => {
                const item = list.find((item: any) => item.type && item.type.includes(type));
                return item ? item.content : '';
              };
              
              // 提取运势指数（从内容中解析数字）
              const extractScore = (content: string): number => {
                if (!content) return Math.floor(Math.random() * 40) + 60;
                
                // 查找指数相关的数字，优先匹配百分制数字
                const percentMatch = content.match(/([1-9]\d?)%/);
                if (percentMatch) {
                  return parseInt(percentMatch[1]);
                }
                
                // 查找分数形式，如"85分"
                const scoreMatch = content.match(/(\d+)分/);
                if (scoreMatch) {
                  return parseInt(scoreMatch[1]);
                }
                
                // 查找星级评分，转换为分数
                const starMatch = content.match(/(\d+)星/);
                if (starMatch) {
                  return parseInt(starMatch[1]) * 20; // 5星制转100分制
                }
                
                // 查找任意数字，取合理范围内的
                const numbers = content.match(/\d+/g);
                if (numbers) {
                  for (const num of numbers) {
                    const score = parseInt(num);
                    if (score >= 50 && score <= 100) {
                      return score;
                    }
                  }
                }
                
                // 如果没有找到合适的数字，返回随机值
                return Math.floor(Math.random() * 40) + 60;
              };
              
              const comprehensiveScore = extractScore(getContentByType('综合指数') || getContentByType('今日概述'));
              const loveScore = extractScore(getContentByType('爱情指数'));
              const workScore = extractScore(getContentByType('工作指数') || getContentByType('事业指数'));
              const moneyScore = extractScore(getContentByType('财运指数'));
              const healthScore = extractScore(getContentByType('健康指数'));
              
              constellationData = {
                sign: inputSign, // 返回原始输入的英文名称
                date: today,
                overall_fortune: getContentByType('今日概述') || getContentByType('综合'),
                love_fortune: getContentByType('爱情指数'),
                career_fortune: getContentByType('工作指数') || getContentByType('事业指数'),
                wealth_fortune: getContentByType('财运指数'),
                health_fortune: getContentByType('健康指数'),
                lucky_number: parseInt(getContentByType('幸运数字')) || Math.floor(Math.random() * 100) + 1,
                lucky_color: getContentByType('幸运颜色') || '蓝色',
                // 幸运信息结构
                lucky_info: {
                  color: getContentByType('幸运颜色') || '蓝色',
                  number: getContentByType('幸运数字') || String(Math.floor(Math.random() * 100) + 1),
                  noble_sign: getContentByType('贵人星座') || ''
                },
                // 运势指数
                indices: {
                  comprehensive: comprehensiveScore,
                  love: loveScore,
                  work: workScore,
                  money: moneyScore,
                  health: healthScore
                },
                // 兼容字段
                comprehensive: comprehensiveScore,
                love: loveScore,
                work: workScore,
                money: moneyScore,
                health: healthScore
              };
              console.log('成功解析天行星座API数据:', constellationData);
            }
          }
        } catch (error) {
          console.error('天行数据API调用失败:', error);
        }
      }
      
      // 如果没有配置API key或API调用失败，返回错误
      if (!constellationData) {
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