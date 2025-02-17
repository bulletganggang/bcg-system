import React, { useEffect } from "react";
import { Card, Form, Switch, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { updateChartConfig, resetConfig } from "../../store/slices/configSlice";
import type { ChartConfig } from "../../types";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // 从Redux获取配置
  const chartConfig = useSelector(
    (state: RootState) => state.config.chartConfig
  );

  // 监听配置变化，同步更新表单
  useEffect(() => {
    form.setFieldsValue({
      chartConfig,
    });
  }, [chartConfig, form]);

  // 处理表单提交
  const handleSubmit = (values: { chartConfig: ChartConfig }) => {
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
            chartConfig,
          }}
          onFinish={handleSubmit}
        >
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
