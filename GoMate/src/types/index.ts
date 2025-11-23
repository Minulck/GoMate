export interface BusStop {
  atcocode: string;
  name: string;
  locality: string;
  timing_point: boolean;
  time?: string;
  latitude?: number;
  longitude?: number;
}

export interface BusService {
  id: string;
  operator: {
    code: string;
    name: string;
  };
  line: string;
  line_name: string;
  directions: Direction[];
}

export interface Direction {
  name: "inbound" | "outbound";
  destination: { description: string };
  journey_patterns?: JourneyPattern[];
}

export interface JourneyPattern {
  stops: { atcocode: string }[];
  count: number;
}

export interface Departure {
  line: string;
  direction: string;
  operator: string;
  aimed_departure_time: string;
  expected_departure_time?: string;
  best_departure_estimate?: string;
  source: string;
  mode: string;
  operator_name: string;
  service_timetable?: {
    id: string;
  };
}

export interface StopTimetable {
  atcocode: string;
  name: string;
  locality: string;
  departures: Departure[];
}

export interface JourneyTimetable {
  operator: string;
  line: string;
  direction: string;
  stops: BusStop[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface BusState {
  stops: BusStop[];
  currentStop: BusStop | null;
  services: BusService[];
  currentService: BusService | null;
  timetable: StopTimetable | null;
  journeyTimetable: JourneyTimetable | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export interface FavouritesState {
  favourites: BusStop[];
}

export interface RootState {
  auth: AuthState;
  bus: BusState;
  favourites: FavouritesState;
}

export interface NavigationProps {
  navigation: any;
  route?: any;
}
