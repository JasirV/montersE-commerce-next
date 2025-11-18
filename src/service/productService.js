import api from "../api/axiosIntespter";
export async function fetchProduct({
  id,
  page = 1,
  limit = 15,
  category,
  brand,
  price,
  availability,
  badges,
  gender,
  featured,
  search,
  sortBy, // ✅ optional sorting param
} = {}) {
  try {
    let endpoint = "products";
    const params = new URLSearchParams();

    // ✅ Add query params dynamically
    if (id) params.append("id", id);
    else {
      params.append("page", page);
      params.append("limit", limit);
    }

    if (category) params.append("category", category);  
    if (brand) params.append("brand", brand);
    if (price) params.append("price", price);
    if (availability) params.append("availability", availability);
    if (badges) params.append("badges", badges);
    if (gender) params.append("gender", gender);
    if (featured !== undefined) params.append("featured", featured);
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    const response = await api.get(`${endpoint}?${params.toString()}`);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    console.error("❌ fetchProduct error:", error);
    return { data: null, error, isLoading: false };
  }
}




export async function LandingPageProduct() {
  try {
    const response = await api.get("products/home");
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}

export async function WatchBycategory(category, { page = 1, limit = 15 } = {}) {
  try {
    const endpoint = `/watches/category/${category}?page=${page}&limit=${limit}`;
    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}
export async function LeatherBycategory(
  category,
  { page = 1, limit = 15 } = {}
) {
  try {
    const endpoint = `/leather/category/${category}?page=${page}&limit=${limit}`;
    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}
export async function AccessoriesBycategory(
  category,
  { page = 1, limit = 15 } = {}
) {
  try {
    const endpoint = `/accessories/category/${category}?page=${page}&limit=${limit}`;
    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}

export const addToCart = async (token, productId, quantity = 1) => {
  console.log(productId);
  try {
    const response = await api.post(
      `/cart/add`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`, // send JWT for auth
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // { message, cart }
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
export const getCart = async (token) => {
  try {
    const response = await api.get("/products/cart", {
      headers: {
        Authorization: `Bearer ${token}`, // send JWT for auth
      },
    });
    return response.data; // { message, cart }
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Remove product from cart
export const removeFromCart = async (token, productId) => {
  try {
    const response = await api.delete("/cart/remove", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { productId },
    });
    return response.data; // { message, cart }
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// upateCart
export const updateCart = async (token, items) => {
  console.log("hello");
  try {
    const res = await api.put(
      `/cart/update-cart`,
      { items },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data; // { message, cart, totalAmount, recommended }
  } catch (error) {
    console.error("Update cart error:", error.response?.data || error.message);
    throw error;
  }
};

export const Recommendations = async (token) => {
  try {
    const res = await api.get("/cart/recommendations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {}
};

export async function fetchProductAll({ search = "" } = {}) {
  try {
    let endpoint = `productAll`;

    // ✅ Add search if provided
    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`;
    }

    const response = await api.get(endpoint);

    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}
export async function getHomeProductGrid() {
  try {
    let endpoint = `home`;
    // ✅ Add search if provided
    const response = await api.get(endpoint);

    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}

export const updateHomeProductGrid = async (categoryId, { title, productId }) => {
  try {
    const res = await api.put(`/home/updatehomeproduct/${categoryId}`, {
      title,
      productId,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating home product grid:", error);
    throw error;
  }
};