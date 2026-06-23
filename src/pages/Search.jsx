import React, { useEffect, useState } from 'react';

export default function Search({ records, setCurrentPage, setSelectedRecordId, showAlert, showConfirm }) {
    const [recordId, setRecordId] = useState('');
    const [docType, setDocType] = useState('ALL');
    const [status, setStatus] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-12-31');

    const [forms, setForms] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/convert-file-and-submit?page=${page}`)
            .then(res => res.json())
            .then(result => {
                const mappedData = result.data.map(item => ({
                    id: item._id,
                    type: item.tenDon.replace(".pdf", ""),
                    date: item.createdAt,
                    dateDisplay: new Date(item.createdAt).toLocaleDateString("vi-VN"),
                    status:
                        item.trangThai === "cho_duyet"
                            ? "Chờ xử lý"
                            : item.trangThai === "da_duyet"
                                ? "Đã phê duyệt"
                                : item.trangThai === "tu_choi"
                                    ? "Bị từ chối"
                                    : "Đang xử lý"
                }));

                setForms(mappedData);
                setTotalPages(result.pagination.totalPages);
            })
            .catch(err => {
                console.error(err);
            });
    }, [page]);

    const filteredForms = forms.filter(form => {
        if (recordId && !form.id.toLowerCase().includes(recordId.trim().toLowerCase())) return false;
        if (docType !== 'ALL' && form.type !== docType) return false;
        if (status !== 'ALL' && form.status !== status) return false;

        if (form.date) {
            const formTime = new Date(form.date).getTime();

            if (dateFrom && formTime < new Date(dateFrom).getTime()) return false;
            if (dateTo && formTime > new Date(dateTo).getTime()) return false;
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
            case "Chờ xử lý": return "status-waiting";
            case "Đang xử lý": return "status-processing";
            case "Đã phê duyệt": return "status-approved";
            case "Bị từ chối": return "status-rejected";
            default: return "";
        }
    };

    // Filter logic
    const filteredRecords = records.filter(record => {
        if (recordId && !record.id.toLowerCase().includes(recordId.trim().toLowerCase())) return false;
        if (docType !== 'ALL' && record.type !== docType) return false;
        if (status !== 'ALL' && record.status !== status) return false;

        if (record.date) {
            const recordTime = new Date(record.date).getTime();
            if (dateFrom && recordTime < new Date(dateFrom).getTime()) return false;
            if (dateTo && recordTime > new Date(dateTo).getTime()) return false;
        }
        return true;
    });

    const handleRowClick = (id) => {
        setSelectedRecordId(id);
        setCurrentPage('detail');
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
                <nav className="breadcrumbs-nav" id="breadcrumbs_172_538">
                    <a href="#home" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Trang chủ</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <span className="breadcrumb-current">Tra cứu kết quả</span>
                </nav>

                {/* Page Header Title */}
                <div className="page-main-header">
                    <h1 className="page-title-text" id="title_172_549">DANH SÁCH HỒ SƠ - TRA CỨU</h1>
                    <div className="underline-decor left-align"></div>
                </div>

                {/* Search Filter Board */}
                <section className="filter-board-card" id="frame_184_635">
                    <h3 className="filter-board-title" id="title_184_639">BỘ LỌC TÌM KIẾM</h3>

                    <form onSubmit={(e) => e.preventDefault()} className="filter-form-grid">
                        {/* ID Search */}
                        <div className="form-group-filter">
                            <label htmlFor="filterRecordId">Mã hồ sơ</label>
                            <input
                                type="text"
                                id="filterRecordId"
                                className="filter-control"
                                placeholder="Nhập mã hồ sơ (ví dụ: abc345)..."
                                value={recordId}
                                onChange={(e) => setRecordId(e.target.value)}
                            />
                        </div>

                        {/* Document Type */}
                        <div className="form-group-filter">
                            <label htmlFor="filterDocType">Loại hồ sơ</label>
                            <select
                                id="filterDocType"
                                className="filter-control-select"
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                            >
                                <option value="ALL">Tất cả loại hồ sơ</option>
                                <option value="Đơn xin thôi học">Đơn xin thôi học</option>
                                <option value="Đơn xin bảo lưu">Đơn xin bảo lưu</option>
                                <option value="Đơn xin học lại">Đơn xin học lại</option>
                                <option value="Cấp lại thẻ sinh viên">Cấp lại thẻ sinh viên</option>
                                <option value="Đơn xác nhận khó khăn">Đơn xác nhận khó khăn</option>
                            </select>
                        </div>

                        {/* Status */}
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

                        {/* Date From */}
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

                        {/* Date To */}
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

                        {/* Filter action buttons */}
                        <div className="filter-action-group">
                            <button type="button" onClick={handleReset} id="btnResetFilters" className="btn btn-secondary btn-search-reset">
                                <i className="fa-solid fa-arrow-rotate-left"></i> Làm mới
                            </button>
                        </div>
                    </form>
                </section>

                {/* Search Results Board */}
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
                                    <th style={{ width: '150px', textAlign: 'center' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredForms.map((form, index) => (
                                    <tr
                                        key={form.id}
                                        className="table-row-clickable"
                                        onClick={() => handleRowClick(form.id)}
                                    >
                                        <td style={{ textAlign: 'center', fontWeight: '600' }}>
                                            {index + 1}
                                        </td>

                                        <td style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                                            {form.id.toUpperCase()}
                                        </td>

                                        <td style={{ fontWeight: '500' }}>
                                            {form.type}
                                        </td>

                                        <td style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>
                                            {form.dateDisplay}
                                        </td>

                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`status-badge-pill ${getStatusClass(form.status)}`}>
                                                {form.status}
                                            </span>
                                        </td>

                                        <td style={{ textAlign: 'center' }}>
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
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredForms.length === 0 && (
                        <div id="noResultsMessage" className="no-results-alert">
                            <i className="fa-regular fa-folder-open empty-icon"></i>
                            <p>Không tìm thấy hồ sơ nào phù hợp với bộ lọc tìm kiếm.</p>
                        </div>
                    )}

                    {/* Pagination footer */}
                    <div className="pagination-footer-row" id="group_184_741">
                        <span className="pagination-text">Trang</span>
                        <div className="pagination-pages">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`page-num ${page === index + 1 ? "active" : ""}`}
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
