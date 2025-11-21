// Transport & Destinations API Service
const API_BASE_URL = 'https://dummyjson.com';

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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return response.json();
  }

  async getUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  // Destinations/Products endpoints (using products as travel destinations)
  async getDestinations(limit: number = 20, skip: number = 0): Promise<ApiResponse<Destination[]>> {
    const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const data = await response.json();
    return {
      data: data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.thumbnail,
        price: product.price,
        category: product.category,
        tags: product.tags,
        rating: product.rating,
        thumbnail: product.thumbnail,
      })),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  }

  async getDestination(id: number): Promise<Destination> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch destination');
    }

    const product = await response.json();
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.thumbnail,
      price: product.price,
      category: product.category,
      tags: product.tags,
      rating: product.rating,
      thumbnail: product.thumbnail,
    };
  }

  async searchDestinations(query: string): Promise<ApiResponse<Destination[]>> {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search destinations');
    }

    const data = await response.json();
    return {
      data: data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.thumbnail,
        price: product.price,
        category: product.category,
        tags: product.tags,
        rating: product.rating,
        thumbnail: product.thumbnail,
      })),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  }

  async getDestinationsByCategory(category: string): Promise<ApiResponse<Destination[]>> {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations by category');
    }

    const data = await response.json();
    return {
      data: data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.thumbnail,
        price: product.price,
        category: product.category,
        tags: product.tags,
        rating: product.rating,
        thumbnail: product.thumbnail,
      })),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }
}

export default new ApiService();