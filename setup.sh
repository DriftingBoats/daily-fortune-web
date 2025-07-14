#!/bin/bash

echo "正在设置 TypeScript 后端环境..."
echo

echo "1. 安装 Node.js 依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误: npm install 失败"
    exit 1
fi

echo
echo "2. 编译 TypeScript 代码..."
npm run build
if [ $? -ne 0 ]; then
    echo "错误: TypeScript 编译失败"
    exit 1
fi

echo
echo "3. 检查类型..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "警告: 类型检查发现问题，但不影响运行"
fi

echo
echo "✅ 设置完成！"
echo
echo "现在你可以:"
echo "  - 使用 'npx wrangler pages dev .' 启动本地开发服务器"
echo "  - 部署到 Cloudflare Pages"
echo "  - 部署到 Vercel"
echo