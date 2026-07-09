import React from 'react';

export default function Footer({ setCurrentPage }) {
    const handleFooterLinkClick = (page, e) => {
        e.preventDefault();
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="main-footer" id="footer">
            <div className="footer-container" id="container_6_352">
                {/* Top Footer Menu */}
                <div className="footer-top" id="top_6_353">
                    {/* Col 1: Brand Info */}
                    <div className="footer-col" id="col_6_354">
                        <div className="footer-brand" id="brand_6_355">
                            <img src="assets/images/logo-truong-removebg-preview.png" alt="CTUT Logo" className="footer-logo" />
                            <h4 className="footer-brand-title" id="title_6_358">Khoa CNTT - CTUT</h4>
                        </div>
                        <p className="footer-brand-desc" id="desc_6_360">
                            Trường Đại học Kỹ thuật - Công nghệ Cần Thơ. Hệ thống hành chính điện tử nâng cao hiệu quả quản trị học đường.
                        </p>
                    </div>

                    {/* Col 2: Quick Links */}
                    <div className="footer-col" id="col_6_361">
                        <h4 className="footer-col-title" id="title_6_363">Liên kết nhanh</h4>
                        <ul className="footer-links-list" id="list_6_364">
                            <li><a href="#search" onClick={(e) => handleFooterLinkClick('search', e)}>Tra cứu hồ sơ</a></li>
                            <li><a href="#profile" onClick={(e) => handleFooterLinkClick('profile', e)}>Thông tin cá nhân</a></li>
                            <li><a href="javascript:void(0)" id="link_6_370">Lịch công tác Khoa</a></li>
                            <li><a href="javascript:void(0)" id="link_6_372">Biểu mẫu hành chính</a></li>
                        </ul>
                    </div>

                    {/* Col 3: Support */}
                    <div className="footer-col" id="col_6_373">
                        <h4 className="footer-col-title" id="title_6_375">Hỗ trợ kỹ thuật</h4>
                        <ul className="footer-links-list" id="list_6_376">
                            <li><a href="javascript:void(0)" id="link_6_378">Hướng dẫn sử dụng</a></li>
                            <li><a href="javascript:void(0)" id="link_6_380">Câu hỏi thường gặp</a></li>
                            <li><a href="javascript:void(0)" id="link_6_382">Báo lỗi hệ thống</a></li>
                            <li><a href="javascript:void(0)" id="link_6_384">Quy định bảo mật</a></li>
                        </ul>
                    </div>

                    {/* Col 4: Contact */}
                    <div className="footer-col" id="col_6_385">
                        <h4 className="footer-col-title" id="title_6_387">Thông tin liên hệ</h4>
                        <ul className="footer-contact-list" id="list_6_388">
                            <li>
                                <i className="fa-solid fa-location-dot contact-icon"></i>
                                <span id="text_6_392">256 Nguyễn Văn Cừ, Quận Ninh Kiều, TP. Cần Thơ</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-phone contact-icon"></i>
                                <span id="text_6_395">(0292) 389 4050</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-envelope contact-icon"></i>
                                <span id="text_6_398">khoacntt@ctuet.edu.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Copyright Row */}
                <div className="footer-bottom" id="bottom_6_399">
                    <p className="copyright-text" id="text_6_401">
                        © 2026 Khoa Công nghệ thông tin - CTUT. Bảo lưu mọi quyền.
                    </p>
                    <div className="footer-bottom-links" id="links_6_402">
                        <a href="javascript:void(0)" id="link_6_404">Chính sách bảo mật</a>
                        <span className="link-divider">|</span>
                        <a href="javascript:void(0)" id="link_6_407">Điều khoản sử dụng</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
