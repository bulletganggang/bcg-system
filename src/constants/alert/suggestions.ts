import { AlertLevel, AlertRuleOperator, AlertRuleType } from "@/types";

/**
 * 预警规则建议
 * 为用户提供常见的预警规则配置建议
 */
export const ruleSuggestions = [
  // 睡眠质量相关
  {
    name: "睡眠质量过低",
    type: AlertRuleType.SLEEP_QUALITY,
    operator: AlertRuleOperator.LESS_THAN,
    threshold: 70,
    level: AlertLevel.MEDIUM,
    description: "睡眠质量评分低于70分时触发预警",
  },
  {
    name: "睡眠质量严重不足",
    type: AlertRuleType.SLEEP_QUALITY,
    operator: AlertRuleOperator.LESS_THAN,
    threshold: 60,
    level: AlertLevel.HIGH,
    description: "睡眠质量评分低于60分时触发预警",
  },

  // 呼吸率相关
  {
    name: "呼吸率过低",
    type: AlertRuleType.RESPIRATORY_RATE,
    operator: AlertRuleOperator.LESS_THAN,
    threshold: 12,
    level: AlertLevel.MEDIUM,
    description: "平均呼吸率低于12次/分钟时触发预警",
  },
  {
    name: "呼吸率过高",
    type: AlertRuleType.RESPIRATORY_RATE,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 20,
    level: AlertLevel.MEDIUM,
    description: "平均呼吸率高于20次/分钟时触发预警",
  },

  // 睡眠阶段相关
  {
    name: "深睡比例不足",
    type: AlertRuleType.DEEP_SLEEP_RATIO,
    operator: AlertRuleOperator.LESS_THAN,
    threshold: 15,
    level: AlertLevel.MEDIUM,
    description: "深睡眠比例低于15%时触发预警",
  },
  {
    name: "REM睡眠不足",
    type: AlertRuleType.REM_SLEEP_RATIO,
    operator: AlertRuleOperator.LESS_THAN,
    threshold: 20,
    level: AlertLevel.MEDIUM,
    description: "REM睡眠比例低于20%时触发预警",
  },

  // 睡眠时长相关
  {
    name: "睡眠时间不足",
    type: AlertRuleType.SLEEP_DURATION,
    operator: AlertRuleOperator.LESS_THAN,
    threshold: 420,
    level: AlertLevel.MEDIUM,
    description: "睡眠时长少于7小时(420分钟)时触发预警",
  },
  {
    name: "睡眠时间过长",
    type: AlertRuleType.SLEEP_DURATION,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 540,
    level: AlertLevel.LOW,
    description: "睡眠时长超过9小时(540分钟)时触发预警",
  },

  // 体动相关
  {
    name: "体动过多",
    type: AlertRuleType.TOTAL_MOVEMENT,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 60,
    level: AlertLevel.MEDIUM,
    description: "体动总时长超过60分钟时触发预警，可能表示睡眠不安稳",
  },
  {
    name: "体动严重过多",
    type: AlertRuleType.TOTAL_MOVEMENT,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 90,
    level: AlertLevel.HIGH,
    description: "体动总时长超过90分钟时触发预警，可能表示睡眠质量差",
  },
  {
    name: "不活跃时间过长",
    type: AlertRuleType.TOTAL_INACTIVITY,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 480,
    level: AlertLevel.MEDIUM,
    description:
      "不活跃总时长超过8小时(480分钟)时触发预警，可能表示睡眠过于沉重",
  },
  {
    name: "体位改变频繁",
    type: AlertRuleType.POSITION_CHANGE,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 30,
    level: AlertLevel.MEDIUM,
    description: "体位改变时长超过30分钟时触发预警，可能表示睡眠不舒适",
  },
  {
    name: "身体变动频繁",
    type: AlertRuleType.BODY_MOVEMENT,
    operator: AlertRuleOperator.GREATER_THAN,
    threshold: 40,
    level: AlertLevel.MEDIUM,
    description: "身体变动时长超过40分钟时触发预警，可能表示睡眠不安稳",
  },
];
