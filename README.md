# BCG 信号采集与处理系统

## 项目简介

本项目是一个基于 React 的 BCG（心冲击图）信号采集与处理系统的前端部分，主要用于健康监测、疾病预警和运动康复等场景。系统提供了数据可视化、历史记录查询、数据分析等功能。

## 主要功能

- 睡眠数据监测与分析
- 数据可视化展示
- 历史数据查询与导出
- 数据分析与健康评估
- 系统配置管理

## 技术栈

- 前端框架：React
- 编程语言：TypeScript
- 路由管理：React Router
- 状态管理：Redux Toolkit
- UI 组件库：Ant Design
- 数据可视化：ECharts
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

- Node.js >= 14.0.0
- npm >= 6.0.0

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
2. 查看睡眠数据
3. 分析历史数据
4. 导出分析报告
5. 管理系统设置

## 注意事项

- 确保 API 服务器地址配置正确
- 建议使用 Chrome 浏览器以获得最佳体验
- 定期备份重要数据

## 贡献指南

1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT License
