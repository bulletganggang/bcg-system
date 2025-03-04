import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "@/types/device";

interface DeviceState {
  devices: Device[];
  currentDevice: Device | null;
}

const initialState: DeviceState = {
  devices: [],
  currentDevice: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
      // 如果没有选中的设备且有设备列表，默认选中第一个
      if (!state.currentDevice && action.payload.length > 0) {
        state.currentDevice = action.payload[0];
      }
    },
    setCurrentDevice: (state, action: PayloadAction<Device | null>) => {
      state.currentDevice = action.payload;
    },
    clearDevices: (state) => {
      state.devices = [];
      state.currentDevice = null;
    },
  },
});

export const { setDevices, setCurrentDevice, clearDevices } =
  deviceSlice.actions;

export default deviceSlice.reducer;
