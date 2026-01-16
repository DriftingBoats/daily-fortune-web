import type { FortuneData, ApiResponse } from './types';
import { TIANAPI_BASE_URL } from './constants';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// 调用天行数据 API 获取老黄历
export async function fetchFortune(apiKey: string): Promise<ApiResponse<FortuneData>> {
  const today = getToday();
  
  if (!apiKey) {
    return {
      success: false,
      error: '未配置 API 密钥'
    };
  }

  try {
    const apiUrl = `${TIANAPI_BASE_URL}/lunar/index?key=${apiKey}&date=${today}`;
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API 请求失败: ${response.status}`
      };
    }

    const data = await response.json() as {
      code: number;
      msg?: string;
      result?: Record<string, string>;
    };

    if (data.code !== 200 || !data.result) {
      return {
        success: false,
        error: data.msg || 'API 返回数据异常'
      };
    }

    const result = data.result;
    const lunarFormatted = result.lubarmonth && result.lunarday
      ? `${result.lubarmonth}${result.lunarday}`
      : (result.lunardate || '农历信息获取中...');

    const fortuneData: FortuneData = {
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
        jieqi: result.jieqi || ''
      },
      fortune_info: {
        fitness: result.fitness || '',
        taboo: result.taboo || '',
        shenwei: result.shenwei || '',
        taishen: result.taishen || '',
        chongsha: result.chongsha || ''
      }
    };

    return {
      success: true,
      data: fortuneData
    };
  } catch (error) {
    return {
      success: false,
      error: `请求异常: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
