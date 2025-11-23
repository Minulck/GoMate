import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import busReducer from "./slices/busSlice";
import favouritesReducer from "./slices/favouritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bus: busReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
