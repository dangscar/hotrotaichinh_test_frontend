import { authApi } from './authApi';
import { tokenStorage } from './tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

let refreshPromise = null;

const clearSession = () => {
    tokenStorage.clear();
    localStorage.removeItem('studentUser');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
};

const tryRefresh = async () => {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = tokenStorage.getRefreshToken();
            if (!refreshToken) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            const data = await authApi.refresh(refreshToken);
            if (!data?.accessToken) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            tokenStorage.setTokens(data.accessToken, data.refreshToken || refreshToken);
            return data.accessToken;
        })().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

/**
 * fetch có gắn JWT; tự refresh 1 lần khi access token hết hạn.
 */
export const authFetch = async (path, options = {}) => {
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    const headers = new Headers(options.headers || {});

    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response = await fetch(url, { ...options, headers });

    if (response.status !== 401) {
        return response;
    }

    try {
        const newToken = await tryRefresh();
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await fetch(url, { ...options, headers });
        return response;
    } catch (err) {
        clearSession();
        throw err;
    }
};

export { API_BASE_URL, clearSession };
