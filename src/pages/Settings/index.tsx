import React, { useEffect } from "react";
import { Card, Form, InputNumber, Switch, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
  updateUserConfig,
  updateChartConfig,
  resetConfig,
} from "../../store/slices/configSlice";
import type { UserConfig, ChartConfig } from "../../types";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 从Redux获取配置
  const userConfig = useSelector((state: RootState) => state.config.userConfig);
  const chartConfig = useSelector(
    (state: RootState) => state.config.chartConfig
  );

  // 监听配置变化，同步更新表单
  useEffect(() => {
    form.setFieldsValue({
      userConfig,
      chartConfig,
    });
  }, [userConfig, chartConfig, form]);

  // 处理表单提交
  const handleSubmit = (values: {
    userConfig: UserConfig;
    chartConfig: ChartConfig;
  }) => {
    dispatch(updateUserConfig(values.userConfig));
    dispatch(updateChartConfig(values.chartConfig));
    message.success("设置已保存");
  };

  // 重置配置
  const handleReset = () => {
    dispatch(resetConfig());
    message.success("设置已重置");
  };

  return (
    <div>
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            userConfig,
            chartConfig,
          }}
          onFinish={handleSubmit}
        >
          <Card type="inner" title="数据采集设置" style={{ marginBottom: 16 }}>
            <Form.Item
              label="采样率(Hz)"
              name={["userConfig", "sampleRate"]}
              rules={[{ required: true, message: "请输入采样率" }]}
            >
              <InputNumber min={1} max={1000} />
            </Form.Item>

            <Form.Item
              label="显示时间范围(秒)"
              name={["userConfig", "timeRange"]}
              rules={[{ required: true, message: "请输入时间范围" }]}
            >
              <InputNumber min={1} max={3600} />
            </Form.Item>

            <Form.Item
              label="显示网格"
              name={["userConfig", "showGrid"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="自动缩放"
              name={["userConfig", "autoScale"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Card type="inner" title="图表设置" style={{ marginBottom: 16 }}>
            <Form.Item
              label="显示标签"
              name={["chartConfig", "showLabel"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="允许缩放"
              name={["chartConfig", "zoomable"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
              <Button onClick={handleReset}>重置设置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
