
// Shared utility functions

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('userToken') !== null;
}

// Get user role from localStorage
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Get user name from localStorage
function getUserName() {
    return localStorage.getItem('userName') || 'User';
}

// Get user email from localStorage
function getUserEmail() {
    return localStorage.getItem('userEmail') || '';
}

// Clear user-specific session data from localStorage
function clearUserData() {
    // Clear authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberLogin');
}

// Logout user by clearing session data and redirecting
function logoutUser() {
  clearUserData();

  // Check if running on a local server (like Live Server)
  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

  if (isLocal) {
    window.location.href = '../frontend/staff/pages/login.html';
  } else {
    window.location.href = '/'; // For deployed environments like Vercel
  }
}

// Initialize logout functionality for any page
function initializeLogout() {
    // This listener now ONLY targets elements with data-action="logout".
    document.body.addEventListener('click', function(e) {
        // Use .closest() to handle clicks on child elements inside the button
        const logoutButton = e.target.closest('[data-action="logout"]');
        
        if (logoutButton) {
            e.preventDefault();

            // Show confirmation dialog
            if (confirm('Are you sure you want to log out?')) {
                logoutUser();
            }
        }
    });
}

// Show loading spinner
function showLoading(element) {
    element.innerHTML = `
    <div class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      <span class="ml-2 text-gray-600">Loading...</span>
    </div>
  `;
}

// Show error message
function showError(element, message) {
    element.innerHTML = `
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> ${message}</span>
    </div>
  `;
}

// Show success message
function showSuccess(element, message) {
    element.innerHTML = `
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Success!</strong>
      <span class="block sm:inline"> ${message}</span>
    </div>
  `;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number format
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLogout();
});