// 星座中英文映射
export const CONSTELLATION_MAP: Record<string, string> = {
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

// 英文到中文映射
export const ENGLISH_TO_CHINESE_MAP: Record<string, string> = {
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

// 星座日期范围
export const CONSTELLATION_DATES: Record<string, string> = {
  'aries': '3.21-4.19',
  'taurus': '4.20-5.20',
  'gemini': '5.21-6.21',
  'cancer': '6.22-7.22',
  'leo': '7.23-8.22',
  'virgo': '8.23-9.22',
  'libra': '9.23-10.23',
  'scorpio': '10.24-11.22',
  'sagittarius': '11.23-12.21',
  'capricorn': '12.22-1.19',
  'aquarius': '1.20-2.18',
  'pisces': '2.19-3.20'
};

// 天行数据 API 基础 URL
export const TIANAPI_BASE_URL = 'https://apis.tianapi.com';
