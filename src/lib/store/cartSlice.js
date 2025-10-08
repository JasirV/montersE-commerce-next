import api from "@/api/axiosIntespter";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch cart count
export const fetchCartCount = createAsyncThunk(
  "cart/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) throw new Error("No token found");

      const res = await api.get("/cart-count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ return only the number
      return res.data.cartCount; 
    } catch (error) {
      console.error("Error fetching cart count:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    incrementCart: (state) => {
      state.count += 1;
    },
    decrementCart: (state) => {
      if (state.count > 0) state.count -= 1;
    },
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    resetCart: (state) => {
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload;
      })
      .addCase(fetchCartCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { incrementCart, decrementCart, setCartCount, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;
