import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action to delete all rows associated with a user ID
export const deleteCartForUser = createAsyncThunk('cart/deleteCartForUser', async (userId, { rejectWithValue }) => {
  try {
    // Assuming you have an API endpoint for deleting a user's cart
    const response = await axios.delete(`http://localhost:5001/api/carts/${userId}`);
    
    // Return the user ID to identify which user's cart was deleted
    return userId;
  } catch (error) {
    // Handle errors and provide a rejection value
    return rejectWithValue(error.message);
  }
});
