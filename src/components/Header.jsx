import React, { useState, useEffect } from 'react';
import { getStudentById } from '../constants/mockStudents';

export default function Header({ studentId, onLogout, currentPage, setCurrentPage, showAlert, showConfirm }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [avatar, setAvatar] = useState(null);

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [readIds, setReadIds] = useState(() => {
        const stored = localStorage.getItem('readNotifications');
        return stored ? JSON.parse(stored) : [];
    });
    const [bellOpen, setBellOpen] = useState(false);

    useEffect(() => {
        if (studentId) {
            const profileKey = `studentProfile_${studentId}`;
            const stored = localStorage.getItem(profileKey);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setAvatar(parsed.avatar || null);
                } catch (e) {
                    console.error("Error reading avatar from localStorage:", e);
                }
            } else {
                setAvatar(null);
            }
        } else {
            setAvatar(null);
        }
    }, [studentId, currentPage]);

    // Load and listen to notifications
    useEffect(() => {
        if (!studentId) {
            setNotifications([]);
            return;
        }

        const loadNotifications = () => {
            const stored = localStorage.getItem('studentRecords');
            if (stored) {
                try {
                    const recordsList = JSON.parse(stored);
                    const mapped = recordsList.map(record => {
                        let message = '';
                        let icon = 'fa-circle-info';
                        let color = '#3b82f6';
                        
                        if (record.status === 'Đã phê duyệt') {
                            message = `Yêu cầu "${record.type}" của bạn đã được phê duyệt thành công.`;
                            icon = 'fa-circle-check';
                            color = '#10b981';
                        } else if (record.status === 'Bị từ chối') {
                            message = `Yêu cầu "${record.type}" của bạn đã bị từ chối.`;
                            icon = 'fa-circle-xmark';
                            color = '#ef4444';
                        } else if (record.status === 'Đang xử lý') {
                            message = `Yêu cầu "${record.type}" của bạn đang được thụ lý và xử lý.`;
                            icon = 'fa-clock';
                            color = '#f59e0b';
                        } else {
                            message = `Yêu cầu "${record.type}" của bạn đã được tiếp nhận và chờ xử lý.`;
                            icon = 'fa-spinner';
                            color = '#6b7280';
                        }
                        
                        return {
                            id: record.id,
                            title: record.type,
                            message: message,
                            status: record.status,
                            time: record.dateDisplay || record.date,
                            icon,
                            color
                        };
                    });
                    setNotifications(mapped);
                } catch (e) {
                    console.error("Error parsing studentRecords:", e);
                }
            }
        };

        loadNotifications();

        const handleStorageChange = (e) => {
            if (e.key === 'studentRecords') {
                loadNotifications();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [studentId, currentPage]);

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
        setBellOpen(false);
    };

    const toggleBell = (e) => {
        e.stopPropagation();
        setBellOpen(!bellOpen);
        setDropdownOpen(false);
    };

    const handleNotificationClick = (id) => {
        if (!readIds.includes(id)) {
            const updated = [...readIds, id];
            setReadIds(updated);
            localStorage.setItem('readNotifications', JSON.stringify(updated));
        }
        setBellOpen(false);
        window.location.hash = `detail/${id}`;
    };

    const handleMarkAllRead = () => {
        const allIds = notifications.map(n => n.id);
        setReadIds(allIds);
        localStorage.setItem('readNotifications', JSON.stringify(allIds));
    };

    // Close dropdowns on click outside
    useEffect(() => {
        const closeDropdowns = () => {
            setDropdownOpen(false);
            setBellOpen(false);
        };
        document.addEventListener('click', closeDropdowns);
        return () => document.removeEventListener('click', closeDropdowns);
    }, []);

    const handleNavClick = (pageId, e) => {
        e.preventDefault();
        setCurrentPage('home');
        setMenuOpen(false); // Close mobile menu when clicked

        // Wait for render, then scroll to section
        setTimeout(() => {
            const element = document.getElementById(pageId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

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
                        <span className="brand-subtitle" id="subtitle_6_416">Cổng dịch vụ sinh viên</span>
                    </div>
                </div>

                {/* Navigation Bar - Shifted left by placing as sibling of brand-group and header-controls */}
                <nav className={`nav-bar ${menuOpen ? 'show' : ''}`} id="nav_6_418">
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
                </nav>

                {/* Header controls (including User Profile avatar & notifications) */}
                <div className="header-controls" id="controls_6_417">
                    <div className="btn-group" id="btn_group_6_427">
                        {studentId ? (
                            (() => {
                                const student = getStudentById(studentId);
                                return (
                                    <div className="header-user-section" style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                                        {/* Notifications bell */}
                                        <div className="notifications-container" onClick={(e) => e.stopPropagation()}>
                                            <button className="bell-btn" onClick={toggleBell} aria-label="Thông báo" title="Thông báo">
                                                <i className="fa-regular fa-bell"></i>
                                                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
                                            </button>
                                            
                                            <div className={`notifications-dropdown ${bellOpen ? 'show' : ''}`}>
                                                <div className="notifications-header">
                                                    <h3>Thông báo</h3>
                                                    {unreadCount > 0 && (
                                                        <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
                                                            Đánh dấu tất cả đã đọc
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="notifications-list">
                                                    {notifications.length > 0 ? (
                                                        notifications.map((notif) => {
                                                            const isUnread = !readIds.includes(notif.id);
                                                            return (
                                                                <div 
                                                                    key={notif.id} 
                                                                    className={`notification-item ${isUnread ? 'unread' : ''}`}
                                                                    onClick={() => handleNotificationClick(notif.id)}
                                                                >
                                                                    <div className="notification-icon-wrapper" style={{ color: notif.color }}>
                                                                        <i className={`fa-solid ${notif.icon}`}></i>
                                                                    </div>
                                                                    <div className="notification-content">
                                                                        <span className="notification-title">{notif.title}</span>
                                                                        <span className="notification-msg">{notif.message}</span>
                                                                        <span className="notification-time">{notif.time}</span>
                                                                    </div>
                                                                    {isUnread && <div className="notification-unread-dot"></div>}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="notifications-empty">
                                                            <i className="fa-regular fa-bell-slash"></i>
                                                            <span>Không có thông báo nào</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* User profile avatar dropdown */}
                                        <div className="user-profile avatar-only" onClick={toggleDropdown}>
                                            <div className="profile-avatar-col">
                                                <div className="avatar-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {avatar ? (
                                                        <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <i className="fa-solid fa-user"></i>
                                                    )}
                                                </div>
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
                                    </div>
                                );
                            })()
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
                </div>

                {/* Mobile Menu Toggle Button (Square rounded menu button) */}
                <button
                    className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                    aria-label="Toggle menu"
                >
                    <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
            </div>
        </header>
    );
}
