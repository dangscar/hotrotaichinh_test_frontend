import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { authApi } from '../services/authApi';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const STUDENT_ROLE = 'student';

export default function Login({ onLoginSuccess, setCurrentPage, showAlert, showConfirm }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const emailValue = email.trim().toLowerCase();
        if (!emailValue) {
            setEmailError('Vui lòng nhập email tài khoản');
            return;
        }

        setEmailError('');
        setSubmitError('');
        setSubmitting(true);

        try {
            const authData = await authApi.login({
                email: emailValue,
                password,
                rememberMe: true
            });
            if (authData.user.role !== STUDENT_ROLE) {
                throw new Error('Tài khoản này không thuộc cổng sinh viên');
            }
            // Lưu token ngay, không chờ bấm Đồng ý trên modal
            onLoginSuccess(authData);
            const userLabel = authData.user.studentId || authData.user.fullName || emailValue;

            showAlert(
                'Đăng nhập thành công',
                `Chào mừng ${userLabel} truy cập Cổng Dịch vụ công sinh viên.`,
                'success',
            );
        } catch (err) {
            setSubmitError(err.message || 'Đăng nhập thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        if (!credentialResponse.credential) {
            setSubmitError('Không nhận được xác thực Google. Vui lòng thử lại.');
            return;
        }

        setSubmitError('');
        setSubmitting(true);
        try {
            const authData = await authApi.googleLogin({
                idToken: credentialResponse.credential,
                rememberMe: true
            });
            if (authData.user.role !== STUDENT_ROLE) {
                throw new Error('Tài khoản này không thuộc cổng sinh viên');
            }
            onLoginSuccess(authData);
            const userLabel = authData.user.studentId || authData.user.fullName || authData.user.email;

            showAlert(
                authData.linkedGoogleNow ? 'Liên kết Google thành công' : 'Đăng nhập Google thành công',
                authData.linkedGoogleNow
                    ? `Tài khoản ${userLabel} đã được liên kết với Google và đăng nhập thành công.`
                    : `Chào mừng ${userLabel} truy cập Cổng Dịch vụ công sinh viên.`,
                'success',
            );
        } catch (err) {
            setSubmitError(err.message || 'Đăng nhập Google thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="login-split-container" id="frame_10_509" style={{ width: '100%', margin: '0' }}>
                
                {/* Left Section: Branding & Graphics */}
                <div className="login-left-brand" id="brand_10_511">
                    <div className="brand-gradient-overlay"></div>
                    
                    <div className="brand-center-content" id="container_10_516">
                        {/* University Logo */}
                        <div className="brand-logo-container" id="margin_10_517">
                            <img src="assets/images/logo-truong-removebg-preview.png" alt="CTUT Logo" className="brand-logo-img" />
                        </div>
                        
                        <h1 className="brand-main-title" id="title_10_522">Hệ Thống dịch vụ công</h1>
                        <div className="brand-divider" id="decor_10_524"></div>
                        <h3 className="brand-subtitle-text" id="text_10_525">Khoa Công nghệ Thông tin</h3>
                    </div>

                    {/* Left Footer Copyright */}
                    <div className="brand-footer-text" id="container_10_514">
                        <span>Can Tho University of Technology © 2026</span>
                    </div>
                </div>

                {/* Right Section: Login Form */}
                <div className="login-right-form-panel" id="background_10_526">
                    <div className="form-wrapper-inner" id="container_10_527">
                        {/* Back Link */}
                        <a 
                            href="#home" 
                            className="back-home-link"
                            onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                        >
                            <i className="fa-solid fa-arrow-left"></i> Quay lại Trang chủ
                        </a>

                        {/* Header Info */}
                        <div className="form-header" id="container_10_528">
                            <h2 className="form-header-title" id="title_10_530">Đăng nhập hệ thống</h2>
                            <p className="form-header-desc" id="text_10_532">Chào mừng bạn quay trở lại với Cổng dịch vụ công Sinh viên.</p>
                        </div>

                        {/* Requirement Note */}
                        <div className="requirement-box" id="background_10_533">
                            <div className="req-icon-col">
                                <i className="fa-solid fa-circle-info req-icon"></i>
                            </div>
                            <div className="req-text-col">
                                <p className="req-text" id="text_10_538">
                                    <strong>Yêu cầu bắt buộc:</strong> Sinh viên sử dụng tài khoản Email định dạng <strong>@student.ctuet.edu.vn</strong> để truy cập hệ thống. Khi đăng nhập bằng Google, bạn cũng phải chọn đúng tài khoản Google trường <strong>@student.ctuet.edu.vn</strong> đã được cấp.
                                </p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form className="login-submit-form" id="form_10_539" onSubmit={handleFormSubmit}>
                            <div className="form-group" id="container_10_540">
                                <label htmlFor="emailInput" className="form-label" id="label_10_541">Tài khoản Email</label>
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
                                {emailError && <span className="error-msg" id="emailErrorMsg">{emailError}</span>}
                            </div>

                            <div className="form-group" id="container_10_546">
                                <label htmlFor="passInput" className="form-label" id="label_10_548">Mật khẩu</label>
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

                            {submitError && <span className="error-msg" style={{ display: 'block', marginBottom: '12px' }}>{submitError}</span>}

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary btn-block btn-submit-login" id="btn_10_553" disabled={submitting}>
                                {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>

                            {/* Divider */}
                            <div className="or-divider" id="container_10_555">
                                <span className="divider-line"></span>
                                <span className="divider-text" id="text_10_558">Hoặc</span>
                                <span className="divider-line"></span>
                            </div>

                            {/* Google login button */}
                            {GOOGLE_CLIENT_ID ? (
                                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                    <div id="btn_10_560" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => setSubmitError('Đăng nhập Google thất bại')}
                                            text="signin_with"
                                            shape="pill"
                                            width="320"
                                        />
                                    </div>
                                </GoogleOAuthProvider>
                            ) : (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-block btn-google-login" 
                                    id="btn_10_560"
                                    onClick={() => {
                                        showAlert("Đăng nhập Google", "Thiếu cấu hình Google Client ID cho giao diện sinh viên.", "warning");
                                    }}
                                >
                                    Đăng nhập bằng Google
                                </button>
                            )}
                        </form>

                        {/* Help links */}
                        <div className="form-links-row" id="border_10_567">
                            <a href="javascript:void(0)" className="form-help-link" onClick={() => showAlert("Quên mật khẩu", "Vui lòng liên hệ trực tiếp với Phòng Đào tạo (phongdaotao@ctuet.edu.vn) để hỗ trợ khôi phục mật khẩu tài khoản sinh viên.", "info")}><i className="fa-solid fa-lock"></i> Quên mật khẩu?</a>
                            <a href="javascript:void(0)" className="form-help-link" onClick={() => showAlert("Liên hệ hỗ trợ", "Tổng đài hỗ trợ kỹ thuật Cổng dịch vụ công sinh viên: (0292) 389 4050.", "info")}><i className="fa-solid fa-circle-question"></i> Liên hệ hỗ trợ</a>
                        </div>

                        {/* Footer Right Panel */}
                        <div className="panel-footer-row" id="container_10_578">
                            <span className="footer-version" id="text_10_580">V.2.4.0 Stable</span>
                            <span className="footer-security" id="text_10_582">An ninh & Bảo mật</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
