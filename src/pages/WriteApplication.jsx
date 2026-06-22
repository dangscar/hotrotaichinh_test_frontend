import React, { useEffect, useState } from 'react';

export default function WriteApplication({ templateId, setCurrentPage, showAlert, showConfirm }) {
    const [loaiDon, setLoaiDon] = useState(null);
    const [formData, setFormData] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [hasPreviewed, setHasPreviewed] = useState(false);

    // Fetch form template by ID on mount
    useEffect(() => {
        if (!templateId) return;

        fetch(`http://localhost:5000/api/v1/import-forms/${templateId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    setLoaiDon(data.data);
                    
                    const initData = {};
                    // Pre-fill default session values if they match placeholder names
                    const studentId = localStorage.getItem('studentId') || '';
                    const studentEmail = localStorage.getItem('studentEmail') || '';
                    
                    data.data.chiTiet.forEach((item) => {
                        const key = item.placeHolder.replace(/^%/, "");
                        if (key === 'MSSV') {
                            initData[key] = studentId;
                        } else if (key === 'EMAIL') {
                            initData[key] = studentEmail;
                        } else if (key === 'HO_TEN') {
                            initData[key] = 'Nguyễn Văn A'; // default matching student template
                        } else {
                            initData[key] = "";
                        }
                    });
                    
                    setFormData(initData);
                } else {
                    showAlert("Lỗi", "Không thể tải cấu hình mẫu đơn.", "danger");
                }
            })
            .catch((err) => {
                console.error(err);
                showAlert("Lỗi", "Không thể kết nối đến máy chủ.", "danger");
            });
    }, [templateId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e, placeHolderKey) => {
        const file = e.target.files[0];
        const key = placeHolderKey.replace(/^%/, "");
        setFormData((prev) => ({
            ...prev,
            [key]: file,
        }));
    };

    const handlePreview = async () => {
        if (!loaiDon) return;

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
                throw new Error("Không thể tạo bản xem trước");
            }

            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            setPreviewUrl(pdfUrl);
            setHasPreviewed(true);
        } catch (err) {
            console.error(err);
            showAlert("Lỗi", "Không thể tạo bản xem trước PDF. Vui lòng kiểm tra lại thông tin.", "danger");
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!loaiDon) return;

        showConfirm(
            "XÁC NHẬN NỘP ĐƠN",
            `Bạn có chắc chắn muốn nộp hồ sơ "${loaiDon.tenDon.toUpperCase()}" lên hệ thống?`,
            async () => {
                try {
                    setUploadLoading(true);
                    const body = new FormData();
                    body.append("templateFile", loaiDon.templateFile);

                    // Thêm tên đơn vào dữ liệu gửi đi để controller lưu đúng tên
                    body.append("tenDon", loaiDon.tenDon);

                    Object.entries(formData).forEach(([key, value]) => {
                        body.append(key, value);
                    });

                    const response = await fetch(
                        `http://localhost:5000/api/v1/convert-file-and-submit/generate?format=pdf&fileName=${encodeURIComponent(loaiDon.tenDon)}.pdf`,
                        {
                            method: "POST",
                            body
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || "Nộp đơn thất bại");
                    }

                    showAlert(
                        "Thành công", 
                        "Nộp đơn trực tuyến thành công! Hồ sơ của bạn đã được tiếp nhận và chuyển đến CVHT.", 
                        "success", 
                        () => {
                            setCurrentPage('search');
                        }
                    );
                } catch (err) {
                    console.error(err);
                    showAlert("Lỗi", err.message || "Nộp đơn thất bại. Vui lòng thử lại sau.", "danger");
                } finally {
                    setUploadLoading(false);
                }
            },
            null,
            "warning",
            "Nộp đơn",
            "Hủy"
        );
    };

    if (!loaiDon) {
        return (
            <main className="page-content-wrapper">
                <div className="content-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải mẫu đơn...</span>
                    </div>
                </div>
            </main>
        );
    }

    // Format display title (e.g. don-xin-thoi-hoc -> ĐƠN XIN THÔI HỌC)
    const displayTitle = loaiDon.tenDon
        .replace(/-/g, ' ')
        .toUpperCase();

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
                <nav className="breadcrumbs-nav">
                    <a href="#home" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Trang chủ</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <a href="#home" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Các thủ tục</a>
                    <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
                    <span className="breadcrumb-current">Viết đơn</span>
                </nav>

                {/* Page Title */}
                <div className="page-main-header">
                    <h1 className="page-title-text">{displayTitle}</h1>
                    <div className="underline-decor left-align"></div>
                </div>

                {/* Custom Stepper Tracker */}
                <section className="stepper-progress-card">
                    <div className="stepper-container" id="stepperContainer">
                        <div className={`step-node-active ${!hasPreviewed ? 'pulsing' : ''}`}>
                            <div className="step-dot"><i className="fa-solid fa-pen-to-square"></i></div>
                            <span className="step-label">Soạn thảo</span>
                        </div>
                        <div className={hasPreviewed ? "step-node-active pulsing" : "step-node-waiting"}>
                            <div className="step-dot"><i className="fa-solid fa-eye"></i></div>
                            <span className="step-label">Xem trước</span>
                        </div>
                        <div className="step-node-waiting">
                            <div className="step-dot"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                            <span className="step-label">Nộp đơn</span>
                        </div>
                        <div className="step-node-waiting">
                            <div className="step-dot"><i className="fa-solid fa-circle-check"></i></div>
                            <span className="step-label">Hoàn tất</span>
                        </div>
                    </div>
                </section>

                {/* Split layout */}
                <div className="detail-split-layout">
                    {/* Left Form Box */}
                    <section className="form-details-column">
                        <div className="card-box">
                            <h4 className="card-box-title">
                                <i className="fa-solid fa-file-waveform"></i> THÔNG TIN ĐƠN YÊU CẦU
                            </h4>

                            {loaiDon.chiTiet.map((item) => {
                                const key = item.placeHolder.replace(/^%/, "");
                                const isFile = item.placeHolder.startsWith("%");

                                return (
                                    <div className="detail-group" key={item._id}>
                                        <span className="detail-label">
                                            {item.moTa.replace(/_/g, ' ')}
                                        </span>

                                        {isFile ? (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="detail-value-box"
                                                onChange={(e) => handleFileChange(e, item.placeHolder)}
                                                style={{ width: "100%" }}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                name={key}
                                                className="detail-value-box"
                                                value={formData[key] || ""}
                                                onChange={handleChange}
                                                placeholder={`Nhập ${item.moTa.replace(/_/g, ' ').toLowerCase()}...`}
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handlePreview}
                                    disabled={previewLoading || uploadLoading}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fa-solid fa-eye"></i>
                                    {" "}
                                    {previewLoading ? "Đang tạo..." : "Xem trước PDF"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSubmit}
                                    disabled={uploadLoading || !hasPreviewed}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                    {" "}
                                    {uploadLoading ? "Đang gửi..." : "Nộp đơn"}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Right PDF Preview */}
                    <section className="pdf-viewer-column">
                        <div className="card-box pdf-card">
                            <div className="pdf-header">
                                <span className="pdf-header-title">BẢN XEM TRƯỚC HỒ SƠ</span>
                                <span className="pdf-header-badge"><i className="fa-solid fa-file-pdf"></i> PDF</span>
                            </div>

                            <div className="pdf-page-container">
                                {previewUrl ? (
                                    <iframe
                                        src={previewUrl}
                                        title="PDF Preview"
                                        width="100%"
                                        height="750px"
                                        style={{
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#fff"
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            height: "500px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#666",
                                            gap: "12px",
                                            background: "rgba(0,0,0,0.02)",
                                            borderRadius: "8px",
                                            border: "1px dashed rgba(0,0,0,0.1)"
                                        }}
                                    >
                                        <i className="fa-solid fa-file-pdf" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                        <span>Vui lòng điền thông tin và nhấn "Xem trước PDF"</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>


            </div>
        </main>
    );
}
