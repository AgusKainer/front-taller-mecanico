import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import autosReducer from "./slices/autosSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    autos: autosReducer,
  },
});

export default store;
