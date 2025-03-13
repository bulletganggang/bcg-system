import React, { useState } from "react";
import {
  Button,
  Table,
  Space,
  Switch,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tooltip,
  Typography,
  Empty,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import {
  addRule,
  updateRule,
  deleteRule,
  toggleRuleStatus,
} from "@/store/slices/alertSlice";
import {
  AlertRule,
  AlertLevel,
  AlertRuleType,
  AlertRuleOperator,
} from "@/types";
import {
  levelColorMap,
  levelTextMap,
  ruleTypeTextMap,
  operatorTextMap,
  ruleUnitMap,
} from "@/constants/alert";
import { ruleSuggestions } from "@/constants/alert/suggestions";
import styles from "../style.module.scss";

const { Option } = Select;
const { confirm } = Modal;
const { Text } = Typography;

/**
 * 预警规则组件
 */
const AlertRules: React.FC = () => {
  const dispatch = useDispatch();
  const { rules } = useSelector((state: RootState) => state.alert);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  // 打开添加规则模态框
  const showAddModal = () => {
    setEditingRule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑规则模态框
  const showEditModal = (rule: AlertRule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      name: rule.name,
      type: rule.type,
      operator: rule.operator,
      threshold: rule.threshold,
      level: rule.level,
      description: rule.description,
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingRule) {
        // 更新规则
        dispatch(
          updateRule({
            id: editingRule.id,
            ...values,
            enabled: true,
          })
        );
      } else {
        // 添加规则
        dispatch(
          addRule({
            ...values,
            enabled: true,
          })
        );
      }
      setIsModalVisible(false);
    });
  };

  // 删除规则确认
  const showDeleteConfirm = (id: string, name: string) => {
    confirm({
      title: `确定要删除${name}吗?`,
      icon: <ExclamationCircleOutlined />,
      content: "删除后将无法恢复",
      centered: true,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        dispatch(deleteRule(id));
      },
    });
  };

  // 切换规则状态
  const handleToggleStatus = (id: string) => {
    dispatch(toggleRuleStatus(id));
  };

  // 快速添加规则
  const handleQuickAdd = (suggestion: (typeof ruleSuggestions)[0]) => {
    const { name, type, operator, threshold, level, description } = suggestion;
    dispatch(
      addRule({
        name,
        type,
        operator,
        threshold,
        level,
        description,
      })
    );
  };

  // 快速添加菜单项
  const quickAddMenuItems = [
    {
      key: "sleep",
      label: "睡眠质量",
      type: "group" as const,
      children: ruleSuggestions
        .filter((item) => item.type === AlertRuleType.SLEEP_QUALITY)
        .map((item) => ({
          key: item.name,
          label: item.name,
          onClick: () => handleQuickAdd(item),
        })),
    },
    {
      key: "respiratory",
      label: "呼吸率",
      type: "group" as const,
      children: ruleSuggestions
        .filter((item) => item.type === AlertRuleType.RESPIRATORY_RATE)
        .map((item) => ({
          key: item.name,
          label: item.name,
          onClick: () => handleQuickAdd(item),
        })),
    },
    {
      key: "stages",
      label: "睡眠阶段",
      type: "group" as const,
      children: ruleSuggestions
        .filter(
          (item) =>
            item.type === AlertRuleType.DEEP_SLEEP_RATIO ||
            item.type === AlertRuleType.REM_SLEEP_RATIO
        )
        .map((item) => ({
          key: item.name,
          label: item.name,
          onClick: () => handleQuickAdd(item),
        })),
    },
    {
      key: "duration",
      label: "睡眠时长",
      type: "group" as const,
      children: ruleSuggestions
        .filter((item) => item.type === AlertRuleType.SLEEP_DURATION)
        .map((item) => ({
          key: item.name,
          label: item.name,
          onClick: () => handleQuickAdd(item),
        })),
    },
    {
      key: "movement",
      label: "体动数据",
      type: "group" as const,
      children: ruleSuggestions
        .filter(
          (item) =>
            item.type === AlertRuleType.TOTAL_MOVEMENT ||
            item.type === AlertRuleType.TOTAL_INACTIVITY ||
            item.type === AlertRuleType.POSITION_CHANGE ||
            item.type === AlertRuleType.BODY_MOVEMENT
        )
        .map((item) => ({
          key: item.name,
          label: item.name,
          onClick: () => handleQuickAdd(item),
        })),
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: "规则名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: AlertRule) => (
        <Space>
          <Text>{text}</Text>
          {record.description && (
            <Tooltip title={record.description}>
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "监控指标",
      dataIndex: "type",
      key: "type",
      render: (type: AlertRuleType) => ruleTypeTextMap[type],
    },
    {
      title: "触发条件",
      key: "condition",
      render: (_: any, record: AlertRule) => (
        <span>
          {operatorTextMap[record.operator]} {record.threshold}
          {ruleUnitMap[record.type]}
        </span>
      ),
    },
    {
      title: "预警级别",
      dataIndex: "level",
      key: "level",
      render: (level: AlertLevel) => (
        <Tag color={levelColorMap[level]}>{levelTextMap[level]}</Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleStatus(record.id)}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: AlertRule) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id, record.name)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.alertRulesContainer}>
      <div className={styles.toolBar}>
        <Space>
          <Dropdown
            menu={{
              items: quickAddMenuItems,
            }}
          >
            <Button>
              快速添加 <DownOutlined />
            </Button>
          </Dropdown>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            添加规则
          </Button>
        </Space>
      </div>

      {rules.length === 0 ? (
        <Empty
          description="暂无预警规则"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={rules}
          rowKey="id"
          pagination={false}
        />
      )}

      <Modal
        title={editingRule ? "编辑预警规则" : "添加预警规则"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        centered
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: AlertRuleType.SLEEP_QUALITY,
            operator: AlertRuleOperator.LESS_THAN,
            level: AlertLevel.MEDIUM,
          }}
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: "请输入规则名称" }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="监控指标"
            rules={[{ required: true, message: "请选择监控指标" }]}
          >
            <Select placeholder="请选择监控指标">
              {Object.entries(ruleTypeTextMap).map(([value, text]) => (
                <Option key={value} value={value}>
                  {text}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="operator"
            label="比较运算符"
            rules={[{ required: true, message: "请选择比较运算符" }]}
          >
            <Select placeholder="请选择比较运算符">
              {Object.entries(operatorTextMap).map(([value, text]) => (
                <Option key={value} value={value}>
                  {text}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="threshold"
            label="阈值"
            rules={[{ required: true, message: "请输入阈值" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入阈值"
              min={0}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="level"
            label="预警级别"
            rules={[{ required: true, message: "请选择预警级别" }]}
          >
            <Select placeholder="请选择预警级别">
              {Object.entries(levelTextMap).map(([value, text]) => (
                <Option key={value} value={value}>
                  <Tag color={levelColorMap[value as AlertLevel]}>{text}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="规则描述">
            <Input.TextArea
              placeholder="请输入规则描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertRules;
