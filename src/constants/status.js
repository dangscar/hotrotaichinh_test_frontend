/**
 * Enum đại diện cho các trạng thái hồ sơ của hệ thống (lấy từ Backend / Database)
 */
export const FormStatus = Object.freeze({
    CHO_DUYET: 'cho_duyet',    // Chờ xử lý / Tiếp nhận
    DA_DUYET: 'da_duyet',      // Đã phê duyệt / Hoàn tất
    TU_CHOI: 'tu_choi',        // Bị từ chối / Hủy
    DANG_XU_LY: 'dang_xu_ly'   // Đang xử lý
});

/**
 * Bản đồ ánh xạ từ trạng thái Backend sang tên hiển thị Tiếng Việt tương ứng
 */
export const FormStatusDisplay = Object.freeze({
    [FormStatus.CHO_DUYET]: 'Chờ xử lý',
    [FormStatus.DA_DUYET]: 'Đã phê duyệt',
    [FormStatus.TU_CHOI]: 'Bị từ chối',
    [FormStatus.DANG_XU_LY]: 'Đang xử lý'
});

/**
 * Bản đồ ánh xạ CSS Class cho trang Tìm kiếm / Tra cứu (Search)
 * (Nhận vào tên hiển thị tiếng Việt, trả về tên class tương ứng)
 */
export const SearchStatusClass = Object.freeze({
    'Chờ xử lý': 'status-waiting',
    'Đang xử lý': 'status-processing',
    'Đã phê duyệt': 'status-approved',
    'Bị từ chối': 'status-rejected'
});

/**
 * Bản đồ ánh xạ CSS Class cho trang Chi tiết (Detail)
 * (Nhận vào mã trạng thái Backend, trả về tên class tương ứng)
 */
export const DetailStatusClass = Object.freeze({
    [FormStatus.CHO_DUYET]: 'status-processing',
    [FormStatus.DA_DUYET]: 'status-approved',
    [FormStatus.TU_CHOI]: 'status-rejected',
    [FormStatus.DANG_XU_LY]: 'status-waiting'
});
