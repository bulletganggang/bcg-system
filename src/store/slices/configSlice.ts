import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ChartConfig } from "../../types";

interface ConfigState {
  /** 图表配置 */
  chartConfig: ChartConfig;
  /** 主题模式 */
  theme: "light" | "dark";
}

const initialState: ConfigState = {
  chartConfig: {
    type: "line",
    showLabel: true,
    zoomable: true,
  },
  theme: "light",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    // 更新图表配置
    updateChartConfig: (state, action: PayloadAction<Partial<ChartConfig>>) => {
      state.chartConfig = {
        ...state.chartConfig,
        ...action.payload,
      };
    },
    // 切换主题
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    // 重置配置
    resetConfig: (state) => {
      state.chartConfig = initialState.chartConfig;
    },
  },
});

export const { updateChartConfig, toggleTheme, resetConfig } =
  configSlice.actions;

export default configSlice.reducer;
