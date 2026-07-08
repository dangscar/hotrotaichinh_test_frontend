export const EMAIL_DOMAIN = '@student.ctuet.edu.vn';
export const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
};
export const isStudentEmail = (email) => {
    return normalizeEmail(email).endsWith(EMAIL_DOMAIN);
};
export const decodeGoogleToken = (idToken) => {
    const base64Url = idToken.split('.')[1];

    const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(
                c =>
                    '%' +
                    ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            )
            .join('')
    );

    return JSON.parse(jsonPayload);
};