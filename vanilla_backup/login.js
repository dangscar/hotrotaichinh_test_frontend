/* ==========================================================================
   INTERACTIVE LOGIC FOR LOGIN PAGE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('form_10_539');
    const emailInput = document.getElementById('emailInput');
    const passInput = document.getElementById('passInput');
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    const togglePassword = document.getElementById('togglePassword');

    // 1. Show/Hide Password Visibility Toggle
    if (togglePassword && passInput) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passInput.getAttribute('type') === 'password';
            
            // Toggle type
            passInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Toggle icon classes
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // 2. Email Validation & Form Submit Simulation
    if (loginForm && emailInput && emailErrorMsg) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailValue = emailInput.value.trim().toLowerCase();
            const emailDomain = '@student.ctuet.edu.vn';
            
            // Validate student email domain
            if (!emailValue.endsWith(emailDomain)) {
                emailInput.classList.add('error');
                emailErrorMsg.innerText = 'Email đăng nhập bắt buộc phải có định dạng mssv@student.ctuet.edu.vn';
                emailInput.focus();
                return;
            }
            
            // Success flow
            emailInput.classList.remove('error');
            emailErrorMsg.innerText = '';
            
            // Extract MSSV from email for personalized welcome
            const mssv = emailValue.split('@')[0].toUpperCase();
            
            alert(`Đăng nhập thành công!\nChào mừng sinh viên ${mssv} truy cập Cổng Dịch Vụ Công sinh viên.`);
            
            // Save log status in localStorage so index.html can know student is logged in
            localStorage.setItem('studentId', mssv);
            localStorage.setItem('studentEmail', emailValue);
            
            // Redirect back to home
            window.location.href = 'index.html';
        });

        // Clear error styling on input
        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('error');
            emailErrorMsg.innerText = '';
        });
    }
});
