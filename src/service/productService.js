"use client";

import api from "../api/axiosIntespter";


export async function fetchProduct({
  id,
  page = 1,
  limit = 16,
  category = [],
  brand = [],
  model = [],
  gender = [],
  condition = [],
  itemCondition = [],
  scopeOfDelivery = [],
  badges = [],
  availability = [],
  featured,
  search,
  sortBy = "newest",
  minPrice,
  maxPrice,
  referenceNumber = [],
  // Advanced filters
  type = [],
  dialColor = [],
  caseColor = [],
  strapColor = [],
  strapMaterial = [],
  caseMaterial = [],
  caseSize = [],
  strapSize = [],
  yearOfProduction = [],
  waterResistance = [],
  movement = [],
  complications = [],
  crystal = [],
  includedAccessories = [],
} = {}) {
  try {
    let endpoint = "products";
    const params = new URLSearchParams();

    if (id) {
      params.append("id", id);
    } else {
      params.append("page", page);
      params.append("limit", limit);
    }

    // Handle array parameters
    const arrayParams = {
      category,
      brand,
      model,
      gender,
      condition,
      itemCondition,
      scopeOfDelivery,
      badges,
      availability,
      referenceNumber,
      type,
      dialColor,
      caseColor,
      strapColor,
      strapMaterial,
      caseMaterial,
      caseSize,
      strapSize,
      yearOfProduction,
      waterResistance,
      movement,
      complications,
      crystal,
      includedAccessories,
    };

    Object.entries(arrayParams).forEach(([key, value]) => {
      if (value && value.length > 0) {
        value.forEach(item => params.append(key, item));
      }
    });

    // Price range
    if (minPrice !== undefined) params.append("minPrice", minPrice);
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice);

    // Other params
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

// Other existing functions remain the same...
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

// ... other existing functions
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
