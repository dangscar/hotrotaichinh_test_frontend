import React, { useState } from 'react';

export default function Search({ records, setCurrentPage, setSelectedRecordId, showAlert, showConfirm }) {
    const [recordId, setRecordId] = useState('');
    const [docType, setDocType] = useState('ALL');
    const [status, setStatus] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-12-31');

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
                                {filteredRecords.map((record, index) => (
                                    <tr 
                                        key={record.id} 
                                        className="table-row-clickable"
                                        onClick={() => handleRowClick(record.id)}
                                    >
                                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{index + 1}</td>
                                        <td style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>{record.id.toUpperCase()}</td>
                                        <td style={{ fontWeight: '500' }}>{record.type}</td>
                                        <td style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>{record.dateDisplay}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`status-badge-pill ${getStatusClass(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a 
                                                href="#detail" 
                                                className="btn-action-view" 
                                                onClick={(e) => { e.preventDefault(); handleRowClick(record.id); }}
                                            >
                                                <i className="fa-solid fa-eye"></i> Chi tiết
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredRecords.length === 0 && (
                        <div id="noResultsMessage" className="no-results-alert">
                            <i className="fa-regular fa-folder-open empty-icon"></i>
                            <p>Không tìm thấy hồ sơ nào phù hợp với bộ lọc tìm kiếm.</p>
                        </div>
                    )}

                    {/* Pagination footer */}
                    <div className="pagination-footer-row" id="group_184_741">
                        <span className="pagination-text">Trang</span>
                        <div className="pagination-pages">
                            <a href="javascript:void(0)" className="page-num active">1</a>
                            <a href="javascript:void(0)" className="page-num">2</a>
                            <a href="javascript:void(0)" className="page-num">3</a>
                            <span className="page-dots">...</span>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
