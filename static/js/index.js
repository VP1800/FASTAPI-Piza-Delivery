document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const spinner = document.querySelector('.spinner-border');
    const forgotPassword = document.getElementById('forgotPassword');

    // Check for logout message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'success') {
        successAlert.innerHTML = '<i class="fas fa-check-circle me-2"></i>Logged out successfully!';
        successAlert.style.display = 'block';
        // Hide the message after 3 seconds
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    }

     // Clear URL parameters
     window.history.replaceState({}, document.title, window.location.pathname);


    // Check for remembered credentials
    checkRememberedUser();

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        passwordToggle.innerHTML = type === 'password' ? 
            '<i class="far fa-eye"></i>' : 
            '<i class="far fa-eye-slash"></i>';
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset alerts
        errorAlert.style.display = 'none';
        successAlert.style.display = 'none';

        // Form validation
        if (!loginForm.checkValidity()) {
            e.stopPropagation();
            loginForm.classList.add('was-validated');
            return;
        }

        // Show loading spinner
        spinner.style.display = 'inline-block';
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        // Get form data
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Handle remember me
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Simulate API call
        setTimeout(() => {
            // For demo purposes, check if username is "admin" and password is "password"
            if (username === 'admin' && password === 'password') {
                handleSuccessfulLogin();
            } else {
                handleFailedLogin();
            }
        }, 1500);
    });

    // Forgot password handler
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });

    // Helper Functions
    function handleSuccessfulLogin() {
        successAlert.style.display = 'block';
        // Store login status
        sessionStorage.setItem('isLoggedIn', 'true');
        // Redirect to dashboard after successful login
        setTimeout(() => {
            window.location.href = 'admin_dashboard.html';
        }, 1500);
    }

    function handleFailedLogin() {
        errorAlert.style.display = 'block';
        spinner.style.display = 'none';
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
    }

    function handleForgotPassword() {
        // Add your forgot password logic here
        alert('Forgot password functionality will be implemented here');
    }

    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            document.getElementById('username').value = rememberedUser;
            document.getElementById('rememberMe').checked = true;
        }
    }

    // Prevent access if already logged in
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'admin_dashboard.html';
    }
});
