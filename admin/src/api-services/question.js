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

export async function countQuestions() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_QUESTION}/api/questions/count`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getQuestionById(id) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_QUESTION
      }/api/questions/get-detail-admin/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getContentByAnswer(id) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_QUESTION
      }/api/questions/get-content/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function declineQuestion(id) {
  try {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_API_URL_QUESTION
      }/api/questions/decline/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function acceptQuestion(id) {
  try {
    const response = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_QUESTION
      }/api/questions/accept/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}