import { authFetch } from './http';

const parseJson = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || 'Không thể kết nối đến máy chủ');
    }
    return data;
};

export const submissionsApi = {
    async listMine({ page = 1, limit = 10 } = {}) {
        const response = await authFetch(`/convert-file-and-submit?page=${page}&limit=${limit}`);
        return parseJson(response);
    },

    async getById(id) {
        const response = await authFetch(`/convert-file-and-submit/${id}`);
        const result = await parseJson(response);
        return result.data;
    },

    async viewFileBlob(fileUrl) {
        const response = await authFetch(
            `/convert-file-and-submit/view-file?url=${encodeURIComponent(fileUrl)}`,
        );
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data?.error?.message || data?.message || 'Không thể mở file hồ sơ');
        }
        return response.blob();
    },
};
