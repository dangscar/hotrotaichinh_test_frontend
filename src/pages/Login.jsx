import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Login({ onLoginSuccess, setCurrentPage, showAlert, showConfirm }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isClientIdPlaceholder = !googleClientId || googleClientId.includes('your-google-client-id');

    useEffect(() => {
        if (isClientIdPlaceholder) return;

        // Dynamic script loading
        const scriptId = 'google-gsi-client';
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }

        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleCredentialResponse,
                });
                
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-btn"),
                    { theme: "outline", size: "large", width: "100%", text: "continue_with" }
                );
            }
        };

        script.onload = initializeGoogleSignIn;
        if (window.google) {
            initializeGoogleSignIn();
        }
    }, [isClientIdPlaceholder, googleClientId]);

    const handleGoogleCredentialResponse = (response) => {
        try {
            const idToken = response.credential;
            // Decode ID Token JWT on client side
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);
            
            const emailValue = payload.email.trim().toLowerCase();
            const emailDomain = '@student.ctuet.edu.vn';
            
            if (!emailValue.endsWith(emailDomain)) {
                toast.error(`Đăng nhập thất bại: Tài khoản Google của bạn (${emailValue}) không thuộc tên miền sinh viên của trường (${emailDomain}). Vui lòng đăng nhập lại bằng tài khoản sinh viên CTUT.`);
                return;
            }

            const mssv = emailValue.split('@')[0].toUpperCase();
            toast.success(`Chào mừng sinh viên ${payload.name || mssv} (${mssv}) truy cập Cổng Dịch vụ công sinh viên.`);
            onLoginSuccess(mssv, emailValue);
        } catch (error) {
            console.error("Lỗi xác thực Google:", error);
            toast.error("Không thể xử lý thông tin phản hồi từ Google.");
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const emailValue = email.trim().toLowerCase();
        const emailDomain = '@student.ctuet.edu.vn';
        
        // Validate student email domain
        if (!emailValue.endsWith(emailDomain)) {
            setEmailError('Email đăng nhập bắt buộc phải có định dạng mssv@student.ctuet.edu.vn');
            return;
        }

        setEmailError('');
        const mssv = emailValue.split('@')[0].toUpperCase();
        
        toast.success(`Chào mừng sinh viên ${mssv} truy cập Cổng Dịch vụ công sinh viên.`);
        onLoginSuccess(mssv, emailValue);
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
                                    <strong>Yêu cầu bắt buộc:</strong> Sinh viên sử dụng tài khoản Email định dạng <strong>@student.ctuet.edu.vn</strong> để truy cập hệ thống.
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

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary btn-block btn-submit-login" id="btn_10_553">
                                Đăng nhập
                            </button>

                            {/* Divider */}
                            <div className="or-divider" id="container_10_555">
                                <span className="divider-line"></span>
                                <span className="divider-text" id="text_10_558">Hoặc</span>
                                <span className="divider-line"></span>
                            </div>

                            {/* Google login button */}
                            {isClientIdPlaceholder ? (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-block btn-google-login" 
                                    id="btn_10_560"
                                    onClick={() => {
                                        showAlert(
                                            "Chưa cấu hình Google Client ID", 
                                            "Tính năng đăng nhập Google chưa thể hoạt động. Vui lòng mở file .env ở thư mục dự án frontend và thay thế giá trị VITE_GOOGLE_CLIENT_ID bằng Client ID thật của bạn được tạo từ Google Cloud Console.", 
                                            "warning"
                                        );
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" className="google-svg-icon" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                    </svg>
                                    Đăng nhập bằng Google (Chưa cấu hình)
                                </button>
                            ) : (
                                <div 
                                    id="google-signin-btn" 
                                    style={{ 
                                        width: '100%', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        marginTop: '10px',
                                        minHeight: '44px' 
                                    }}
                                ></div>
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
