# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 初始化设置（安装依赖 + Prisma 生成 + 数据库迁移）
npm run setup

# 开发模式
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 运行测试（单元测试）
npm run test

# 运行单个测试文件
npx vitest run src/components/chat/__tests__/MessageList.test.tsx

# 运行 E2E 测试（需先安装: npm install -D @playwright/test && npx playwright install）
npm run test:e2e

# 运行 E2E 测试（UI 模式）
npm run test:e2e:ui

# 运行 E2E 测试（显示浏览器）
npm run test:e2e:headed

# 调试 E2E 测试
npm run test:e2e:debug

# 重置数据库
npm run db:reset
```

## 架构概览

这是一个 AI 驱动的 React 组件生成器，具有实时预览功能。

### 核心数据流

```
用户消息 → ChatProvider (useChat) → /api/chat → Claude AI → 工具执行
    ↓
虚拟文件系统更新 → FileSystemContext → PreviewFrame (Babel 编译) → 实时预览
    ↓
Prisma 持久化 → SQLite
```

### 关键模块

| 路径 | 职责 |
|------|------|
| `src/app/api/chat/route.ts` | AI 对话 API，处理工具调用和项目保存 |
| `src/lib/contexts/chat-context.tsx` | 聊天状态管理，集成 @ai-sdk/react 的 useChat |
| `src/lib/contexts/file-system-context.tsx` | 虚拟文件系统状态管理 |
| `src/lib/file-system.ts` | VirtualFileSystem 类，内存文件系统实现 |
| `src/lib/tools/` | AI 工具定义（str-replace、file-manager） |
| `src/lib/prompts/generation.tsx` | AI 系统提示词 |
| `src/lib/provider.ts` | 模型提供者（Anthropic/Mock） |
| `src/components/preview/PreviewFrame.tsx` | @babel/standalone JSX 转换 + iframe 沙箱预览 |
| `src/actions/` | Server Actions（用户、项目 CRUD） |

### 数据模型

- **User**: 用户认证信息
- **Project**: 项目数据，包含序列化的消息历史 (`messages`) 和虚拟文件系统 (`data`)

### 认证

JWT (Jose) + HTTP-Only Cookie，7 天有效期。认证逻辑在 `src/lib/auth.ts`。

## 技术栈

- Next.js 15 (App Router + Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Prisma + SQLite
- @ai-sdk/anthropic (Claude)
- Monaco Editor
- Radix UI + shadcn/ui

## 测试

- **单元测试**: Vitest + React Testing Library
- **E2E 测试**: Playwright（测试文件位于 `e2e/` 目录）

## 环境变量

- `ANTHROPIC_API_KEY`: Anthropic API 密钥（可选，无密钥时使用 Mock 模式）
