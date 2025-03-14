import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import deviceReducer from "./slices/deviceSlice";
import alertReducer from "./slices/alertSlice";

// 配置 persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "device", "alert"], // 持久化 user、device 和 alert reducer
};

// 创建根 reducer
const rootReducer = combineReducers({
  user: userReducer,
  device: deviceReducer,
  alert: alertReducer,
});

// 创建持久化 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
