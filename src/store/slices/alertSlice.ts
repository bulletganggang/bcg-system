import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { AlertRule, AlertRecord } from "@/types";

interface AlertState {
  rules: AlertRule[];
  records: AlertRecord[];
}

const initialState: AlertState = {
  rules: [],
  records: [],
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    // 规则相关操作
    setRules: (state, action: PayloadAction<AlertRule[]>) => {
      state.rules = action.payload;
    },
    addRule: (
      state,
      action: PayloadAction<Omit<AlertRule, "id" | "enabled">>
    ) => {
      const newRule = {
        ...action.payload,
        id: uuidv4(),
        enabled: true,
      };
      state.rules.push(newRule);
    },
    updateRule: (state, action: PayloadAction<AlertRule>) => {
      const index = state.rules.findIndex(
        (rule) => rule.id === action.payload.id
      );
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
    },
    deleteRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter((rule) => rule.id !== action.payload);
    },
    toggleRuleStatus: (state, action: PayloadAction<string>) => {
      const rule = state.rules.find((rule) => rule.id === action.payload);
      if (rule) {
        rule.enabled = !rule.enabled;
      }
    },

    // 预警记录相关操作
    addRecord: (state, action: PayloadAction<Omit<AlertRecord, "id">>) => {
      const newRecord = {
        ...action.payload,
        id: uuidv4(),
      };
      state.records.unshift(newRecord);
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(
        (record) => record.id !== action.payload
      );
    },
    updateRecordStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: AlertRecord["status"];
        processNote?: string;
      }>
    ) => {
      const record = state.records.find((r) => r.id === action.payload.id);
      if (record) {
        record.status = action.payload.status;
        record.processedAt = Date.now();
        if (action.payload.processNote) {
          record.processNote = action.payload.processNote;
        }
      }
    },
    clearRecords: (state) => {
      state.records = [];
    },
  },
});

export const {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  toggleRuleStatus,
  addRecord,
  deleteRecord,
  updateRecordStatus,
  clearRecords,
} = alertSlice.actions;

export default alertSlice.reducer;
