/**
 * GoMate Travel & Transport API Service
 *
 * This service handles all API interactions for the GoMate travel application.
 * It uses DummyJSON API (https://dummyjson.com/docs) as the backend, transforming
 * product data into travel destination format for realistic travel app experience.
 *
 * Features:
 * - User authentication (login/register)
 * - Fetch travel destinations with pagination
 * - Search destinations by query
 * - Filter destinations by category
 * - Individual destination details
 * - Automatic data transformation to travel-themed content
 * - Comprehensive error handling
 *
 * API Endpoints Used:
 * - POST /auth/login - User authentication
 * - GET /auth/me - Get current user
 * - GET /products - Fetch all destinations (transformed from products)
 * - GET /products/search?q={query} - Search destinations
 * - GET /products/{id} - Get single destination
 * - GET /products/category/{category} - Filter by category
 * - GET /products/categories - Get all categories
 */
const API_BASE_URL = "https://dummyjson.com";

export interface Destination {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  tags: string[];
  rating: number | string;
  thumbnail: string;
  location?: string;
  duration?: string;
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
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

  // Destinations/Products endpoints (using products as travel destinations)
  async getDestinations(
    limit: number = 20,
    skip: number = 0
  ): Promise<ApiResponse<Destination[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }

      const data = await response.json();

      // Transform products into travel destinations with realistic data
      const destinations = data.products.map((product: any) =>
        this.transformToDestination(product)
      );

      return {
        data: destinations,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw new Error(
        "Unable to load destinations. Please check your connection."
      );
    }
  }

  // Transform product data to travel destination format
  private transformToDestination(product: any): Destination {
    const travelLocations = [
      "Paris, France",
      "Tokyo, Japan",
      "New York, USA",
      "London, UK",
      "Dubai, UAE",
      "Sydney, Australia",
      "Barcelona, Spain",
      "Rome, Italy",
      "Bali, Indonesia",
      "Bangkok, Thailand",
      "Istanbul, Turkey",
      "Amsterdam, Netherlands",
      "Singapore",
      "Maldives",
      "Santorini, Greece",
      "Iceland",
      "Cape Town, South Africa",
    ];

    const travelCategories = [
      "Beach Paradise",
      "City Break",
      "Adventure",
      "Cultural Tour",
      "Mountain Retreat",
      "Island Getaway",
      "Historical Site",
      "Nature Escape",
    ];

    return {
      id: product.id,
      title: this.generateTravelTitle(product.title),
      description: this.generateTravelDescription(product.description),
      image: product.thumbnail,
      price: Math.round(product.price * 10), // Convert to realistic travel price
      category: travelCategories[product.id % travelCategories.length],
      tags: product.tags || [],
      rating: product.rating || (4 + Math.random()).toFixed(1),
      thumbnail: product.thumbnail,
      location: travelLocations[product.id % travelLocations.length],
      duration: `${Math.floor(Math.random() * 7) + 1}-${
        Math.floor(Math.random() * 7) + 7
      } days`,
    };
  }

  // Generate travel-themed titles
  private generateTravelTitle(originalTitle: string): string {
    const prefixes = [
      "Explore",
      "Discover",
      "Visit",
      "Experience",
      "Journey to",
      "Adventure in",
      "Escape to",
      "Getaway to",
    ];
    const words = originalTitle.split(" ");
    const mainWord = words[0] || "Paradise";
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${mainWord}`;
  }

  // Generate travel-themed descriptions
  private generateTravelDescription(originalDesc: string): string {
    if (!originalDesc) return "An unforgettable travel experience awaits you.";

    const travelPhrases = [
      "Perfect destination for travelers seeking adventure and culture.",
      "Experience breathtaking views and unforgettable memories.",
      "Immerse yourself in local culture and stunning landscapes.",
      "A must-visit destination with rich history and vibrant atmosphere.",
    ];

    // Use original description or fallback to travel phrase
    return originalDesc.length > 50
      ? originalDesc
      : travelPhrases[Math.floor(Math.random() * travelPhrases.length)];
  }

  async getDestination(id: number): Promise<Destination> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch destination");
      }

      const product = await response.json();
      return this.transformToDestination(product);
    } catch (error) {
      console.error("Error fetching destination:", error);
      throw new Error("Unable to load destination details.");
    }
  }

  async searchDestinations(query: string): Promise<ApiResponse<Destination[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search destinations");
      }

      const data = await response.json();
      const destinations = data.products.map((product: any) =>
        this.transformToDestination(product)
      );

      return {
        data: destinations,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    } catch (error) {
      console.error("Error searching destinations:", error);
      throw new Error("Unable to search destinations. Please try again.");
    }
  }

  async getDestinationsByCategory(
    category: string
  ): Promise<ApiResponse<Destination[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch destinations by category");
      }

      const data = await response.json();
      const destinations = data.products.map((product: any) =>
        this.transformToDestination(product)
      );

      return {
        data: destinations,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    } catch (error) {
      console.error("Error fetching category destinations:", error);
      throw new Error("Unable to load destinations by category.");
    }
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/products/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  }
}

export default new ApiService();
