import React, { useState, useEffect } from 'react';
import { getStudentByEmail } from '../constants/mockStudents';

export default function Profile({ setCurrentPage, showAlert, showConfirm }) {
    const email = localStorage.getItem('studentEmail') || '';
    const currentStudent = getStudentByEmail(email);

    const [profile, setProfile] = useState(() => {
        const profileKey = currentStudent ? `studentProfile_${currentStudent.mssv}` : 'studentProfile';
        const stored = localStorage.getItem(profileKey);
        if (stored) return JSON.parse(stored);

        return {
            phone: currentStudent?.phone || "0982394224",
            cccd: currentStudent?.cccd || "079204001948",
            bankAcc: currentStudent?.bankAcc || "1024508930",
            address: currentStudent?.address || "Khu vực 2, Đường Nguyễn Văn Cừ kéo dài, An Khánh, Ninh Kiều, Cần Thơ",
            hokhau: currentStudent?.hokhau || "Ấp Thới Thuận, Xã Thới Đông, Huyện Cờ Đỏ, Thành phố Cần Thơ",
            avatar: null
        };
    });

    const [phone, setPhone] = useState(profile.phone);
    const [cccd, setCccd] = useState(profile.cccd);
    const [bankAcc, setBankAcc] = useState(profile.bankAcc);
    const [address, setAddress] = useState(profile.address);
    const [hokhau, setHokhau] = useState(profile.hokhau);
    const [avatar, setAvatar] = useState(profile.avatar || null);
    const [showSuccess, setShowSuccess] = useState(false);

    const fileInputRef = React.useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showAlert("File quá lớn", "Vui lòng chọn ảnh đại diện có kích thước dưới 2MB.", "error");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const updated = {
            phone: phone.trim(),
            cccd: cccd.trim(),
            bankAcc: bankAcc.trim(),
            address: address.trim(),
            hokhau: hokhau.trim(),
            avatar: avatar
        };

        setProfile(updated);
        const profileKey = currentStudent ? `studentProfile_${currentStudent.mssv}` : 'studentProfile';
        localStorage.setItem(profileKey, JSON.stringify(updated));

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
                setAvatar(profile.avatar || null);
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

                {/* Back navigation button */}
                <div className="back-nav-container" style={{ margin: '15px 0 10px 0' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage('home')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            background: '#f8f9fa',
                            color: '#333',
                            border: '1px solid #ddd',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
                    </button>
                </div>

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
                            <div className="avatar-large-circle" id="ellipse_203_125" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9ecef' }}>
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <i className="fa-solid fa-user-tie avatar-placeholder-icon"></i>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary btn-upload-avatar"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            >
                                <i className="fa-solid fa-camera"></i> Đổi ảnh đại diện
                            </button>
                        </div>

                        {/* Split Form Columns */}
                        <div className="profile-form-grid">

                            {/* Left Column: Academic Info */}
                            <div className="form-col-section">
                                <h4 className="form-col-title"><i className="fa-solid fa-graduation-cap"></i> Thông tin học vụ </h4>

                                <div className="form-group">
                                    <label className="form-label-read">Mã số sinh viên</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.mssv || "221105024"} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Họ và tên</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.name || "Nguyễn Văn A"} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Ngày sinh</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.dob || "11/10/2004"} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Ngành học</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.major || "Công nghệ thông tin"} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Khóa học</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.cohort || "K10"} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Hệ đào tạo</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.degreeType || "Đại học chính quy"} readOnly />
                                </div>

                                <div className="form-group">
                                    <label className="form-label-read">Email sinh viên</label>
                                    <input type="text" className="form-control-read" value={currentStudent?.email || "nvacntt2211@student.ctuet.edu.vn"} readOnly />
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
                                    <label className="form-label-read">Số CCCD/CMND</label>
                                    <input
                                        type="text"
                                        className="form-control-read"
                                        value={currentStudent?.cccd || profile.cccd}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group" id="group_203_141">
                                    <label className="form-label-read">Số tài khoản ngân hàng (Vietcombank)</label>
                                    <input
                                        type="text"
                                        className="form-control-read"
                                        value={currentStudent?.bankAcc || profile.bankAcc}
                                        readOnly
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
