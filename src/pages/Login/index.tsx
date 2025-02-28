import React, { useState } from "react";
import { Card, Tabs, Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";
import request from "@/utils/request";
import { setUserInfo } from "@/store/slices/userSlice";
// import { LoginParams, LoginResponse, ValidLoginParams } from "@/types";
import { LoginParams } from "@/types";
import styles from "./style.module.scss";

const Login: React.FC = () => {
  const [verifyForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState<"verify" | "password">("verify");

  // 发送验证码
  const handleSendVerifyCode = async () => {
    try {
      // 验证手机号
      await verifyForm.validateFields(["phone"]);
      const phone = verifyForm.getFieldValue("phone");

      setLoading(true);
      await request("post", "/sendVerifyCode", { phone });
      message.success("验证码已发送");

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("发送验证码失败:", error);
      message.error("请输入正确的手机号");
    } finally {
      setLoading(false);
    }
  };

  // 处理登录
  const handleLogin = async (values: LoginParams) => {
    try {
      setLoading(true);

      // 根据当前登录方式验证必填字段
      if (activeTab === "verify" && !values.code) {
        message.error("请输入验证码");
        return;
      }
      if (activeTab === "password" && !values.password) {
        message.error("请输入密码");
        return;
      }

      // TODO: 后端接口完成后，这里需要：
      // 1. 调用登录接口获取 token
      // 2. token 会自动保存在 cookie 中（由后端设置 httpOnly cookie）
      // 3. 获取用户信息
      // const loginParams: ValidLoginParams =
      //   activeTab === "verify"
      //     ? { phone: values.phone, code: values.code! }
      //     : { phone: values.phone, password: values.password! };
      // const loginResponse = await request.post('/api/login', loginParams);
      // const userInfoResponse = await request.get('/api/user/info');
      // dispatch(setUserInfo({ ...userInfoResponse.data, isAuthenticated: true }));

      // 临时使用 localStorage 模拟，后端完成后移除
      const mockUserInfo = {
        id: "1",
        name: "test",
        phone: values.phone,
        avatar: undefined,
        isAuthenticated: true,
      };
      localStorage.setItem("userInfo", JSON.stringify(mockUserInfo));
      dispatch(setUserInfo(mockUserInfo));

      message.success("登录成功");
      navigate("/sleep");
    } catch (error) {
      console.error("登录失败:", error);
      message.error("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "verify",
      label: "验证码登录",
      children: (
        <Form
          form={verifyForm}
          name="verifyLogin"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Row gutter={8}>
              <Col flex="auto">
                <Input
                  prefix={<LockOutlined />}
                  placeholder="验证码"
                  size="large"
                />
              </Col>
              <Col flex="none">
                <Button
                  type="primary"
                  disabled={countdown > 0}
                  onClick={handleSendVerifyCode}
                  loading={loading}
                  className={styles.verifyCodeButton}
                >
                  {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.loginButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "password",
      label: "密码登录",
      children: (
        <Form
          form={passwordForm}
          name="passwordLogin"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.loginButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className={styles.loginContainer}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card className={styles.loginCard}>
          <h2 className={styles.title}>人体特征信号采集与处理系统</h2>
          <Tabs
            defaultActiveKey="verify"
            items={items}
            centered
            size="large"
            onChange={(key) => setActiveTab(key as "verify" | "password")}
          />
        </Card>
      </Col>
    </div>
  );
};

export default Login;
