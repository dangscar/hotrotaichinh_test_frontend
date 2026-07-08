import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Profile from './pages/Profile';
import WriteApplication from './pages/WriteApplication';
import CustomModal from './components/CustomModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DEFAULT_RECORDS } from './constants/defaultRecords';

export default function App() {
    // Session states
    const [studentId, setStudentId] = useState(() => localStorage.getItem('studentId'));
    const [studentEmail, setStudentEmail] = useState(() => localStorage.getItem('studentEmail'));
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    // Page routing state
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // Records state list
    const [records, setRecords] = useState(() => {
        const stored = localStorage.getItem('studentRecords');
        if (!stored) {
            localStorage.setItem('studentRecords', JSON.stringify(DEFAULT_RECORDS));
            return DEFAULT_RECORDS;
        }
        return JSON.parse(stored);
    });

    // Custom Modal config state
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        onConfirm: null,
        onCancel: null
    });

    // Modal helpers
    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setModalConfig({
            isOpen: true,
            type,
            title,
            message,
            confirmText: 'Đồng ý',
            cancelText: null,
            onConfirm: () => {
                setModalConfig(prev => ({ ...prev, isOpen: false }));
                if (onConfirm) onConfirm();
            },
            onCancel: null
        });
    };

    const showConfirm = (title, message, onConfirm, onCancel = null, type = 'warning', confirmText = 'Xác nhận', cancelText = 'Hủy bỏ') => {
        setModalConfig({
            isOpen: true,
            type,
            title,
            message,
            confirmText,
            cancelText,
            onConfirm: () => {
                setModalConfig(prev => ({ ...prev, isOpen: false }));
                if (onConfirm) onConfirm();
            },
            onCancel: () => {
                setModalConfig(prev => ({ ...prev, isOpen: false }));
                if (onCancel) onCancel();
            }
        });
    };

    // Sync current page state to window hash
    useEffect(() => {
        const currentHash = window.location.hash.replace('#', '');
        let expectedHash = currentPage;
        if (currentPage === 'detail' && selectedRecordId) {
            expectedHash = `detail/${selectedRecordId}`;
        } else if (currentPage === 'write-application' && selectedTemplateId) {
            expectedHash = `write-application/${selectedTemplateId}`;
        }

        if (currentHash !== expectedHash) {
            window.location.hash = expectedHash;
        }
    }, [currentPage, selectedRecordId, selectedTemplateId]);

    // Handle hash change events (e.g. browser back/forward buttons)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (!hash) {
                setCurrentPage('home');
                return;
            }

            const parts = hash.split('/');
            const route = parts[0];

            if (route === 'detail' && parts[1]) {
                setSelectedRecordId(parts[1]);
                setCurrentPage('detail');
            } else if (route === 'write-application' && parts[1]) {
                setSelectedTemplateId(parts[1]);
                setCurrentPage('write-application');
            } else if (['home', 'login', 'search', 'profile'].includes(route)) {
                setCurrentPage(route);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Run once initially

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Sync records to localStorage when changed
    useEffect(() => {
        localStorage.setItem('studentRecords', JSON.stringify(records));
    }, [records]);

    // Handle authentication redirect guard checks
    useEffect(() => {
        const securePages = ['search', 'detail', 'profile', 'write-application'];
        if (securePages.includes(currentPage) && !studentId) {
            showAlert(
                "Yêu cầu đăng nhập", 
                "Vui lòng đăng nhập bằng email sinh viên để tiếp tục sử dụng dịch vụ.", 
                "warning",
                () => {
                    setCurrentPage('login');
                }
            );
        }
    }, [currentPage, studentId]);

    // Handle scroll to top visibility
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLoginSuccess = (id, email) => {
        setStudentId(id);
        setStudentEmail(email);
        localStorage.setItem('studentId', id);
        localStorage.setItem('studentEmail', email);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setStudentId(null);
        setStudentEmail(null);
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentEmail');
        setCurrentPage('home');
    };

    const handleWithdraw = (recordId) => {
        showConfirm(
            "XÁC NHẬN RÚT HỒ SƠ",
            "Bạn có chắc chắn muốn rút hồ sơ này? Thao tác này không thể hoàn tác và hồ sơ sẽ bị hủy bỏ.",
            () => {
                const updated = records.map(r => {
                    if (r.id === recordId) {
                        const now = new Date();
                        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}, ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
                        return {
                            ...r,
                            status: "Bị từ chối",
                            history: [
                                `${timeString} - Sinh viên thực hiện rút hồ sơ yêu cầu. Đơn tự động hủy.`,
                                ...r.history
                            ]
                        };
                    }
                    return r;
                });
                setRecords(updated);
                showAlert(
                    "Rút hồ sơ thành công", 
                    "Trạng thái đơn đã được cập nhật thành Bị từ chối và hủy bỏ trên hệ thống.", 
                    "success"
                );
            },
            null,
            "danger",
            "Rút hồ sơ",
            "Hủy bỏ"
        );
    };

    // Sidebar is visible on secure pages when logged in
    const showSidebar = studentId && ['search', 'detail', 'profile', 'write-application'].includes(currentPage);

    // Apply sidebar class helper to HTML body wrapper
    useEffect(() => {
        if (showSidebar) {
            document.body.classList.add('has-sidebar');
        } else {
            document.body.classList.remove('has-sidebar');
        }
    }, [showSidebar]);

    // Render Page Views
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <Home 
                        studentId={studentId} 
                        setCurrentPage={setCurrentPage} 
                        setSelectedRecordId={setSelectedRecordId} 
                        setSelectedTemplateId={setSelectedTemplateId}
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'login':
                return (
                    <Login 
                        onLoginSuccess={handleLoginSuccess} 
                        setCurrentPage={setCurrentPage} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'search':
                return (
                    <Search 
                        records={records} 
                        setCurrentPage={setCurrentPage} 
                        setSelectedRecordId={setSelectedRecordId} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'detail':
                return (
                    <Detail 
                        recordId={selectedRecordId} 
                        records={records} 
                        onWithdraw={handleWithdraw} 
                        setCurrentPage={setCurrentPage} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'profile':
                return (
                    <Profile 
                        setCurrentPage={setCurrentPage} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'write-application':
                return (
                    <WriteApplication 
                        templateId={selectedTemplateId} 
                        setCurrentPage={setCurrentPage} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            default:
                return (
                    <Home 
                        studentId={studentId} 
                        setCurrentPage={setCurrentPage} 
                        setSelectedRecordId={setSelectedRecordId} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
        }
    };

    return (
        <div className="app-layout">
            {/* Render header on all views except login */}
            {currentPage !== 'login' && (
                <Header 
                    studentId={studentId} 
                    onLogout={handleLogout} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} 
                    showAlert={showAlert}
                    showConfirm={showConfirm}
                />
            )}

            {/* Injected Sidebar wrapper */}
            {showSidebar && (
                <Sidebar 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    onLogout={handleLogout} 
                    showAlert={showAlert}
                    showConfirm={showConfirm}
                />
            )}

            {/* Active Content view */}
            {renderPage()}

            {/* Render footer on all views except login */}
            {currentPage !== 'login' && (
                <Footer setCurrentPage={setCurrentPage} />
            )}

            {/* Custom Modal Container */}
            <CustomModal 
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
                onCancel={modalConfig.onCancel}
            />

            {/* Global Toast Container */}
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
                theme="colored" 
            />

            {/* Scroll to top button */}
            {showScrollTop && currentPage !== 'login' && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        cursor: 'pointer',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease',
                    }}
                    title="Cuộn lên đầu trang"
                    className="btn-scroll-top"
                >
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
            )}
        </div>
    );
}
