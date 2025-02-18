import React, { useEffect } from "react";
import { Card, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";

const Error: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 5秒后重定向到睡眠数据页面
    const timer = setTimeout(() => {
      navigate("/sleep");
    }, 5000);

    // 清理定时器
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Card className={styles.errorCard}>
      <Result
        status="404"
        title="404"
        subTitle={
          <div className={styles.subTitle}>
            <p>抱歉，您访问的页面不存在</p>
            <p>5秒后将自动跳转...</p>
          </div>
        }
      />
    </Card>
  );
};

export default Error;
