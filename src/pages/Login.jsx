import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { authApi } from '../services/authApi';
import { isStudentEmail, normalizeEmail } from '../constants/utils';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const STUDENT_ROLE = 'student';
const isClientIdPlaceholder =
    !GOOGLE_CLIENT_ID || String(GOOGLE_CLIENT_ID).includes('your-google-client-id');

export default function Login({ onLoginSuccess, setCurrentPage, showAlert }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const finishLogin = (authData) => {
        const userLabel = authData.user.studentId || authData.user.fullName || authData.user.email;
        const message = authData.linkedGoogleNow
            ? `Tài khoản ${userLabel} đã được liên kết với Google và đăng nhập thành công.`
            : `Chào mừng ${userLabel} truy cập Cổng Dịch vụ sinh viên.`;

        toast.success(message);
        onLoginSuccess(authData);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const emailValue = normalizeEmail(email);
        if (!emailValue) {
            setEmailError('Vui lòng nhập email tài khoản');
            return;
        }
        if (!isStudentEmail(emailValue)) {
            setEmailError('Email đăng nhập bắt buộc phải có định dạng mssv@student.ctuet.edu.vn');
            return;
        }

        setEmailError('');
        setSubmitError('');
        setSubmitting(true);

        try {
            const authData = await authApi.login({
                email: emailValue,
                password,
                rememberMe: true,
            });
            if (authData.user.role !== STUDENT_ROLE) {
                throw new Error('Tài khoản này không thuộc cổng sinh viên');
            }
            finishLogin(authData);
        } catch (err) {
            setSubmitError(err.message || 'Đăng nhập thất bại');
            toast.error(err.message || 'Đăng nhập thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        if (!credentialResponse.credential) {
            setSubmitError('Không nhận được xác thực Google. Vui lòng thử lại.');
            toast.error('Không nhận được xác thực Google. Vui lòng thử lại.');
            return;
        }

        setSubmitError('');
        setSubmitting(true);
        try {
            const authData = await authApi.googleLogin({
                idToken: credentialResponse.credential,
                rememberMe: true,
            });
            if (authData.user.role !== STUDENT_ROLE) {
                throw new Error('Tài khoản này không thuộc cổng sinh viên');
            }
            finishLogin(authData);
        } catch (err) {
            setSubmitError(err.message || 'Đăng nhập Google thất bại');
            toast.error(err.message || 'Đăng nhập Google thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="login-split-container" id="frame_10_509" style={{ width: '100%', margin: '0' }}>
                <div className="login-left-brand" id="brand_10_511">
                    <div className="brand-gradient-overlay"></div>

                    <div className="brand-center-content" id="container_10_516">
                        <div className="brand-logo-container" id="margin_10_517">
                            <img
                                src="assets/images/logo-truong-removebg-preview.png"
                                alt="CTUT Logo"
                                className="brand-logo-img"
                            />
                        </div>

                        <h1 className="brand-main-title" id="title_10_522">
                            HỆ THỐNG DỊCH VỤ DÀNH CHO SINH VIÊN
                        </h1>
                        <div className="brand-divider" id="decor_10_524"></div>
                        <h3 className="brand-subtitle-text" id="text_10_525">
                            Khoa Công nghệ thông tin
                        </h3>
                    </div>

                    <div className="brand-footer-text" id="container_10_514">
                        <span>Can Tho University of Technology © 2026</span>
                    </div>
                </div>

                <div className="login-right-form-panel" id="background_10_526">
                    <div className="form-wrapper-inner" id="container_10_527">
                        <a
                            href="#home"
                            className="back-home-link"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage('home');
                            }}
                        >
                            <i className="fa-solid fa-arrow-left"></i> Quay lại Trang chủ
                        </a>

                        <div className="form-header" id="container_10_528">
                            <h2 className="form-header-title" id="title_10_530">
                                Đăng nhập hệ thống
                            </h2>
                            <p className="form-header-desc" id="text_10_532">
                                Chào mừng bạn quay trở lại với Cổng dịch vụ Sinh viên.
                            </p>
                        </div>

                        <div className="requirement-box" id="background_10_533">
                            <div className="req-icon-col">
                                <i className="fa-solid fa-circle-info req-icon"></i>
                            </div>
                            <div className="req-text-col">
                                <p className="req-text" id="text_10_538">
                                    <strong>Yêu cầu bắt buộc:</strong> Sinh viên sử dụng tài khoản
                                    Email định dạng <strong>@student.ctuet.edu.vn</strong> để truy
                                    cập hệ thống. Khi đăng nhập bằng Google, phải chọn đúng tài
                                    khoản Google trường đã được cấp.
                                </p>
                            </div>
                        </div>

                        <form className="login-submit-form" id="form_10_539" onSubmit={handleFormSubmit}>
                            <div className="form-group" id="container_10_540">
                                <label htmlFor="emailInput" className="form-label" id="label_10_541">
                                    Tài khoản Email
                                </label>
                                <input
                                    type="email"
                                    id="emailInput"
                                    className={`form-control ${emailError ? 'error' : ''}`}
                                    placeholder="mssv@student.ctuet.edu.vn"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError('');
                                    }}
                                    required
                                />
                                {emailError && (
                                    <span className="error-msg" id="emailErrorMsg">
                                        {emailError}
                                    </span>
                                )}
                            </div>

                            <div className="form-group" id="container_10_546">
                                <label htmlFor="passInput" className="form-label" id="label_10_548">
                                    Mật khẩu
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="passInput"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <i
                                        className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                                        id="togglePassword"
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>

                            {submitError && (
                                <span
                                    className="error-msg"
                                    style={{ display: 'block', marginBottom: '12px' }}
                                >
                                    {submitError}
                                </span>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-submit-login"
                                id="btn_10_553"
                                disabled={submitting}
                            >
                                {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>

                            <div className="or-divider" id="container_10_555">
                                <span className="divider-line"></span>
                                <span className="divider-text" id="text_10_558">
                                    Hoặc
                                </span>
                                <span className="divider-line"></span>
                            </div>

                            {isClientIdPlaceholder ? (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-block btn-google-login"
                                    id="btn_10_560"
                                    onClick={() => {
                                        showAlert?.(
                                            'Chưa cấu hình Google Client ID',
                                            'Tính năng đăng nhập Google chưa thể hoạt động. Vui lòng mở file .env và đặt VITE_GOOGLE_CLIENT_ID bằng Client ID thật từ Google Cloud Console.',
                                            'warning',
                                        );
                                    }}
                                >
                                    Đăng nhập bằng Google (Chưa cấu hình)
                                </button>
                            ) : (
                                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                    <div
                                        id="btn_10_560"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '10px',
                                            minHeight: '44px',
                                        }}
                                    >
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => {
                                                setSubmitError('Đăng nhập Google thất bại');
                                                toast.error('Đăng nhập Google thất bại');
                                            }}
                                            text="continue_with"
                                            shape="pill"
                                            width="320"
                                        />
                                    </div>
                                </GoogleOAuthProvider>
                            )}
                        </form>

                        <div className="form-links-row" id="border_10_567">
                            <a
                                href="javascript:void(0)"
                                className="form-help-link"
                                onClick={() =>
                                    showAlert?.(
                                        'Quên mật khẩu',
                                        'Vui lòng liên hệ trực tiếp với Phòng Đào tạo (phongdaotao@ctuet.edu.vn) để hỗ trợ khôi phục mật khẩu tài khoản sinh viên.',
                                        'info',
                                    )
                                }
                            >
                                <i className="fa-solid fa-lock"></i> Quên mật khẩu?
                            </a>
                            <a
                                href="javascript:void(0)"
                                className="form-help-link"
                                onClick={() =>
                                    showAlert?.(
                                        'Liên hệ hỗ trợ',
                                        'Tổng đài hỗ trợ kỹ thuật Cổng dịch vụ công sinh viên: (0292) 389 4050.',
                                        'info',
                                    )
                                }
                            >
                                <i className="fa-solid fa-circle-question"></i> Liên hệ hỗ trợ
                            </a>
                        </div>

                        <div className="panel-footer-row" id="container_10_578">
                            <span className="footer-version" id="text_10_580">
                                V.2.4.0 Stable
                            </span>
                            <span className="footer-security" id="text_10_582">
                                An ninh & Bảo mật
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
