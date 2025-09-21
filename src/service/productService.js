import api from "../api/axiosIntespter";

export async function fetchProduct(id) {
  try {
    const endpoint = id ? `products?id=${id}` : "products";
    const response = await api.get(endpoint);
    return { data: response.data.products, error: null, isLoading: false };
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