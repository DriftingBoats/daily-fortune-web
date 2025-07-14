#!/bin/bash

# 每日运势应用部署脚本

echo "🚀 开始部署每日运势应用..."

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装Python3"
    exit 1
fi

# 安装依赖
echo "📦 安装Python依赖..."
pip install -r requirements.txt

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚙️ 创建环境变量文件..."
    cp .env.example .env
    echo "📝 请编辑 .env 文件，添加你的API密钥（可选）"
fi

# 启动应用
echo "🎉 启动应用..."
echo "📱 访问地址: http://localhost:5000"
echo "🛑 按 Ctrl+C 停止服务"
python app.py