import React from 'react';
import { useEffect, useState } from "react";

export default function Detail({ recordId, records, onWithdraw, setCurrentPage, showAlert, showConfirm }) {
    //Lấy thông tin đơn theo id
    const [loaiDon, setLoaiDon] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/import-forms/${recordId}`)
            .then((res) => res.json())
            .then((data) => {
                setLoaiDon(data.data);

                const initData = {};

                data.data.chiTiet.forEach((item) => {
                    initData[item.placeHolder] = "";
                });

                setFormData(initData);
            })
            .catch((err) => console.error(err));
    }, [recordId]);

    //Preview
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const handlePreview = async () => {
        try {
            setPreviewLoading(true);

            const body = new FormData();

            body.append("templateFile", loaiDon.templateFile);

            Object.entries(formData).forEach(([key, value]) => {
                body.append(key, value);
            });

            const response = await fetch(
                `http://localhost:5000/api/v1/convert-file-and-submit/preview`,
                {
                    method: "POST",
                    body,
                }
            );

            if (!response.ok) {
                throw new Error("Không thể preview");
            }

            const blob = await response.blob();

            // pdf blob url
            const pdfUrl = URL.createObjectURL(blob);

            setPreviewUrl(pdfUrl);
        } catch (err) {
            console.error(err);
            alert("Không thể tạo preview");
        } finally {
            setPreviewLoading(false);
        }
    };

    //Upload
    const [uploadLoading, setUploadLoading] = useState(false);
    const handleUpload = async () => {
        try {
            setUploadLoading(true);

            const body = new FormData();

            body.append(
                "templateFile",
                loaiDon.templateFile
            );

            Object.entries(formData).forEach(
                ([key, value]) => {
                    body.append(key, value);
                }
            );

            const response = await fetch(
                `http://localhost:5000/api/v1/convert-file-and-submit/generate?format=pdf&fileName=${encodeURIComponent(loaiDon.tenDon)}`+".pdf",
                {
                    method: "POST",
                    body
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Nộp đơn thất bại"
                );
            }

            alert(result.message);
        } catch (err) {
            console.error(err);
            alert("Nộp đơn thất bại");
        } finally {
            setUploadLoading(false);
        }
    };

    //const record = records.find(r => r.id === recordId);

    // if (!record) {
    //     return (
    //         <main className="page-content-wrapper">
    //             <div className="content-container" style={{ textAlign: 'center', padding: '100px 0' }}>
    //                 <h2>Không tìm thấy thông tin hồ sơ</h2>
    //                 <p>Vui lòng quay lại danh sách tra cứu để chọn hồ sơ hợp lệ. {recordId}</p>
    //                 <a href="#search" className="btn btn-primary" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Quay lại</a>
    //             </div>
    //         </main>
    //     );
    // }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
    // const getStepperClasses = () => {
    //     let activeUpTo = 0;
    //     let isError = false;

    //     if (record.status === "Chờ xử lý") activeUpTo = 0;
    //     else if (record.status === "Đang xử lý") activeUpTo = 1;
    //     else if (record.status === "Đã phê duyệt") activeUpTo = 4;
    //     else if (record.status === "Bị từ chối") {
    //         activeUpTo = 0;
    //         isError = true;
    //     }

    //     const nodes = Array(5).fill('').map((_, i) => {
    //         let className = 'stepper-step';
    //         if (isError && i === 0) {
    //             className += ' error';
    //         } else if (i <= activeUpTo) {
    //             className += ' active';
    //             if (i === activeUpTo && activeUpTo < 4) className += ' pulsing';
    //             else if (activeUpTo === 4) className += ' completed';
    //         }
    //         return className;
    //     });

    //     const lines = Array(4).fill('').map((_, i) => {
    //         let className = 'step-line';
    //         if (!isError && i < activeUpTo) {
    //             className += ' active';
    //             if (activeUpTo === 4) className += ' completed';
    //         }
    //         return className;
    //     });

    //     return { nodes, lines };
    // };

    // const { nodes: stepNodes, lines: stepLines } = getStepperClasses();

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
                    {/* <span className="breadcrumb-current">{record.type}</span> */}
                </nav>

                {/* Page Title */}
                <div className="page-main-header">
                    {/* <h1 className="page-title-text" id="title_172_358">{record.type.toUpperCase()}</h1> */}
                    <div className="underline-decor left-align"></div>
                </div>

                {/* Dynamic Notification Banner */}
                {/* {record.status === "Chờ xử lý" && (
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
                )} */}

                {/* Stepper Progress Tracker */}
                <section className="stepper-progress-card">
                    <div className="stepper-container" id="stepperContainer">
                        <div className={"step-node-active"}>
                            <div className="step-dot"><i className="fa-solid fa-circle-info"></i></div>
                            <span className="step-label">Đã tiếp nhận</span>
                        </div>
                        <div className={"step-node-active"}>
                            <div className="step-dot"><i className="fa-solid fa-user-graduate"></i></div>
                            <span className="step-label">Chờ CVHT</span>
                        </div>
                        <div className={"step-node-waiting"}>
                            <div className="step-dot"><i className="fa-solid fa-graduation-cap"></i></div>
                            <span className="step-label">Chờ Khoa</span>
                        </div>
                        <div className={"step-node-waiting"}>
                            <div className="step-dot"><i className="fa-solid fa-building-columns"></i></div>
                            <span className="step-label">P.CTCT-SV</span>
                        </div>
                        <div className={"step-node-waiting"}>
                            <div className="step-dot"><i className="fa-solid fa-circle-check"></i></div>
                            <span className="step-label">Hoàn tất</span>
                        </div>


                        {/* <div className={stepLines[0]}></div>

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
                        </div> */}
                    </div>
                </section>

                {/* <p className="status-summary-text">
                    {getStatusSummaryText(record.status)}
                </p> */}

                {/* Split layout */}
                <div className="detail-split-layout">
                    {/* Left Form Box */}
                    <section className="form-details-column">
                        <div className="card-box">
                            <h4 className="card-box-title"><i className="fa-solid fa-file-waveform"></i> THÔNG TIN ĐƠN YÊU CẦU</h4>

                            <div className="detail-group">
                                <span className="detail-label">ID hồ sơ</span>
                                <input
                                    type="text"
                                    className="detail-value-box"
                                    value={recordId}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {loaiDon?.chiTiet?.map((item) => (
                                <div className="detail-group" key={item._id}>
                                    <span className="detail-label">
                                        {item.moTa}
                                    </span>

                                    {item.placeHolder.includes("%") ? (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="detail-value-box"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [item.placeHolder.replace(/^%/, "")]: e.target.files[0]
                                                }));
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name={item.placeHolder}
                                            className="detail-value-box"
                                            value={formData[item.placeHolder] || ""}
                                            onChange={handleChange}
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handlePreview}
                                disabled={previewLoading}
                            >
                                <i className="fa-solid fa-eye"></i>
                                {" "}
                                {previewLoading ? "Đang tạo..." : "Preview"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleUpload}
                                disabled={uploadLoading}
                            >
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                {" "}
                                {uploadLoading
                                    ? "Đang upload..."
                                    : "Nộp đơn"}
                            </button>
                            {/* <div className="detail-group">
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
                            </div> */}
                        </div>
                    </section>

                    {/* Right PDF Preview */}
                    <section className="pdf-viewer-column">
                        <div className="card-box pdf-card">
                            <div className="pdf-header">
                                <span className="pdf-header-title">
                                    "ĐANG XỬ LÝ"
                                    {/* {record.status === "Đã phê duyệt" ? 'ĐÃ PHÊ DUYỆT & KÝ SỐ' : record.status === 'Bị từ chối' ? 'HỒ SƠ ĐÃ BỊ HỦY' : 'Read only PDF Preview'} */}
                                </span>
                                <span className="pdf-header-badge"><i className="fa-solid fa-file-pdf"></i> PDF</span>
                            </div>

                            <div className="pdf-page-container">
                                {previewUrl ? (
                                    <iframe
                                        src={previewUrl}
                                        title="PDF Preview"
                                        width="100%"
                                        height="900px"
                                        style={{
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#fff"
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            height: "900px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#666"
                                        }}
                                    >
                                        Nhấn nút Preview để xem trước PDF
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Operations History Logs */}
                <section className="history-logs-card" id="frame_172_312">
                    <h4 className="history-title-text"><i className="fa-solid fa-clock-rotate-left"></i> LỊCH SỬ THAO TÁC</h4>
                    <div className="timeline-wrapper">
                        {/* {record.history.map((logItem, idx) => {
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
                        })} */}
                    </div>
                </section>

                {/* Action Buttons */}
                <section className="detail-actions-row">
                    <div className="actions-left">
                        {/* {(record.status === "Chờ xử lý" || record.status === "Đang xử lý") && (
                            <button
                                type="button"
                                id="btnWithdraw"
                                className="btn btn-danger"
                                onClick={() => onWithdraw(record.id)}
                            >
                                <i className="fa-solid fa-trash-can"></i> Rút hồ sơ
                            </button>
                        )} */}
                    </div>

                    {/* {record.status === "Đã phê duyệt" && (
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
                    )} */}

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
