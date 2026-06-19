import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage, onLogout, showAlert, showConfirm }) {
    const handleLogoutClick = (e) => {
        e.preventDefault();
        showConfirm(
            "ĐĂNG XUẤT",
            "Bạn có chắc muốn đăng xuất khỏi hệ thống dịch vụ công?",
            onLogout,
            null,
            "warning",
            "Đăng xuất",
            "Hủy bỏ"
        );
    };

    return (
        <div className="nav-sidebar" id="dynamic-sidebar">
            <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
                <img src="assets/images/logo-truong-removebg-preview.png" alt="Logo" />
            </div>
            <div className="sidebar-menu">
                <a 
                    href="#home" 
                    className={`sidebar-item ${currentPage === 'home' ? 'active' : ''}`} 
                    title="Trang chủ"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                >
                    <i className="fa-solid fa-house"></i>
                </a>
                <a 
                    href="#search" 
                    className={`sidebar-item ${currentPage === 'search' ? 'active' : ''}`} 
                    title="Tra cứu hồ sơ"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                </a>
                <a 
                    href="#profile" 
                    className={`sidebar-item ${currentPage === 'profile' ? 'active' : ''}`} 
                    title="Thông tin cá nhân"
                    onClick={(e) => { e.preventDefault(); setCurrentPage('profile'); }}
                >
                    <i className="fa-solid fa-user-graduate"></i>
                </a>
            </div>
            <div className="sidebar-footer">
                <a 
                    href="#logout" 
                    className="sidebar-item" 
                    title="Đăng xuất"
                    onClick={handleLogoutClick}
                >
                    <i className="fa-solid fa-right-from-bracket"></i>
                </a>
            </div>
        </div>
    );
}
