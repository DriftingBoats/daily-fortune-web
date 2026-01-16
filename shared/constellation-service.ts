import type { ConstellationData, ApiResponse } from './types';
import { TIANAPI_BASE_URL, CONSTELLATION_MAP, ENGLISH_TO_CHINESE_MAP } from './constants';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// 从内容中提取评分
function extractScore(content: string): number {
  if (!content) return Math.floor(Math.random() * 40) + 60;

  // 百分制匹配
  const percentMatch = content.match(/([1-9]\d?)%/);
  if (percentMatch) return parseInt(percentMatch[1]);

  // 分数匹配
  const scoreMatch = content.match(/(\d+)分/);
  if (scoreMatch) return parseInt(scoreMatch[1]);

  // 星级匹配
  const starMatch = content.match(/(\d+)星/);
  if (starMatch) return parseInt(starMatch[1]) * 20;

  // 查找合理范围的数字
  const numbers = content.match(/\d+/g);
  if (numbers) {
    for (const num of numbers) {
      const score = parseInt(num);
      if (score >= 50 && score <= 100) return score;
    }
  }

  return Math.floor(Math.random() * 40) + 60;
}

// 调用天行数据 API 获取星座运势
export async function fetchConstellation(
  apiKey: string,
  sign: string
): Promise<ApiResponse<ConstellationData>> {
  const today = getToday();

  if (!apiKey) {
    return {
      success: false,
      error: '未配置 API 密钥'
    };
  }

  // 转换星座名称
  const chineseSign = ENGLISH_TO_CHINESE_MAP[sign] || sign;
  const englishSign = CONSTELLATION_MAP[chineseSign] || sign;

  try {
    const apiUrl = `${TIANAPI_BASE_URL}/star/index?key=${apiKey}&astro=${englishSign}`;
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
      result?: {
        list?: Array<{ type: string; content: string }>;
      };
    };

    if (data.code !== 200 || !data.result?.list) {
      return {
        success: false,
        error: data.msg || 'API 返回数据异常'
      };
    }

    const list = data.result.list;
    const getContentByType = (type: string): string => {
      const item = list.find((i) => i.type?.includes(type));
      return item?.content || '';
    };

    const comprehensiveScore = extractScore(getContentByType('综合指数') || getContentByType('今日概述'));
    const loveScore = extractScore(getContentByType('爱情指数'));
    const workScore = extractScore(getContentByType('工作指数') || getContentByType('事业指数'));
    const moneyScore = extractScore(getContentByType('财运指数'));
    const healthScore = extractScore(getContentByType('健康指数'));

    const constellationData: ConstellationData = {
      sign: englishSign,
      date: today,
      overall_fortune: getContentByType('今日概述') || getContentByType('综合'),
      love_fortune: getContentByType('爱情指数'),
      career_fortune: getContentByType('工作指数') || getContentByType('事业指数'),
      wealth_fortune: getContentByType('财运指数'),
      health_fortune: getContentByType('健康指数'),
      lucky_number: parseInt(getContentByType('幸运数字')) || Math.floor(Math.random() * 100) + 1,
      lucky_color: getContentByType('幸运颜色') || '蓝色',
      indices: {
        comprehensive: comprehensiveScore,
        love: loveScore,
        work: workScore,
        money: moneyScore,
        health: healthScore
      }
    };

    return {
      success: true,
      data: constellationData
    };
  } catch (error) {
    return {
      success: false,
      error: `请求异常: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
