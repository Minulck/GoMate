import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "../../services/api";
import {
  BusService,
  BusStop,
  JourneyTimetable,
  StopTimetable,
} from "../../types";

export const fetchBusStops = createAsyncThunk(
  "bus/fetchBusStops",
  async (_, { rejectWithValue }) => {
    try {
      const stops = await ApiService.getBusStops();
      return stops;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const searchBusStops = createAsyncThunk(
  "bus/searchBusStops",
  async (query: string, { rejectWithValue }) => {
    try {
      const stops = await ApiService.searchBusStops(query);
      return stops;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchStopTimetable = createAsyncThunk(
  "bus/fetchStopTimetable",
  async (atcocode: string, { rejectWithValue }) => {
    try {
      const timetable = await ApiService.getStopTimetable(atcocode);
      return timetable;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const searchBusServices = createAsyncThunk(
  "bus/searchBusServices",
  async (
    { operator, line }: { operator: string; line: string },
    { rejectWithValue }
  ) => {
    try {
      const services = await ApiService.searchBusServices(operator, line);
      return services;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchJourneyTimetable = createAsyncThunk(
  "bus/fetchJourneyTimetable",
  async (
    {
      operator,
      line,
      direction,
    }: { operator: string; line: string; direction: "inbound" | "outbound" },
    { rejectWithValue }
  ) => {
    try {
      const timetable = await ApiService.getJourneyTimetable(
        operator,
        line,
        direction
      );
      return timetable;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchJourneyPatterns = createAsyncThunk(
  "bus/fetchJourneyPatterns",
  async (serviceId: string, { rejectWithValue }) => {
    try {
      const service = await ApiService.getJourneyPatterns(serviceId);
      return service;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const busSlice = createSlice({
  name: "bus",
  initialState: {
    stops: [] as BusStop[],
    currentStop: null as BusStop | null,
    services: [] as BusService[],
    currentService: null as BusService | null,
    timetable: null as StopTimetable | null,
    journeyTimetable: null as JourneyTimetable | null,
    loading: false,
    error: null as string | null,
    searchQuery: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearCurrentStop: (state) => {
      state.currentStop = null;
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearTimetable: (state) => {
      state.timetable = null;
    },
    clearJourneyTimetable: (state) => {
      state.journeyTimetable = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bus stops
      .addCase(fetchBusStops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusStops.fulfilled, (state, action) => {
        state.loading = false;
        state.stops = action.payload;
      })
      .addCase(fetchBusStops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search bus stops
      .addCase(searchBusStops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBusStops.fulfilled, (state, action) => {
        state.loading = false;
        state.stops = action.payload;
      })
      .addCase(searchBusStops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stop timetable
      .addCase(fetchStopTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStopTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
      })
      .addCase(fetchStopTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search bus services
      .addCase(searchBusServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBusServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(searchBusServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch journey timetable
      .addCase(fetchJourneyTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJourneyTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.journeyTimetable = action.payload;
      })
      .addCase(fetchJourneyTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch journey patterns
      .addCase(fetchJourneyPatterns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJourneyPatterns.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchJourneyPatterns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSearchQuery,
  clearCurrentStop,
  clearCurrentService,
  clearTimetable,
  clearJourneyTimetable,
} = busSlice.actions;
export default busSlice.reducer;
