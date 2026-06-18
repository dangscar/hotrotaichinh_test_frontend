/* ==========================================================================
   LOGIC FOR RECORD DETAIL PAGE
   ========================================================================== */

// Retrieve record database from localStorage
function getRecords() {
    return JSON.parse(localStorage.getItem('studentRecords') || '[]');
}

// Save records back to localStorage
function saveRecords(records) {
    localStorage.setItem('studentRecords', JSON.stringify(records));
}

// Parse query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Formats status to text summary description
function getStatusSummaryText(status) {
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
}

// Render dynamic steps in tracker
function renderStepper(status) {
    const steps = [
        document.getElementById('stepNode1'),
        document.getElementById('stepNode2'),
        document.getElementById('stepNode3'),
        document.getElementById('stepNode4'),
        document.getElementById('stepNode5')
    ];
    
    const lines = [
        document.getElementById('stepLine1'),
        document.getElementById('stepLine2'),
        document.getElementById('stepLine3'),
        document.getElementById('stepLine4')
    ];

    // Reset all steps and lines
    steps.forEach(s => { if (s) s.className = 'stepper-step'; });
    lines.forEach(l => { if (l) l.className = 'step-line'; });

    // Mark steps and lines active based on progress status
    let activeUpTo = 0; // 0-indexed step node index
    
    if (status === "Chờ xử lý") {
        activeUpTo = 0; // Just Step 1 (Đã tiếp nhận)
    } else if (status === "Đang xử lý") {
        activeUpTo = 1; // Step 1 and Step 2 (Chờ CVHT)
    } else if (status === "Đã phê duyệt") {
        activeUpTo = 4; // All 5 steps completed
    } else if (status === "Bị từ chối") {
        activeUpTo = 0; // Keep Step 1 active but color error style
        if (steps[0]) steps[0].classList.add('error');
        return;
    }

    for (let i = 0; i <= activeUpTo; i++) {
        if (steps[i]) {
            steps[i].classList.add('active');
            if (i === activeUpTo && activeUpTo < 4) {
                // Keep current progress step pulsing
                steps[i].classList.add('pulsing');
            } else if (activeUpTo === 4) {
                steps[i].classList.add('completed');
            }
        }
        if (i < activeUpTo && lines[i]) {
            lines[i].classList.add('active');
        }
    }
}

// Setup notifications, actions, and PDF signatures based on status
function renderStatusDetails(record) {
    const banner = document.getElementById('bannerNotificationContainer');
    const bannerTitle = document.getElementById('bannerNotificationTitle');
    const bannerDesc = document.getElementById('bannerNotificationDesc');
    const statusText = document.getElementById('statusSummaryText');
    const pdfHeaderTitle = document.getElementById('pdfHeaderTitle');
    
    const btnWithdrawGroup = document.getElementById('group_172_343');
    const btnCompletedGroup = document.getElementById('group_208_529');
    
    const stampAdvisor = document.getElementById('stampAdvisor');
    const stampFaculty = document.getElementById('stampFaculty');
    const stampDepartment = document.getElementById('stampDepartment');

    // 1. Text description
    statusText.innerText = getStatusSummaryText(record.status);

    // 2. Setup stamps default styling
    [stampAdvisor, stampFaculty, stampDepartment].forEach(st => {
        if (st) {
            st.className = 'sig-stamp waiting';
            st.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> Chờ duyệt';
        }
    });

    if (record.status === "Chờ xử lý") {
        banner.className = 'banner-notification info-style';
        bannerTitle.innerText = 'Đã tiếp nhận hồ sơ';
        bannerDesc.innerText = `Hồ sơ ${record.id.toUpperCase()} đã được gửi thành công. Đang xếp hàng chờ xử lý.`;
        
        btnWithdrawGroup.style.display = 'block';
        btnCompletedGroup.style.display = 'none';
        
        pdfHeaderTitle.innerText = 'Read-only PDF Preview';
    } 
    else if (record.status === "Đang xử lý") {
        banner.className = 'banner-notification info-style';
        bannerTitle.innerText = 'Nộp đơn thành công!';
        bannerDesc.innerText = `Mã hồ sơ của bạn là: ${record.id.toUpperCase()} (Vui lòng lưu lại mã này để tra cứu)`;
        
        btnWithdrawGroup.style.display = 'block';
        btnCompletedGroup.style.display = 'none';
        
        pdfHeaderTitle.innerText = 'Read-only PDF Preview';
        
        // Advisor is processing
        if (stampAdvisor) {
            stampAdvisor.className = 'sig-stamp processing';
            stampAdvisor.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý';
        }
    } 
    else if (record.status === "Đã phê duyệt") {
        banner.className = 'banner-notification success-style';
        bannerTitle.innerText = 'Thủ tục đã hoàn tất!';
        bannerDesc.innerText = 'Bản điện tử có chữ ký số của đơn xin thôi học đã sẵn sàng. Bạn có thể tải về để lưu trữ.';
        
        btnWithdrawGroup.style.display = 'none';
        btnCompletedGroup.style.display = 'flex';
        
        pdfHeaderTitle.innerText = 'ĐÃ PHÊ DUYỆT & KÝ SỐ';
        
        // In completed state, inject green certified stamps
        if (stampAdvisor) {
            stampAdvisor.className = 'sig-stamp certified';
            stampAdvisor.innerHTML = `
                <i class="fa-solid fa-circle-check"></i> ĐÃ DUYỆT<br>
                <span class="stamp-by">ThS. Nguyễn Văn B</span><br>
                <span class="stamp-time">13/06/2026</span>
            `;
        }
        if (stampFaculty) {
            stampFaculty.className = 'sig-stamp certified';
            stampFaculty.innerHTML = `
                <i class="fa-solid fa-circle-check"></i> ĐÃ DUYỆT<br>
                <span class="stamp-by">PGS.TS. Trần Văn C</span><br>
                <span class="stamp-time">15/06/2026</span>
            `;
        }
        if (stampDepartment) {
            stampDepartment.className = 'sig-stamp certified-seal';
            stampDepartment.innerHTML = `
                <i class="fa-solid fa-certificate"></i> ĐÃ ĐÓNG DẤU<br>
                <span class="stamp-by">P.CTCT-SV-KN</span><br>
                <span class="stamp-time">16/06/2026</span>
            `;
        }
    } 
    else if (record.status === "Bị từ chối") {
        banner.className = 'banner-notification danger-style';
        bannerTitle.innerText = 'Hồ sơ đã bị huỷ / từ chối';
        bannerDesc.innerText = `Đơn của bạn đã bị từ chối hoặc rút thành công. Vui lòng liên hệ Văn phòng Khoa để được hướng dẫn chi tiết.`;
        
        btnWithdrawGroup.style.display = 'none';
        btnCompletedGroup.style.display = 'none';
        
        pdfHeaderTitle.innerText = 'HỒ SƠ ĐÃ BỊ HỦY';
        
        [stampAdvisor, stampFaculty, stampDepartment].forEach(st => {
            if (st) {
                st.className = 'sig-stamp rejected';
                st.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Bị từ chối / Hủy';
            }
        });
    }
}

