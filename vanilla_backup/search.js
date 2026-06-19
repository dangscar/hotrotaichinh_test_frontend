/* ==========================================================================
   LOGIC FOR SEARCH & LOOKUP PAGE
   ========================================================================== */

// Default mock records to populate database
const DEFAULT_RECORDS = [
    {
        id: "abc345",
        type: "Đơn xin thôi học",
        date: "2026-06-12",
        dateDisplay: "10:30, 12/06/2026",
        status: "Đang xử lý",
        reason: "Do hoàn cảnh gia đình thay đổi, tôi phải di chuyển chỗ ở về quê sinh sống, không có điều kiện tiếp tục theo học tại trường.",
        history: [
            "10:30, 12/06/2026 - Hệ thống đã tiếp nhận hồ sơ trên Cổng dịch vụ công.",
            "10:28, 12/06/2026 - Sinh viên thực hiện ký và nộp đơn."
        ]
    },
    {
        id: "abc505",
        type: "Đơn xin thôi học",
        date: "2026-06-12",
        dateDisplay: "10:30, 12/06/2026",
        status: "Đã phê duyệt",
        reason: "Do hoàn cảnh gia đình thay đổi, tôi phải di chuyển chỗ ở về quê sinh sống.",
        history: [
            "15:30, 16/06/2026 - Hệ thống cấp bản điện tử có chữ ký số. Giao dịch hoàn tất.",
            "15:25, 16/06/2026 - Phòng Công tác Chính trị - Sinh viên (P.CTCT-SV-KN) đã phê duyệt và đóng dấu hồ sơ.",
            "09:15, 15/06/2026 - Trưởng Khoa Công nghệ Thông tin đã xem xét và xác nhận đơn.",
            "14:20, 13/06/2026 - Cố vấn học tập (CVHT) đã phản hồi và thông qua nguyện vọng.",
            "10:30, 12/06/2026 - Hệ thống đã tiếp nhận hồ sơ trên Cổng dịch vụ công.",
            "10:28, 12/06/2026 - Sinh viên thực hiện ký và nộp đơn."
        ]
    },
    {
        id: "blu892",
        type: "Đơn xin bảo lưu",
        date: "2026-05-15",
        dateDisplay: "09:00, 15/05/2026",
        status: "Đã phê duyệt",
        reason: "Bảo lưu kết quả học tập để đi điều trị sức khỏe trong vòng 1 năm học.",
        history: [
            "11:20, 18/05/2026 - Đã duyệt cấp quyết định bảo lưu kết quả học tập.",
            "09:00, 15/05/2026 - Nộp đơn thành công trên hệ thống Một cửa."
        ]
    },
    {
        id: "hl2310",
        type: "Đơn xin học lại",
        date: "2026-05-20",
        dateDisplay: "08:00, 20/05/2026",
        status: "Chờ xử lý",
        reason: "Hết thời hạn bảo lưu kết quả học tập, xin tiếp tục tham gia học tập từ học kỳ 1 năm học 2026-2027.",
        history: [
            "08:00, 20/05/2026 - Đang chờ bộ phận chức năng khoa xem xét học lực sinh viên."
        ]
    },
    {
        id: "cc5510",
        type: "Cấp lại thẻ sinh viên",
        date: "2026-06-10",
        dateDisplay: "14:30, 10/06/2026",
        status: "Bị từ chối",
        reason: "Bị mất thẻ sinh viên cũ do đánh rơi ví đựng giấy tờ.",
        history: [
            "16:00, 11/06/2026 - Bị từ chối phê duyệt do hồ sơ thiếu minh chứng xác nhận.",
            "14:30, 10/06/2026 - Hệ thống tiếp nhận đơn cấp lại thẻ sinh viên."
        ]
    }
];

// Load records database from localStorage or set default
function getRecords() {
    let records = localStorage.getItem('studentRecords');
    if (!records) {
        localStorage.setItem('studentRecords', JSON.stringify(DEFAULT_RECORDS));
        return DEFAULT_RECORDS;
    }
    return JSON.parse(records);
}

// Map status to CSS classes and styles
function getStatusClass(status) {
    switch (status) {
        case "Chờ xử lý": return "status-waiting";
        case "Đang xử lý": return "status-processing";
        case "Đã phê duyệt": return "status-approved";
        case "Bị từ chối": return "status-rejected";
        default: return "";
    }
}

// Render records in the table body
function renderRecords(records) {
    const tableBody = document.getElementById('recordsTableBody');
    const noResults = document.getElementById('noResultsMessage');
    
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    if (records.length === 0) {
        noResults.style.display = 'flex';
        return;
    }
    noResults.style.display = 'none';

    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row-clickable';
        row.innerHTML = `
            <td style="text-align: center; font-weight: 600;">${index + 1}</td>
            <td style="font-weight: 700; color: var(--color-primary-dark);">${record.id.toUpperCase()}</td>
            <td style="font-weight: 500;">${record.type}</td>
            <td style="color: var(--color-gray); font-size: 0.9rem;">${record.dateDisplay}</td>
            <td style="text-align: center;">
                <span class="status-badge-pill ${getStatusClass(record.status)}">
                    ${record.status}
                </span>
            </td>
            <td style="text-align: center;">
                <a href="detail.html?id=${record.id}" class="btn-action-view" title="Xem chi tiết">
                    <i class="fa-solid fa-eye"></i> Chi tiết
                </a>
            </td>
        `;
        
        // Clicking row redirects to detail page
        row.addEventListener('click', (e) => {
            // Avoid conflict if the user clicks directly on the details button
            if (e.target.tagName !== 'A' && e.target.parentElement.tagName !== 'A') {
                window.location.href = `detail.html?id=${record.id}`;
            }
        });
        
        tableBody.appendChild(row);
    });
}

// Perform filtering
function applyFilters(e) {
    if (e) e.preventDefault();
    
    const recordId = document.getElementById('filterRecordId').value.trim().toLowerCase();
    const docType = document.getElementById('filterDocType').value;
    const status = document.getElementById('filterStatus').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;

    const allRecords = getRecords();
    
    const filtered = allRecords.filter(record => {
        // ID filter
        if (recordId && !record.id.toLowerCase().includes(recordId)) return false;
        
        // Doc type filter
        if (docType !== 'ALL' && record.type !== docType) return false;
        
        // Status filter
        if (status !== 'ALL' && record.status !== status) return false;
        
        // Date range filter
        if (record.date) {
            const recordDate = new Date(record.date);
            if (dateFrom && recordDate < new Date(dateFrom)) return false;
            if (dateTo && recordDate > new Date(dateTo)) return false;
        }
        
        return true;
    });

    renderRecords(filtered);
}

// Reset filter form inputs
function resetFilters() {
    document.getElementById('searchFilterForm').reset();
    
    // Set default dates
    document.getElementById('filterDateFrom').value = '2026-01-01';
    document.getElementById('filterDateTo').value = '2026-12-31';
    
    // Rerender all records
    renderRecords(getRecords());
}

// Initialize page events
document.addEventListener('DOMContentLoaded', () => {
    const allRecords = getRecords();
    renderRecords(allRecords);

    const filterForm = document.getElementById('searchFilterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', applyFilters);
    }

    const resetBtn = document.getElementById('btnResetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
});
