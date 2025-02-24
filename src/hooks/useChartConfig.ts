import { useState, useCallback, useMemo } from "react";
import type { ChartConfig } from "../types";
import type { EChartsOption } from "echarts";

interface UseChartConfigProps {
  /** 初始配置 */
  initialConfig?: Partial<ChartConfig>;
}

interface UseChartConfigReturn {
  /** 图表配置 */
  config: ChartConfig;
  /** 更新配置 */
  updateConfig: (newConfig: Partial<ChartConfig>) => void;
  /** ECharts配置项 */
  echartsOption: EChartsOption;
}

/**
 * 图表配置Hook
 * @param props 配置参数
 * @returns Hook返回值
 */
export function useChartConfig({
  initialConfig,
}: UseChartConfigProps = {}): UseChartConfigReturn {
  // 默认配置
  const defaultConfig: ChartConfig = {
    type: "line",
    showLabel: true,
    zoomable: true,
  };

  const [config, setConfig] = useState<ChartConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<ChartConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  }, []);

  // 生成ECharts配置项
  const echartsOption = useMemo((): EChartsOption => {
    const baseOption: EChartsOption = {
      animation: false,
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        show: config.showLabel,
        top: 10,
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: true,
        },
        scale: true,
      },
      dataZoom: config.zoomable
        ? [
            {
              type: "inside",
              start: 0,
              end: 100,
            },
            {
              start: 0,
              end: 100,
            },
          ]
        : undefined,
      series: [
        {
          type: config.type,
          emphasis: {
            focus: "series",
          },
          lineStyle: {
            width: 1,
          },
        },
      ],
    };

    return baseOption;
  }, [config]);

  return {
    config,
    updateConfig,
    echartsOption,
  };
}
