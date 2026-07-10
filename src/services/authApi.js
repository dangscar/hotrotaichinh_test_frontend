import { tokenStorage } from './tokenStorage';

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

    async refresh(refreshToken) {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
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

    async ensureValidSession() {
        const accessToken = tokenStorage.getAccessToken();
        const refreshToken = tokenStorage.getRefreshToken();

        if (accessToken) {
            try {
                const user = await this.getMe(accessToken);
                return { user, accessToken };
            } catch {
                // try refresh below
            }
        }

        if (!refreshToken) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }

        const refreshed = await this.refresh(refreshToken);
        if (!refreshed?.accessToken) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }

        tokenStorage.setTokens(refreshed.accessToken, refreshed.refreshToken || refreshToken);
        const user = await this.getMe(refreshed.accessToken);
        return { user, accessToken: refreshed.accessToken };
    },
};
