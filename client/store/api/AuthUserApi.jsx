import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authUserApi = createApi({
  reducerPath: "authUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/authentication`,
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
    // Create/Register user
    createRegister: builder.mutation({
      query: (registerData) => ({
        url: "/register",
        method: "POST",
        body: registerData,
      }),
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get all users
    getRegisters: builder.query({
      query: () => "/register",
    }),

    // Get user by ID
    getRegisterById: builder.query({
      query: (id) => `/register/${id}`,
    }),

    // Update user
    updateRegister: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/register/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    // Delete user
    deleteRegister: builder.mutation({
      query: (id) => ({
        url: `/register/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks
export const {
  useCreateRegisterMutation,
  useLoginUserMutation, // <-- 👈 New login hook
  useGetRegistersQuery,
  useGetRegisterByIdQuery,
  useUpdateRegisterMutation,
  useDeleteRegisterMutation,
} = authUserApi;
