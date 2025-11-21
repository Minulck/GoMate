import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "../../services/api";
import { Destination } from "../../types";

export const fetchDestinations = createAsyncThunk(
  "destinations/fetchDestinations",
  async (
    { limit = 20, skip = 0 }: { limit?: number; skip?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiService.getDestinations(limit, skip);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchDestination = createAsyncThunk(
  "destinations/fetchDestination",
  async (id: number, { rejectWithValue }) => {
    try {
      const destination = await ApiService.getDestination(id);
      return destination;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const searchDestinations = createAsyncThunk(
  "destinations/searchDestinations",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await ApiService.searchDestinations(query);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "destinations/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await ApiService.getCategories();
      return categories;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const destinationsSlice = createSlice({
  name: "destinations",
  initialState: {
    destinations: [] as Destination[],
    currentDestination: null as Destination | null,
    loading: false,
    error: null as string | null,
    categories: [] as string[],
    searchQuery: "",
    selectedCategory: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearCurrentDestination: (state) => {
      state.currentDestination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch destinations
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload.data;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single destination
      .addCase(fetchDestination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDestination = action.payload;
      })
      .addCase(fetchDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search destinations
      .addCase(searchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload.data;
      })
      .addCase(searchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const {
  clearError,
  setSearchQuery,
  setSelectedCategory,
  clearCurrentDestination,
} = destinationsSlice.actions;
export default destinationsSlice.reducer;
