/**
 * GoMate Travel & Transport API Service
 *
 * This service handles all API interactions for the GoMate travel application.
 * It uses TransportAPI (https://transportapi.com/) as the backend for real bus data.
 *
 * Features:
 * - User authentication (login/register)
 * - Fetch bus stop timetables
 * - Search bus services
 * - Get journey timetables
 * - Get journey patterns (ladder view)
 * - Comprehensive error handling
 *
 * API Endpoints Used:
 * - POST /auth/login - User authentication
 * - GET /auth/me - Get current user
 * - GET /v3/uk/bus/stop_timetables/{atcocode}.json - Get upcoming departures from a bus stop
 * - GET /v3/uk/bus/route/{operator}/{line}/{direction}/timetable.json - Get journey timetable for a specific bus
 * - GET /v3/uk/bus/services.json - Search bus services by operator code and line
 * - GET /v3/uk/bus/services/{service_id}.json - Get all journey patterns (ladder view) for a service
 */
const API_BASE_URL = "https://transportapi.com/v3/uk/bus";
const DUMMYJSON_BASE_URL = "https://dummyjson.com";

// TODO: Replace with your actual TransportAPI credentials
// Get them from https://developer.transportapi.com/
const APP_ID = "d3f7ee26";
const APP_KEY = "c3772544958beef9e83f80a46146f3e0";

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

export interface ApiResponse<T> {
  data: T;
  total?: number;
  skip?: number;
  limit?: number;
}

class ApiService {
  // Authentication endpoints
  async login({ username, password }: LoginCredentials): Promise<User> {
    const response = await fetch(`${DUMMYJSON_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    return response.json();
  }

  async getUser(token: string): Promise<User> {
    const response = await fetch(`${DUMMYJSON_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  }

  // Bus data endpoints using TransportAPI
  async getStopTimetable(atcocode: string): Promise<StopTimetable> {
    try {
      const url = `${API_BASE_URL}/stop_timetables/${atcocode}.json?app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("API usage limits exceeded. Using demo data.");
        }
        throw new Error(
          `Failed to fetch stop timetable: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        atcocode: data.atcocode,
        name: data.name,
        locality: data.locality,
        departures: data.departures?.all || [],
      };
    } catch (error) {
      console.error("Error fetching stop timetable:", error);
      // Fallback to dummy data
      const dummyDepartures: Departure[] = [
        {
          line: "15",
          direction: "Oxford Circus",
          operator: "CT",
          aimed_departure_time: "12:30",
          expected_departure_time: "12:32",
          source: "Timetable",
          mode: "bus",
          operator_name: "Arriva London",
        },
        {
          line: "73",
          direction: "Victoria",
          operator: "CT",
          aimed_departure_time: "12:35",
          expected_departure_time: "12:35",
          source: "Timetable",
          mode: "bus",
          operator_name: "Arriva London",
        },
        {
          line: "390",
          direction: "Archway",
          operator: "CT",
          aimed_departure_time: "12:40",
          expected_departure_time: "12:40",
          source: "Timetable",
          mode: "bus",
          operator_name: "Arriva London",
        },
      ];
      return {
        atcocode,
        name: "Demo Bus Stop",
        locality: "London",
        departures: dummyDepartures,
      };
    }
  }

  async searchBusServices(
    operator: string,
    line: string
  ): Promise<BusService[]> {
    try {
      const url = `${API_BASE_URL}/services.json?operator=${operator}&line_name=${line}&app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to search bus services: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.member || [];
    } catch (error) {
      console.error("Error searching bus services:", error);
      throw new Error("Unable to search bus services. Please try again.");
    }
  }

  async getJourneyTimetable(
    operator: string,
    line: string,
    direction: "inbound" | "outbound"
  ): Promise<JourneyTimetable> {
    try {
      const url = `${API_BASE_URL}/route/${operator}/${line}/${direction}/timetable.json?app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch journey timetable: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        operator,
        line,
        direction,
        stops: data.stops || [],
      };
    } catch (error) {
      console.error("Error fetching journey timetable:", error);
      throw new Error("Unable to load journey timetable.");
    }
  }

