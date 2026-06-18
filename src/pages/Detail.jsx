import React from 'react';

export default function Detail({ recordId, records, onWithdraw, setCurrentPage, showAlert, showConfirm }) {
    const record = records.find(r => r.id === recordId);

    if (!record) {
        return (
            <main className="page-content-wrapper">
                <div className="content-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Không tìm thấy thông tin hồ sơ</h2>
                    <p>Vui lòng quay lại danh sách tra cứu để chọn hồ sơ hợp lệ.</p>
                    <a href="#search" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Quay lại</a>
                </div>
            </main>
        );
    }

    const getStatusSummaryText = (status) => {
        switch (status) {
            case "Chờ xử lý":
                return "Trạng thái hiện tại: Đơn mới được tiếp nhận, đang xếp hàng chờ kiểm duyệt và phân công xử lý.";
            case "Đang xử lý":
                return "Trạng thái hiện tại: Đang chờ Cố vấn học tập (CVHT) ký xác nhận sinh viên (Dự kiến 3-5 ngày làm việc).";
            case "Đã phê duyệt":
                return "Trạng thái hiện tại: Đã hoàn thành thủ tục. Hồ sơ đã phê duyệt và đóng dấu điện tử thành công.";
            case "Bị từ chối":
                return "Trạng thái hiện tại: Hồ sơ đã bị từ chối phê duyệt hoặc đã được rút theo nguyện vọng của sinh viên.";
            default:
                return "Trạng thái hiện tại: Không xác định.";
        }
    };

    // Calculate stepper state highlights
    const getStepperClasses = () => {
        let activeUpTo = 0;
        let isError = false;

        if (record.status === "Chờ xử lý") activeUpTo = 0;
        else if (record.status === "Đang xử lý") activeUpTo = 1;
        else if (record.status === "Đã phê duyệt") activeUpTo = 4;
        else if (record.status === "Bị từ chối") {
            activeUpTo = 0;
            isError = true;
        }

        const nodes = Array(5).fill('').map((_, i) => {
            let className = 'stepper-step';
            if (isError && i === 0) {
                className += ' error';
            } else if (i <= activeUpTo) {
                className += ' active';
                if (i === activeUpTo && activeUpTo < 4) className += ' pulsing';
                else if (activeUpTo === 4) className += ' completed';
            }
            return className;
        });

        const lines = Array(4).fill('').map((_, i) => {
            let className = 'step-line';
            if (!isError && i < activeUpTo) {
                className += ' active';
                if (activeUpTo === 4) className += ' completed';
            }
            return className;
        });

        return { nodes, lines };
    };

    const { nodes: stepNodes, lines: stepLines } = getStepperClasses();

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

    return (
        <main className="page-content-wrapper">
            <div className="content-container">
                
                {/* Breadcrumbs */}
                <nav className="breadcrumbs-nav" id="breadcrumbs_163_57">
                    <a href="#home" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Trang chủ</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <a href="#search" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Các thủ tục</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <span className="breadcrumb-current">{record.type}</span>
                </nav>

                {/* Page Title */}
                <div className="page-main-header">
                    <h1 className="page-title-text" id="title_172_358">{record.type.toUpperCase()}</h1>
                    <div className="underline-decor left-align"></div>
                </div>

                {/* Dynamic Notification Banner */}
                {record.status === "Chờ xử lý" && (
                    <section className="banner-notification info-style" id="bannerNotificationContainer">
                        <div className="banner-icon-wrapper"><i className="fa-solid fa-circle-check banner-icon"></i></div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Đã tiếp nhận hồ sơ</h4>
                            <p className="banner-desc">Hồ sơ {record.id.toUpperCase()} đã được gửi thành công. Đang xếp hàng chờ xử lý.</p>
                        </div>
                    </section>
                )}
                {record.status === "Đang xử lý" && (
                    <section className="banner-notification info-style" id="bannerNotificationContainer">
                        <div className="banner-icon-wrapper"><i className="fa-solid fa-circle-check banner-icon"></i></div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Nộp đơn thành công!</h4>
                            <p className="banner-desc">Mã hồ sơ của bạn là: {record.id.toUpperCase()} (Vui lòng lưu lại mã này để tra cứu)</p>
                        </div>
                    </section>
                )}
                {record.status === "Đã phê duyệt" && (
                    <section className="banner-notification success-style" id="bannerNotificationContainer">
                        <div className="banner-icon-wrapper"><i className="fa-solid fa-circle-check banner-icon"></i></div>
                        <div className="banner-text-wrapper">
                            <h4 className="banner-title">Thủ tục đã hoàn tất!</h4>
                            <p className="banner-desc">Bản điện tử có chữ ký số của đơn xin thôi học đã sẵn sàng. Bạn có thể tải về để lưu trữ.</p>
                        </div>
                    </section>
                )}
                {record.status === "Bị từ chối" && (
                    <section className="banner-notification danger-style" id="bannerNotificationContainer">
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
                        <div className={stepNodes[0]}>
                            <div className="step-dot"><i className="fa-solid fa-circle-info"></i></div>
                            <span className="step-label">Đã tiếp nhận</span>
                        </div>
                        <div className={stepLines[0]}></div>

                        <div className={stepNodes[1]}>
                            <div className="step-dot"><i className="fa-solid fa-user-graduate"></i></div>
                            <span className="step-label">Chờ CVHT</span>
                        </div>
                        <div className={stepLines[1]}></div>

                        <div className={stepNodes[2]}>
                            <div className="step-dot"><i className="fa-solid fa-graduation-cap"></i></div>
                            <span className="step-label">Chờ Khoa</span>
                        </div>
                        <div className={stepLines[2]}></div>

                        <div className={stepNodes[3]}>
                            <div className="step-dot"><i className="fa-solid fa-building-columns"></i></div>
                            <span className="step-label">P.CTCT-SV</span>
                        </div>
                        <div className={stepLines[3]}></div>

                        <div className={stepNodes[4]}>
                            <div className="step-dot"><i className="fa-solid fa-circle-check"></i></div>
                            <span className="step-label">Hoàn tất</span>
                        </div>
                    </div>
                </section>

                <p className="status-summary-text">
                    {getStatusSummaryText(record.status)}
                </p>

                {/* Split layout */}
                <div className="detail-split-layout">
                    {/* Left Form Box */}
                    <section className="form-details-column">
                        <div className="card-box">
                            <h4 className="card-box-title"><i className="fa-solid fa-file-waveform"></i> THÔNG TIN ĐƠN YÊU CẦU</h4>
                            
                            <div className="detail-group">
                                <span className="detail-label">Mã số sinh viên</span>
                                <div className="detail-value-box">2211050502</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Họ và tên sinh viên</span>
                                <div className="detail-value-box">Nguyễn Văn A</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Mã hồ sơ tra cứu</span>
                                <div className="detail-value-box highlight">{record.id.toUpperCase()}</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Thời gian nộp</span>
                                <div className="detail-value-box">{record.dateDisplay}</div>
                            </div>

                            <div className="detail-group">
                                <span className="detail-label">Lý do trình bày</span>
                                <div className="detail-value-area">{record.reason}</div>
                            </div>
                        </div>
                    </section>

                    {/* Right PDF Preview */}
                    <section className="pdf-viewer-column">
                        <div className="card-box pdf-card">
                            <div className="pdf-header">
                                <span className="pdf-header-title">
                                    {record.status === "Đã phê duyệt" ? 'ĐÃ PHÊ DUYỆT & KÝ SỐ' : record.status === 'Bị từ chối' ? 'HỒ SƠ ĐÃ BỊ HỦY' : 'Read only PDF Preview'}
                                </span>
                                <span className="pdf-header-badge"><i className="fa-solid fa-file-pdf"></i> PDF</span>
                            </div>
                            
                            <div className="pdf-page-container">
                                <div className="pdf-mock-page">
                                    {/* University Letterhead */}
                                    <div className="pdf-letterhead">
                                        <div className="lh-left">
                                            TRƯỜNG ĐH KỸ THUẬT - CÔNG NGHỆ CẦN THƠ<br />
                                            <strong>KHOA CÔNG NGHỆ THÔNG TIN</strong>
                                        </div>
                                        <div className="lh-right">
                                            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br />
                                            <span className="lh-sub">Độc lập - Tự do - Hạnh phúc</span>
                                        </div>
                                    </div>
                                    <hr className="pdf-lh-divider" />

                                    <h3 className="pdf-doc-title">{record.type.toUpperCase()}</h3>

                                    <div className="pdf-body-content">
                                        <p>Kính gửi: Ban Giám hiệu Trường Đại học Kỹ thuật - Công nghệ Cần Thơ,</p>
                                        <p style={{ textIndent: '24px' }}>Ban Chủ nhiệm Khoa Công nghệ thông tin.</p>
                                        <p style={{ marginTop: '12px' }}>Tôi tên là: <strong>Nguyễn Văn A</strong>, Mã số sinh viên: <strong>2211050502</strong></p>
                                        <p>Sinh viên lớp: <strong>Công nghệ thông tin - K10</strong>, Hệ đào tạo: <strong>Đại học chính quy</strong></p>
                                        <p>Hiện đang học tại Khoa: <strong>Công nghệ Thông tin</strong></p>
                                        <p>Nay tôi làm đơn này xin kính trình Ban Giám hiệu, Ban Chủ nhiệm Khoa cho phép tôi được thôi học tại trường kể từ học kỳ I năm học 2026-2027.</p>
                                        <p><strong>Lý do xin thôi học:</strong> <span>{record.reason}</span></p>
                                        <p>Rất mong nhận được sự chấp thuận từ phía Nhà trường.</p>
                                        <p style={{ textAlign: 'right', marginTop: '15px', fontStyle: 'italic' }}>Cần Thơ, ngày 12 tháng 06 năm 2026</p>
                                    </div>

                                    {/* Signatures seals grid */}
                                    <div className="pdf-signatures-grid">
                                        {/* CVHT */}
                                        <div className="pdf-sig-box">
                                            <span className="sig-title">Cố vấn học tập</span>
                                            {record.status === "Đã phê duyệt" ? (
                                                <div className="sig-stamp certified">
                                                    <i className="fa-solid fa-circle-check"></i> ĐÃ DUYỆT<br />
                                                    <span className="stamp-by">ThS. Nguyễn Văn B</span><br />
                                                    <span className="stamp-time">13/06/2026</span>
                                                </div>
                                            ) : record.status === "Đang xử lý" ? (
                                                <div className="sig-stamp processing">
                                                    <i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý
                                                </div>
                                            ) : record.status === "Bị từ chối" ? (
                                                <div className="sig-stamp rejected">
                                                    <i className="fa-solid fa-circle-xmark"></i> Bị từ chối / Hủy
                                                </div>
                                            ) : (
                                                <div className="sig-stamp waiting">
                                                    <i className="fa-solid fa-hourglass-half"></i> Chờ duyệt
                                                </div>
                                            )}
                                        </div>

                                        {/* Khoa */}
                                        <div className="pdf-sig-box">
                                            <span className="sig-title">Khoa CNTT</span>
                                            {record.status === "Đã phê duyệt" ? (
                                                <div className="sig-stamp certified">
                                                    <i className="fa-solid fa-circle-check"></i> ĐÃ DUYỆT<br />
                                                    <span className="stamp-by">PGS.TS. Trần Văn C</span><br />
                                                    <span className="stamp-time">15/06/2026</span>
                                                </div>
                                            ) : record.status === "Bị từ chối" ? (
                                                <div className="sig-stamp rejected">
                                                    <i className="fa-solid fa-circle-xmark"></i> Bị từ chối / Hủy
                                                </div>
                                            ) : (
                                                <div className="sig-stamp waiting">
                                                    <i className="fa-solid fa-hourglass-half"></i> Chờ duyệt
                                                </div>
                                            )}
                                        </div>

                                        {/* P.CTCT-SV-KN */}
                                        <div className="pdf-sig-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="sig-title">P. CTCT-SV-KN</span>
                                            {record.status === "Đã phê duyệt" ? (
                                                <div className="sig-stamp certified-seal">
                                                    <i className="fa-solid fa-certificate"></i> ĐÃ ĐÓNG DẤU<br />
                                                    <span className="stamp-by">P.CTCT-SV-KN</span><br />
                                                    <span className="stamp-time">16/06/2026</span>
                                                </div>
                                            ) : record.status === "Bị từ chối" ? (
                                                <div className="sig-stamp rejected">
                                                    <i className="fa-solid fa-circle-xmark"></i> Bị từ chối / Hủy
                                                </div>
                                            ) : (
                                                <div className="sig-stamp waiting">
                                                    <i className="fa-solid fa-hourglass-half"></i> Chờ duyệt
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Operations History Logs */}
                <section className="history-logs-card" id="frame_172_312">
                    <h4 className="history-title-text"><i className="fa-solid fa-clock-rotate-left"></i> LỊCH SỬ THAO TÁC</h4>
                    <div className="timeline-wrapper">
                        {record.history.map((logItem, idx) => {
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
                        {(record.status === "Chờ xử lý" || record.status === "Đang xử lý") && (
                            <button 
                                type="button" 
                                id="btnWithdraw" 
                                className="btn btn-danger"
                                onClick={() => onWithdraw(record.id)}
                            >
                                <i className="fa-solid fa-trash-can"></i> Rút hồ sơ
                            </button>
                        )}
                    </div>
                    
                    {record.status === "Đã phê duyệt" && (
                        <div className="actions-center">
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => showAlert(
                                    "Tải xuống PDF", 
                                    `Hệ thống đang khởi tạo và tải xuống bản ký số điện tử của hồ sơ "${record.id.toUpperCase()}".`, 
                                    "success"
                                )}
                            >
                                <i className="fa-solid fa-cloud-arrow-down"></i> Tải PDF
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => window.print()}
                            >
                                <i className="fa-solid fa-print"></i> In tài liệu
                            </button>
                            <div className="qr-verify-badge">
                                <div className="qr-code-placeholder"><i className="fa-solid fa-qrcode"></i></div>
                                <span className="qr-text">Quét mã<br />xác thực</span>
                            </div>
                        </div>
                    )}

                    <div className="actions-right">
                        <a 
                            href="#search" 
                            className="btn btn-secondary"
                            onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}
                        >
                            <i className="fa-solid fa-arrow-left"></i> Quay về danh sách đơn
                        </a>
                    </div>
                </section>

            </div>
        </main>
    );
}
