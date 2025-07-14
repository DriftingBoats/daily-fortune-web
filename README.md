# 每日运势 - 老黄历查询应用

一个简洁美观的每日运势查询应用，提供传统老黄历信息，包括宜忌、农历日期、节日等信息。

## ✨ 功能特点

- 📅 **老黄历查询** - 获取详细的农历信息和宜忌事项
- 🎨 **现代化界面** - 响应式设计，支持移动端
- 🚀 **快速部署** - 支持 Cloudflare Pages 和 Vercel 一键部署
- 📡 **RESTful API** - 提供完整的 API 接口
- 💾 **智能缓存** - 减少 API 调用，提升响应速度
- 🔄 **自动降级** - API 失败时提供备用内容

## 🖥️ 在线演示

访问部署后的应用即可查看每日运势信息。

## 📋 API 接口

### 获取完整老黄历信息
```
GET /api/fortune?format=structured
```

### 获取今日老黄历
```
GET /api/fortune/today
```

### 获取简化信息
```
GET /api/fortune/simple
```

### 获取API信息
```
GET /api/info
```

## 🚀 快速部署

### Cloudflare Pages 部署

1. Fork 或下载此项目到你的 GitHub 仓库
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 点击「创建项目」→「连接到 Git」
4. 选择你的仓库
5. 配置构建设置：
   - **框架预设**: `None`
   - **构建命令**: `pip install -r requirements.txt`
   - **构建输出目录**: `/`
   - **根目录**: `/`
6. 在环境变量中添加（可选）：
   - `TIANAPI_KEY`: 天行数据API密钥
7. 点击「保存并部署」

### Vercel 部署

1. Fork 或下载此项目到你的 GitHub 仓库
2. 登录 [Vercel](https://vercel.com/)
3. 点击「New Project」
4. 选择你的仓库
5. 配置项目：
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
6. 在环境变量中添加（可选）：
   - `TIANAPI_KEY`: 天行数据API密钥
7. 点击「Deploy」

### 本地运行

1. 克隆项目：
```bash
git clone <your-repo-url>
cd fortune-app
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置环境变量（可选）：
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 API 密钥
```

4. 运行应用：
```bash
python app.py
```

5. 访问 `http://localhost:5000`

## ⚙️ 配置说明

### 环境变量

- `TIANAPI_KEY` (可选): 天行数据API密钥，用于获取真实的老黄历数据
- `PORT` (可选): 应用端口，默认为5000

### API密钥申请

如需获取真实的老黄历数据，请到 [天行数据](https://www.tianapi.com/) 申请免费API密钥。

不配置API密钥时，应用会使用幽默的备用内容。

## 📁 项目结构

```
fortune-app/
├── app.py              # 主应用文件
├── templates/
│   └── index.html      # 前端页面模板
├── requirements.txt    # Python依赖
├── .env.example       # 环境变量示例
├── README.md          # 项目说明
└── vercel.json        # Vercel配置文件
```

## 🎨 界面预览

- 现代化渐变背景
- 卡片式布局展示运势信息
- 响应式设计，适配各种设备
- 优雅的加载和错误状态

## 📱 移动端支持

应用采用响应式设计，完美适配手机、平板等移动设备。

## 🔧 技术栈

- **后端**: Python Flask
- **前端**: HTML5 + CSS3 + JavaScript
- **API**: 天行数据老黄历API
- **部署**: Cloudflare Pages / Vercel

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题或建议，请通过 GitHub Issues 联系。