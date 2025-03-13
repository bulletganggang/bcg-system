import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Empty,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import {
  updateRecordStatus,
  clearRecords,
  deleteRecord,
} from "@/store/slices/alertSlice";
import { AlertRecord, AlertLevel } from "@/types";
import dayjs from "dayjs";
import styles from "../style.module.scss";
import {
  levelColorMap,
  levelTextMap,
  operatorTextMap,
} from "@/constants/alert/mappings";

const { Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

/**
 * 预警记录组件
 */
const AlertRecords: React.FC = () => {
  const dispatch = useDispatch();
  const { records } = useSelector((state: RootState) => state.alert);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AlertRecord | null>(null);

  // 打开处理模态框
  const showProcessModal = (record: AlertRecord) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      status: record.status,
      processNote: record.processNote || "",
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  // 提交处理表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (currentRecord) {
        dispatch(
          updateRecordStatus({
            id: currentRecord.id,
            status: values.status,
            processNote: values.processNote,
          })
        );
      }
      setIsModalVisible(false);
    });
  };

  // 清空所有记录确认
  const showClearConfirm = () => {
    confirm({
      title: "确定要清空所有预警记录吗?",
      icon: <ExclamationCircleOutlined />,
      content: "清空后将无法恢复",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        dispatch(clearRecords());
      },
      centered: true,
    });
  };

  // 删除单条记录确认
  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "确定要删除这条预警记录吗?",
      icon: <ExclamationCircleOutlined />,
      content: "删除后将无法恢复",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        dispatch(deleteRecord(id));
      },
      centered: true,
    });
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="red">未处理</Tag>;
      case 1:
        return <Tag color="green">已处理</Tag>;
      case 2:
        return <Tag color="default">已忽略</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "规则名称",
      dataIndex: "ruleName",
      key: "ruleName",
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
      title: "预警日期",
      dataIndex: "sleepDate",
      key: "alertDate",
      render: (time: number) => dayjs(time).format("YYYY-MM-DD"),
    },
    {
      title: "触发值",
      dataIndex: "triggerValue",
      key: "triggerValue",
      render: (value: number) => value.toFixed(2),
    },
    {
      title: "触发条件",
      key: "condition",
      render: (_: any, record: AlertRecord) => (
        <span>
          {operatorTextMap[record.operator]}
          {record.threshold}
        </span>
      ),
    },
    {
      title: "触发时间",
      dataIndex: "triggeredAt",
      key: "triggeredAt",
      render: (time: number) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "处理时间",
      dataIndex: "processedAt",
      key: "processedAt",
      render: (time: number) =>
        time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: "处理备注",
      dataIndex: "processNote",
      key: "processNote",
      render: (note: string) => note || "-",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: AlertRecord) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => showProcessModal(record)}
            style={{ color: record.status === 0 ? "#ff4d4f" : "#52c41a" }}
          >
            {record.status === 0 ? "处理" : "详情"}
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
            variant="solid"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.alertRecordsContainer}>
      <div className={styles.toolBar}>
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={records.length === 0}
            onClick={showClearConfirm}
          >
            清空记录
          </Button>
        </Space>
      </div>

      {records.length === 0 ? (
        <Empty
          description="暂无预警记录"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      )}

      <Modal
        title={currentRecord?.status === 0 ? "处理预警" : "预警详情"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        centered
      >
        {currentRecord && (
          <div className={styles.recordDetail}>
            <div className={styles.recordItem}>
              <Text strong>规则名称：</Text>
              <Text>{currentRecord.ruleName}</Text>
            </div>
            <div className={styles.recordItem}>
              <Text strong>预警级别：</Text>
              <Tag color={levelColorMap[currentRecord.level]}>
                {levelTextMap[currentRecord.level]}
              </Tag>
            </div>
            <div className={styles.recordItem}>
              <Text strong>预警日期：</Text>
              <Text>{dayjs(currentRecord.sleepDate).format("YYYY-MM-DD")}</Text>
            </div>
            <div className={styles.recordItem}>
              <Text strong>触发值：</Text>
              <Text>{currentRecord.triggerValue.toFixed(2)}</Text>
            </div>
            <div className={styles.recordItem}>
              <Text strong>触发条件：</Text>
              <Text>
                {operatorTextMap[currentRecord.operator]}{" "}
                {currentRecord.threshold}
              </Text>
            </div>
            <div className={styles.recordItem}>
              <Text strong>触发时间：</Text>
              <Text>
                {dayjs(currentRecord.triggeredAt).format("YYYY-MM-DD HH:mm:ss")}
              </Text>
            </div>
            <div className={styles.recordItem}>
              <Text strong>设备编码：</Text>
              <Text>{currentRecord.deviceCode}</Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: currentRecord.status,
                processNote: currentRecord.processNote || "",
              }}
            >
              <Form.Item
                name="status"
                label="处理状态"
                rules={[{ required: true, message: "请选择处理状态" }]}
              >
                <Radio.Group>
                  <Radio value={1}>
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      已处理
                    </Space>
                  </Radio>
                  <Radio value={2}>
                    <Space>
                      <CloseCircleOutlined style={{ color: "#bfbfbf" }} />
                      已忽略
                    </Space>
                  </Radio>
                  {currentRecord.status === 0 && (
                    <Radio value={0}>
                      <Space>
                        <ExclamationCircleOutlined
                          style={{ color: "#ff4d4f" }}
                        />
                        未处理
                      </Space>
                    </Radio>
                  )}
                </Radio.Group>
              </Form.Item>

              <Form.Item name="processNote" label="处理备注">
                <TextArea
                  rows={4}
                  placeholder="请输入处理备注"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AlertRecords;
