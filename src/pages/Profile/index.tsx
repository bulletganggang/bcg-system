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
import { EditOutlined, CameraOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { useDispatch, useSelector } from "react-redux";
import { updateUserName, updateUserAvatar } from "@/store/slices/userSlice";
import type { RootState } from "@/store";
import dayjs from "dayjs";
import styles from "./style.module.scss";

interface UserResponse {
  // 基本信息
  name: string;
  avatar?: string;
  // 详细信息
  phone: string;
  gender: "男" | "女";
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

  // 检查文件大小是否超过200KB
  const beforeUpload = (file: RcFile) => {
    // 检查文件类型
    const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type);
    if (!isImage) {
      message.error("只能上传 JPG/JPEG/PNG 格式的图片！");
      return false;
    }

    // 检查文件大小
    const isLt200KB = file.size / 1024 < 200;
    if (!isLt200KB) {
      message.error("图片大小不能超过200KB!");
      return false;
    }

    return isImage && isLt200KB;
  };

  // 处理头像上传
  const handleAvatarChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "done") {
      // 获取上传的文件
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        // 将文件转换为base64字符串
        const base64 = reader.result as string;

        // 1. 更新Redux中的头像（重要信息）
        dispatch(updateUserAvatar(base64));

        // 2. 更新localStorage（模拟调用保存用户信息接口）
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo);
          // 保存所有信息，包括重要信息（用户名、新头像）和不重要信息
          const updatedInfo = {
            ...userInfo,
            avatar: base64,
          };
          localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
        }

        message.success("头像上传成功！");
      });
      reader.readAsDataURL(info.file.originFileObj as Blob);
    }
  };

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

      // 只将基本信息（用户名和头像）存入Redux
      dispatch(updateUserName(userInfo.name));
      if (userInfo.avatar) {
        dispatch(updateUserAvatar(userInfo.avatar));
      }

      // 详细信息保存在组件状态中
      setUserDetailInfo(userInfo);
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  }, [dispatch]);

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

      // 1. 检查用户名是否被修改
      if (formattedValues.name !== name) {
        // 如果用户名被修改，更新Redux（重要信息）
        dispatch(updateUserName(formattedValues.name));
      }

      // 2. 准备要保存的完整用户信息
      const updatedInfo: UserResponse = {
        ...formattedValues,
        avatar: avatar || undefined,
      };

      // 3. 保存到localStorage（模拟调用保存用户信息接口）
      localStorage.setItem("userInfo", JSON.stringify(updatedInfo));

      // 4. 更新组件中的详细信息
      setUserDetailInfo(updatedInfo);
      setIsEditing(false);
      message.success("个人信息修改成功");
    } catch (error) {
      console.error("保存失败:", error);
    }
  };

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
              onChange={handleAvatarChange}
              accept=".jpg,.jpeg,.png"
              customRequest={({ onSuccess }) => {
                // 模拟上传成功
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 0);
              }}
            >
              <div className={styles.avatarWrapper}>
                <Avatar src={avatar} size={80} />
                <div className={styles.avatarOverlay}>
                  <CameraOutlined className={styles.cameraIcon} />
                </div>
              </div>
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
                <Select.Option value="男">男</Select.Option>
                <Select.Option value="女">女</Select.Option>
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
              <span className={styles.value}>{userDetailInfo.gender}</span>
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
