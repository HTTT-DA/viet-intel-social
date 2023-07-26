import axios from "axios";

export async function requestLogin(email, password) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getListCategories() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/category/get-all-categories`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteCategory(id) {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/category/delete-category/${id}/`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}