// Render dynamic history logs list
function renderHistory(history) {
    const container = document.getElementById('historyTimelineContainer');
    if (!container) return;
    container.innerHTML = '';
    
    if (!history || history.length === 0) {
        container.innerHTML = '<p class="empty-timeline-text">Chưa có lịch sử thao tác nào.</p>';
        return;
    }

    history.forEach(logItem => {
        // Split timestamp and description if in format "time - message"
        const parts = logItem.split(' - ');
        const time = parts[0] || '';
        const msg = parts.slice(1).join(' - ') || logItem;
        
        // Pick appropriate icon based on keywords
        let iconClass = 'fa-circle-chevron-right';
        if (msg.includes('đã tiếp nhận') || msg.includes('tiếp nhận')) iconClass = 'fa-file-import';
        else if (msg.includes('ký và nộp đơn') || msg.includes('nộp đơn')) iconClass = 'fa-file-signature';
        else if (msg.includes('CVHT') || msg.includes('Cố vấn')) iconClass = 'fa-user-tie';
        else if (msg.includes('Trưởng Khoa') || msg.includes('Khoa')) iconClass = 'fa-graduation-cap';
        else if (msg.includes('Phòng Công tác') || msg.includes('P.CTCT-SV-KN')) iconClass = 'fa-building-columns';
        else if (msg.includes('hoàn tất') || msg.includes('hoàn thành')) iconClass = 'fa-clipboard-check';
        else if (msg.includes('rút hồ sơ') || msg.includes('từ chối')) iconClass = 'fa-circle-xmark';

        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-badge">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="timeline-body">
                <span class="timeline-time">${time}</span>
                <p class="timeline-message">${msg}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// Handle "Rút hồ sơ" action
function handleWithdraw(recordId) {
    if (confirm("XÁC NHẬN RÚT HỒ SƠ:\nBạn có chắc chắn muốn rút hồ sơ này? Thao tác này không thể hoàn tác và hồ sơ sẽ bị hủy bỏ.")) {
        const records = getRecords();
        const recordIndex = records.findIndex(r => r.id === recordId);
        
        if (recordIndex !== -1) {
            const now = new Date();
            const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}, ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            
            // Update record
            records[recordIndex].status = "Bị từ chối";
            records[recordIndex].history.unshift(`${timeString} - Sinh viên thực hiện rút hồ sơ yêu cầu. Đơn tự động hủy.`);
            
            saveRecords(records);
            alert("Rút hồ sơ thành công! Trạng thái đơn đã được cập nhật thành Bị từ chối.");
            
            // Reload page
            window.location.reload();
        }
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const recordId = getQueryParam('id');
    if (!recordId) {
        alert("Lỗi: Không tìm thấy Mã hồ sơ yêu cầu.");
        window.location.href = 'search.html';
        return;
    }

    const records = getRecords();
    const record = records.find(r => r.id === recordId);
    
    if (!record) {
        alert(`Lỗi: Không tìm thấy thông tin hồ sơ cho mã "${recordId}".`);
        window.location.href = 'search.html';
        return;
    }

    // Populate data fields
    document.getElementById('breadcrumbDocName').innerText = record.type;
    document.querySelector('.page-title-text').innerText = record.type.toUpperCase();
    
    document.getElementById('formRecordId').innerText = record.id.toUpperCase();
    document.getElementById('formRecordDate').innerText = record.dateDisplay;
    document.getElementById('formRecordReason').innerText = record.reason;
    
    document.getElementById('pdfRecordReason').innerText = record.reason;
    document.querySelector('.pdf-doc-title').innerText = record.type.toUpperCase();

    // Setup visual components
    renderStepper(record.status);
    renderStatusDetails(record);
    renderHistory(record.history);

    // Event binding
    const withdrawBtn = document.getElementById('btnWithdraw');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => handleWithdraw(recordId));
    }

    const downloadBtn = document.getElementById('btnDownloadPDF');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert(`Tải xuống PDF:\nHệ thống đang khởi tạo và tải xuống bản ký số của hồ sơ "${recordId.toUpperCase()}".`);
        });
    }

    const printBtn = document.getElementById('btnPrint');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
