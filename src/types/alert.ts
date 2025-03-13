/**
 * 预警级别枚举
 */
export enum AlertLevel {
  /** 低级别 */
  LOW = "low",
  /** 中级别 */
  MEDIUM = "medium",
  /** 高级别 */
  HIGH = "high",
  /** 紧急级别 */
  URGENT = "urgent",
}

/**
 * 预警规则类型枚举
 */
export enum AlertRuleType {
  /** 睡眠质量 */
  SLEEP_QUALITY = "sleep_quality",
  /** 呼吸率 */
  RESPIRATORY_RATE = "respiratory_rate",
  /** 深睡比例 */
  DEEP_SLEEP_RATIO = "deep_sleep_ratio",
  /** REM睡眠比例 */
  REM_SLEEP_RATIO = "rem_sleep_ratio",
  /** 睡眠时长 */
  SLEEP_DURATION = "sleep_duration",
}

/**
 * 预警规则比较运算符枚举
 */
export enum AlertRuleOperator {
  /** 大于 */
  GREATER_THAN = ">",
  /** 小于 */
  LESS_THAN = "<",
  /** 等于 */
  EQUAL = "=",
  /** 大于等于 */
  GREATER_THAN_OR_EQUAL = ">=",
  /** 小于等于 */
  LESS_THAN_OR_EQUAL = "<=",
  /** 不等于 */
  NOT_EQUAL = "!=",
}

/**
 * 预警规则接口
 */
export interface AlertRule {
  /** 规则ID */
  id: string;
  /** 规则名称 */
  name: string;
  /** 规则类型 */
  type: AlertRuleType;
  /** 比较运算符 */
  operator: AlertRuleOperator;
  /** 阈值 */
  threshold: number;
  /** 预警级别 */
  level: AlertLevel;
  /** 是否启用 */
  enabled: boolean;
  /** 描述 */
  description?: string;
}

/**
 * 预警记录接口
 */
export interface AlertRecord {
  /** 记录ID */
  id: string;
  /** 触发的规则ID */
  ruleId: string;
  /** 规则名称 */
  ruleName: string;
  /** 预警级别 */
  level: AlertLevel;
  /** 触发时间 */
  triggeredAt: number;
  /** 睡眠数据日期 */
  sleepDate: number;
  /** 触发值 */
  triggerValue: number;
  /** 阈值 */
  threshold: number;
  /** 比较运算符 */
  operator: AlertRuleOperator;
  /** 规则类型 */
  type: AlertRuleType;
  /** 设备编码 */
  deviceCode: string;
  /** 处理状态 0-未处理 1-已处理 2-已忽略 */
  status: 0 | 1 | 2;
  /** 处理时间 */
  processedAt?: number;
  /** 处理备注 */
  processNote?: string;
}
