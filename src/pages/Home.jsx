import React, { useState, useEffect } from 'react';

export default function Home({ studentId, setCurrentPage, setSelectedRecordId, setSelectedTemplateId, showAlert, showConfirm }) {
    const [templates, setTemplates] = useState([]);

    // Fetch all templates from database on load
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/import-forms?limit=100')
            .then(res => res.json())
            .then(result => {
                if (result.success && Array.isArray(result.data)) {
                    setTemplates(result.data);
                }
            })
            .catch(err => console.error('Error fetching templates:', err));
    }, []);

    const handleProcedureClick = (title) => {
        // Map card titles to database template names (tenDon)
        const mapTitleToTenDon = {
            'Đơn xin thực tập': 'giay-gioi-thieu-thuc-tap',
            'Đơn xin bảo lưu': 'don-bao-luu',
            'Đơn xin học lại': 'don-hoc-lai',
            'Đơn xin thôi học': 'don-xin-thoi-hoc',
            'Cấp lại thẻ sinh viên': 'don-cap-lai-the-sinh-vien',
            'Đơn xác nhận khó khăn': 'giay-xac-nhan-hckk'
        };

        const targetTenDon = mapTitleToTenDon[title];
        const template = templates.find(t => t.tenDon === targetTenDon);

        if (!template) {
            showAlert(
                "Mẫu đơn chưa sẵn sàng",
                `Mẫu đơn cho thủ tục "${title}" chưa được đưa vào hệ thống. Vui lòng liên hệ quản trị viên.`,
                "warning"
            );
            return;
        }

        if (!studentId) {
            showAlert(
                "Yêu cầu đăng nhập",
                `Bạn đang muốn nộp hồ sơ cho thủ tục "${title}". Vui lòng đăng nhập bằng tài khoản Email sinh viên để tiếp tục.`,
                "warning",
                () => {
                    setCurrentPage('login');
                }
            );
        } else {
            showAlert(
                "Nộp đơn trực tuyến",
                `Bạn đang nộp hồ sơ cho thủ tục "${title}". Hệ thống sẽ chuyển hướng sang biểu mẫu điền thông tin chi tiết.`,
                "info",
                () => {
                    setSelectedTemplateId(template._id);
                    setCurrentPage('write-application');
                }
            );
        }
    };

    const handleScrollToProcedures = (e) => {
        e.preventDefault();
        const element = document.getElementById('procedures');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToSteps = (e) => {
        e.preventDefault();
        const element = document.getElementById('steps');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section" id="hero">
                <div className="hero-container" id="container_6_252">
                    {/* Left Hero Content */}
                    <div className="hero-content" id="content_6_253">
                        <div className="badge" id="badge_6_254">
                            <span className="badge-text" id="text_6_255">Hệ thống dịch vụ công</span>
                        </div>
                        <h2 className="hero-title" id="title_6_257">
                            Hệ thống thủ tục hành chính<br />điện tử Sinh viên
                        </h2>
                        <p className="hero-desc" id="desc_6_259">
                            Giải quyết các loại đơn từ hành chính trực tuyến nhanh chóng, minh bạch và an toàn. Tích hợp giải pháp chữ ký số bảo mật cho tất cả các quy trình phê duyệt của Khoa và Nhà trường.
                        </p>
                        <div className="hero-actions" id="actions_6_260">
                            <a href="#procedures" className="btn btn-primary" id="btn_6_261" onClick={handleScrollToProcedures}>Nộp đơn ngay</a>
                            <a href="#steps" className="btn btn-secondary" id="btn_6_265" onClick={handleScrollToSteps}>Xem hướng dẫn</a>
                        </div>
                    </div>

                    {/* Right Hero Image */}
                    <div className="hero-image-wrapper" id="image_6_267">
                        <div className="image-card" id="card_6_268">
                            <img src="/public/assets/images/university_banner.png" alt="CTUT Administrative Building" className="hero-img" id="img_6_269" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Administrative Procedures Section */}
            <section className="procedures-section" id="procedures">
                <div className="procedures-container" id="container_211_3">
                    {/* Section Header */}
                    <div className="section-header" id="header_211_4">
                        <h2 className="section-title" id="title_211_5">Các thủ tục hành chính</h2>
                        <p className="section-desc" id="desc_211_7">
                            Danh sách các dịch vụ công trực tuyến dành cho sinh viên Khoa Công nghệ thông tin được hỗ trợ giải quyết qua Cổng Dịch vụ Sinh viên.
                        </p>
                        <div className="underline-decor" id="decor_211_9"></div>
                    </div>

                    {/* Cards Grid */}
                    <div className="cards-grid" id="grid_211_10">
                        {/* Card 1: Đơn xin thực tập */}
                        <div className="card" id="card_211_11">
                            <div className="card-icon-wrapper" id="icon_211_12">
                                <i className="fa-solid fa-briefcase card-icon"></i>
                            </div>
                            <h3 className="card-title" id="title_211_17">Đơn xin thực tập</h3>
                            <p className="card-desc" id="desc_211_19">
                                Đăng ký thực tập tại doanh nghiệp, xin giấy giới thiệu và xác nhận kế hoạch thực tập tốt nghiệp.
                            </p>
                            <div className="card-action" id="action_211_20">
                                <a
                                    href="#apply"
                                    className="card-link"
                                    id="link_211_21"
                                    onClick={(e) => { e.preventDefault(); handleProcedureClick('Đơn xin thực tập'); }}
                                >
                                    CHI TIẾT <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                </a>
                            </div>
                        </div>

                        {/* Card 2: Đơn xin bảo lưu */}
                        <div className="card" id="card_211_26">
                            <div className="card-icon-wrapper" id="icon_211_27">
                                <i className="fa-solid fa-folder-open card-icon"></i>
                            </div>
                            <h3 className="card-title" id="title_211_31">Đơn xin bảo lưu</h3>
                            <p className="card-desc" id="desc_211_33">
                                Thủ tục xin nghỉ học tạm thời, bảo lưu kết quả học tập hoặc xin thôi học theo nguyện vọng cá nhân.
                            </p>
                            <div className="card-action" id="action_211_35">
                                <a
                                    href="#apply"
                                    className="card-link"
                                    id="link_211_36"
                                    onClick={(e) => { e.preventDefault(); handleProcedureClick('Đơn xin bảo lưu'); }}
                                >
                                    CHI TIẾT <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                </a>
                            </div>
                        </div>

                        {/* Card 3: Đơn xin học lại */}
                        <div className="card" id="card_211_41">
                            <div className="card-icon-wrapper" id="icon_211_42">
                                <i className="fa-solid fa-graduation-cap card-icon"></i>
                            </div>
                            <h3 className="card-title" id="title_211_46">Đơn xin học lại</h3>
                            <p className="card-desc" id="desc_211_48">
                                Thủ tục dành cho sinh viên có mong muốn tham gia lại quá trình học tập tại trường sau thời gian tạm dừng.
                            </p>
                            <div className="card-action" id="action_211_50">
                                <a
                                    href="#apply"
                                    className="card-link"
                                    id="link_211_51"
                                    onClick={(e) => { e.preventDefault(); handleProcedureClick('Đơn xin học lại'); }}
                                >
                                    CHI TIẾT <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                </a>
                            </div>
                        </div>

                        {/* Card 4: Đơn xin thôi học */}
                        <div className="card" id="card_211_56">
                            <div className="card-icon-wrapper" id="icon_211_57">
                                <i className="fa-solid fa-user-minus card-icon"></i>
                            </div>
                            <h3 className="card-title" id="title_211_61">Đơn xin thôi học</h3>
                            <p className="card-desc" id="desc_211_63">
                                Thủ tục dành cho sinh viên muốn chính thức chấm dứt quá trình học tập tại trường vì lý do cá nhân.
                            </p>
                            <div className="card-action" id="action_211_65">
                                <a
                                    href="#apply"
                                    className="card-link"
                                    id="link_211_66"
                                    onClick={(e) => { e.preventDefault(); handleProcedureClick('Đơn xin thôi học'); }}
                                >
                                    CHI TIẾT <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                </a>
                            </div>
                        </div>

                        {/* Card 5: Đơn xin cấp lại thẻ sinh viên */}
                        <div className="card" id="card_211_71">
                            <div className="card-icon-wrapper" id="icon_211_72">
                                <i className="fa-solid fa-id-card card-icon"></i>
                            </div>
                            <h3 className="card-title" id="title_211_76">Cấp lại thẻ sinh viên</h3>
                            <p className="card-desc" id="desc_211_78">
                                Yêu cầu cấp thẻ sinh viên mới trong trường hợp bị mất, hư hỏng hoặc sai sót thông tin cá nhân.
                            </p>
                            <div className="card-action" id="action_211_80">
                                <a
                                    href="#apply"
                                    className="card-link"
                                    id="link_211_81"
                                    onClick={(e) => { e.preventDefault(); handleProcedureClick('Cấp lại thẻ sinh viên'); }}
                                >
                                    CHI TIẾT <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                </a>
                            </div>
                        </div>

                        {/* Card 6: Đơn xác nhận khó khăn */}
                        <div className="card" id="card_211_86">
                            <div className="card-icon-wrapper" id="icon_211_87">
                                <i className="fa-solid fa-hand-holding-heart card-icon"></i>
                            </div>
                            <h3 className="card-title" id="title_211_91">Đơn xác nhận khó khăn</h3>
                            <p className="card-desc" id="desc_211_93">
                                Yêu cầu xác nhận hoàn cảnh gia đình khó khăn để làm hồ sơ xét duyệt học bổng, hỗ trợ học phí.
                            </p>
                            <div className="card-action" id="action_211_95">
                                <a
                                    href="#apply"
                                    className="card-link"
                                    id="link_211_96"
                                    onClick={(e) => { e.preventDefault(); handleProcedureClick('Đơn xác nhận khó khăn'); }}
                                >
                                    CHI TIẾT <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Grid Subtitle Footer */}
                    <div className="grid-sub-footer" id="sub_footer_211_101">
                        <span className="sub-footer-text" id="text_211_103">Hệ thống hỗ trợ sinh viên - Khoa Công nghệ thông tin</span>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="steps-section" id="steps">
                <div className="steps-container" id="container_6_304">
                    <div className="section-header" id="header_6_305">
                        <h2 className="section-title" id="title_6_307">Quy trình thực hiện</h2>
                        <div className="underline-decor" id="decor_6_308"></div>
                    </div>

                    {/* Steps Progress Layout */}
                    <div className="steps-flow" id="flow_6_309">
                        {/* Step 1 */}
                        <div className="step-card" id="step_6_310">
                            <div className="step-num-badge" id="badge_6_312">
                                <span className="step-num" id="num_6_314">01</span>
                            </div>
                            <h3 className="step-title" id="title_6_316">Sinh viên nộp đơn</h3>
                            <p className="step-desc" id="desc_6_318">Khai báo thông tin và tải lên các minh chứng cần thiết trực tuyến.</p>
                        </div>

                        <div className="step-arrow"><i className="fa-solid fa-arrow-right-long"></i></div>

                        {/* Step 2 */}
                        <div className="step-card" id="step_6_320">
                            <div className="step-num-badge" id="badge_6_323">
                                <span className="step-num" id="num_6_325">02</span>
                            </div>
                            <h3 className="step-title" id="title_6_327">CVHT duyệt</h3>
                            <p className="step-desc" id="desc_6_329">Cố vấn học tập xem xét và cho ý kiến chuyên môn về nguyện vọng.</p>
                        </div>

                        <div className="step-arrow"><i className="fa-solid fa-arrow-right-long"></i></div>

                        {/* Step 3 */}
                        <div className="step-card" id="step_6_331">
                            <div className="step-num-badge" id="badge_6_334">
                                <span className="step-num" id="num_6_336">03</span>
                            </div>
                            <h3 className="step-title" id="title_6_338">Lãnh đạo ký số</h3>
                            <p className="step-desc" id="desc_6_340">Lãnh đạo Khoa thực hiện ký số phê duyệt trên hệ thống điện tử.</p>
                        </div>

                        <div className="step-arrow"><i className="fa-solid fa-arrow-right-long"></i></div>

                        {/* Step 4 */}
                        <div className="step-card active" id="step_6_342">
                            <div className="step-num-badge" id="badge_6_345">
                                <span className="step-num" id="num_6_346">04</span>
                            </div>
                            <h3 className="step-title" id="title_6_348">Nhận kết quả</h3>
                            <p className="step-desc" id="desc_6_350">Sinh viên nhận thông báo và tải kết quả văn bản đã được phê duyệt.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
