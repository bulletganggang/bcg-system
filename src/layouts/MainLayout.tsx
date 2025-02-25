import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown, Modal } from "antd";
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
import { setUserBasicInfo } from "../store/slices/userSlice";
import styles from "./style.module.scss";
// import request from "@/utils/request";

const { Header, Sider, Content } = Layout;

/**
 * 主布局组件
 */
const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state: RootState) => state.user);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取用户信息
  useEffect(() => {
    // TODO: 调用后端接口，获取用户信息
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      // 将用户基本信息存储到Redux
      dispatch(
        setUserBasicInfo({
          name: parsedUserInfo.name,
          avatar: parsedUserInfo.avatar,
        })
      );
    } else {
      // 如果没有用户信息，重定向到登录页
      navigate("/login");
    }
  }, [navigate, dispatch]);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 暂时隐藏登录退出验证
      // await request("post", "/logout");

      // 清除本地存储的用户信息
      localStorage.removeItem("userInfo");
      // 重置用户信息
      dispatch(setUserBasicInfo({ name: "", avatar: undefined }));
      // 跳转到登录页
      navigate("/login");
    } catch (error) {
      console.error("退出登录失败:", error);
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
                  <span className={styles.username}>{name}</span>
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
