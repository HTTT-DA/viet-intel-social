import axios from "axios";

export async function getListCategories(currentPage) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_CATEGORY
      }/api/categories/all?page=${currentPage}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteCategory(id) {
  try {
    await axios.delete(
      `${
        import.meta.env.VITE_API_URL_CATEGORY
      }/api/categories/delete/${id}`
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function countCategories() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_CATEGORY}/api/categories/count`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addNewCategory(data) {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL_CATEGORY}/api/categories/create`,
      data
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function checkIsExisted(name) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_CATEGORY
      }/api/categories/check/${name}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}