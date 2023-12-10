import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productInfo: localStorage.getItem('productInfo')
    ? JSON.parse(localStorage.getItem('productInfo'))
    : null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setproductInfo: (state, action) => {
      state.productInfo = action.payload;
      localStorage.setItem('productInfo', JSON.stringify(action.payload));
      
    },
  },
});

export const { setproductInfo } = productSlice.actions;

export default productSlice.reducer;