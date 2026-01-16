// 老黄历数据类型
export interface FortuneData {
  date_info: {
    gregorian_date: string;
    lunar_date: string;
    lunar_formatted: string;
    year_ganzhi: string;
    month_ganzhi: string;
    day_ganzhi: string;
    zodiac: string;
    lunar_festival?: string;
    festival?: string;
    jieqi?: string;
  };
  fortune_info: {
    fitness: string;
    taboo: string;
    shenwei?: string;
    taishen?: string;
    chongsha?: string;
  };
}

// 星座运势数据类型
export interface ConstellationData {
  sign: string;
  date: string;
  overall_fortune: string;
  love_fortune: string;
  career_fortune: string;
  wealth_fortune: string;
  health_fortune: string;
  lucky_number: number;
  lucky_color: string;
  indices: {
    comprehensive: number;
    love: number;
    work: number;
    money: number;
    health: number;
  };
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 一言数据类型
export interface HitokotoData {
  hitokoto: string;
  from?: string;
  from_who?: string;
}
