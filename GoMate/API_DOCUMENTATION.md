# GoMate API Documentation

This document outlines the API endpoints used in the GoMate travel application, along with the data structures and how they are utilized within the app.

## API Base URL

```
https://dummyjson.com
```

## Authentication Endpoints

### POST /auth/login

**Purpose:** User authentication (login)

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "token": "string"
}
```

**Usage:** Called via `loginAsync` thunk in `authSlice.ts` when user submits login form. On success, stores user data and token in AsyncStorage.

### GET /auth/me

**Purpose:** Get current user information using authentication token

**Request Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "token": "string"
}
```

**Usage:** Defined in `ApiService.getUser()` but currently not used in the application. Authentication status is checked via AsyncStorage instead.

## Destinations Endpoints

### GET /products

**Purpose:** Fetch list of travel destinations (products transformed into travel-themed content)

**Query Parameters:**

- `limit` (optional, default: 20): Number of items to fetch
- `skip` (optional, default: 0): Number of items to skip for pagination

**Response:**

```json
{
  "products": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "price": "number",
      "discountPercentage": "number",
      "rating": "number",
      "stock": "number",
      "brand": "string",
      "category": "string",
      "thumbnail": "string",
      "images": ["string"]
    }
  ],
  "total": "number",
  "skip": "number",
  "limit": "number"
}
```

**Transformation:** Products are transformed into `Destination` objects with travel-themed titles, descriptions, and additional fields like location and duration.

**Usage:** Called via `fetchDestinations` thunk in `destinationsSlice.ts`. Used in `HomeScreen` on component mount and pull-to-refresh.

### GET /products/search

**Purpose:** Search destinations by query string

**Query Parameters:**

- `q`: Search query string

**Response:** Same structure as `/products` endpoint

**Usage:** Called via `searchDestinations` thunk in `destinationsSlice.ts`. Triggered when user performs search in `HomeScreen`.

### GET /products/{id}

**Purpose:** Get detailed information for a specific destination

**Path Parameters:**

- `id`: Destination/product ID (number)

**Response:** Single product object (same structure as individual items in `/products`)

**Usage:** Called via `fetchDestination` thunk in `destinationsSlice.ts`. Available for fetching individual destination details (currently, `DetailsScreen` receives destination data via navigation props).

### GET /products/category/{category}

**Purpose:** Filter destinations by category

**Path Parameters:**

- `category`: Category name (string)

**Response:** Same structure as `/products` endpoint

**Usage:** Implemented in `ApiService.getDestinationsByCategory()` but not currently used in the application.

### GET /products/categories

**Purpose:** Get list of available destination categories

**Response:**

```json
["string", "string", ...]
```

**Usage:** Called via `fetchCategories` thunk in `destinationsSlice.ts`. Categories are stored in Redux state but filtering by category is not currently implemented in the UI.

## Data Structures

### LoginCredentials

```typescript
interface LoginCredentials {
  username: string;
  password: string;
}
```

### User

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}
```

### Destination (after transformation)

```typescript
interface Destination {
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
```

### ApiResponse<T>

```typescript
interface ApiResponse<T> {
  data: T;
  total?: number;
  skip?: number;
  limit?: number;
}
```

## Redux Thunks

- `fetchDestinations(limit?, skip?)`: Fetches paginated list of destinations
- `fetchDestination(id)`: Fetches single destination details
- `searchDestinations(query)`: Searches destinations by query
- `fetchCategories()`: Fetches available categories
- `loginAsync(credentials)`: Authenticates user

## Notes

- The application uses DummyJSON API as a mock backend, transforming product data into travel destination format
- Authentication tokens are stored in AsyncStorage for persistence
- Error handling is implemented at both API service and Redux thunk levels
- Some endpoints (like `/auth/me` and `/products/category/{category}`) are implemented but not currently used in the UI
- The app currently passes destination data via navigation props rather than always fetching individual items</content>
  <filePath>c:\Users\User\Desktop\Gomate\GoMate\API_DOCUMENTATION.md
