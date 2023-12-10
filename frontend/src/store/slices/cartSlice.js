import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk for fetching cart information
export const fetchCartInfo = createAsyncThunk('cart/fetchCartInfo', async (userId, { rejectWithValue }) => {
  try {
    // Assuming you have an API endpoint for fetching cart info by user ID
    const response = await axios.get(`http://localhost:5001/api/cart/carts/${userId}`);
    console.log(response.data)
    return response.data;
    
    
    
  } catch (error) {
    // Handle errors and provide a rejection value
    return rejectWithValue(error.message);
  }
});

const initialState = {
  cartInfo: localStorage.getItem('cartInfo')
    ? JSON.parse(localStorage.getItem('cartInfo'))
    : { id: null, products: [] }, // Initialize products as an array
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setcartInfo: (state, action) => {
      // Assuming action.payload is an array of products
      state.cartInfo.id = action.payload;
      state.cartInfo.products = action.payload;
      localStorage.setItem('cartInfo', JSON.stringify(state.cartInfo));
    },
  },
  extraReducers: (builder) => {
    // Add extra reducers for handling fetchCartInfo async action
    builder
      .addCase(fetchCartInfo.fulfilled, (state, action) => {
        // Update the cartInfo state when fetching is successful
        state.cartInfo.id =action.payload;
        state.cartInfo.products = action.payload;
        localStorage.setItem('cartInfo', JSON.stringify(state.cartInfo));
      })
      .addCase(fetchCartInfo.rejected, (state, action) => {
        // Handle any actions when fetching is rejected (optional)
      });
  },
});

export const { setcartInfo } = cartSlice.actions;

export default cartSlice.reducer;
