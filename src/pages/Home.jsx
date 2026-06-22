import React from 'react';
import { useEffect, useState } from "react";

export default function Home({ studentId, setCurrentPage, setSelectedRecordId, showAlert, showConfirm }) {
    //Lấy các đơn từ API
    const [loaiDonList, setLoaiDonList] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/import-forms")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoaiDonList(data.data || []);
            })
            .catch(err => console.error(err));
    }, []);

    const handleProcedureClick = (loaiDon) => {
        if (!studentId) {
            showAlert(
                "Yêu cầu đăng nhập",
                `Bạn đang muốn nộp hồ sơ cho thủ tục "${loaiDon.tenDon}". Vui lòng đăng nhập bằng tài khoản Email sinh viên để tiếp tục.`,
                "warning",
                () => {
                    setCurrentPage("login");
                }
            );
        } else {
            setSelectedRecordId(loaiDon._id);
            //setSelectedRecordId('abc345');

            showAlert(
                "Nộp đơn trực tuyến",
                `Bạn đang nộp hồ sơ cho thủ tục "${loaiDon.tenDon}".`,
                "info",
                () => {
                    setCurrentPage("detail");
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
                            <img src="public/assets/images/university_banner.png" alt="CTUT Administrative Building" className="hero-img" id="img_6_269" />
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
                        {loaiDonList.map((loaiDon) => (
                            <div
                                className="card"
                                key={loaiDon._id}
                            >
                                <div className="card-icon-wrapper">
                                    <i className="fa-solid fa-file-lines card-icon"></i>
                                </div>

                                <h3 className="card-title">
                                    {loaiDon.tenDon}
                                </h3>

                                <p className="card-desc">
                                    Gồm {loaiDon.chiTiet?.length || 0} trường thông tin cần khai báo.
                                </p>

                                <div className="card-action">
                                    <a
                                        href="#apply"
                                        className="card-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleProcedureClick(loaiDon);
                                        }}
                                    >
                                        CHI TIẾT{" "}
                                        <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                    </a>
                                </div>
                            </div>
                        ))}
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
