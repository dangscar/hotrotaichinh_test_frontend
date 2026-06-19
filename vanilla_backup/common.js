/* ==========================================================================
   SHARED HELPERS & SESSION MANAGEMENT FOR DVC_CNTT
   ========================================================================== */

// Helper to load HTML components dynamically
async function loadComponent(placeholderId, filePath) {
    try {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;
        
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load component: ${filePath}`);
        const html = await response.text();
        placeholder.innerHTML = html;
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

// Check if user is logged in
function checkSession() {
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    const currentPath = window.location.pathname;
    
    // Public pages that don't force login redirection
    const isPublicPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('login.html');
    
    if (!studentId && !isPublicPage) {
        alert("Yêu cầu đăng nhập:\nVui lòng đăng nhập để truy cập trang này.");
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Injects the vertical navigation sidebar dynamically
function injectSidebar() {
    const currentPath = window.location.pathname;
    // Don't show sidebar on index or login pages
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('login.html')) {
        return;
    }

    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'nav-sidebar';
    sidebarContainer.id = 'dynamic-sidebar';
    
    const isSearchActive = currentPath.includes('search.html') ? 'active' : '';
    const isProfileActive = currentPath.includes('profile.html') ? 'active' : '';
    const isDetailActive = currentPath.includes('detail.html') ? 'active' : '';

    sidebarContainer.innerHTML = `
        <div class="sidebar-logo">
            <img src="assets/images/logo-truong-removebg-preview.png" alt="Logo">
        </div>
        <div class="sidebar-menu">
            <a href="index.html" class="sidebar-item" title="Trang chủ">
                <i class="fa-solid fa-house"></i>
            </a>
            <a href="search.html" class="sidebar-item ${isSearchActive}" title="Tra cứu hồ sơ">
                <i class="fa-solid fa-magnifying-glass"></i>
            </a>
            <a href="profile.html" class="sidebar-item ${isProfileActive}" title="Thông tin cá nhân">
                <i class="fa-solid fa-user-graduate"></i>
            </a>
            <a href="detail.html" class="sidebar-item ${isDetailActive}" style="display: none;" title="Chi tiết đơn">
                <i class="fa-solid fa-file-invoice"></i>
            </a>
        </div>
        <div class="sidebar-footer">
            <a href="#" id="sidebarLogout" class="sidebar-item" title="Đăng xuất">
                <i class="fa-solid fa-right-from-bracket"></i>
            </a>
        </div>
    `;

    document.body.insertBefore(sidebarContainer, document.body.firstChild);
    document.body.classList.add('has-sidebar');

    // Handle logout link inside sidebar
    const logoutBtn = document.getElementById('sidebarLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đăng xuất khỏi hệ thống?')) {
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                window.location.href = 'index.html';
            }
        });
    }
}

// Adjust header interface when logged in
async function setupDynamicHeader() {
    const studentId = localStorage.getItem('studentId');
    const btnGroup = document.getElementById('btn_group_6_427');
    if (studentId && btnGroup) {
        btnGroup.innerHTML = `
            <div class="user-profile">
                <div class="profile-info-col">
                    <span class="user-name">Nguyễn Văn A</span>
                    <span class="user-role">Sinh viên - K10</span>
                </div>
                <div class="profile-avatar-col">
                    <div class="avatar-circle">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                </div>
                <div class="profile-dropdown-menu">
                    <a href="profile.html"><i class="fa-solid fa-user-gear"></i> Cá nhân</a>
                    <a href="search.html"><i class="fa-solid fa-folder-open"></i> Hồ sơ của tôi</a>
                    <hr>
                    <a href="#" id="headerLogoutBtn" class="logout-link"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
                </div>
            </div>
        `;

        // Profile Avatar Dropdown Click behavior
        const avatarCol = btnGroup.querySelector('.profile-avatar-col');
        const dropdownMenu = btnGroup.querySelector('.profile-dropdown-menu');
        
        if (avatarCol && dropdownMenu) {
            avatarCol.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });
        }

        const logoutBtn = document.getElementById('headerLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('studentId');
                localStorage.removeItem('studentEmail');
                alert('Đăng xuất thành công.');
                window.location.href = 'index.html';
            });
        }
    }
}

// Run on page initialization
document.addEventListener('DOMContentLoaded', async () => {
    if (checkSession()) {
        injectSidebar();
        
        // Dynamically load common header and footer placeholders
        await Promise.all([
            loadComponent('header-placeholder', 'components/header.html'),
            loadComponent('footer-placeholder', 'components/footer.html')
        ]);
        
        await setupDynamicHeader();
    }
});
