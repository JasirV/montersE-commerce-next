import api from "@/api/axiosIntespter";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch wishlist count
export const fetchWishlistCount = createAsyncThunk(
  "wishlist/fetchCount",
   async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) throw new Error("No token found");

      const res = await api.get("/wishlist-count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ return only the number
      return res.data.wishlistCount; 
    } catch (error) {
      console.error("Error fetching cart count:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    count: 0,
  },
  reducers: {
    incrementWishlist: (state) => {
      state.count += 1;
    },
    decrementWishlist: (state) => {
      if (state.count > 0) state.count -= 1;
    },
    setWishlistCount: (state, action) => {
      state.count = action.payload;
    },
    resetWishlist: (state) => {
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlistCount.fulfilled, (state, action) => {
      state.count = action.payload;
    });
  },
});

export const {
  incrementWishlist,
  decrementWishlist,
  setWishlistCount,
  resetWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
