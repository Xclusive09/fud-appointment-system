// Student Profile JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize mobile menu
    initializeMobileMenu();

    // Load profile data
    loadProfileData();

    // Handle form submission
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);

    // Handle cancel button
    document.getElementById('cancelBtn').addEventListener('click', loadProfileData);
});

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');

    if (mobileMenuBtn && mobileMenu && closeMobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });

        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

function loadProfileData() {
    const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');

    // Pre-fill email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        profile.email = userEmail;
    }

    // Fill form fields
    const formElements = document.getElementById('profileForm').elements;
    for (let element of formElements) {
        if (element.name && profile[element.name]) {
            element.value = profile[element.name];
        }
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const profileData = {};

    // Extract form data
    for (let [key, value] of formData.entries()) {
        profileData[key] = value.trim();
    }

    // Validate required fields
    const requiredFields = ['fullname', 'email', 'phone', 'dob', 'faculty', 'dept', 'registration_number'];
    const missingFields = requiredFields.filter(field => !profileData[field]);

    if (missingFields.length > 0) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    // Validate email format
    if (!isValidEmail(profileData.email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Validate phone number
    if (!isValidPhone(profileData.phone)) {
        showAlert('Please enter a valid phone number', 'error');
        return;
    }

    // Save profile
    saveProfile(profileData);
}

function saveProfile(profileData) {
    const saveBtn = document.getElementById('saveBtn');

    // Show loading state
    saveBtn.disabled = true;
    saveBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Saving...
  `;

    // Simulate API call
    setTimeout(() => {
        try {
            // Save to localStorage
            localStorage.setItem('studentProfile', JSON.stringify(profileData));

            // Update user email if changed
            localStorage.setItem('userEmail', profileData.email);

            showAlert('Profile saved successfully!', 'success');

            // Check if redirected from appointment booking
            if (sessionStorage.getItem('redirectToAppointment')) {
                sessionStorage.removeItem('redirectToAppointment');
                setTimeout(() => {
                    window.location.href = 'appointments.html';
                }, 2000);
            }

        } catch (error) {
            showAlert('Error saving profile. Please try again.', 'error');
        } finally {
            // Reset button state
            saveBtn.disabled = false;
            saveBtn.innerHTML = 'Save Profile';
        }
    }, 1500);
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alertClass = type === 'error'
        ? 'bg-red-100 border-red-400 text-red-700'
        : 'bg-green-100 border-green-400 text-green-700';

    alertContainer.className = `border px-4 py-3 rounded relative ${alertClass}`;
    alertContainer.innerHTML = `
    <span class="block sm:inline">${message}</span>
  `;
    alertContainer.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertContainer.classList.add('hidden');
    }, 5000);
}