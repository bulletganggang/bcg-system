import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserConfig, ChartConfig } from "../../types";

interface ConfigState {
  /** 用户配置 */
  userConfig: UserConfig;
  /** 图表配置 */
  chartConfig: ChartConfig;
  /** 主题模式 */
  theme: "light" | "dark";
}

const initialState: ConfigState = {
  userConfig: {
    sampleRate: 100,
    timeRange: 10,
    showGrid: true,
    autoScale: true,
  },
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
    // 更新用户配置
    updateUserConfig: (state, action: PayloadAction<Partial<UserConfig>>) => {
      state.userConfig = {
        ...state.userConfig,
        ...action.payload,
      };
    },
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
      state.userConfig = initialState.userConfig;
      state.chartConfig = initialState.chartConfig;
    },
  },
});

export const { updateUserConfig, updateChartConfig, toggleTheme, resetConfig } =
  configSlice.actions;

export default configSlice.reducer;
