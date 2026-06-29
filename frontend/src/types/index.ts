export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: number;
  title: string;
  description: string | null;
  price: number;
  city: string;
  state: string | null;
  country: string | null;
  address: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  owner: User;
  propertyImages: PropertyImage[];
}

export interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
}

export interface Inquiry {
  id: number;
  propertyId: number;
  buyerId: number;
  message: string;
  createdAt: string;
  property: Property;
  buyer: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  properties: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}
