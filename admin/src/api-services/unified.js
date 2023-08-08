import axios from "axios";

export async function getNotificationType(userID) {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8004/core/get-notification-type/${userID}`
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
            `http://127.0.0.1:8004/core/update-notification-type`,
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