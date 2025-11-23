import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/api";
import { LoginCredentials, User } from "../../types";
import { AsyncStorageWrapper } from "../../utils/asyncStorage";

// Async thunk for login
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await ApiService.login(credentials);
      await AsyncStorageWrapper.setItem("token", user.token);
      await AsyncStorageWrapper.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for checking auth status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorageWrapper.getItem("token");
      const userStr = await AsyncStorageWrapper.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        return { user, token };
      } else {
        throw new Error("No token or user data");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorageWrapper.removeItem("token");
      AsyncStorageWrapper.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
