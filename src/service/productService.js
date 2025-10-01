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
