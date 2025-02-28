import React, { useState, useEffect, useCallback } from "react";
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
} from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "@/store/slices/userSlice";
import type { RootState } from "@/store";
import dayjs from "dayjs";
import styles from "./style.module.scss";

interface UserResponse {
  // 基本信息
  name: string;
  avatar?: string;
  // 详细信息
  phone: string;
  gender: 0 | 1;
  height: number;
  weight: number;
  birthday: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state: RootState) => state.user);
  const [userDetailInfo, setUserDetailInfo] = useState<UserResponse | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    try {
      // TODO: 实际项目中这里会调用后端API
      // const response = await request.get('/api/user/info');
      // const userInfo = response.data;

      // 临时使用localStorage模拟后端返回的数据
      const storedUserInfo = localStorage.getItem("userInfo");
      if (!storedUserInfo) return;

      const userInfo: UserResponse = JSON.parse(storedUserInfo);

      // 详细信息保存在组件状态中
      setUserDetailInfo(userInfo);
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleEditClick = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...userDetailInfo,
      name, // 使用Redux中的用户名
      birthday: dayjs(userDetailInfo?.birthday),
    });
  };

  const handleSave = async (values: Omit<UserResponse, "avatar">) => {
    try {
      const formattedValues = {
        ...userDetailInfo,
        ...values,
        birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
      };

      // 准备要保存的完整用户信息
      const updatedInfo: UserResponse = {
        ...formattedValues,
        avatar: avatar || undefined,
      };

      // 1. 更新 Redux 中的用户信息
      dispatch(updateUserInfo(updatedInfo));

      // 2. 保存到 localStorage（模拟调用保存用户信息接口）
      localStorage.setItem("userInfo", JSON.stringify(updatedInfo));

      // 3. 更新组件中的详细信息
      setUserDetailInfo(updatedInfo);
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
        // 使用 FileReader 读取文件
        const reader = new FileReader();
        reader.onload = async (e) => {
          const avatarUrl = e.target?.result as string;

          // 1. 更新 Redux 中的头像
          dispatch(updateUserInfo({ avatar: avatarUrl }));

          // 2. 更新 localStorage 中的用户信息（模拟调用保存用户信息接口）
          const storedUserInfo = localStorage.getItem("userInfo");
          if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            localStorage.setItem(
              "userInfo",
              JSON.stringify({
                ...userInfo,
                avatar: avatarUrl,
              })
            );
          }

          // 3. 更新组件状态
          setUserDetailInfo((prev) =>
            prev ? { ...prev, avatar: avatarUrl } : null
          );

          message.success("头像更新成功");
        };

        // 读取文件内容
        reader.readAsDataURL(info.file.originFileObj as Blob);
      } catch (error) {
        console.error("更新头像失败:", error);
        message.error("头像更新失败");
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
        src={avatar}
        icon={loading ? <LoadingOutlined /> : null}
      />
      <div className={styles.avatarOverlay}>
        <CameraOutlined className={styles.cameraIcon} />
      </div>
    </div>
  );

  if (!userDetailInfo) {
    return <Card loading />;
  }

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
                // 模拟上传成功
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 0);
              }}
            >
              {uploadButton}
            </Upload>
          </div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{name}</div>
            <div className={styles.userPhone}>
              手机号：{userDetailInfo.phone}
            </div>
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
            initialValues={userDetailInfo}
            onFinish={handleSave}
            layout="vertical"
            className={styles.editForm}
          >
            <Form.Item
              name="name"
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
              <Select>
                <Select.Option value={1}>男</Select.Option>
                <Select.Option value={0}>女</Select.Option>
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
              <span className={styles.value}>{name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>性别</span>
              <span className={styles.value}>
                {userDetailInfo.gender === 1 ? "男" : "女"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>身高</span>
              <span className={styles.value}>{userDetailInfo.height}cm</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>体重</span>
              <span className={styles.value}>{userDetailInfo.weight}kg</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>出生日期</span>
              <span className={styles.value}>{userDetailInfo.birthday}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
