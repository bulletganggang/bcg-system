import React from "react";
import { Alert } from "antd";
import type { ComparisonData } from "@/types";
import styles from "./style.module.scss";

interface ComparisonReportProps {
  comparisonData: ComparisonData[];
}

/**
 * 数据对比报告组件
 */
const ComparisonReport: React.FC<ComparisonReportProps> = ({
  comparisonData,
}) => {
  if (comparisonData.length !== 2) return null;

  try {
    const [data1, data2] = comparisonData;
    const qualityDiff =
      data2.data.sleep_quality_score - data1.data.sleep_quality_score;
    const durationDiff =
      data2.data.sleep_summary_data.total_sleep_duration_minutes -
      data1.data.sleep_summary_data.total_sleep_duration_minutes;

    const messages = [];
    const type = Math.abs(qualityDiff) > 10 ? "warning" : "info";

    // 睡眠质量差异分析
    messages.push(
      `睡眠质量: ${data2.date}的睡眠评分${
        qualityDiff > 0 ? "提高了" : "下降了"
      }${Math.abs(qualityDiff).toFixed(1)}分`
    );

    // 睡眠时长差异分析
    messages.push(
      `睡眠时长: ${durationDiff > 0 ? "增加了" : "减少了"}${Math.abs(
        durationDiff
      )}分钟`
    );

    // 睡眠阶段差异分析
    const stageDiff = {
      light:
        data2.data.sleep_summary_data.light_sleep_overall_minutes -
        data1.data.sleep_summary_data.light_sleep_overall_minutes,
      deep:
        data2.data.sleep_summary_data.deep_sleep_overall_minutes -
        data1.data.sleep_summary_data.deep_sleep_overall_minutes,
      rem:
        data2.data.sleep_summary_data.rem_sleep_overall_minutes -
        data1.data.sleep_summary_data.rem_sleep_overall_minutes,
    };

    messages.push(
      `睡眠阶段变化: 浅睡${stageDiff.light > 0 ? "增加" : "减少"}${Math.abs(
        stageDiff.light
      )}分钟，深睡${stageDiff.deep > 0 ? "增加" : "减少"}${Math.abs(
        stageDiff.deep
      )}分钟，REM${stageDiff.rem > 0 ? "增加" : "减少"}${Math.abs(
        stageDiff.rem
      )}分钟`
    );

    // 体动数据差异分析
    const movementDiff = {
      inactivity:
        data2.data.movement.total_inactivity_duration_minutes -
        data1.data.movement.total_inactivity_duration_minutes,
      totalMovement:
        data2.data.movement.total_movement_duration_minutes -
        data1.data.movement.total_movement_duration_minutes,
      bodyMovement:
        (data2.data.movement.movement_types.find(
          (type) => type.type === "Body Movement"
        )?.duration_minutes || 0) -
        (data1.data.movement.movement_types.find(
          (type) => type.type === "Body Movement"
        )?.duration_minutes || 0),
      positionChange:
        (data2.data.movement.movement_types.find(
          (type) => type.type === "Position Change"
        )?.duration_minutes || 0) -
        (data1.data.movement.movement_types.find(
          (type) => type.type === "Position Change"
        )?.duration_minutes || 0),
    };

    messages.push(
      `体动变化: 不活跃时长${
        movementDiff.inactivity > 0 ? "增加" : "减少"
      }${Math.abs(movementDiff.inactivity)}分钟，体动总时长${
        movementDiff.totalMovement > 0 ? "增加" : "减少"
      }${Math.abs(movementDiff.totalMovement)}分钟`
    );

    return (
      <Alert
        className={styles.report}
        type={type}
        message="差异分析报告"
        description={messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
        showIcon
      />
    );
  } catch (error) {
    console.error("生成报告时出错:", error);
    return (
      <Alert
        type="error"
        message="生成报告失败"
        description="处理数据时发生错误，请确保选择的日期数据完整。"
        showIcon
      />
    );
  }
};

export default ComparisonReport;
