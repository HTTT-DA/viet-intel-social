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

export async function automaticCensorQuestions() {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL_QUESTION}/api/questions/automatic-censor`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getListTag() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_QUESTION}/api/tags`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function findTag(tagName) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_QUESTION}/api/tags/find/${tagName}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteTag(tagID) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL_QUESTION}/api/tags/delete/${tagID}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createTag(data) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_QUESTION}/api/tags/create`, data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
