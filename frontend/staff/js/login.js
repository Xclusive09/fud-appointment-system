// Staff Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const alertContainer = document.getElementById('alertContainer');
    const loginBtn = document.getElementById('loginBtn');

    // Clear any existing data on login page load
    clearUserData();

    // Check if already logged in
    if (isAuthenticated() && getUserRole() === 'staff') {
        window.location.href = 'dashboard.html';
        return;
    }

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle icon
        const icon = this.querySelector('svg');
        if (type === 'password') {
            icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      `;
        } else {
            icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
      `;
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate form
        if (!validateForm(email, password)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Simulate API call
        setTimeout(() => {
            authenticateStaff(email, password, rememberMe);
        }, 1000);
    });

    function validateForm(email, password) {
        clearAlert();

        if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return false;
        }

        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return false;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'error');
            return false;
        }

        return true;
    }

    function authenticateStaff(email, password, rememberMe) {
        try {
            // Mock authentication - simplified to just one staff role
            const mockStaff = [
                { email: 'admin@clinic.com', password: 'admin123', name: 'Dr. Smith' },
                { email: 'staff@clinic.com', password: 'staff123', name: 'Nurse Johnson' },
                { email: 'doctor@clinic.com', password: 'doctor123', name: 'Dr. Brown' },
                { email: 'nurse@clinic.com', password: 'nurse123', name: 'Nurse Williams' },
                { email: 'receptionist@clinic.com', password: 'recept123', name: 'Jane Reception' },
                { email: 'class@clinic.com', password: 'class123', name: 'Jane peace' }
            ];

            console.log('Attempting staff login for:', email); // Debug log
            const staff = mockStaff.find(s => s.email.toLowerCase() === email.toLowerCase() && s.password === password);

        if (staff) {
            // Success
            const token = generateAuthToken();

            // Store authentication data (no specific role, just 'staff')
            localStorage.setItem('userToken', token);
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('userName', staff.name);
            localStorage.setItem('userEmail', staff.email);

            if (rememberMe) {
                localStorage.setItem('rememberLogin', 'true');
            }

            showAlert('Login successful! Redirecting...', 'success');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Failed
            showAlert('Invalid email or password', 'error');
            setLoadingState(false);
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showAlert('An error occurred during login', 'error');
        setLoadingState(false);
    }
}

    function generateAuthToken() {
        return 'staff_' + Math.random().toString(36).substr(2, 9);
    }

    function setLoadingState(loading) {
        if (loading) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Signing in...
      `;
        } else {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Sign In';
        }
    }

    function showAlert(message, type) {
        const alertClass = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
        alertContainer.className = `border px-4 py-3 rounded relative mb-4 ${alertClass}`;
        alertContainer.innerHTML = message;
        alertContainer.classList.remove('hidden');
    }

    function clearAlert() {
        alertContainer.classList.add('hidden');
    }
});