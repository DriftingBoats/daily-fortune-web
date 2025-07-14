# 每日运势 - 老黄历查询应用

一个简洁美观的每日运势查询应用，提供传统老黄历信息，包括宜忌、农历日期、节日等信息。

## ✨ 功能特点

- 📅 **老黄历查询** - 获取详细的农历信息和宜忌事项
- ⭐ **星座运势** - 提供12星座的每日运势查询
- 🎨 **现代化界面** - 响应式设计，支持移动端
- 🚀 **快速部署** - 支持 Cloudflare Pages 和 Vercel 一键部署
- 📡 **RESTful API** - 提供完整的 API 接口
- 💾 **智能缓存** - 减少 API 调用，提升响应速度
- 🔄 **自动降级** - API 失败时提供备用内容
- 🛠️ **TypeScript 后端** - 原生支持 Cloudflare Pages，性能更优

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

### 获取星座运势
```
GET /api/constellation?sign=白羊座
```

### 获取API信息
```
GET /api/info
```

## 🔧 问题解决

### Cloudflare Pages 部署错误修复

如果你之前遇到 "网络错误，请稍后重试 错误详情: Unexpected token '<'" 的问题，这是因为 Cloudflare Pages 不支持 Python Flask 后端。

**解决方案**: 本项目现已升级为 TypeScript 后端，使用 Cloudflare Pages Functions，完美解决部署问题：

- ✅ 原生支持 Cloudflare Pages
- ✅ 无需 Python 环境
- ✅ 更快的冷启动时间
- ✅ 更好的性能表现
- ✅ 完整的 CORS 支持

## 🚀 快速部署

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DriftingBoats/daily-fortune-web)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DriftingBoats/daily-fortune-web)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/python?referralCode=alphasec)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/DriftingBoats/daily-fortune-web)

### 手动部署

#### Cloudflare Pages 部署

1. Fork 或下载此项目到你的 GitHub 仓库
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 点击「创建项目」→「连接到 Git」
4. 选择你的仓库
5. 配置构建设置：
   - **框架预设**: `None`
   - **构建命令**: `npm install && npm run build`
   - **构建输出目录**: `/`
   - **根目录**: `/`
6. 在环境变量中添加（可选）：
   - `TIANAPI_KEY`: 天行数据API密钥
7. 点击「保存并部署」

**注意**: Cloudflare Pages 现在使用 TypeScript Functions，无需 Python 环境，解决了之前的部署问题。

#### Vercel 部署

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
npm install
```

3. 构建 TypeScript：
```bash
npm run build
```

4. 配置环境变量（可选）：
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 API 密钥
```

5. 使用 Wrangler 本地开发：
```bash
npx wrangler pages dev .
```

6. 访问 `http://localhost:8788`

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
├── functions/
│   └── api/
│       ├── fortune.ts      # 老黄历API (TypeScript)
│       ├── constellation.ts # 星座运势API (TypeScript)
│       └── index.ts        # API入口文件
├── index.html          # 前端页面
├── package.json        # Node.js依赖
├── tsconfig.json       # TypeScript配置
├── wrangler.toml       # Cloudflare配置
├── .env.example       # 环境变量示例
├── API_SETUP.md       # API配置说明
├── MIGRATION.md       # 迁移指南
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

- **后端**: TypeScript (Cloudflare Pages Functions)
- **前端**: HTML5 + CSS3 + JavaScript  
- **API**: 天行数据老黄历API
- **部署**: Cloudflare Pages / Vercel
- **开发工具**: Wrangler CLI, npm

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题或建议，请通过 GitHub Issues 联系。