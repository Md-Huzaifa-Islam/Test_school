import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./api/authApi";
import { assessmentApi } from "./api/assessmentApi";
import authSlice from "./slices/authSlice";
import assessmentSlice from "./slices/assessmentSlice";
import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice";
import uiSlice from "./slices/uiSlice";

// Redux persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui"], // Only persist auth and ui state
  blacklist: ["api", "assessmentApi"], // Don't persist API cache
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  assessment: assessmentSlice,
  user: userSlice,
  notifications: notificationSlice,
  ui: uiSlice,
  [authApi.reducerPath]: authApi.reducer,
  [assessmentApi.reducerPath]: assessmentApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(authApi.middleware)
      .concat(assessmentApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export { useAppDispatch, useAppSelector } from "./hooks";
