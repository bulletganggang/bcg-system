import React from "react";
import { Alert } from "antd";
import type { SleepData } from "@/types";
import styles from "./style.module.scss";

interface RespiratoryRateAlertProps {
  respiratoryRate: SleepData["respiratory_rate"];
}

/**
 * 获取呼吸率异常检测结果
 */
const getRespiratoryRateAlert = (
  respiratoryRate: SleepData["respiratory_rate"]
) => {
  const issues: string[] = [];
  let maxSeverity: "warning" | "error" = "warning";

  // 检查最低呼吸率
  if (respiratoryRate.minimum_bpm < 10) {
    issues.push(
      `最低呼吸率（${respiratoryRate.minimum_bpm}次/分钟）严重偏低，可能存在呼吸抑制`
    );
    maxSeverity = "error";
  } else if (respiratoryRate.minimum_bpm < 12) {
    issues.push(`最低呼吸率（${respiratoryRate.minimum_bpm}次/分钟）偏低`);
  }

  // 检查平均呼吸率
  if (respiratoryRate.average_bpm < 10 || respiratoryRate.average_bpm > 24) {
    issues.push(
      `平均呼吸率（${respiratoryRate.average_bpm}次/分钟）${
        respiratoryRate.average_bpm < 10 ? "严重偏低" : "严重偏高"
      }`
    );
    maxSeverity = "error";
  } else if (
    respiratoryRate.average_bpm < 12 ||
    respiratoryRate.average_bpm > 20
  ) {
    issues.push(
      `平均呼吸率（${respiratoryRate.average_bpm}次/分钟）${
        respiratoryRate.average_bpm < 12 ? "偏低" : "偏高"
      }`
    );
  }

  // 检查最高呼吸率
  if (respiratoryRate.maximum_bpm > 24) {
    issues.push(
      `最高呼吸率（${respiratoryRate.maximum_bpm}次/分钟）严重偏高，可能存在呼吸急促`
    );
    maxSeverity = "error";
  } else if (respiratoryRate.maximum_bpm > 20) {
    issues.push(`最高呼吸率（${respiratoryRate.maximum_bpm}次/分钟）偏高`);
  }

  if (issues.length === 0) return null;

  return {
    type: maxSeverity,
    message: "检测到呼吸率异常",
    description: issues.join("；"),
  };
};

/**
 * 呼吸率异常检测提示组件
 */
const RespiratoryRateAlert: React.FC<RespiratoryRateAlertProps> = ({
  respiratoryRate,
}) => {
  const alertInfo = getRespiratoryRateAlert(respiratoryRate);

  if (!alertInfo) return null;

  return (
    <Alert
      className={styles.alert}
      type={alertInfo.type}
      message={alertInfo.message}
      description={alertInfo.description}
      showIcon
    />
  );
};

export default RespiratoryRateAlert;
