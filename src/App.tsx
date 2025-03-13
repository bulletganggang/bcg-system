import {
  Route,
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { store, persistor } from "./store";
import MainLayout from "./layouts/MainLayout";
import AuthGuard from "./components/AuthGuard";
import React, { Suspense } from "react";
import { Spin } from "antd";

// 懒加载页面组件
const Sleep = React.lazy(() => import("./pages/Sleep"));
const Analysis = React.lazy(() => import("./pages/Analysis"));
const Comparison = React.lazy(() => import("./pages/Comparison"));
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
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
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
          path="comparison"
          element={
            <Suspense fallback={<LoadingComponent />}>
              <Comparison />
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
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <ConfigProvider locale={zhCN}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
