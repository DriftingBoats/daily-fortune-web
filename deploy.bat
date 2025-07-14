@echo off
chcp 65001 >nul
echo 🚀 开始部署每日运势应用...

:: 检查Python环境
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 未安装，请先安装Python
    pause
    exit /b 1
)

:: 安装依赖
echo 📦 安装Python依赖...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

:: 检查环境变量文件
if not exist ".env" (
    echo ⚙️ 创建环境变量文件...
    copy .env.example .env >nul
    echo 📝 请编辑 .env 文件，添加你的API密钥（可选）
)

:: 启动应用
echo 🎉 启动应用...
echo 📱 访问地址: http://localhost:5000
echo 🛑 按 Ctrl+C 停止服务
echo.
python app.py
pause