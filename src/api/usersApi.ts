import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  address: {
    country: string;
  };
  company: {
    department: string;
  };
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => 'users?limit=100',
    }),
    getProducts: builder.query<ProductsResponse, void>({
      query: () => 'products?limit=100',
    }),
  }),
});

export const { useGetUsersQuery, useGetProductsQuery } = usersApi;
