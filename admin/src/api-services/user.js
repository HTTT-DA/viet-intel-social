import axios from "axios";

export async function getUserByID(userId) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_USER
      }/api/users/get-user-for-admin/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function requestLogin(data) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_USER}/api/users/sign-in-admin`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}