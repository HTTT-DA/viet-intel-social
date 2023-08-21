import axios from "axios";

export async function getNotificationType(userID) {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/users/get-notification-type/${userID}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function updateNotificationType(user_id, notification_type) {
    try {
        const response = await axios.post(
            `http://127.0.0.1:8000/api/users/update-notification-type/`,
            {
                user_id: user_id,
                notification_type: notification_type
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getAnswerFromQuesion(question_content) {
    try {
        const response = await axios.post(
            `http://127.0.0.1:8004/core/get-answer/`,
            {
                question_content: question_content,
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}


export async function exportUser() {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8004/core/export-user/`,

        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function exportQuestion(date) {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8004/core/export-question/?date=${date}`,

        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function exportAnswer(date) {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8004/core/export-answer/?date=${date}`,

        );
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function importUser(csv_file) {
    try {
        const formData = new FormData();
        formData.append('files', csv_file);

        const response = await axios.post(
            `http://127.0.0.1:8004/core/import-user/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function importQuestion(csv_file) {
    try {
        const formData = new FormData();
        formData.append('files', csv_file);

        const response = await axios.post(
            `http://127.0.0.1:8004/core/import-question/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function importAnswer(csv_file) {
    try {
        const formData = new FormData();
        formData.append('files', csv_file);

        const response = await axios.post(
            `http://127.0.0.1:8004/core/import-answer/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}