  async getJourneyPatterns(serviceId: string): Promise<BusService> {
    try {
      const url = `${API_BASE_URL}/services/${serviceId}.json?journey_patterns=true&app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch journey patterns: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        id: serviceId,
        operator: data.operator,
        line: data.line,
        line_name: data.line_name,
        directions: data.directions || [],
      };
    } catch (error) {
      console.error("Error fetching journey patterns:", error);
      throw new Error("Unable to load journey patterns.");
    }
  }

  // For initial data, we'll fetch real bus stops from TransportAPI
  async getBusStops(): Promise<BusStop[]> {
    try {
      const url = `https://transportapi.com/v3/uk/places.json?query=London&type=bus_stop&app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 403) {
          console.warn("API usage limits exceeded. Using demo data.");
          return [
            {
              atcocode: "490000123A",
              name: "Oxford Street",
              locality: "London",
              timing_point: true,
              latitude: 51.515,
              longitude: -0.144,
            },
            {
              atcocode: "490000248G",
              name: "Victoria Station",
              locality: "London",
              timing_point: true,
              latitude: 51.49653,
              longitude: -0.1435,
            },
            {
              atcocode: "490000129D",
              name: "Kings Cross",
              locality: "London",
              timing_point: true,
              latitude: 51.5304,
              longitude: -0.12308,
            },
          ];
        }
        throw new Error(`Failed to fetch bus stops: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.member || []).slice(0, 10).map((place: any) => ({
        atcocode: place.atcocode,
        name: place.name,
        locality: place.locality || "London",
        timing_point: place.timing_point || false,
        latitude: place.latitude,
        longitude: place.longitude,
      }));
    } catch (error) {
      console.error("Error fetching bus stops:", error);
      // Fallback to dummy data if API fails
      return [
        {
          atcocode: "490000123A",
          name: "Oxford Street",
          locality: "London",
          timing_point: true,
          latitude: 51.515,
          longitude: -0.144,
        },
        {
          atcocode: "490000248G",
          name: "Victoria Station",
          locality: "London",
          timing_point: true,
          latitude: 51.49653,
          longitude: -0.1435,
        },
        {
          atcocode: "490000129D",
          name: "Kings Cross",
          locality: "London",
          timing_point: true,
          latitude: 51.5304,
          longitude: -0.12308,
        },
      ];
    }
  }

  async searchBusStops(query: string): Promise<BusStop[]> {
    try {
      const url = `https://transportapi.com/v3/uk/places.json?query=${encodeURIComponent(
        query
      )}&type=bus_stop&app_id=${APP_ID}&app_key=${APP_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 403) {
          console.warn("API usage limits exceeded. Using demo data.");
          return [
            {
              atcocode: "490000123A",
              name: `${query} Street`,
              locality: "London",
              timing_point: true,
              latitude: 51.515,
              longitude: -0.144,
            },
            {
              atcocode: "490000248G",
              name: `${query} Station`,
              locality: "London",
              timing_point: true,
              latitude: 51.49653,
              longitude: -0.1435,
            },
            {
              atcocode: "490000129D",
              name: `${query} Square`,
              locality: "London",
              timing_point: true,
              latitude: 51.5304,
              longitude: -0.12308,
            },
          ];
        }
        throw new Error(`Failed to search bus stops: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.member || []).map((place: any) => ({
        atcocode: place.atcocode,
        name: place.name,
        locality: place.locality || "Unknown",
        timing_point: place.timing_point || false,
        latitude: place.latitude,
        longitude: place.longitude,
      }));
    } catch (error) {
      console.error("Error searching bus stops:", error);
      // Fallback to dummy data based on query
      const dummyStops: BusStop[] = [
        {
          atcocode: "490000123A",
          name: `${query} Street`,
          locality: "London",
          timing_point: true,
          latitude: 51.515,
          longitude: -0.144,
        },
        {
          atcocode: "490000248G",
          name: `${query} Station`,
          locality: "London",
          timing_point: true,
          latitude: 51.49653,
          longitude: -0.1435,
        },
        {
          atcocode: "490000129D",
          name: `${query} Square`,
          locality: "London",
          timing_point: true,
          latitude: 51.5304,
          longitude: -0.12308,
        },
      ];
      return dummyStops;
    }
  }
}

export default new ApiService();
