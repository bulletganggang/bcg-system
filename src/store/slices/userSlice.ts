import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "@/types";

const initialState: UserInfo = {
  userId: undefined,
  username: "",
  phone: "",
  avatar: undefined,
  gender: 0,
  weight: undefined,
  height: undefined,
  birthday: undefined,
  role: undefined,
  isFirstLogin: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      return { ...state, ...action.payload };
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      Object.assign(state, action.payload);
    },
    clearUserInfo: () => initialState,
  },
});

export const { setUserInfo, updateUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
