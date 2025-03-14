# BCG 信号采集与处理系统

## 项目简介

本项目是一个基于 React 的 BCG（心冲击图）信号处理系统的前端部分，专注于睡眠数据分析和健康状况评估。系统提供了数据可视化、历史记录查询、数据分析、健康建议和预警管理等功能，帮助用户了解和改善自己的睡眠质量。

## 主要功能

### 睡眠数据分析

- 睡眠质量评分分析
- 睡眠阶段分布分析
- 睡眠时间规律分析
- 体动数据监测与分析
- 呼吸率监测与分析
- 健康建议生成

### 数据对比

- 不同日期睡眠数据对比
- 多维度指标对比分析
- 睡眠质量变化趋势分析
- 体动数据对比分析

### 预警管理

- 自定义预警规则设置
- 多种预警指标支持（睡眠质量、呼吸率、睡眠阶段、体动数据等）
- 预警记录管理与处理
- 快速添加常用预警规则

### 个人中心

- 用户信息管理
- 设备绑定与管理
- 账户安全设置

## 技术栈

- 前端框架：React 18
- 编程语言：TypeScript 5
- 路由管理：React Router v7
- 状态管理：Redux Toolkit
- UI 组件库：Ant Design 5
- 数据可视化：ECharts 5
- 网络请求：Axios
- 样式处理：SCSS Modules
- 构建工具：Vite

## 项目结构

```
src/
  ├── api/            # API 接口封装
  ├── assets/         # 静态资源
  ├── components/     # 公共组件
  ├── configs/        # 配置文件
  │   └── charts/     # 图表配置
  │       ├── analysis/   # 分析页面图表
  │       ├── comparison/ # 对比页面图表
  │       └── sleep/      # 睡眠页面图表
  ├── constants/      # 常量定义
  │   └── alert/      # 预警相关常量
  ├── layouts/        # 布局组件
  ├── pages/          # 页面组件
  │   ├── AlertSettings/  # 预警设置页面
  │   ├── Analysis/       # 数据分析页面
  │   ├── Comparison/     # 数据对比页面
  │   ├── Error/          # 错误页面
  │   ├── Login/          # 登录页面
  │   ├── Profile/        # 个人中心页面
  │   └── Sleep/          # 睡眠数据页面
  ├── store/          # Redux状态管理
  │   └── slices/     # Redux切片
  ├── styles/         # 全局样式
  ├── types/          # TypeScript类型定义
  ├── utils/          # 工具函数
  ├── App.tsx         # 应用入口
  └── main.tsx        # 主入口文件
```

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

存在对等依赖冲突，请使用 --legacy-peer-deps

```bash
npm install --legacy-peer-deps
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 预览构建结果

```bash
npm run preview
```

## 功能使用流程

1. 登录系统

   - 使用手机号和验证码登录

2. 设备管理

   - 在个人中心绑定设备
   - 选择当前使用的设备

3. 查看睡眠数据

   - 选择日期查看详细睡眠数据
   - 查看睡眠质量、睡眠阶段、呼吸率和体动数据

4. 数据分析

   - 查看周/月度睡眠数据统计
   - 分析睡眠规律和趋势

5. 数据对比

   - 选择两个日期进行睡眠数据对比
   - 查看各项指标的差异和变化

6. 预警管理

   - 设置自定义预警规则
   - 查看和处理预警记录

7. 数据导出
   - 导出睡眠报告为 PDF
   - 导出数据为 Excel

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
