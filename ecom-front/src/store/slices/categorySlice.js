import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryInfo: localStorage.getItem('categoryInfo')
    ? JSON.parse(localStorage.getItem('categoryInfo'))
    : null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setcategoryInfo: (state, action) => {
      state.categoryInfo = action.payload;
      localStorage.setItem('categoryInfo', JSON.stringify(action.payload));
      
    },
  },
});

export const { setcategoryInfo } = categorySlice.actions;

export default categorySlice.reducer;