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
    getProductsOrders: builder.query({
      query: () => "/products",
    }),
    getProductOrder: builder.query({
      query: () => `/productsorder`,
    }),
    getCart: builder.query({
      query: () => "/cart",
    }),
    getsendStripeApi: builder.query({
      query: () => "/stripeapi",
    }),
    // ✅ GET single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    getProductOrderById: builder.query({
      query: (id) => `/products/order/${id}`,
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
    createProductOrder: builder.mutation({
      query: (newProduct) => ({
        url: "/orders",
        method: "POST",
        body: newProduct,
      }),
    }),
    createProcessPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment/process",
        method: "POST",
        body: paymentData,
      }),
    }),
    createCart: builder.mutation({
      query: (newProduct) => ({
        url: "/cart",
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
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/update/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
    }),

    // ✅ DELETE product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
    removeCartItem: builder.mutation({
      query: (id) => ({
        url: `/products/remove/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useGetProductsQuery,
  useGetCartQuery,
  useGetProductByIdQuery,
  useGetProductOrderQuery,
  useGetProductOrderByIdQuery,
  useGetsendStripeApiQuery,
  useCreateProductMutation,
  useCreateProcessPaymentMutation,
  useCreateCartMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewsMutation,
  useCreateProductOrderMutation,
} = productAdminApi;
