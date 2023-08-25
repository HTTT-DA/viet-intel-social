import axios from "axios";

export async function getListAnswersOfQuestion(currentPage, questionId) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_ANSWER
      }/api/answers/get-by-question-id-admin/${questionId}?page=${currentPage}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function countAnswersOfQuestion(questionId) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_ANSWER
      }/api/answers/count/${questionId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getAnswerById(answerId) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL_ANSWER
      }/api/answers/get-detail-admin/${answerId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function declineAnswer(answerId) {
  try {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_API_URL_ANSWER
      }/api/answers/decline/${answerId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function acceptAnswer(answerId) {
  try {
    const response = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_ANSWER
      }/api/answers/accept/${answerId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function automaticCensorAnswers() {
  try {
    const response = await axios.patch(
      `${
        import.meta.env.VITE_API_URL_ANSWER
      }/api/answers/automatic-censor`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}