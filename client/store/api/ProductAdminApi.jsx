import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productAdminApi = createApi({
  reducerPath: "productAdminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/ecommerceProject`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ✅ GET all products
    getProducts: builder.query({
      query: () => "/products",
    }),

    // ✅ GET single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),

    // ✅ CREATE new product
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
    }),
    createProductReviews: builder.mutation({
      query: (newProduct) => ({
        url: "/reviews",
        method: "POST",
        body: newProduct,
      }),
    }),
    // ✅ UPDATE product
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    // ✅ DELETE product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewsMutation,
} = productAdminApi;
