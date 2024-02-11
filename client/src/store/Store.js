import { configureStore } from "@reduxjs/toolkit";
import AuthSclice from "./slices/AuthSclice";

const store = configureStore({
  reducer: {
    AuthSclice,
  },
  devTools: true,
});

export default store;
