import api from "../api/axiosIntespter";

export async function fetchProduct({ id, page = 1, limit = 15 } = {}) {
  try {
    let endpoint = "products";

    if (id) {
      endpoint += `?id=${id}`;
    } else {
      endpoint += `?page=${page}&limit=${limit}`;
    }

    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  }
}


export async function LandingPageProduct(){
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
export async function LeatherBycategory(category, { page = 1, limit = 15 } = {}) {
  try {
    const endpoint = `/leather/category/${category}?page=${page}&limit=${limit}`;
    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  } 
}
export async function AccessoriesBycategory(category, { page = 1, limit = 15 } = {}) {
  try {
    const endpoint = `/accessories/category/${category}?page=${page}&limit=${limit}`;
    const response = await api.get(endpoint);
    return { data: response.data, error: null, isLoading: false };
  } catch (error) {
    return { data: null, error, isLoading: false };
  } 
}

export const addToCart = async (token, productId, quantity = 1) => {
  console.log(productId)
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
    const response = await api.get("/cart", {
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
    const response = await api.delete(
      "/cart/remove",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
         data: { productId }
      }
    );
    return response.data; // { message, cart }
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// upateCart 
export const updateCart = async (token, items) => {
  console.log('hello')
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


export const Recommendations =async (token)=>{
  try {
    const res=await api.get('/cart/recommendations',{headers:{Authorization:`Bearer ${token}`}})
    return res.data
  } catch (error) {
    
  }
}