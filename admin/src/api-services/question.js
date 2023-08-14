import axios from "axios";

export async function getListQuestions(currentPage) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_QUESTION
      }/api/questions/get-all-admin?page=${currentPage}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
