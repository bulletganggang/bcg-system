# BCG 信号采集与处理系统

## 项目简介

本项目是一个基于 React 的 BCG（心冲击图）信号处理系统的前端部分，专注于历史数据分析和健康状况评估。系统提供了数据可视化、历史记录查询、数据分析和健康建议等功能，帮助用户了解和改善自己的睡眠质量。

## 主要功能

### 数据分析

- 睡眠质量评分分析
- 睡眠阶段分布分析
- 睡眠时间规律分析
- 异常数据识别与提醒
- 健康建议生成

### 历史记录

- 历史数据查询与展示
- 数据分页与筛选
- 详细记录查看
- 异常记录标记

### 数据可视化

- 睡眠质量趋势图
- 睡眠阶段分布图
- 作息规律分析图
- 多维度数据对比

### 个人中心

- 用户信息管理
- 系统设置
- 数据导出
- 主题设置

## 技术栈

- 前端框架：React 18
- 编程语言：TypeScript 5
- 路由管理：React Router v7
- 状态管理：Redux Toolkit
- UI 组件库：Ant Design 5
- 数据可视化：ECharts 5
- 网络请求：Axios
- 样式处理：SCSS Modules

## 项目结构

```
src/
  ├── assets/        # 静态资源
  ├── components/    # 公共组件
  ├── hooks/         # 自定义Hooks
  ├── layouts/       # 布局组件
  ├── pages/         # 页面组件
  ├── store/         # Redux状态管理
  ├── styles/        # 全局样式
  ├── types/         # TypeScript类型定义
  ├── utils/         # 工具函数
  ├── App.tsx        # 应用入口
  └── main.tsx       # 主入口文件
```

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

1. 登录系统
2. 查看历史数据
3. 分析睡眠质量
4. 查看健康建议
5. 管理个人信息

## 注意事项

- 确保 API 服务器地址配置正确
- 建议使用 Chrome 最新版本以获得最佳体验
- 定期导出重要数据
- 注意数据隐私保护

## 贡献指南

1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT License
