import axios from "axios";

export async function requestLogin(email, password) {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    email,
    password,
  });
  return response.data;
}
