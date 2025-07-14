#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
每日运势 Web 应用
提供老黄历、运势查询等功能
"""

import os
import json
import random
import time
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv
import requests
import pytz
import logging

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder='.')

# 配置Flask应用，避免斜杠重定向问题
app.url_map.strict_slashes = False

class FortuneBot:
    def __init__(self):
        self.tianapi_key = os.getenv('TIANAPI_KEY')
        
        # 重试配置
        self.max_retries = 3
        self.retry_delay = 1  # 秒
        
        # 缓存配置
        self.cache = {}
        self.cache_duration = {
            'fortune': timedelta(hours=12)  # 老黄历缓存12小时
        }
        
        if not self.tianapi_key:
            logger.warning("TIANAPI_KEY 未配置，将使用固定文案")
    
    def _is_cache_valid(self, cache_key):
        """检查缓存是否有效"""
        if cache_key not in self.cache:
            return False
        
        cache_data = self.cache[cache_key]
        cache_time = cache_data.get('timestamp')
        cache_type = cache_data.get('type')
        
        if not cache_time or cache_type not in self.cache_duration:
            return False
        
        return datetime.now() - cache_time < self.cache_duration[cache_type]
    
    def _set_cache(self, cache_key, data, cache_type):
        """设置缓存"""
        self.cache[cache_key] = {
            'data': data,
            'timestamp': datetime.now(),
            'type': cache_type
        }
    
    def _get_cache(self, cache_key):
        """获取缓存数据"""
        if self._is_cache_valid(cache_key):
            return self.cache[cache_key]['data']
        return None
    
    def _retry_request(self, func, *args, **kwargs):
        """带重试机制的请求方法"""
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                return func(*args, **kwargs)
            except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    logger.warning(f"请求失败，第{attempt + 1}次重试: {e}")
                    time.sleep(self.retry_delay * (attempt + 1))  # 指数退避
                else:
                    logger.error(f"请求失败，已达到最大重试次数: {e}")
            except Exception as e:
                # 对于非网络错误，不进行重试
                logger.error(f"请求出现非网络错误: {e}")
                raise e
        
        # 如果所有重试都失败，抛出最后一个异常
        if last_exception:
            raise last_exception
    
    def get_today_fortune_structured(self):
        """获取今日运势（老黄历）结构化数据"""
        today = datetime.now().strftime('%Y-%m-%d')
        cache_key = f"fortune_structured_{today}"
        
        # 检查缓存
        cached_fortune = self._get_cache(cache_key)
        if cached_fortune:
            logger.info("使用缓存的结构化运势数据")
            return cached_fortune
        
        try:
            # 天行数据老黄历API
            api_url = "https://apis.tianapi.com/lunar/index"
            
            # 必须有API密钥才能调用
            if not self.tianapi_key:
                logger.warning("TIANAPI_KEY未配置，使用备用运势")
                fallback_data = self._get_fallback_fortune_structured()
                self._set_cache(cache_key, fallback_data, 'fortune')
                return fallback_data
            
            def make_request():
                response = requests.get(
                    api_url,
                    params={'key': self.tianapi_key, 'date': today},
                    timeout=10
                )
                response.raise_for_status()
                return response
            
            response = self._retry_request(make_request)
            data = response.json()
            
            if data.get('code') == 200 and 'result' in data:
                result = data['result']
                
                # 构建结构化数据
                structured_data = {
                    'date_info': {
                        'gregorian_date': today,
                        'lunar_date': result.get('lunar_date', ''),
                        'lunar_day': result.get('lunar_day', ''),
                        'lunar_formatted': result.get('lunar_date_cn', ''),
                        'lunar_month_name': result.get('lunar_month_cn', ''),
                        'year_ganzhi': result.get('year_ganzhi', ''),
                        'month_ganzhi': result.get('month_ganzhi', ''),
                        'day_ganzhi': result.get('day_ganzhi', ''),
                        'zodiac': result.get('zodiac', '')
                    },
                    'fortune_info': {
                        'fitness': result.get('fitness', ''),
                        'taboo': result.get('taboo', ''),
                        'shenwei': result.get('shenwei', ''),
                        'taishen': result.get('taishen', ''),
                        'chongsha': result.get('chongsha', ''),
                        'suisha': result.get('suisha', ''),
                        'wuxing': result.get('wuxing', ''),
                        'pengzu': result.get('pengzu', ''),
                        'jianshen': result.get('jianshen', ''),
                        'tiangandizhiwuxing': result.get('tiangandizhiwuxing', '')
                    },
                    'wuxing_info': {
                        'wuxing': result.get('wuxing', ''),
                        'nayin': result.get('nayin', ''),
                        'tiangandizhiwuxing': result.get('tiangandizhiwuxing', '')
                    },
                    'festival_info': {
                        'festival': result.get('festival', ''),
                        'holiday': result.get('holiday', '')
                    }
                }
                
                # 缓存数据
                self._set_cache(cache_key, structured_data, 'fortune')
                logger.info("获取结构化运势数据成功")
                return structured_data
            else:
                logger.warning(f"API返回错误: {data.get('msg', '未知错误')}")
                fallback_data = self._get_fallback_fortune_structured()
                self._set_cache(cache_key, fallback_data, 'fortune')
                return fallback_data
                
        except Exception as e:
            logger.error(f"获取结构化运势失败: {e}")
            fallback_data = self._get_fallback_fortune_structured()
            self._set_cache(cache_key, fallback_data, 'fortune')
            return fallback_data
    
    def _get_fallback_fortune_structured(self):
        """获取备用结构化运势信息"""
        today = datetime.now().strftime('%Y-%m-%d')
        
        # 丰富的宜忌选项
        fitness_options = [
            '祈福、出行、会友', '学习、读书、思考', '整理、清洁、收纳',
            '运动、健身、散步', '烹饪、品茶、休息', '创作、写作、绘画',
            '沟通、交流、分享', '规划、总结、反思', '购物、理财、投资',
            '娱乐、游戏、放松', '种植、园艺、养护', '修缮、维护、保养'
        ]
        
        taboo_options = [
            '争吵、冲突、抱怨', '熬夜、过劳、透支', '冲动、急躁、鲁莽',
            '浪费、挥霍、奢侈', '拖延、懒散、消极', '八卦、传谣、议论',
            '贪心、嫉妒、比较', '焦虑、担忧、恐惧', '固执、偏见、排斥',
            '暴饮、暴食、贪杯', '孤立、封闭、逃避', '批评、指责、埋怨'
        ]
        
        # 生肖和五行信息
        zodiac_animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
        wuxing_elements = ['金', '木', '水', '火', '土']
        
        # 根据日期生成相对固定的随机数
        import hashlib
        date_hash = int(hashlib.md5(today.encode()).hexdigest()[:8], 16)
        random.seed(date_hash)
        
        fallback_data = {
            'date_info': {
                'gregorian_date': today,
                'lunar_date': f'农历{random.randint(1, 12)}月{random.randint(1, 30)}日',
                'lunar_day': f'{random.randint(1, 30)}',
                'lunar_formatted': f'农历{random.randint(1, 12)}月{random.randint(1, 30)}日',
                'lunar_month_name': f'{random.randint(1, 12)}月',
                'year_ganzhi': '癸卯年',
                'month_ganzhi': f'{random.choice(["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"])}{random.choice(["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"])}月',
                'day_ganzhi': f'{random.choice(["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"])}{random.choice(["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"])}日',
                'zodiac': random.choice(zodiac_animals)
            },
            'fortune_info': {
                'fitness': random.choice(fitness_options),
                'taboo': random.choice(taboo_options),
                'shenwei': f'{random.choice(["东", "南", "西", "北", "东南", "西南", "东北", "西北"])}方',
                'taishen': f'{random.choice(["厨灶", "仓库", "房床", "门户", "厕所"])}',
                'chongsha': f'冲{random.choice(zodiac_animals)}({random.choice(["东", "南", "西", "北"])})',
                'suisha': f'{random.choice(["东", "南", "西", "北"])}方',
                'wuxing': random.choice(wuxing_elements),
                'pengzu': f'彭祖百忌：{random.choice(["甲不开仓", "乙不栽植", "丙不修灶", "丁不剃头", "戊不受田"])}',
                'jianshen': f'{random.choice(["建", "除", "满", "平", "定", "执", "破", "危", "成", "收", "开", "闭"])}日',
                'tiangandizhiwuxing': f'{random.choice(wuxing_elements)}'
            },
            'wuxing_info': {
                'wuxing': random.choice(wuxing_elements),
                'nayin': f'{random.choice(["海中金", "炉中火", "大林木", "路旁土", "剑锋金", "山头火", "涧下水", "城头土", "白蜡金", "杨柳木"])}',
                'tiangandizhiwuxing': f'{random.choice(wuxing_elements)}'
            },
            'festival_info': {
                'festival': random.choice(['', '春分', '清明', '立夏', '端午', '夏至', '立秋', '中秋', '寒露', '立冬', '冬至', '腊八']) if random.random() < 0.3 else '',
                'holiday': ''
            }
        }
        
        # 重置随机种子
        random.seed()
        return fallback_data
    
    def get_today_fortune(self):
        """获取今日运势（老黄历）带缓存"""
        today = datetime.now().strftime('%Y-%m-%d')
        cache_key = f"fortune_{today}"
        
        # 检查缓存
        cached_fortune = self._get_cache(cache_key)
        if cached_fortune:
            logger.info("使用缓存的运势数据")
            return cached_fortune
        
        try:
            # 获取结构化数据
            structured_data = self.get_today_fortune_structured()
            
            # 格式化为文本
            date_info = structured_data.get('date_info', {})
            fortune_info = structured_data.get('fortune_info', {})
            
            lunar_date = date_info.get('lunar_formatted', '农历信息获取中...')
            fitness = fortune_info.get('fitness', '摸鱼')
            taboo = fortune_info.get('taboo', '加班')
            
            fortune_text = f"📅 {lunar_date}\n✅ 宜：{fitness}\n❌ 忌：{taboo}"
            
            # 缓存数据
            self._set_cache(cache_key, fortune_text, 'fortune')
            return fortune_text
                
        except Exception as e:
            logger.error(f"获取运势失败: {e}")
            fallback_fortune = self._get_fallback_fortune()
            self._set_cache(cache_key, fallback_fortune, 'fortune')
            return fallback_fortune
    
    def _get_fallback_fortune(self):
        """获取备用运势信息"""
        fallback_fortunes = [
            "📅 农历信息获取中...\n✅ 宜：摸鱼、划水、发呆\n❌ 忌：加班、开会、写报告",
            "📅 今日黄历\n✅ 宜：午休、喝茶、聊天\n❌ 忌：认真工作、主动汇报",
            "📅 老黄历提醒\n✅ 宜：保持低调、适度摸鱼\n❌ 忌：表现积极、承担责任",
            "📅 运势播报\n✅ 宜：网上冲浪、刷手机\n❌ 忌：提升自己、努力奋斗",
            "📅 今日宜忌\n✅ 宜：装忙、假装思考\n❌ 忌：真的很忙、真的在想"
        ]
        return random.choice(fallback_fortunes)

# 创建机器人实例
bot = FortuneBot()

# 路由定义
@app.route('/')
def index():
    """首页"""
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"渲染首页模板失败: {e}")
        return f"<h1>模板渲染错误</h1><p>错误详情: {str(e)}</p>", 500

@app.route('/test')
def test():
    """测试路由"""
    return "<h1>Flask应用正常运行</h1><p>这是一个测试页面</p>"

@app.route('/api/fortune', methods=['GET'])
def get_fortune():
    """获取老黄历信息"""
    try:
        # 获取查询参数
        format_type = request.args.get('format', 'structured')  # structured 或 text
        
        if format_type == 'structured':
            fortune_data = bot.get_today_fortune_structured()
            return jsonify({
                'success': True,
                'data': fortune_data,
                'format': 'structured'
            })
        else:
            fortune_text = bot.get_today_fortune()
            return jsonify({
                'success': True,
                'data': {
                    'fortune_text': fortune_text
                },
                'format': 'text'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'获取老黄历失败: {str(e)}'
        }), 500

@app.route('/api/fortune/today', methods=['GET'])
def get_today_fortune():
    """获取今日老黄历"""
    try:
        fortune_data = bot.get_today_fortune_structured()
        return jsonify({
            'success': True,
            'data': fortune_data,
            'date': datetime.now().strftime('%Y-%m-%d')
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'获取今日老黄历失败: {str(e)}'
        }), 500

@app.route('/api/fortune/simple', methods=['GET'])
def get_simple_fortune():
    """获取简化的老黄历信息（仅宜忌）"""
    try:
        fortune_data = bot.get_today_fortune_structured()
        
        # 提取简化信息
        simple_info = {
            'lunar_date': fortune_data.get('date_info', {}).get('lunar_formatted', ''),
            'fitness': fortune_data.get('fortune_info', {}).get('fitness', ''),
            'taboo': fortune_data.get('fortune_info', {}).get('taboo', ''),
            'festival': fortune_data.get('festival_info', {}).get('festival', '')
        }
        
        return jsonify({
            'success': True,
            'data': simple_info,
            'date': datetime.now().strftime('%Y-%m-%d')
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'获取简化老黄历失败: {str(e)}'
        }), 500

@app.route('/api/constellation', methods=['GET'])
def get_constellation():
    """获取星座运势"""
    try:
        sign = request.args.get('sign')
        if not sign:
            return jsonify({
                'success': False,
                'error': '请提供星座参数'
            }), 400
        
        # 简单的星座运势数据
        constellation_data = {
            'sign': sign,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'overall': '今日运势不错，适合积极行动',
            'love': '感情运势平稳，单身者有机会遇到心仪对象',
            'career': '工作运势良好，适合推进重要项目',
            'wealth': '财运一般，建议理性消费',
            'health': '身体状况良好，注意适当休息',
            'lucky_number': random.randint(1, 100),
            'lucky_color': random.choice(['红色', '蓝色', '绿色', '黄色', '紫色'])
        }
        
        return jsonify({
            'success': True,
            'data': constellation_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'获取星座运势失败: {str(e)}'
        }), 500

@app.route('/api/info', methods=['GET'])
def get_api_info():
    """获取API信息"""
    api_info = {
        'name': '每日运势 API',
        'version': '1.0.0',
        'description': '提供老黄历、运势查询等功能',
        'endpoints': {
            '/': '首页',
            '/api/fortune': '获取老黄历信息',
            '/api/fortune/today': '获取今日老黄历',
            '/api/fortune/simple': '获取简化老黄历信息',
            '/api/constellation': '获取星座运势',
            '/api/info': '获取API信息'
        }
    }
    return jsonify(api_info)

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 5000))
        print(f'Starting Flask app on port {port}...')
        app.run(host='127.0.0.1', port=port, debug=True)
    except Exception as e:
        print(f'Failed to start Flask app: {e}')
        import traceback
        traceback.print_exc()