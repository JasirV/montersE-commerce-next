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
