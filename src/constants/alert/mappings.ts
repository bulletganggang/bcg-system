import { AlertLevel, AlertRuleType, AlertRuleOperator } from "@/types";

/**
 * 预警级别颜色枚举
 */
export enum AlertLevelColor {
  LOW = "blue",
  MEDIUM = "orange",
  HIGH = "red",
  URGENT = "purple",
}

/**
 * 预警级别文本枚举
 */
export enum AlertLevelText {
  LOW = "低",
  MEDIUM = "中",
  HIGH = "高",
  URGENT = "紧急",
}

/**
 * 预警规则类型文本枚举
 */
export enum AlertRuleTypeText {
  SLEEP_QUALITY = "睡眠质量",
  RESPIRATORY_RATE = "平均呼吸率",
  DEEP_SLEEP_RATIO = "深睡比例",
  REM_SLEEP_RATIO = "REM睡眠比例",
  SLEEP_DURATION = "睡眠时长",
}

/**
 * 预警规则比较运算符文本枚举
 */
export enum AlertRuleOperatorText {
  GREATER_THAN = "大于",
  LESS_THAN = "小于",
  EQUAL = "等于",
  GREATER_THAN_OR_EQUAL = "大于等于",
  LESS_THAN_OR_EQUAL = "小于等于",
  NOT_EQUAL = "不等于",
}

/**
 * 预警规则单位枚举
 */
export enum AlertRuleUnit {
  SLEEP_QUALITY = "分",
  RESPIRATORY_RATE = "次/分钟",
  DEEP_SLEEP_RATIO = "%",
  REM_SLEEP_RATIO = "%",
  SLEEP_DURATION = "分钟",
}

/**
 * 预警级别颜色映射
 */
export const levelColorMap: Record<AlertLevel, AlertLevelColor> = {
  [AlertLevel.LOW]: AlertLevelColor.LOW,
  [AlertLevel.MEDIUM]: AlertLevelColor.MEDIUM,
  [AlertLevel.HIGH]: AlertLevelColor.HIGH,
  [AlertLevel.URGENT]: AlertLevelColor.URGENT,
};

/**
 * 预警级别文本映射
 */
export const levelTextMap: Record<AlertLevel, AlertLevelText> = {
  [AlertLevel.LOW]: AlertLevelText.LOW,
  [AlertLevel.MEDIUM]: AlertLevelText.MEDIUM,
  [AlertLevel.HIGH]: AlertLevelText.HIGH,
  [AlertLevel.URGENT]: AlertLevelText.URGENT,
};

/**
 * 预警规则类型文本映射
 */
export const ruleTypeTextMap: Record<AlertRuleType, AlertRuleTypeText> = {
  [AlertRuleType.SLEEP_QUALITY]: AlertRuleTypeText.SLEEP_QUALITY,
  [AlertRuleType.RESPIRATORY_RATE]: AlertRuleTypeText.RESPIRATORY_RATE,
  [AlertRuleType.DEEP_SLEEP_RATIO]: AlertRuleTypeText.DEEP_SLEEP_RATIO,
  [AlertRuleType.REM_SLEEP_RATIO]: AlertRuleTypeText.REM_SLEEP_RATIO,
  [AlertRuleType.SLEEP_DURATION]: AlertRuleTypeText.SLEEP_DURATION,
};

/**
 * 预警规则比较运算符文本映射
 */
export const operatorTextMap: Record<AlertRuleOperator, AlertRuleOperatorText> =
  {
    [AlertRuleOperator.GREATER_THAN]: AlertRuleOperatorText.GREATER_THAN,
    [AlertRuleOperator.LESS_THAN]: AlertRuleOperatorText.LESS_THAN,
    [AlertRuleOperator.EQUAL]: AlertRuleOperatorText.EQUAL,
    [AlertRuleOperator.GREATER_THAN_OR_EQUAL]:
      AlertRuleOperatorText.GREATER_THAN_OR_EQUAL,
    [AlertRuleOperator.LESS_THAN_OR_EQUAL]:
      AlertRuleOperatorText.LESS_THAN_OR_EQUAL,
    [AlertRuleOperator.NOT_EQUAL]: AlertRuleOperatorText.NOT_EQUAL,
  };

/**
 * 预警规则单位映射
 */
export const ruleUnitMap: Record<AlertRuleType, AlertRuleUnit> = {
  [AlertRuleType.SLEEP_QUALITY]: AlertRuleUnit.SLEEP_QUALITY,
  [AlertRuleType.RESPIRATORY_RATE]: AlertRuleUnit.RESPIRATORY_RATE,
  [AlertRuleType.DEEP_SLEEP_RATIO]: AlertRuleUnit.DEEP_SLEEP_RATIO,
  [AlertRuleType.REM_SLEEP_RATIO]: AlertRuleUnit.REM_SLEEP_RATIO,
  [AlertRuleType.SLEEP_DURATION]: AlertRuleUnit.SLEEP_DURATION,
};
