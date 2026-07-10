import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Profile from './pages/Profile';
import CustomModal from './components/CustomModal';
import { authApi } from './services/authApi';
import { tokenStorage } from './services/tokenStorage';

const DEFAULT_RECORDS = [
    {
        id: "abc345",
        type: "Đơn xin thôi học",
        date: "2026-06-12",
        dateDisplay: "10:30, 12/06/2026",
        status: "Đang xử lý",
        reason: "Do hoàn cảnh gia đình thay đổi, tôi phải di chuyển chỗ ở về quê sinh sống, không có điều kiện tiếp tục theo học tại trường.",
        history: [
            "10:30, 12/06/2026 - Hệ thống đã tiếp nhận hồ sơ trên Cổng dịch vụ công.",
            "10:28, 12/06/2026 - Sinh viên thực hiện ký và nộp đơn."
        ]
    },
    {
        id: "abc505",
        type: "Đơn xin thôi học",
        date: "2026-06-12",
        dateDisplay: "10:30, 12/06/2026",
        status: "Đã phê duyệt",
        reason: "Do hoàn cảnh gia đình thay đổi, tôi phải di chuyển chỗ ở về quê sinh sống.",
        history: [
            "15:30, 16/06/2026 - Hệ thống cấp bản điện tử có chữ ký số. Giao dịch hoàn tất.",
            "15:25, 16/06/2026 - Phòng Công tác Chính trị - Sinh viên (P.CTCT-SV-KN) đã phê duyệt và đóng dấu hồ sơ.",
            "09:15, 15/06/2026 - Trưởng Khoa Công nghệ Thông tin đã xem xét và xác nhận đơn.",
            "14:20, 13/06/2026 - Cố vấn học tập (CVHT) đã phản hồi và thông qua nguyện vọng.",
            "10:30, 12/06/2026 - Hệ thống đã tiếp nhận hồ sơ trên Cổng dịch vụ công.",
            "10:28, 12/06/2026 - Sinh viên thực hiện ký và nộp đơn."
        ]
    },
    {
        id: "blu892",
        type: "Đơn xin bảo lưu",
        date: "2026-05-15",
        dateDisplay: "09:00, 15/05/2026",
        status: "Đã phê duyệt",
        reason: "Bảo lưu kết quả học tập để đi điều trị sức khỏe trong vòng 1 năm học.",
        history: [
            "11:20, 18/05/2026 - Đã duyệt cấp quyết định bảo lưu kết quả học tập.",
            "09:00, 15/05/2026 - Nộp đơn thành công trên hệ thống Một cửa."
        ]
    },
    {
        id: "hl2310",
        type: "Đơn xin học lại",
        date: "2026-05-20",
        dateDisplay: "08:00, 20/05/2026",
        status: "Chờ xử lý",
        reason: "Hết thời hạn bảo lưu kết quả học tập, xin tiếp tục tham gia học tập từ học kỳ 1 năm học 2026-2027.",
        history: [
            "08:00, 20/05/2026 - Đang chờ bộ phận chức năng khoa xem xét học lực sinh viên."
        ]
    },
    {
        id: "cc5510",
        type: "Cấp lại thẻ sinh viên",
        date: "2026-06-10",
        dateDisplay: "14:30, 10/06/2026",
        status: "Bị từ chối",
        reason: "Bị mất thẻ sinh viên cũ do đánh rơi ví đựng giấy tờ.",
        history: [
            "16:00, 11/06/2026 - Bị từ chối phê duyệt do hồ sơ thiếu minh chứng xác nhận.",
            "14:30, 10/06/2026 - Hệ thống tiếp nhận đơn cấp lại thẻ sinh viên."
        ]
    }
];

export default function App() {
    // Session states
    const [studentUser, setStudentUser] = useState(() => {
        const stored = localStorage.getItem('studentUser');
        return stored ? JSON.parse(stored) : null;
    });
    const [studentId, setStudentId] = useState(() => localStorage.getItem('studentId'));
    const [studentEmail, setStudentEmail] = useState(() => localStorage.getItem('studentEmail'));
    
    // Page routing state
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedRecordId, setSelectedRecordId] = useState(null);

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

    // Sync records to localStorage when changed
    useEffect(() => {
        localStorage.setItem('studentRecords', JSON.stringify(records));
    }, [records]);

    // Khôi phục / làm mới phiên đăng nhập khi mở app
    useEffect(() => {
        let cancelled = false;
        const hasToken = Boolean(tokenStorage.getAccessToken() || tokenStorage.getRefreshToken());
        if (!hasToken) {
            // Có UI user cũ nhưng không còn token → xóa session giả
            if (studentUser || studentId) {
                localStorage.removeItem('studentUser');
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                setStudentUser(null);
                setStudentId(null);
                setStudentEmail(null);
            }
            return undefined;
        }

        authApi
            .ensureValidSession()
            .then(({ user }) => {
                if (cancelled) return;
                setStudentUser(user);
                setStudentId(user.studentId || user.email);
                setStudentEmail(user.email);
                localStorage.setItem('studentUser', JSON.stringify(user));
                localStorage.setItem('studentId', user.studentId || user.email);
                localStorage.setItem('studentEmail', user.email);
            })
            .catch(() => {
                if (cancelled) return;
                tokenStorage.clear();
                localStorage.removeItem('studentUser');
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                setStudentUser(null);
                setStudentId(null);
                setStudentEmail(null);
            });

        return () => {
            cancelled = true;
        };
        // Chỉ chạy 1 lần khi mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle authentication redirect guard checks
    useEffect(() => {
        const securePages = ['search', 'detail', 'profile'];
        const hasValidToken = Boolean(
            tokenStorage.getAccessToken() || tokenStorage.getRefreshToken(),
        );
        if (securePages.includes(currentPage) && (!studentId || !hasValidToken)) {
            showAlert(
                'Yêu cầu đăng nhập',
                'Vui lòng đăng nhập bằng email sinh viên để tiếp tục sử dụng dịch vụ.',
                'warning',
                () => {
                    setCurrentPage('login');
                },
            );
        }
    }, [currentPage, studentId]);

    const handleLoginSuccess = (authData) => {
        const { user, accessToken, refreshToken } = authData;
        tokenStorage.setTokens(accessToken, refreshToken);
        setStudentUser(user);
        setStudentId(user.studentId || user.email);
        setStudentEmail(user.email);
        localStorage.setItem('studentUser', JSON.stringify(user));
        localStorage.setItem('studentId', user.studentId || user.email);
        localStorage.setItem('studentEmail', user.email);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        tokenStorage.clear();
        localStorage.removeItem('studentUser');
        setStudentId(null);
        setStudentEmail(null);
        setStudentUser(null);
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
    const showSidebar = studentId && ['search', 'detail', 'profile'].includes(currentPage);

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
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'login':
                return (
                    <Login 
                        onLoginSuccess={handleLoginSuccess} 
                        studentUser={studentUser}
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
                        studentId={studentId}
                        studentEmail={studentEmail}
                        setCurrentPage={setCurrentPage} 
                        showAlert={showAlert}
                        showConfirm={showConfirm}
                    />
                );
            case 'profile':
                return (
                    <Profile 
                        studentUser={studentUser}
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
                    studentUser={studentUser}
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
        </div>
    );
}
