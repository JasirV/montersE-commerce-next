import api from "../api/axiosIntespter";

// 🛒 Get Cart Count
export const getCartCount = async (userId) => {
  try {
    const response = await api.get(`/user/cart-count/${userId}`);
    return response.data.cartCount || 0;
  } catch (error) {
    console.error("Failed to fetch cart count:", error);
    throw error;
  }
};

// 💖 Get Wishlist Count
export const getWishlistCount = async (userId) => {
  try {
    const response = await api.get(`/user/wishlist-count/${userId}`);
    return response.data.wishlistCount || 0;
  } catch (error) {
    console.error("Failed to fetch wishlist count:", error);
    throw error;
  }
};
