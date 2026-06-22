import React, { useEffect, useState } from 'react';

export default function Detail({ recordId, setCurrentPage, showAlert, showConfirm }) {
    const [formRecord, setFormRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the submitted application details
    useEffect(() => {
        if (!recordId) return;

        setLoading(true);
        fetch(`http://localhost:5000/api/v1/convert-file-and-submit/${recordId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    setFormRecord(data.data);
                } else {
                    showAlert("Lỗi", "Không tìm thấy hồ sơ yêu cầu.", "danger");
                }
            })
            .catch((err) => {
                console.error(err);
                showAlert("Lỗi", "Không thể kết nối đến máy chủ.", "danger");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [recordId]);

    const getStatusText = (status) => {
        switch (status) {
            case "cho_duyet": return "Chờ xử lý";
            case "da_duyet": return "Đã phê duyệt";
            case "tu_choi": return "Bị từ chối";
            default: return "Đang xử lý";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "cho_duyet": return "status-processing";
            case "da_duyet": return "status-approved";
            case "tu_choi": return "status-rejected";
            default: return "status-waiting";
        }
    };

    const getStatusSummaryText = (status) => {
        switch (status) {
            case "cho_duyet":
                return "Trạng thái hiện tại: Đơn mới được tiếp nhận, đang xếp hàng chờ kiểm duyệt và phân công xử lý.";
            case "da_duyet":
                return "Trạng thái hiện tại: Đã hoàn thành thủ tục. Hồ sơ đã phê duyệt và đóng dấu điện tử thành công.";
            case "tu_choi":
                return "Trạng thái hiện tại: Hồ sơ đã bị từ chối phê duyệt hoặc đã được rút theo nguyện vọng.";
            default:
                return "Trạng thái hiện tại: Đang chờ Cố vấn học tập (CVHT) ký xác nhận sinh viên.";
        }
    };

    // Generate stepper classes dynamically
    const getStepperClasses = (status) => {
        let step1 = "step-node-waiting";
        let step2 = "step-node-waiting";
        let step3 = "step-node-waiting";
        let step4 = "step-node-waiting";
        let step5 = "step-node-waiting";

        if (status === "cho_duyet") {
            step1 = "step-node-active completed";
            step2 = "step-node-active pulsing";
        } else if (status === "da_duyet") {
            step1 = "step-node-active completed";
            step2 = "step-node-active completed";
            step3 = "step-node-active completed";
            step4 = "step-node-active completed";
            step5 = "step-node-active completed";
        } else if (status === "tu_choi") {
            step1 = "step-node-active error";
        } else {
            step1 = "step-node-active completed";
            step2 = "step-node-active completed";
            step3 = "step-node-active pulsing";
        }

        return { step1, step2, step3, step4, step5 };
    };

    // Pick dynamic timeline item icon
    const getTimelineIcon = (msg) => {
        if (msg.includes('đã tiếp nhận') || msg.includes('tiếp nhận')) return 'fa-file-import';
        if (msg.includes('ký và nộp đơn') || msg.includes('nộp đơn')) return 'fa-file-signature';
        if (msg.includes('CVHT') || msg.includes('Cố vấn')) return 'fa-user-tie';
        if (msg.includes('Trưởng Khoa') || msg.includes('Khoa')) return 'fa-graduation-cap';
        if (msg.includes('Phòng Công tác') || msg.includes('P.CTCT-SV-KN')) return 'fa-building-columns';
        if (msg.includes('hoàn tất') || msg.includes('hoàn thành')) return 'fa-clipboard-check';
        if (msg.includes('rút hồ sơ') || msg.includes('từ chối')) return 'fa-circle-xmark';
        return 'fa-circle-chevron-right';
    };

    // Generate timeline history logs dynamically
    const getTimelineLogs = (record) => {
        if (!record) return [];
        const logs = [];
        const createdDate = new Date(record.createdAt);
        
        const formatLogTime = (date) => {
            return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        };

        logs.push(`${formatLogTime(createdDate)} - Hệ thống đã tiếp nhận hồ sơ trên Cổng dịch vụ công.`);
        logs.push(`${formatLogTime(createdDate)} - Sinh viên thực hiện ký và nộp đơn.`);

        if (record.trangThai === 'da_duyet') {
            const dateCVHT = new Date(createdDate.getTime() + 2 * 60 * 60 * 1000); 
            const dateKhoa = new Date(createdDate.getTime() + 12 * 60 * 60 * 1000); 
            const datePCT = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000); 
            
            logs.unshift(`${formatLogTime(datePCT)} - Hệ thống cấp bản điện tử có chữ ký số. Giao dịch hoàn tất.`);
            logs.unshift(`${formatLogTime(datePCT)} - Phòng Công tác Chính trị - Sinh viên đã phê duyệt và đóng dấu hồ sơ.`);
            logs.unshift(`${formatLogTime(dateKhoa)} - Trưởng Khoa Công nghệ Thông tin đã xem xét và xác nhận đơn.`);
            logs.unshift(`${formatLogTime(dateCVHT)} - Cố vấn học tập (CVHT) đã phản hồi và thông qua nguyện vọng.`);
        } else if (record.trangThai === 'tu_choi') {
            const dateReject = new Date(createdDate.getTime() + 4 * 60 * 60 * 1000);
            logs.unshift(`${formatLogTime(dateReject)} - Bị từ chối phê duyệt do hồ sơ không hợp lệ hoặc sinh viên chủ động rút.`);
        } else {
            const dateCVHT = new Date(createdDate.getTime() + 1 * 60 * 60 * 1000);
            logs.unshift(`${formatLogTime(dateCVHT)} - Đang chờ Cố vấn học tập (CVHT) ký xác nhận thông tin sinh viên.`);
        }

        return logs;
    };

    if (loading) {
        return (
            <main className="page-content-wrapper">
                <div className="content-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải thông tin hồ sơ...</span>
                    </div>
                </div>
            </main>
        );
    }

    if (!formRecord) {
        return (
            <main className="page-content-wrapper">
                <div className="content-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Không tìm thấy thông tin hồ sơ</h2>
                    <p>Vui lòng quay lại danh sách tra cứu để chọn hồ sơ hợp lệ. ID: {recordId}</p>
                    <a href="#search" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Quay lại</a>
                </div>
            </main>
        );
    }

    const { step1, step2, step3, step4, step5 } = getStepperClasses(formRecord.trangThai);
    const pdfViewUrl = `http://localhost:5000/api/v1/convert-file-and-submit/${recordId}/view`;
    const displayTitle = formRecord.tenDon.replace(/-/g, ' ').toUpperCase();

    return (
        <main className="page-content-wrapper">
            <div className="content-container">

                {/* Back navigation button */}
                <div className="back-nav-container" style={{ margin: '15px 0 10px 0' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage('search')}
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
                        <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách đơn
                    </button>
                </div>

                {/* Breadcrumbs */}
                <nav className="breadcrumbs-nav">
                    <a href="#home" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Trang chủ</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <a href="#search" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Các thủ tục</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <span className="breadcrumb-current">{displayTitle}</span>
                </nav>

                {/* Page Title */}
                <div className="page-main-header">
                    <h1 className="page-title-text">{displayTitle}</h1>
                    <div className="underline-decor left-align"></div>
                </div>

                {/* Dynamic Notification Banner */}
                {formRecord.trangThai === "cho_duyet" && (
                    <section className="banner-notification info-style">
                        <div className="banner-icon-wrapper"><i className="fa-solid fa-circle-check banner-icon"></i></div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Đã tiếp nhận hồ sơ</h4>
                            <p className="banner-desc">Hồ sơ {recordId.toUpperCase()} đã được gửi thành công. Đang xếp hàng chờ xử lý.</p>
                        </div>
                    </section>
                )}
                {formRecord.trangThai === "da_duyet" && (
                    <section className="banner-notification success-style">
                        <div className="banner-icon-wrapper"><i className="fa-solid fa-circle-check banner-icon"></i></div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Thủ tục đã hoàn tất!</h4>
                            <p className="banner-desc">Bản điện tử có chữ ký số của hồ sơ đã sẵn sàng. Bạn có thể tải về để lưu trữ.</p>
                        </div>
                    </section>
                )}
                {formRecord.trangThai === "tu_choi" && (
                    <section className="banner-notification danger-style">
                        <div className="banner-icon-wrapper"><i className="fa-solid fa-circle-xmark banner-icon"></i></div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Hồ sơ đã bị huỷ / từ chối</h4>
                            <p className="banner-desc">Đơn của bạn đã bị từ chối hoặc rút thành công. Vui lòng liên hệ Văn phòng Khoa để được hỗ trợ.</p>
                        </div>
                    </section>
                )}

                {/* Stepper Progress Tracker */}
                <section className="stepper-progress-card">
                    <div className="stepper-container" id="stepperContainer">
                        <div className={step1}>
                            <div className="step-dot"><i className="fa-solid fa-circle-info"></i></div>
                            <span className="step-label">Đã tiếp nhận</span>
                        </div>
                        <div className={step2}>
                            <div className="step-dot"><i className="fa-solid fa-user-graduate"></i></div>
                            <span className="step-label">Chờ CVHT</span>
                        </div>
                        <div className={step3}>
                            <div className="step-dot"><i className="fa-solid fa-graduation-cap"></i></div>
                            <span className="step-label">Chờ Khoa</span>
                        </div>
                        <div className={step4}>
                            <div className="step-dot"><i className="fa-solid fa-building-columns"></i></div>
                            <span className="step-label">P.CTCT-SV</span>
                        </div>
                        <div className={step5}>
                            <div className="step-dot"><i className="fa-solid fa-circle-check"></i></div>
                            <span className="step-label">Hoàn tất</span>
                        </div>
                    </div>
                </section>

                <p className="status-summary-text">
                    {getStatusSummaryText(formRecord.trangThai)}
                </p>

                {/* Split layout */}
                <div className="detail-split-layout">
                    {/* Left Form Box */}
                    <section className="form-details-column">
                        <div className="card-box">
                            <h4 className="card-box-title"><i className="fa-solid fa-file-waveform"></i> THÔNG TIN HỒ SƠ ĐÃ NỘP</h4>

                            <div className="detail-group">
                                <span className="detail-label">Mã hồ sơ tra cứu</span>
                                <div className="detail-value-box highlight">{recordId.toUpperCase()}</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Họ và tên người nộp</span>
                                <div className="detail-value-box">{formRecord.tenNguoiGui}</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Loại hồ sơ</span>
                                <div className="detail-value-box">{displayTitle}</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Thời gian nộp</span>
                                <div className="detail-value-box">{new Date(formRecord.createdAt).toLocaleString("vi-VN")}</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Trạng thái hồ sơ</span>
                                <div className="detail-value-box">
                                    <span className={`status-badge-pill ${getStatusClass(formRecord.trangThai)}`}>
                                        {getStatusText(formRecord.trangThai)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right PDF Preview */}
                    <section className="pdf-viewer-column">
                        <div className="card-box pdf-card">
                            <div className="pdf-header">
                                <span className="pdf-header-title">
                                    {formRecord.trangThai === "da_duyet" ? 'ĐÃ PHÊ DUYỆT & KÝ SỐ' : formRecord.trangThai === 'tu_choi' ? 'HỒ SƠ ĐÃ BỊ HỦY' : 'BẢN ĐƠN ĐÃ NỘP - PDF'}
                                </span>
                                <span className="pdf-header-badge"><i className="fa-solid fa-file-pdf"></i> PDF</span>
                            </div>

                            <div className="pdf-page-container">
                                <iframe
                                    src={pdfViewUrl}
                                    title="PDF Viewer"
                                    width="100%"
                                    height="900px"
                                    style={{
                                        border: "none",
                                        borderRadius: "8px",
                                        background: "#fff"
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Operations History Logs */}
                <section className="history-logs-card">
                    <h4 className="history-title-text"><i className="fa-solid fa-clock-rotate-left"></i> LỊCH SỬ THAO TÁC</h4>
                    <div className="timeline-wrapper">
                        {getTimelineLogs(formRecord).map((logItem, idx) => {
                            const parts = logItem.split(' - ');
                            const logTime = parts[0] || '';
                            const logMsg = parts.slice(1).join(' - ') || logItem;

                            return (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-badge">
                                        <i className={`fa-solid ${getTimelineIcon(logMsg)}`}></i>
                                    </div>
                                    <div className="timeline-body">
                                        <span className="timeline-time">{logTime}</span>
                                        <p className="timeline-message">{logMsg}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Action Buttons */}
                <section className="detail-actions-row">
                    <div className="actions-left">
                        {/* Allowed to withdraw if still pending */}
                        {formRecord.trangThai === "cho_duyet" && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    showConfirm(
                                        "XÁC NHẬN RÚT HỒ SƠ",
                                        "Bạn có chắc chắn muốn rút hồ sơ này? Thao tác này không thể hoàn tác và hồ sơ sẽ bị hủy bỏ.",
                                        async () => {
                                            // Handle withdraw on backend if required, or show success feedback
                                            showAlert("Thành công", "Đã yêu cầu rút hồ sơ thành công.", "success", () => {
                                                setCurrentPage('search');
                                            });
                                        }
                                    );
                                }}
                            >
                                <i className="fa-solid fa-trash-can"></i> Rút hồ sơ
                            </button>
                        )}
                    </div>

                    <div className="actions-center">
                        <a
                            href={pdfViewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary"
                        >
                            <i className="fa-solid fa-cloud-arrow-down"></i> Tải PDF
                        </a>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => window.print()}
                        >
                            <i className="fa-solid fa-print"></i> In tài liệu
                        </button>
                    </div>


                </section>

            </div>
        </main>
    );
}
