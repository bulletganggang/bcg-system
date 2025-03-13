import React, { useEffect } from "react";
import { Layout, Menu, theme, Avatar, Badge } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  RestOutlined,
  AreaChartOutlined,
  CompressOutlined,
  UserOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import type { RootState } from "../store";
import { setUserInfo } from "../store/slices/userSlice";
import { setDevices } from "../store/slices/deviceSlice";
import { getProfile, getDeviceList } from "@/api";
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
  const { records } = useSelector((state: RootState) => state.alert);

  // 未处理的预警记录数量
  const unprocessedCount = records.filter(
    (record) => record.status === 0
  ).length;

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
      key: "/comparison",
      icon: <CompressOutlined />,
      label: "数据对比",
    },
    {
      key: "/alert-settings",
      icon:
        unprocessedCount > 0 ? (
          <Badge count={unprocessedCount} size="small">
            <AlertOutlined />
          </Badge>
        ) : (
          <AlertOutlined />
        ),
      label: "预警设置",
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
              <div
                className={styles.userInfo}
                onClick={() => navigate("/profile")}
              >
                <Avatar src={avatar} size="large" />
                <span className={styles.username}>{username}</span>
              </div>
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
    </Layout>
  );
};

export default MainLayout;
