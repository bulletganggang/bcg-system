import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BCGData, HealthStatus } from "../../types";

interface BCGState {
  /** BCG数据列表 */
  data: BCGData[];
  /** 健康状态 */
  healthStatus: HealthStatus | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 是否已连接 */
  connected: boolean;
}

const initialState: BCGState = {
  data: [],
  healthStatus: null,
  loading: false,
  error: null,
  connected: false,
};

export const bcgSlice = createSlice({
  name: "bcg",
  initialState,
  reducers: {
    // 添加BCG数据
    addBCGData: (state, action: PayloadAction<BCGData>) => {
      state.data.push(action.payload);
      // 保持数据量在1000个以内
      if (state.data.length > 1000) {
        state.data = state.data.slice(-1000);
      }
    },
    // 更新健康状态
    updateHealthStatus: (state, action: PayloadAction<HealthStatus>) => {
      state.healthStatus = action.payload;
    },
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // 设置错误信息
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // 设置连接状态
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    // 清除数据
    clearData: (state) => {
      state.data = [];
      state.healthStatus = null;
      state.error = null;
    },
  },
});

export const {
  addBCGData,
  updateHealthStatus,
  setLoading,
  setError,
  setConnected,
  clearData,
} = bcgSlice.actions;

export default bcgSlice.reducer;
