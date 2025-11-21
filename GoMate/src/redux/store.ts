import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import destinationsReducer from "./slices/destinationsSlice";
import favouritesReducer from "./slices/favouritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationsReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
