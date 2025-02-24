import {
  Route,
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { store } from "./store";
import MainLayout from "./layouts/MainLayout";
import React, { Suspense } from "react";
import { Spin } from "antd";

// 懒加载页面组件
const Sleep = React.lazy(() => import("./pages/Sleep"));
const Analysis = React.lazy(() => import("./pages/Analysis"));
const History = React.lazy(() => import("./pages/History"));
const Login = React.lazy(() => import("./pages/Login"));
const Error = React.lazy(() => import("./pages/Error"));
const Profile = React.lazy(() => import("./pages/Profile"));

// 加载中组件
const LoadingComponent: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spin size="large" />
  </div>
);

// 路由守卫组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = localStorage.getItem("userInfo") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// 创建路由配置
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/login"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <Login />
          </Suspense>
        }
      />
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
        <Route
          path="sleep"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <Sleep />
            </Suspense>
          }
        />
        <Route
          path="analysis"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <Analysis />
            </Suspense>
          }
        />
        <Route
          path="history"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <History />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <Profile />
            </Suspense>
          }
        />
      </Route>
      {/* 错误页面路由 */}
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingComponent />}>
            <Error />
          </Suspense>
        }
      />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
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
