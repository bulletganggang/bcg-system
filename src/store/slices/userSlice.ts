import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "@/types";

interface UserState extends UserInfo {
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: "",
  name: "",
  phone: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      Object.assign(state, action.payload);
    },
    clearUserInfo: () => initialState,
  },
});

export const { setUserInfo, updateUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
