import React, { useState, useEffect } from 'react';

export default function Header({ studentId, onLogout, currentPage, setCurrentPage, showAlert, showConfirm }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const closeDropdown = () => setDropdownOpen(false);
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    const handleNavClick = (pageId, e) => {
        e.preventDefault();
        setCurrentPage('home');
        
        // Wait for render, then scroll to section
        setTimeout(() => {
            const element = document.getElementById(pageId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <header className={`main-header ${scrolled ? 'scrolled' : ''}`} id="header_6_408">
            <div className="header-container" id="container_6_409">
                {/* Logo & Brand Info */}
                <div className="brand-group" id="brand_6_410" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
                    <div className="logo-wrapper" id="logo_6_411">
                        <img src="assets/images/logo-truong-removebg-preview.png" alt="CTUT Logo" className="logo-img" />
                    </div>
                    <div className="brand-text" id="text_6_412">
                        <h1 className="brand-title" id="title_6_414">Khoa CNTT - CTUT</h1>
                        <span className="brand-subtitle" id="subtitle_6_416">Cổng dịch vụ công sinh viên</span>
                    </div>
                </div>

                {/* Navigation Bar */}
                <nav className="nav-bar" id="nav_6_418">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a 
                                href="#hero" 
                                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                                onClick={(e) => handleNavClick('hero', e)}
                            >
                                Trang chủ
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                href="#procedures" 
                                className="nav-link" 
                                onClick={(e) => handleNavClick('procedures', e)}
                            >
                                Thủ tục
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                href="#steps" 
                                className="nav-link" 
                                onClick={(e) => handleNavClick('steps', e)}
                            >
                                Quy trình
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                href="#footer" 
                                className="nav-link" 
                                onClick={(e) => handleNavClick('footer', e)}
                            >
                                Hướng dẫn
                            </a>
                        </li>
                    </ul>
                    
                    <div className="btn-group" id="btn_group_6_427">
                        {studentId ? (
                            <div className="user-profile" onClick={toggleDropdown}>
                                <div className="profile-info-col">
                                    <span className="user-name">Nguyễn Văn A</span>
                                    <span className="user-role">Sinh viên - K10</span>
                                </div>
                                <div className="profile-avatar-col">
                                    <div className="avatar-circle">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
                                </div>
                                <div className={`profile-dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                    <a href="#profile" onClick={(e) => { e.preventDefault(); setCurrentPage('profile'); }}>
                                        <i className="fa-solid fa-user-gear"></i> Cá nhân
                                    </a>
                                    <a href="#search" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>
                                        <i className="fa-solid fa-folder-open"></i> Hồ sơ của tôi
                                    </a>
                                    <hr />
                                    <a 
                                        href="#logout" 
                                        onClick={(e) => { 
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
                                        }} 
                                        className="logout-link"
                                    >
                                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <a 
                                href="#login" 
                                className="btn btn-primary btn-login" 
                                id="btn_145:604"
                                onClick={(e) => { e.preventDefault(); setCurrentPage('login'); }}
                            >
                                Đăng nhập
                            </a>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
