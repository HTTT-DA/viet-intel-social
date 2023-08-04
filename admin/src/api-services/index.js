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

export async function getListQuestions() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/question/get-questions`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getListAnswers() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/question/get-answers`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}