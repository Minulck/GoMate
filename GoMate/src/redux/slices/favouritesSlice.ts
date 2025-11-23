import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper } from "../../utils/asyncStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusStop } from "../../types";

const FAVOURITES_KEY = "favourites";

export const loadFavourites = createAsyncThunk(
  "favourites/loadFavourites",
  async () => {
    const stored = await AsyncStorageWrapper.getItem(FAVOURITES_KEY);
    if (stored) {
      return JSON.parse(stored) as BusStop[];
    }
    return [] as BusStop[];
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [] as BusStop[],
    loading: false,
  },
  reducers: {
    setFavourites: (state, action: PayloadAction<BusStop[]>) => {
      state.favourites = action.payload;
      AsyncStorageWrapper.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
    },
    addToFavourites: (state, action: PayloadAction<BusStop>) => {
      const exists = state.favourites.find(
        (item) => item.atcocode === action.payload.atcocode
      );
      if (!exists) {
        state.favourites.push(action.payload);
        AsyncStorageWrapper.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
      }
    },
    removeFromFavourites: (state, action: PayloadAction<string>) => {
      state.favourites = state.favourites.filter(
        (item) => item.atcocode !== action.payload
      );
      AsyncStorageWrapper.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
    },
    toggleFavourite: (state, action: PayloadAction<BusStop>) => {
      const exists = state.favourites.find(
        (item) => item.atcocode === action.payload.atcocode
      );
      if (exists) {
        state.favourites = state.favourites.filter(
          (item) => item.atcocode !== action.payload.atcocode
        );
      } else {
        state.favourites.push(action.payload);
      }
      AsyncStorageWrapper.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavourites.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(loadFavourites.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setFavourites,
  addToFavourites,
  removeFromFavourites,
  toggleFavourite,
} = favouritesSlice.actions;
export default favouritesSlice.reducer;
