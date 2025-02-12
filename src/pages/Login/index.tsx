import React, { useState } from "react";
import { Card, Tabs, Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";
import request, { RequestParams } from "@/utils/request";

// 登录参数接口
interface LoginParams extends RequestParams {
  phone: string;
  password?: string;
  verifyCode?: string;
  type: "verify" | "password"; // 登录类型
}

// 登录响应接口
// interface LoginResponse {
//   userInfo: {
//     name: string;
//     avatar?: string;
//   };
// }

const Login: React.FC = () => {
  const [verifyForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
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
  const handleLogin = async (values: Omit<LoginParams, "type">) => {
    try {
      setLoading(true);

      // 根据当前登录方式验证必填字段
      if (activeTab === "verify" && !values.verifyCode) {
        message.error("请输入验证码");
        return;
      }
      if (activeTab === "password" && !values.password) {
        message.error("请输入密码");
        return;
      }

      // // 实际登录逻辑(暂时跳过登录验证)
      // const loginParams: LoginParams = {
      //   ...values,
      //   phone: values.phone as string,
      //   type: activeTab,
      // };
      // await request("post", "/login", loginParams);
      // message.success("登录成功");

      // 模拟登录成功
      localStorage.setItem("userInfo", JSON.stringify({ name: values.phone }));
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
            name="verifyCode"
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
              block
              loading={loading}
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
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            人体特征信号采集与处理系统
          </h2>
          <Tabs
            defaultActiveKey="verify"
            items={items}
            centered
            size="large"
            onChange={(key) => setActiveTab(key as "verify" | "password")}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
