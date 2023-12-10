// addressSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addressInfo: localStorage.getItem('addressInfo') || '',
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setaddressInfo: (state, action) => {
      // Convert the payload to a string
      state.addressInfo = String(action.payload);
      localStorage.setItem('addressInfo', String(action.payload));
    },
    logout: (state, action) => {
      state.addressInfo = '';
      localStorage.removeItem('addressInfo');
    },
  },
});

export const { setaddressInfo } = addressSlice.actions;

export default addressSlice.reducer;
