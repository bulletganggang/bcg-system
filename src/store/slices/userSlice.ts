import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  avatar?: string;
}

const initialState: UserState = {
  name: "",
  avatar: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserBasicInfo: (
      state,
      action: PayloadAction<{ name: string; avatar?: string }>
    ) => {
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { setUserBasicInfo, updateUserName, updateUserAvatar } =
  userSlice.actions;

export default userSlice.reducer;
