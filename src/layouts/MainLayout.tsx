import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  SettingOutlined,
  HistoryOutlined,
  BulbOutlined,
  RestOutlined,
  LogoutOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import type { RootState } from "../store";
import { toggleTheme } from "../store/slices/configSlice";
import styles from "./style.module.scss";
import classNames from "classnames";
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
      icon: <AreaChartOutlined />,
      label: "数据分析",
    },
    {
      key: "/history",
      icon: <HistoryOutlined />,
      label: "历史记录",
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
        className={styles.header}
        style={{ background: colorBgContainer }}
      >
        <h1
          className={styles.title}
          style={{
            color: themeMode === "dark" ? "#fff" : "rgba(0, 0, 0, 0.85)",
          }}
        >
          人体特征信号采集与处理系统
        </h1>
        <div className={styles.rightContent}>
          <BulbOutlined
            className={styles.themeIcon}
            onClick={() => dispatch(toggleTheme())}
          />
        </div>
      </Header>
      <Layout style={{ marginTop: 56 }}>
        <Sider
          theme={themeMode}
          breakpoint="lg"
          collapsed={false}
          className={styles.sider}
        >
          <div className={styles.siderContent}>
            <Menu
              theme={themeMode}
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              className={styles.menu}
            />
            {userInfo && (
              <div className={styles.userSection}>
                <Dropdown menu={userMenu} placement="topRight">
                  <div className={styles.userInfo}>
                    <Avatar src={userInfo.avatar} size="large">
                      {!userInfo.avatar && userInfo.name?.[0]}
                    </Avatar>
                    <span
                      className={classNames(styles.username, styles[themeMode])}
                    >
                      {userInfo.name}
                    </span>
                  </div>
                </Dropdown>
              </div>
            )}
          </div>
        </Sider>
        <Layout className={styles.content}>
          <Content className={styles.contentInner}>
            <div
              className={styles.contentBox}
              style={{
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
