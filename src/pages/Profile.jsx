import React, { useState, useEffect } from 'react';

const DEFAULT_PROFILE = {
    phone: "0982394224",
    cccd: "079204001948",
    bankAcc: "1024508930",
    address: "Khu vực 2, Đường Nguyễn Văn Cừ kéo dài, An Khánh, Ninh Kiều, Cần Thơ",
    hokhau: "Ấp Thới Thuận, Xã Thới Đông, Huyện Cờ Đỏ, Thành phố Cần Thơ"
};

export default function Profile({ studentUser, setCurrentPage, showAlert, showConfirm }) {
    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem('studentProfile');
        return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    });

    const [phone, setPhone] = useState(profile.phone);
    const [cccd, setCccd] = useState(profile.cccd);
    const [bankAcc, setBankAcc] = useState(profile.bankAcc);
    const [address, setAddress] = useState(profile.address);
    const [hokhau, setHokhau] = useState(profile.hokhau);
    const [showSuccess, setShowSuccess] = useState(false);
    const displayStudentId = studentUser?.studentId || '';
    const displayFullName = studentUser?.fullName || '';
    const displayEmail = studentUser?.email || '';

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const updated = {
            phone: phone.trim(),
            cccd: cccd.trim(),
            bankAcc: bankAcc.trim(),
            address: address.trim(),
            hokhau: hokhau.trim()
        };

        setProfile(updated);
        localStorage.setItem('studentProfile', JSON.stringify(updated));
        
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
            setShowSuccess(false);
        }, 6000);
    };

    const handleCancel = () => {
        showConfirm(
            "Hủy bỏ thay đổi",
            "Bạn có muốn hủy các thay đổi chưa lưu và khôi phục dữ liệu gốc?",
            () => {
                setPhone(profile.phone);
                setCccd(profile.cccd);
                setBankAcc(profile.bankAcc);
                setAddress(profile.address);
                setHokhau(profile.hokhau);
                setShowSuccess(false);
            },
            null,
            "warning",
            "Hủy bỏ",
            "Quay lại"
        );
    };

    return (
        <main className="page-content-wrapper">
            <div className="content-container">
                
                {/* Breadcrumbs */}
                <nav className="breadcrumbs-nav" id="breadcrumbs_203_41">
                    <a href="#home" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Trang chủ</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <span className="breadcrumb-current">Thông tin cá nhân</span>
                </nav>

                {/* Page Title */}
                <div className="page-main-header">
                    <h1 className="page-title-text" id="title_203_48">THÔNG TIN CÁ NHÂN</h1>
                    <div className="underline-decor left-align"></div>
                </div>

                {/* Success Banner */}
                {showSuccess && (
                    <section className="banner-notification success-style" id="profileSuccessBanner" style={{ display: 'flex', marginBottom: '24px' }}>
                        <div className="banner-icon-wrapper">
                            <i className="fa-solid fa-circle-check banner-icon"></i>
                        </div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Thông tin cá nhân đã được cập nhật thành công!</h4>
                            <p className="banner-desc">Hệ thống đã lưu lại các thay đổi mới nhất vào hồ sơ học sinh.</p>
                        </div>
                    </section>
                )}

                {/* Profile Form Card */}
                <section className="profile-card" id="frame_203_123">
                    <form id="profileUpdateForm" onSubmit={handleFormSubmit}>
                        
                        {/* Avatar */}
                        <div className="profile-avatar-section" id="group_203_124">
                            <div className="avatar-large-circle" id="ellipse_203_125">
                                <i className="fa-solid fa-user-tie avatar-placeholder-icon"></i>
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-upload-avatar"
                                onClick={() => showAlert(
                                    "Đổi ảnh đại diện", 
                                    "Tính năng tải lên hình ảnh đại diện từ máy tính hiện đang được phát triển.", 
                                    "info"
                                )}
                            >
                                <i className="fa-solid fa-camera"></i> Đổi ảnh đại diện
                            </button>
                        </div>

                        {/* Split Form Columns */}
                        <div className="profile-form-grid">
                            
                            {/* Left Column: Academic Info */}
                            <div className="form-col-section">
                                <h4 className="form-col-title"><i className="fa-solid fa-graduation-cap"></i> Thông tin học vụ (Chỉ đọc)</h4>
                                
                                <div className="form-group">
                                    <label className="form-label-read">Mã số sinh viên</label>
                                    <input type="text" className="form-control-read" value={displayStudentId} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Họ và tên</label>
                                    <input type="text" className="form-control-read" value={displayFullName} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Ngày sinh</label>
                                    <input type="text" className="form-control-read" value="11/10/2004" readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Ngành học</label>
                                    <input type="text" className="form-control-read" value="Công nghệ thông tin" readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Khóa học</label>
                                    <input type="text" className="form-control-read" value="K10" readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Hệ đào tạo</label>
                                    <input type="text" className="form-control-read" value="Đại học chính quy" readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Email sinh viên</label>
                                    <input type="text" className="form-control-read" value={displayEmail} readOnly />
                                </div>
                            </div>

                            {/* Right Column: Personal Info */}
                            <div className="form-col-section">
                                <h4 className="form-col-title"><i className="fa-solid fa-user-pen"></i> Thông tin liên hệ & cá nhân</h4>
                                
                                <div className="form-group" id="group_203_154">
                                    <label htmlFor="profilePhone" className="form-label">Số điện thoại <span className="required">*</span></label>
                                    <input 
                                        type="tel" 
                                        id="profilePhone" 
                                        className="form-control" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="form-group" id="group_203_145">
                                    <label htmlFor="profileCccd" className="form-label">Số CCCD/CMND <span className="required">*</span></label>
                                    <input 
                                        type="text" 
                                        id="profileCccd" 
                                        className="form-control" 
                                        placeholder="Nhập số CCCD..." 
                                        value={cccd}
                                        onChange={(e) => setCccd(e.target.value)}
                                        required 
                                    />
                                </div>

                                <div className="form-group" id="group_203_141">
                                    <label htmlFor="profileBankAcc" className="form-label">Số tài khoản ngân hàng (Vietcombank)</label>
                                    <input 
                                        type="text" 
                                        id="profileBankAcc" 
                                        className="form-control" 
                                        placeholder="Nhập số tài khoản Vietcombank..."
                                        value={bankAcc}
                                        onChange={(e) => setBankAcc(e.target.value)}
                                    />
                                </div>

                                <div className="form-group" id="group_203_148">
                                    <label htmlFor="profileAddress" className="form-label">Địa chỉ hiện tại <span className="required">*</span></label>
                                    <textarea 
                                        id="profileAddress" 
                                        className="form-control-area" 
                                        rows="3" 
                                        placeholder="Nhập số nhà, tên đường..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group" id="group_203_151">
                                    <label htmlFor="profileHokhau" className="form-label">Hộ khẩu thường trú <span className="required">*</span></label>
                                    <textarea 
                                        id="profileHokhau" 
                                        className="form-control-area" 
                                        rows="3" 
                                        placeholder="Nhập địa chỉ hộ khẩu..."
                                        value={hokhau}
                                        onChange={(e) => setHokhau(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                        </div>

                        {/* Action buttons */}
                        <div className="profile-actions-bar">
                            <button type="button" onClick={handleCancel} id="btnCancelProfile" className="btn btn-secondary">Hủy bỏ</button>
                            <button type="submit" className="btn btn-primary btn-save-profile">Cập nhật thông tin</button>
                        </div>

                    </form>
                </section>

            </div>
        </main>
    );
}
