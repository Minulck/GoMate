import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusStop } from "../../types";

const FAVOURITES_KEY = "favourites";

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [] as BusStop[],
  },
  reducers: {
    setFavourites: (state, action: PayloadAction<BusStop[]>) => {
      state.favourites = action.payload;
    },
    addToFavourites: (state, action: PayloadAction<BusStop>) => {
      const exists = state.favourites.find(
        (item) => item.atcocode === action.payload.atcocode
      );
      if (!exists) {
        state.favourites.push(action.payload);
        AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
      }
    },
    removeFromFavourites: (state, action: PayloadAction<string>) => {
      state.favourites = state.favourites.filter(
        (item) => item.atcocode !== action.payload
      );
      AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
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
      AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
    },
    loadFavourites: (state) => {
      AsyncStorage.getItem(FAVOURITES_KEY).then((stored) => {
        if (stored) {
          const favourites = JSON.parse(stored);
          state.favourites = favourites;
        }
      });
    },
  },
});

export const {
  setFavourites,
  addToFavourites,
  removeFromFavourites,
  toggleFavourite,
  loadFavourites,
} = favouritesSlice.actions;
export default favouritesSlice.reducer;
