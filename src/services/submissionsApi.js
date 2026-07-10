import { tokenStorage } from './tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const authHeaders = () => {
    const accessToken = tokenStorage.getAccessToken();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const parseJson = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || 'Không thể kết nối đến máy chủ');
    }
    return data;
};

export const submissionsApi = {
    async listMine({ page = 1, limit = 10 } = {}) {
        const response = await fetch(
            `${API_BASE_URL}/convert-file-and-submit?page=${page}&limit=${limit}`,
            { headers: { ...authHeaders() } },
        );
        return parseJson(response);
    },

    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/convert-file-and-submit/${id}`, {
            headers: { ...authHeaders() },
        });
        const result = await parseJson(response);
        return result.data;
    },

    async viewFileBlob(fileUrl) {
        const response = await fetch(
            `${API_BASE_URL}/convert-file-and-submit/view-file?url=${encodeURIComponent(fileUrl)}`,
            { headers: { ...authHeaders() } },
        );
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data?.error?.message || data?.message || 'Không thể mở file hồ sơ');
        }
        return response.blob();
    },
};
