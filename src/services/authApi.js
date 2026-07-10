const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const parseApiResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const errorMessage =
            data?.error?.message ||
            data?.message ||
            'Không thể kết nối đến máy chủ';
        throw new Error(errorMessage);
    }
    return data?.data || data;
};

export const authApi = {
    async login(payload) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return parseApiResponse(response);
    },

    async googleLogin(payload) {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return parseApiResponse(response);
    },

    async getMe(accessToken) {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return parseApiResponse(response);
    },
};
