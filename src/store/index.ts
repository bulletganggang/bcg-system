import { configureStore } from "@reduxjs/toolkit";
import bcgReducer from "./slices/bcgSlice";
import configReducer from "./slices/configSlice";

export const store = configureStore({
  reducer: {
    bcg: bcgReducer,
    config: configReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
