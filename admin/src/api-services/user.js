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

export async function addRequestAccess(data) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_USER}/api/users/add-user-request`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getRequestAccess() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_USER}/api/users/get-user-request`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function declineRequestAccess(requestId) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL_USER}/api/users/decline-user-request/${requestId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function acceptRequestAccess(requestId) {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL_USER}/api/users/accept-user-request/${requestId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}