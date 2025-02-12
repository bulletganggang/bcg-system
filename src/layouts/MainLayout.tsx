import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LineChartOutlined,
  SettingOutlined,
  HistoryOutlined,
  DashboardOutlined,
  BulbOutlined,
  RestOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { RootState } from "../store";
import { toggleTheme } from "../store/slices/configSlice";
// import request from "@/utils/request";

const { Header, Sider, Content } = Layout;

// 用户信息接口
interface UserInfo {
  avatar?: string;
  name: string;
}

/**
 * 主布局组件
 */
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.config.theme);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取用户信息
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      // 如果没有用户信息，重定向到登录页
      navigate("/login");
    }
  }, [navigate]);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 暂时隐藏登录退出验证
      // await request("post", "/logout");

      // 清除本地存储的用户信息
      localStorage.removeItem("userInfo");
      // 跳转到登录页
      navigate("/login");
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  // 菜单项配置
  const menuItems = [
    {
      key: "/sleep",
      icon: <RestOutlined />,
      label: "睡眠数据",
    },
    {
      key: "/analysis",
      icon: <LineChartOutlined />,
      label: "数据分析",
    },
    {
      key: "/history",
      icon: <HistoryOutlined />,
      label: "历史记录",
    },
    {
      key: "/monitor",
      icon: <DashboardOutlined />,
      label: "实时监测",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "系统设置",
    },
  ];

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    // 如果是根路径，返回 "/sleep"
    if (location.pathname === "/") return "/sleep";
    // 否则查找匹配的菜单项
    const matchedItem = menuItems.find((item) =>
      location.pathname.startsWith(item.key)
    );
    return matchedItem ? matchedItem.key : "/sleep";
  };

  // 用户下拉菜单
  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "退出登录",
        onClick: handleLogout,
      },
    ],
    style: {
      width: "120px",
    },
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: "0 24px",
          background: colorBgContainer,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1,
          // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1.5em",
            color: themeMode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.85)",
          }}
        >
          人体特征信号采集与处理系统
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {userInfo && (
            <Dropdown
              menu={userMenu}
              placement="bottom"
              align={{ offset: [0, 4] }}
            >
              <Avatar
                src={userInfo.avatar}
                style={{ cursor: "pointer" }}
                size="large"
              >
                {!userInfo.avatar && userInfo.name?.[0]}
              </Avatar>
            </Dropdown>
          )}
          <BulbOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => dispatch(toggleTheme())}
          />
        </div>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider theme={themeMode} breakpoint="lg" collapsedWidth="0">
          <Menu
            theme={themeMode}
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
