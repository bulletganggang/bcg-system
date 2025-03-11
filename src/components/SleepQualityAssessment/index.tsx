import React from "react";
import { Card, Progress, Space, Typography, Alert } from "antd";
import {
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { SleepData } from "@/types";
import styles from "./style.module.scss";

const { Title, Text } = Typography;

interface SleepQualityAssessmentProps {
  sleepData: SleepData;
}

/**
 * 获取睡眠质量等级信息
 * @param score 睡眠评分
 */
const getQualityLevel = (score: number) => {
  if (score >= 90) {
    return {
      level: "优秀",
      color: "#52c41a",
      icon: <TrophyOutlined />,
      description: "您的睡眠质量非常好，请继续保持良好的睡眠习惯。",
    };
  }
  if (score >= 80) {
    return {
      level: "良好",
      color: "#1890ff",
      icon: <CheckCircleOutlined />,
      description: "您的睡眠质量良好，但仍有提升的空间。",
    };
  }
  if (score >= 70) {
    return {
      level: "一般",
      color: "#faad14",
      icon: <ExclamationCircleOutlined />,
      description: "您的睡眠质量一般，建议关注以下建议来改善睡眠。",
    };
  }
  return {
    level: "欠佳",
    color: "#ff4d4f",
    icon: <WarningOutlined />,
    description: "您的睡眠质量较差，请认真关注以下建议并及时改善。",
  };
};

/**
 * 睡眠质量评估组件
 */
const SleepQualityAssessment: React.FC<SleepQualityAssessmentProps> = ({
  sleepData,
}) => {
  const { sleep_quality_score, sleep_suggestion } = sleepData;
  const qualityInfo = getQualityLevel(sleep_quality_score);

  return (
    <Card
      title={
        <Space>
          <span className={styles.cardIcon}>🌙</span>
          睡眠质量评估
        </Space>
      }
      className={styles.qualityCard}
    >
      <div className={styles.scoreSection}>
        <Progress
          type="circle"
          percent={sleep_quality_score}
          format={(percent) => (
            <div className={styles.scoreContent}>
              <div className={styles.scoreValue}>{percent}</div>
              <div className={styles.scoreLabel}>睡眠评分</div>
            </div>
          )}
          strokeColor={qualityInfo.color}
          size={120}
        />
        <div className={styles.qualityInfo}>
          <Title level={4}>
            <Space>
              {qualityInfo.icon}
              <span style={{ color: qualityInfo.color }}>
                {qualityInfo.level}
              </span>
            </Space>
          </Title>
          <Text type="secondary">{qualityInfo.description}</Text>
        </div>
      </div>

      <div className={styles.suggestionSection}>
        <Title level={5}>改善建议</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          {sleep_suggestion.map((suggestion, index) => (
            <Alert
              key={index}
              message={suggestion}
              type={index === 0 ? "warning" : "info"}
              showIcon
            />
          ))}
        </Space>
      </div>
    </Card>
  );
};

export default SleepQualityAssessment;
