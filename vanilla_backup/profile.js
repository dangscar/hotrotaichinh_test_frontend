/* ==========================================================================
   LOGIC FOR PROFILE MANAGEMENT PAGE
   ========================================================================== */

const DEFAULT_PROFILE = {
    phone: "0982394224",
    cccd: "079204001948",
    bankAcc: "1024508930",
    address: "Khu vực 2, Đường Nguyễn Văn Cừ kéo dài, An Khánh, Ninh Kiều, Cần Thơ",
    hokhau: "Ấp Thới Thuận, Xã Thới Đông, Huyện Cờ Đỏ, Thành phố Cần Thơ"
};

// Retrieve student profile from localStorage
function getStudentProfile() {
    const profile = localStorage.getItem('studentProfile');
    if (!profile) {
        localStorage.setItem('studentProfile', JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
    }
    return JSON.parse(profile);
}

// Save student profile to localStorage
function saveStudentProfile(profile) {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
}

// Populate form fields with saved profile values
function loadProfileData() {
    const profile = getStudentProfile();
    
    const phoneInput = document.getElementById('profilePhone');
    const cccdInput = document.getElementById('profileCccd');
    const bankAccInput = document.getElementById('profileBankAcc');
    const addressInput = document.getElementById('profileAddress');
    const hokhauInput = document.getElementById('profileHokhau');

    if (phoneInput) phoneInput.value = profile.phone;
    if (cccdInput) cccdInput.value = profile.cccd;
    if (bankAccInput) bankAccInput.value = profile.bankAcc;
    if (addressInput) addressInput.value = profile.address;
    if (hokhauInput) hokhauInput.value = profile.hokhau;
}

// Handle form submission
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const updatedProfile = {
        phone: document.getElementById('profilePhone').value.trim(),
        cccd: document.getElementById('profileCccd').value.trim(),
        bankAcc: document.getElementById('profileBankAcc').value.trim(),
        address: document.getElementById('profileAddress').value.trim(),
        hokhau: document.getElementById('profileHokhau').value.trim()
    };

    saveStudentProfile(updatedProfile);
    
    // Show success banner
    const successBanner = document.getElementById('profileSuccessBanner');
    if (successBanner) {
        successBanner.style.display = 'flex';
        // Scroll banner to view smoothly
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // Hide success banner after 6 seconds
        setTimeout(() => {
            successBanner.style.display = 'none';
        }, 6000);
    }
}

// Initialize page events
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();

    const form = document.getElementById('profileUpdateForm');
    if (form) {
        form.addEventListener('submit', handleProfileUpdate);
    }

    const cancelBtn = document.getElementById('btnCancelProfile');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("HỦY BỎ THAY ĐỔI:\nBạn có muốn hủy các thay đổi chưa lưu và khôi phục dữ liệu gốc?")) {
                loadProfileData();
                const successBanner = document.getElementById('profileSuccessBanner');
                if (successBanner) successBanner.style.display = 'none';
            }
        });
    }

    const avatarBtn = document.querySelector('.btn-upload-avatar');
    if (avatarBtn) {
        avatarBtn.addEventListener('click', () => {
            alert("Đổi ảnh đại diện:\nTính năng tải lên hình ảnh từ máy tính đang được phát triển.");
        });
    }
});
