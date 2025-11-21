export interface Destination {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  thumbnail: string;
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

export interface DestinationsState {
  destinations: Destination[];
  currentDestination: Destination | null;
  loading: boolean;
  error: string | null;
  categories: string[];
  searchQuery: string;
  selectedCategory: string | null;
}

export interface FavouritesState {
  favourites: Destination[];
}

export interface RootState {
  auth: AuthState;
  destinations: DestinationsState;
  favourites: FavouritesState;
}

export interface NavigationProps {
  navigation: any;
  route?: any;
}