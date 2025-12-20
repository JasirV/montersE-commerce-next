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

// service/productService.js
export async function WatchBycategory(style, params = {}) {
  try {
    const { 
      page = 1, 
      limit = 16,
      sortBy = "newest",
      ...filters 
    } = params;

    // Build query string from filters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: sortBy,
    });

    // Add all filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    let endpoint;
    
    if (style === "all" || !style) {
      // Use the all watches endpoint
      endpoint = `/watches/all?${queryParams.toString()}`;
    } else {
      // Use the style-specific endpoint
      const safeStyle = encodeURIComponent(style);
      endpoint = `/watches/style/${safeStyle}?${queryParams.toString()}`;
    }

    console.log("API Call:", endpoint);
    const response = await api.get(endpoint);
    
    return { 
      data: response.data, 
      error: null, 
      isLoading: false 
    };
  } catch (error) {
    console.error("API Error:", error);
    return { 
      data: null, 
      error, 
      isLoading: false 
    };
  }
}

export async function getAllAccessories({
  page = 1,
  limit = 15,
  subcategory,
  brand,
  gender,
  material,
  color,
  condition,
  minPrice,
  maxPrice,
  search,
  sortBy,
  sortOrder,
  published = true,
} = {}) {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    params.append("published", published);

    if (subcategory) params.append("subcategory", subcategory);
    if (brand) params.append("brand", brand);
    if (gender) params.append("gender", gender);
    if (material) params.append("material", material);
    if (color) params.append("color", color);
    if (condition) params.append("condition", condition);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const res = await api.get(`/accessories/?${params.toString()}`);

    return res.data;
  } catch (error) {
    console.error("getAllAccessories Error:", error);
    return null;
  }
}


// service/productService.js
export async function LeatherBycategory(category, params = {}) {
  try {
    const { 
      page = 1, 
      limit = 16,
      sortBy = "newest",
      leatherType = "all",
      ...filters 
    } = params;

    // Build URL query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add sort parameter if not default
    if (sortBy && sortBy !== "featured") {
      queryParams.append("sortBy", sortBy);
    }

    // Add dynamic filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v !== undefined && v !== null && v !== '') {
            queryParams.append(key, v);
          }
        });
      } else if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    // Handle price range separately
    if (filters.minPrice) {
      queryParams.append("minPrice", filters.minPrice);
    }
    if (filters.maxPrice) {
      queryParams.append("maxPrice", filters.maxPrice);
    }

    // safe encode category
    const safeCategory = category || "All";
    const endpoint = `/leather/category/${safeCategory}?${queryParams.toString()}`;

    // console.log("Leather API Call:", endpoint);

    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };

  } catch (error) {
    console.error("Leather API Error:", error);
    return { data: null, error, isLoading: false };
  }
}

// productService.js
// service/productService.js
export async function getBrandsBaeWatchs(brand, params = {}) {
  try {
    const {
      page = 1,
      limit = 16,
      sortBy = "featured",
      minPrice,
      maxPrice,
      ...filters
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: sortBy,
    });

    // Add price range
    if (minPrice !== undefined) queryParams.append("minPrice", minPrice);
    if (maxPrice !== undefined) queryParams.append("maxPrice", maxPrice);

    // Add additional filters dynamically
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v !== undefined && v !== null && v !== "") {
            queryParams.append(key, v);
          }
        });
      } else if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    // Encode brand to safely include in URL
    const safeBrand = encodeURIComponent(brand);
    const endpoint = `/products/brand/${safeBrand}/watches?${queryParams.toString()}`;

    console.log("Brand Watches API:", endpoint);

    const response = await api.get(endpoint);
    
    // Extract data based on backend response structure
    const products = response.data.products || [];
    const totalProducts = response.data.count || 0;
    const itemsPerPage = limit;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    return {
      success: true,
      data: {
        products: products,
        totalProducts: totalProducts,
        totalPages: totalPages,
        currentPage: parseInt(page),
        productsPerPage: itemsPerPage
      },
      error: null,
      isLoading: false,
    };

  } catch (error) {
    console.error("Brand Watch API Error:", error);

    return {
      success: false,
      data: {
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        productsPerPage: 16
      },
      error: error.response?.data || error.message,
      isLoading: false,
    };
  }
}


// * GET: /leather/getHandBags
//  */
export async function getHandBags(params = {}) {
  try {
    const {
      page = 1,
      limit = 16,
      sortBy = "newest",
      minPrice,
      maxPrice,
      brand = [],
      color = [],
      material = [],
      leatherType = [],
      size = [],
      subCategory = [],
      condition = [],
      gender = [],
      availability = [],
      category = [],
      ...otherFilters
    } = params;

    // Build query params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: sortBy.toString(),
    });

    // Add array filters
    const arrayFields = {
      brand,
      color,
      material,
      leatherType,
      size,
      subCategory,
      condition,
      gender,
      availability,
      category
    };

    Object.entries(arrayFields).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach((v) => {
          if (v !== undefined && v !== null && v !== "") {
            queryParams.append(key, v);
          }
        });
      }
    });

    // Add price filters
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      queryParams.append("minPrice", minPrice.toString());
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      queryParams.append("maxPrice", maxPrice.toString());
    }

    // Add any additional filters
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    // Final request URL
    const endpoint = `/leather/getHandBags?${queryParams.toString()}`;

    // console.log("HandBag API Call:", endpoint);

    const response = await api.get(endpoint);

    return {
      data: response.data.data, // Access the data property from response
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error("❌ HandBag API Error:", error);

    return {
      data: null,
      error: error.response?.data || error.message,
      isLoading: false,
    };
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