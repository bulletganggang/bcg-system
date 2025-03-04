import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown, Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HistoryOutlined,
  RestOutlined,
  LogoutOutlined,
  AreaChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { RootState } from "../store";
import { setUserInfo, clearUserInfo } from "../store/slices/userSlice";
import { setDevices, clearDevices } from "../store/slices/deviceSlice";
import { getProfile, logout, getDeviceList } from "@/api";
import styles from "./style.module.scss";

const { Header, Sider, Content } = Layout;

/**
 * 主布局组件
 */
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { username, avatar } = useSelector((state: RootState) => state.user);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取用户信息和设备列表
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 调用获取用户信息接口
        const userResponse = await getProfile();
        dispatch(setUserInfo(userResponse.data));

        // 获取设备列表
        const deviceResponse = await getDeviceList();
        dispatch(setDevices(deviceResponse.data));
      } catch (error) {
        // 如果获取信息失败（未登录或 token 过期），跳转到登录页
        console.error("获取初始数据失败:", error);
        navigate("/login");
      }
    };

    fetchInitialData();
  }, [navigate, dispatch]);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 调用退出登录接口
      await logout();

      // 清除 Redux 状态
      dispatch(clearUserInfo());
      dispatch(clearDevices());

      // 跳转到登录页
      navigate("/login");
    } catch (error) {
      console.error("退出登录失败:", error);
      message.error("退出登录失败，请重试");
    }
  };

  // 显示退出确认弹窗
  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
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
      key: "/profile",
      icon: <UserOutlined />,
      label: "个人中心",
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
        onClick: showLogoutModal,
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
        <h1 className={styles.title}>人体特征信号采集与处理系统</h1>
      </Header>
      <Layout style={{ marginTop: 56 }}>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsed={false}
          className={styles.sider}
        >
          <div className={styles.siderContent}>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              items={menuItems}
              onClick={({ key }) => navigate(key)}
              className={styles.menu}
            />
            <div className={styles.userSection}>
              <Dropdown menu={userMenu} placement="topRight">
                <div
                  className={styles.userInfo}
                  onClick={() => navigate("/profile")}
                >
                  <Avatar src={avatar} size="large" />
                  <span className={styles.username}>{username}</span>
                </div>
              </Dropdown>
            </div>
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
      <Modal
        title="退出登录"
        open={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="确认"
        cancelText="取消"
        centered
      >
        <p>确定要退出登录吗？</p>
      </Modal>
    </Layout>
  );
};

export default MainLayout;
