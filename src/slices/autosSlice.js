import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  autos: [],
  autoSeleccionado: null,
  loading: false,
  error: null,
};

const autosSlice = createSlice({
  name: "autos",
  initialState,
  reducers: {
    setAutos: (state, action) => {
      state.autos = action.payload;
    },
    setAutoSeleccionado: (state, action) => {
      state.autoSeleccionado = action.payload;
    },
    addAuto: (state, action) => {
      state.autos.push(action.payload);
    },
    updateAuto: (state, action) => {
      const index = state.autos.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.autos[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAutos,
  setAutoSeleccionado,
  addAuto,
  updateAuto,
  setLoading,
  setError,
} = autosSlice.actions;
export default autosSlice.reducer;
