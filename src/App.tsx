import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { store } from "./store";
import MainLayout from "./layouts/MainLayout";
import React from "react";

// 懒加载页面组件
const Sleep = React.lazy(() => import("./pages/Sleep"));
const Analysis = React.lazy(() => import("./pages/Analysis"));
const History = React.lazy(() => import("./pages/History"));
const Login = React.lazy(() => import("./pages/Login"));
const Error = React.lazy(() => import("./pages/Error"));
const Profile = React.lazy(() => import("./pages/Profile"));

// 路由守卫组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = localStorage.getItem("userInfo") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {/* 根路径重定向到sleep */}
            <Route index element={<Navigate to="/sleep" replace />} />
            <Route path="sleep" element={<Sleep />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* 错误页面路由 */}
          <Route path="*" element={<Error />} />
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
