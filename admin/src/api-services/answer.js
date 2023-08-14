import axios from "axios";

export async function getListAnswers(currentPage) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_CATEGORY
      }/api/answers/all?page=${currentPage}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
