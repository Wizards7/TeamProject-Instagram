import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

export const store = configureStore({
  reducer: {
    // Add the single API reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Add the single API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;