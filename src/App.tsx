import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";
import zhCN from "antd/locale/zh_CN";
import { store } from "./store";
import MainLayout from "./layouts/MainLayout";
import type { RootState } from "./store";
import React from "react";

// 懒加载页面组件
const Sleep = React.lazy(() => import("./pages/Sleep"));
const Analysis = React.lazy(() => import("./pages/Analysis"));
const History = React.lazy(() => import("./pages/History"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Monitor = React.lazy(() => import("./pages/Monitor"));

const App: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.config.theme);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* 根路径重定向到sleep */}
            <Route index element={<Navigate to="/sleep" replace />} />
            <Route path="sleep" element={<Sleep />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="history" element={<History />} />
            <Route path="monitor" element={<Monitor />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

// 包装App组件with Redux Provider
const WrappedApp: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default WrappedApp;
