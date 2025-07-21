import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { authUserApi } from "../store/api/AuthUserApi";
import { productAdminApi } from "../store/api/ProductAdminApi";

export const store = configureStore({
  reducer: {
    // Add the userApi reducer
    [authUserApi.reducerPath]: authUserApi.reducer,
    [productAdminApi.reducerPath]: productAdminApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authUserApi.middleware)
      .concat(productAdminApi.middleware),
});

setupListeners(store.dispatch); // Set up listeners for RTK query

export default store;
