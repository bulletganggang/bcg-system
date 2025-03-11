import React, { useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Form,
  message,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  Input,
  Modal,
  List,
} from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  CameraOutlined,
  PlusOutlined,
  HeartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo, clearUserInfo } from "@/store/slices/userSlice";
import {
  setDevices,
  setCurrentDevice,
  clearDevices,
} from "@/store/slices/deviceSlice";
import type { RootState } from "@/store";
import type { UserInfo, Device } from "@/types";
import dayjs from "dayjs";
import styles from "./style.module.scss";
import {
  bindDevice,
  unbindDevice,
  getDeviceList,
  updateProfile,
  changeAvatar,
  logout,
} from "@/api";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user);
  const devices = useSelector((state: RootState) => state.device.devices);
  const currentDevice = useSelector(
    (state: RootState) => state.device.currentDevice
  );

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isBindModalVisible, setIsBindModalVisible] = useState(false);
  const [bindForm] = Form.useForm();
  const [bindLoading, setBindLoading] = useState(false);
  const [isUnbindModalVisible, setIsUnbindModalVisible] = useState(false);
  const [unbindingDevice, setUnbindingDevice] = useState<Device | null>(null);
  const [unbindLoading, setUnbindLoading] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...userInfo,
      gender: userInfo.gender === 0 ? undefined : userInfo.gender,
      birthday: userInfo.birthday ? dayjs(userInfo.birthday) : undefined,
    });
  };

  const handleSave = async (values: Omit<UserInfo, "avatar">) => {
    try {
      const formattedValues = {
        ...values,
        birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
        weight: String(values.weight),
        height: String(values.height),
      };

      await updateProfile(formattedValues, userInfo.userId!);

      // 更新 Redux 状态时保持为数字类型
      dispatch(
        updateUserInfo({
          ...values,
          birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
        })
      );

      setIsEditing(false);
      message.success("个人信息修改成功");
    } catch (error) {
      console.error("保存失败:", error);
      message.error("保存失败，请重试");
    }
  };

  // 处理头像上传前的检查
  const beforeUpload = (file: RcFile) => {
    const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type);
    if (!isImage) {
      message.error("只能上传 JPG/PNG 格式的图片！");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB！");
    }
    return isImage && isLt2M;
  };

  // 处理头像上传
  const handleAvatarUpload: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      try {
        // 上传头像
        const response = await changeAvatar(info.file.originFileObj as File);

        // 更新 Redux 中的头像
        dispatch(updateUserInfo({ avatar: response.data }));

        message.success("头像上传成功");
      } catch (error) {
        console.error("头像上传失败:", error);
        message.error("头像上传失败，请重试");
      } finally {
        setLoading(false);
      }
    }
  };

  // 上传按钮
  const uploadButton = (
    <div className={styles.avatarWrapper}>
      <Avatar
        size={80}
        src={userInfo.avatar}
        icon={loading ? <LoadingOutlined /> : null}
      />
      <div className={styles.avatarOverlay}>
        <CameraOutlined className={styles.cameraIcon} />
      </div>
    </div>
  );

  const handleBindDevice = async (values: { deviceCode: string }) => {
    if (!userInfo.userId) {
      message.error("用户ID不能为空");
      return;
    }

    try {
      setBindLoading(true);
      // 调用绑定设备 API
      await bindDevice(values.deviceCode, userInfo.userId);

      // 绑定成功后重新获取设备列表
      const response = await getDeviceList();
      dispatch(setDevices(response.data));

      setIsBindModalVisible(false);
      bindForm.resetFields();
      message.success("设备绑定成功");
    } catch (error) {
      console.error("绑定设备失败:", error);
      message.error("绑定设备失败，请重试");
    } finally {
      setBindLoading(false);
    }
  };

  const handleUnbindDevice = async (device: Device) => {
    if (!device.deviceCode) return;
    setUnbindingDevice(device);
    setIsUnbindModalVisible(true);
  };

  const confirmUnbind = async () => {
    if (!unbindingDevice?.deviceCode || !userInfo.userId) return;

    try {
      setUnbindLoading(true);
      await unbindDevice(unbindingDevice.deviceCode, userInfo.userId);
      message.success("设备解绑成功");

      // 直接更新Redux状态
      const newDevices = devices.filter(
        (d) => d.deviceCode !== unbindingDevice.deviceCode
      );
      dispatch(setDevices(newDevices));

      // 如果解绑的是当前选中的设备
      if (currentDevice?.deviceCode === unbindingDevice.deviceCode) {
        // 如果还有其他设备，选择下一个设备
        if (newDevices.length > 0) {
          // 选择第一个设备
          const nextDevice = newDevices[0];
          dispatch(setCurrentDevice(nextDevice));
        } else {
          // 如果没有设备了，清空当前设备
          dispatch(setCurrentDevice(null));
        }
      }
    } catch (error) {
      console.error("解绑设备失败:", error);
      message.error("解绑设备失败，请重试");
    } finally {
      setUnbindLoading(false);
      setIsUnbindModalVisible(false);
      setUnbindingDevice(null);
    }
  };

  const handleSelectDevice = (device: Device) => {
    // 直接更新 Redux 中的当前设备
    dispatch(setCurrentDevice(device));
  };

  // 处理退出登录
  const handleLogout = async () => {
    setIsLogoutModalVisible(true);
  };

  // 确认退出登录
  const confirmLogout = async () => {
    try {
      setLogoutLoading(true);
      // 调用退出登录接口
      await logout();

      // 清除 Redux 状态
      dispatch(clearUserInfo());
      dispatch(clearDevices());

      // 跳转到登录页
      navigate("/login");
      message.success("退出登录成功");
    } catch (error) {
      console.error("退出登录失败:", error);
      message.error("退出登录失败，请重试");
      setLogoutLoading(false);
      setIsLogoutModalVisible(false);
    }
  };

  const DeviceIcon: React.FC<{ type: Device["deviceType"] }> = () => {
    return (
      <div className={styles.deviceIcon}>
        <HeartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>
    );
  };

  return (
    <div className={styles.profileContainer}>
      <Card title="个人中心" className={styles.profileCard}>
        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleAvatarUpload}
              accept=".jpg,.jpeg,.png"
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 0);
              }}
            >
              {uploadButton}
            </Upload>
          </div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{userInfo.username}</div>
            <div className={styles.userPhone}>手机号：{userInfo.phone}</div>
          </div>
        </div>
      </Card>

      <Card
        title="个人信息"
        className={styles.infoCard}
        extra={
          !isEditing && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={handleEditClick}
              className={styles.editButton}
            >
              修改个人信息
            </Button>
          )
        }
      >
        {isEditing ? (
          <Form
            form={form}
            initialValues={userInfo}
            onFinish={handleSave}
            layout="vertical"
            className={styles.editForm}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input maxLength={20} showCount />
            </Form.Item>
            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: "请选择性别" }]}
            >
              <Select placeholder="请选择性别">
                <Select.Option value={1}>男</Select.Option>
                <Select.Option value={2}>女</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="height"
              label="身高"
              rules={[{ required: true, message: "请输入身高" }]}
            >
              <InputNumber
                min={1}
                max={300}
                addonAfter="cm"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="weight"
              label="体重"
              rules={[{ required: true, message: "请输入体重" }]}
            >
              <InputNumber
                min={1}
                max={500}
                addonAfter="kg"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="birthday"
              label="出生日期"
              rules={[{ required: true, message: "请选择出生日期" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => current && current.isAfter(dayjs())}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                确定
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div className={styles.infoDisplay}>
            <div className={styles.infoItem}>
              <span className={styles.label}>用户名</span>
              <span className={styles.value}>{userInfo.username}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>性别</span>
              <span className={styles.value}>
                {userInfo.gender === 1
                  ? "男"
                  : userInfo.gender === 2
                  ? "女"
                  : ""}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>身高</span>
              <span className={styles.value}>{userInfo.height}cm</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>体重</span>
              <span className={styles.value}>{userInfo.weight}kg</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>出生日期</span>
              <span className={styles.value}>
                {userInfo.birthday
                  ? dayjs(userInfo.birthday).format("YYYY-MM-DD")
                  : ""}
              </span>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="设备管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsBindModalVisible(true)}
          >
            绑定设备
          </Button>
        }
        className={styles.deviceCard}
      >
        <List
          dataSource={devices}
          renderItem={(device) => (
            <List.Item
              className={classNames(styles.deviceItem, {
                [styles.selected]:
                  device.deviceCode === currentDevice?.deviceCode,
              })}
              onClick={() => handleSelectDevice(device)}
            >
              <div className={styles.deviceInfo}>
                <div className={styles.deviceIcon}>
                  <DeviceIcon type={device.deviceType} />
                </div>
                <div className={styles.deviceMeta}>
                  <div className={styles.deviceName}>{device.deviceName}</div>
                  <div className={styles.deviceCode}>{device.deviceCode}</div>
                </div>
              </div>
              <Button
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnbindDevice(device);
                }}
              >
                解绑
              </Button>
            </List.Item>
          )}
        />
      </Card>

      {/* 退出登录卡片 */}
      <Card title="账号安全" className={styles.securityCard}>
        <div className={styles.logoutButtonWrapper}>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </Card>

      <Modal
        title="绑定设备"
        open={isBindModalVisible}
        onOk={() => bindForm.submit()}
        onCancel={() => {
          setIsBindModalVisible(false);
          bindForm.resetFields();
        }}
        confirmLoading={bindLoading}
        centered
      >
        <Form form={bindForm} onFinish={handleBindDevice}>
          <Form.Item
            name="deviceCode"
            rules={[{ required: true, message: "请输入设备码" }]}
          >
            <Input placeholder="请输入设备码" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="解绑设备"
        open={isUnbindModalVisible}
        onOk={confirmUnbind}
        onCancel={() => {
          setIsUnbindModalVisible(false);
          setUnbindingDevice(null);
        }}
        confirmLoading={unbindLoading}
        centered
      >
        <p>
          是否确认解绑{unbindingDevice?.deviceName}(
          {unbindingDevice?.deviceCode})？
        </p>
      </Modal>

      {/* 退出登录确认对话框 */}
      <Modal
        title="退出登录"
        open={isLogoutModalVisible}
        onOk={confirmLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        confirmLoading={logoutLoading}
        okText="确认"
        cancelText="取消"
        centered
      >
        <p>确定要退出登录吗？</p>
      </Modal>
    </div>
  );
};

export default Profile;
