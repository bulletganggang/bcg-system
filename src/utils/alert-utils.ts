import { v4 as uuidv4 } from "uuid";
import {
  AlertRule,
  AlertRuleOperator,
  AlertRuleType,
  SleepData,
  AlertRecord,
} from "@/types";

/**
 * 评估预警条件
 * @param value 待评估的值
 * @param operator 比较运算符
 * @param threshold 阈值
 * @returns 是否满足条件
 */
export const evaluateCondition = (
  value: number,
  operator: AlertRuleOperator,
  threshold: number
): boolean => {
  switch (operator) {
    case AlertRuleOperator.GREATER_THAN:
      return value > threshold;
    case AlertRuleOperator.LESS_THAN:
      return value < threshold;
    case AlertRuleOperator.EQUAL:
      return value === threshold;
    case AlertRuleOperator.GREATER_THAN_OR_EQUAL:
      return value >= threshold;
    case AlertRuleOperator.LESS_THAN_OR_EQUAL:
      return value <= threshold;
    case AlertRuleOperator.NOT_EQUAL:
      return value !== threshold;
    default:
      return false;
  }
};

/**
 * 获取需要检测的数值
 * @param data 睡眠数据
 * @param ruleType 规则类型
 * @returns 需要检测的数值
 */
const getValueToCheck = (data: SleepData, ruleType: AlertRuleType): number => {
  switch (ruleType) {
    case AlertRuleType.SLEEP_QUALITY:
      return data.sleep_quality_score;
    case AlertRuleType.RESPIRATORY_RATE:
      return data.respiratory_rate.average_bpm;
    case AlertRuleType.DEEP_SLEEP_RATIO: {
      const totalSleepMinutes =
        data.sleep_summary_data.total_sleep_duration_minutes;
      if (totalSleepMinutes === 0) return 0;
      return (
        (data.sleep_summary_data.deep_sleep_overall_minutes /
          totalSleepMinutes) *
        100
      );
    }
    case AlertRuleType.REM_SLEEP_RATIO: {
      const totalSleepMinutes =
        data.sleep_summary_data.total_sleep_duration_minutes;
      if (totalSleepMinutes === 0) return 0;
      return (
        (data.sleep_summary_data.rem_sleep_overall_minutes /
          totalSleepMinutes) *
        100
      );
    }
    case AlertRuleType.SLEEP_DURATION:
      return data.sleep_summary_data.total_sleep_duration_minutes;
    case AlertRuleType.TOTAL_MOVEMENT:
      return data.movement.total_movement_duration_minutes;
    case AlertRuleType.TOTAL_INACTIVITY:
      return data.movement.total_inactivity_duration_minutes;
    case AlertRuleType.POSITION_CHANGE: {
      const positionChange = data.movement.movement_types.find(
        (type) => type.type === "Position Change"
      );
      return positionChange?.duration_minutes || 0;
    }
    case AlertRuleType.BODY_MOVEMENT: {
      const bodyMovement = data.movement.movement_types.find(
        (type) => type.type === "Body Movement"
      );
      return bodyMovement?.duration_minutes || 0;
    }
    default:
      return 0;
  }
};

/**
 * 检查预警规则
 * @param data 睡眠数据
 * @param rules 预警规则列表
 * @param existingRecords 当前已有的预警记录
 * @returns 触发的预警记录列表
 */
export const checkAlertRules = (
  data: SleepData,
  rules: AlertRule[],
  existingRecords: AlertRecord[]
) => {
  const triggeredAlerts = rules
    .filter((rule) => rule.enabled)
    .filter((rule) => {
      // 检查是否已经存在相同日期、相同规则的预警记录
      // 规则名称、监控指标、比较运算符、阈值、预警级别中任一不同，都视为新的预警
      return !existingRecords.some(
        (record) =>
          record.sleepDate === data.timestamp * 1000 &&
          record.ruleName === rule.name &&
          record.type === rule.type &&
          record.operator === rule.operator &&
          record.threshold === rule.threshold &&
          record.level === rule.level
      );
    })
    .map((rule) => {
      const value = getValueToCheck(data, rule.type);

      if (evaluateCondition(value, rule.operator, rule.threshold)) {
        return {
          id: uuidv4(),
          ruleId: rule.id,
          ruleName: rule.name,
          level: rule.level,
          triggeredAt: Date.now(),
          sleepDate: data.timestamp * 1000,
          triggerValue: value,
          threshold: rule.threshold,
          operator: rule.operator,
          type: rule.type,
          deviceCode: data.device_code,
          status: 0 as const,
        };
      }
      return null;
    })
    .filter((alert): alert is NonNullable<typeof alert> => alert !== null);

  return triggeredAlerts;
};
