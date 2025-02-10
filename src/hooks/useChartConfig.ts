import { useState, useCallback, useMemo } from "react";
import type { ChartConfig } from "../types";
import type { EChartsOption } from "echarts";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

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
  // 从Redux获取配置
  const chartConfig = useSelector(
    (state: RootState) => state.config.chartConfig
  );
  const userConfig = useSelector((state: RootState) => state.config.userConfig);

  // 默认配置
  const defaultConfig: ChartConfig = {
    type: "line",
    showLabel: true,
    zoomable: true,
  };

  const [config, setConfig] = useState<ChartConfig>({
    ...defaultConfig,
    ...chartConfig,
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
        show: chartConfig.showLabel,
        top: 10,
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: userConfig.showGrid,
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: userConfig.showGrid,
        },
        scale: userConfig.autoScale,
      },
      dataZoom: chartConfig.zoomable
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
  }, [config.type, chartConfig, userConfig]);

  return {
    config,
    updateConfig,
    echartsOption,
  };
}
