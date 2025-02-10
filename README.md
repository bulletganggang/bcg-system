# BCG 信号采集与处理系统

## 项目简介

本项目是一个基于 Web 的 BCG（心冲击图）信号采集与处理系统的前端实现。系统主要用于健康监测、疾病预警和运动康复等场景，通过实时数据采集、可视化展示和智能分析，为用户提供直观的健康状态监测。

## 主要功能

- 实时数据采集与显示
  - WebSocket 实时数据传输
  - 动态波形图显示
  - 多种图表类型支持（折线图、波形图、柱状图等）

- 数据分析与处理
  - 信号特征提取
  - 健康状态评估
  - 异常检测与预警

- 交互功能
  - 数据缩放与平移
  - 波形标注
  - 历史数据回放
  - 数据对比分析

- 系统管理
  - 用户管理
  - 数据管理
  - 系统配置

## 技术栈

- 前端框架：React 19
- 开发语言：TypeScript
- 状态管理：Redux Toolkit
- 路由管理：React Router v7
- UI 组件库：Ant Design
- 数据可视化：ECharts
- 样式处理：Sass
- 网络请求：Axios
- 实时通信：WebSocket
- 构建工具：Vite

## 项目结构

```
src/
├── api/                # API接口
├── assets/            # 静态资源
├── components/        # 公共组件
├── hooks/             # 自定义hooks
├── layouts/           # 布局组件
├── pages/            # 页面组件
├── store/            # Redux状态管理
├── styles/           # 样式文件
├── types/            # TypeScript类型定义
└── utils/            # 工具函数
```

## 开发环境配置

1. Node.js 版本要求：>= 18.0.0
2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 构建生产版本：

```bash
npm run build
```

## 开发规范

- 使用 TypeScript 进行开发，确保类型安全
- 遵循 React 函数式组件编写规范
- 使用 ESLint 进行代码规范检查
- 遵循组件化和模块化开发原则
- 保持代码简洁，遵循 DRY 原则

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 注意事项

- 确保 WebSocket 服务器地址配置正确
- 注意处理大量实时数据的性能优化
- 关注数据可视化组件的性能表现
- 做好错误处理和异常提示
