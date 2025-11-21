import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Destination } from '../../types';

const FAVOURITES_KEY = 'favourites';

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: {
    favourites: [] as Destination[],
  },
  reducers: {
    setFavourites: (state, action: PayloadAction<Destination[]>) => {
      state.favourites = action.payload;
    },
    addToFavourites: (state, action: PayloadAction<Destination>) => {
      const exists = state.favourites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favourites.push(action.payload);
        AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
      }
    },
    removeFromFavourites: (state, action: PayloadAction<number>) => {
      state.favourites = state.favourites.filter(item => item.id !== action.payload);
      AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(state.favourites));
    },
    toggleFavourite: (state, action: PayloadAction<Destination>) => {
      const exists = state.favourites.find(item => item.id === action.payload.id);
      if (exists) {
        state.favourites = state.favourites.filter(item => item.id !== action.payload.id);
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

export const { setFavourites, addToFavourites, removeFromFavourites, toggleFavourite, loadFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;