/* ==========================================================================
   INTERACTIVE LOGIC FOR DVC_CNTT PORTAL
   ========================================================================== */

// Helper function to load HTML components dynamically
async function loadComponent(placeholderId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load component: ${filePath}`);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    // 0. Load Header and Footer components dynamically
    await Promise.all([
        loadComponent('header-placeholder', 'components/header.html'),
        loadComponent('footer-placeholder', 'components/footer.html')
    ]);

    // 1. Header scroll effect
    const header = document.getElementById('header_6_408');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Check Login Session & Render Header Profile
    const btnGroup = document.getElementById('btn_group_6_427');
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');

    if (studentId && btnGroup) {
        // Render logged-in user profile badge
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
                window.location.reload();
            });
        }
    }

    // 3. Dynamic navigation active link tracking
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Fallback for header scroll at the top of page
        if (window.scrollY < 100) {
            currentSection = 'hero';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentSection)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Detail card click redirects for administrative procedures
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const cardTitle = e.currentTarget.closest('.card').querySelector('.card-title').innerText;
            
            if (studentId) {
                alert(`Bạn đang nộp hồ sơ cho thủ tục "${cardTitle}". Hệ thống sẽ mở biểu mẫu điền thông tin.`);
            } else {
                alert(`Yêu cầu đăng nhập:\nBạn đang muốn nộp hồ sơ cho thủ tục "${cardTitle}". Vui lòng đăng nhập bằng tài khoản Email sinh viên để tiếp tục.`);
                window.location.href = 'login.html';
            }
        });
    });
});
