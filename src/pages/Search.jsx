import React, { useEffect, useState } from 'react';
import { submissionsApi } from '../services/submissionsApi';
import { tokenStorage } from '../services/tokenStorage';

const mapStatus = (trangThai) => {
    if (trangThai === 'cho_duyet') return 'Chờ xử lý';
    if (trangThai === 'da_duyet') return 'Đã phê duyệt';
    if (trangThai === 'tu_choi') return 'Bị từ chối';
    return 'Đang xử lý';
};

export default function Search({ setCurrentPage, setSelectedRecordId, showAlert }) {
    const [recordId, setRecordId] = useState('');
    const [docType, setDocType] = useState('ALL');
    const [status, setStatus] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-12-31');

    const [forms, setForms] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewingId, setViewingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!tokenStorage.getAccessToken()) {
            showAlert?.(
                'Yêu cầu đăng nhập',
                'Vui lòng đăng nhập để xem danh sách hồ sơ đã nộp.',
                'warning',
                () => setCurrentPage('login'),
            );
            return;
        }

        setLoading(true);
        setErrorMessage('');
        submissionsApi
            .listMine({ page, limit: 10 })
            .then((result) => {
                const mappedData = (result.data || []).map((item) => ({
                    id: item._id,
                    type: String(item.tenDon || '').replace(/\.pdf$/i, ''),
                    date: item.createdAt,
                    dateDisplay: new Date(item.createdAt).toLocaleString('vi-VN'),
                    status: mapStatus(item.trangThai),
                    fileUrl: item.duongDanFile,
                    fileMimeType: item.fileMimeType,
                }));

                setForms(mappedData);
                setTotalPages(result.pagination?.totalPages || 1);
            })
            .catch((err) => {
                console.error(err);
                setForms([]);
                setTotalPages(1);
                setErrorMessage(err.message || 'Không tải được danh sách hồ sơ');
            })
            .finally(() => setLoading(false));
    }, [page, setCurrentPage, showAlert]);

    const filteredForms = forms.filter((form) => {
        if (recordId && !form.id.toLowerCase().includes(recordId.trim().toLowerCase())) return false;
        if (docType !== 'ALL' && form.type !== docType) return false;
        if (status !== 'ALL' && form.status !== status) return false;

        if (form.date) {
            const formTime = new Date(form.date).getTime();
            if (dateFrom && formTime < new Date(dateFrom).getTime()) return false;
            if (dateTo) {
                const end = new Date(dateTo);
                end.setHours(23, 59, 59, 999);
                if (formTime > end.getTime()) return false;
            }
        }

        return true;
    });

    const handleReset = () => {
        setRecordId('');
        setDocType('ALL');
        setStatus('ALL');
        setDateFrom('2026-01-01');
        setDateTo('2026-12-31');
    };

    const getStatusClass = (recordStatus) => {
        switch (recordStatus) {
            case 'Chờ xử lý':
                return 'status-waiting';
            case 'Đang xử lý':
                return 'status-processing';
            case 'Đã phê duyệt':
                return 'status-approved';
            case 'Bị từ chối':
                return 'status-rejected';
            default:
                return '';
        }
    };

    const handleViewFile = async (form, event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();

        if (!form.fileUrl) {
            showAlert?.('Thông báo', 'Hồ sơ này chưa có file đính kèm', 'warning');
            return;
        }

        try {
            setViewingId(form.id);
            // Lấy lại URL mới nhất (sau khi cán bộ ký số, file có thể đã đổi sang bản signed)
            let fileUrl = form.fileUrl;
            try {
                const latest = await submissionsApi.getById(form.id);
                if (latest?.duongDanFile) {
                    fileUrl = latest.duongDanFile;
                }
            } catch {
                // fallback URL trong danh sách
            }

            const blob = await submissionsApi.viewFileBlob(fileUrl);
            const objectUrl = URL.createObjectURL(blob);
            window.open(objectUrl, '_blank', 'noopener,noreferrer');
            setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
            showAlert?.(
                'Đã mở hồ sơ',
                'Nếu đã được ký số, xem trang cuối PDF để thấy chữ ký.',
                'info',
            );
        } catch (err) {
            showAlert?.('Lỗi', err.message || 'Không thể mở file hồ sơ', 'error');
        } finally {
            setViewingId(null);
        }
    };

    const handleRowClick = (id) => {
        setSelectedRecordId(id);
        setCurrentPage('detail');
    };

    const docTypeOptions = Array.from(new Set(forms.map((f) => f.type).filter(Boolean)));

    return (
        <main className="page-content-wrapper">
            <div className="content-container">
                <nav className="breadcrumbs-nav" id="breadcrumbs_172_538">
                    <a
                        href="#home"
                        className="breadcrumb-link"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage('home');
                        }}
                    >
                        Trang chủ
                    </a>
                    <span className="breadcrumb-sep">
                        <i className="fa-solid fa-chevron-right"></i>
                    </span>
                    <span className="breadcrumb-current">Tra cứu kết quả</span>
                </nav>

                <div className="page-main-header">
                    <h1 className="page-title-text" id="title_172_549">
                        DANH SÁCH HỒ SƠ - TRA CỨU
                    </h1>
                    <div className="underline-decor left-align"></div>
                    <p style={{ margin: '8px 0 0', color: '#666' }}>
                        Xem trạng thái và mở file đơn (bản đã ký số nếu cán bộ đã ký).
                    </p>
                </div>

                <section className="filter-board-card" id="frame_184_635">
                    <h3 className="filter-board-title" id="title_184_639">
                        BỘ LỌC TÌM KIẾM
                    </h3>

                    <form onSubmit={(e) => e.preventDefault()} className="filter-form-grid">
                        <div className="form-group-filter">
                            <label htmlFor="filterRecordId">Mã hồ sơ</label>
                            <input
                                type="text"
                                id="filterRecordId"
                                className="filter-control"
                                placeholder="Nhập mã hồ sơ..."
                                value={recordId}
                                onChange={(e) => setRecordId(e.target.value)}
                            />
                        </div>

                        <div className="form-group-filter">
                            <label htmlFor="filterDocType">Loại hồ sơ</label>
                            <select
                                id="filterDocType"
                                className="filter-control-select"
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                            >
                                <option value="ALL">Tất cả loại hồ sơ</option>
                                {docTypeOptions.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-filter">
                            <label htmlFor="filterStatus">Trạng thái</label>
                            <select
                                id="filterStatus"
                                className="filter-control-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="Chờ xử lý">Chờ xử lý</option>
                                <option value="Đang xử lý">Đang xử lý</option>
                                <option value="Đã phê duyệt">Đã phê duyệt</option>
                                <option value="Bị từ chối">Bị từ chối</option>
                            </select>
                        </div>

                        <div className="form-group-filter">
                            <label htmlFor="filterDateFrom">Ngày gửi (Từ)</label>
                            <input
                                type="date"
                                id="filterDateFrom"
                                className="filter-control"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        <div className="form-group-filter">
                            <label htmlFor="filterDateTo">Ngày gửi (Đến)</label>
                            <input
                                type="date"
                                id="filterDateTo"
                                className="filter-control"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>

                        <div className="filter-action-group">
                            <button
                                type="button"
                                onClick={handleReset}
                                id="btnResetFilters"
                                className="btn btn-secondary btn-search-reset"
                            >
                                <i className="fa-solid fa-arrow-rotate-left"></i> Làm mới
                            </button>
                        </div>
                    </form>
                </section>

                {errorMessage && (
                    <div className="no-results-alert" style={{ marginBottom: 16 }}>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <section className="results-table-card">
                    <div className="table-responsive-wrapper">
                        <table className="records-data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px', textAlign: 'center' }}>STT</th>
                                    <th style={{ width: '140px' }}>Mã hồ sơ</th>
                                    <th>Loại hồ sơ</th>
                                    <th style={{ width: '180px' }}>Ngày gửi</th>
                                    <th style={{ width: '180px', textAlign: 'center' }}>Trạng thái</th>
                                    <th style={{ width: '220px', textAlign: 'center' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                                            Đang tải danh sách hồ sơ...
                                        </td>
                                    </tr>
                                ) : (
                                    filteredForms.map((form, index) => (
                                        <tr key={form.id} className="table-row-clickable">
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>
                                                {(page - 1) * 10 + index + 1}
                                            </td>
                                            <td
                                                style={{
                                                    fontWeight: 700,
                                                    color: 'var(--color-primary-dark)',
                                                }}
                                            >
                                                {String(form.id).slice(-8).toUpperCase()}
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{form.type}</td>
                                            <td style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>
                                                {form.dateDisplay}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span
                                                    className={`status-badge-pill ${getStatusClass(form.status)}`}
                                                >
                                                    {form.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    className="btn-action-view"
                                                    style={{
                                                        marginRight: 8,
                                                        border: 'none',
                                                        background: 'transparent',
                                                        color: '#0b5ed7',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                    }}
                                                    disabled={viewingId === form.id || !form.fileUrl}
                                                    onClick={(e) => handleViewFile(form, e)}
                                                >
                                                    <i className="fa-solid fa-file-pdf"></i>{' '}
                                                    {viewingId === form.id ? 'Đang mở...' : 'Xem đơn'}
                                                </button>
                                                <a
                                                    href="#detail"
                                                    className="btn-action-view"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRowClick(form.id);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-eye"></i> Chi tiết
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && filteredForms.length === 0 && !errorMessage && (
                        <div id="noResultsMessage" className="no-results-alert">
                            <i className="fa-regular fa-folder-open empty-icon"></i>
                            <p>Không tìm thấy hồ sơ nào phù hợp với bộ lọc tìm kiếm.</p>
                        </div>
                    )}

                    <div className="pagination-footer-row" id="group_184_741">
                        <span className="pagination-text">Trang</span>
                        <div className="pagination-pages">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`page-num ${page === index + 1 ? 'active' : ''}`}
                                    onClick={() => setPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
