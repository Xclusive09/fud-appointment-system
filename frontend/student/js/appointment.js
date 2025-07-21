// Student Appointment Booking JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the appointment form
    initializeAppointmentForm();
});

function initializeAppointmentForm() {
    // Initialize mobile menu
    initializeMobileMenu();

    // Set minimum date to today
    setMinimumDate();

    // Initialize form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    // Initialize date change handler
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', updateAvailableSlots);
    }
}

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

function setMinimumDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function updateAvailableSlots() {
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');

    if (!dateInput.value) {
        timeSelect.innerHTML = '<option value="">Select time first</option>';
        return;
    }

    const selectedDate = new Date(dateInput.value);
    const dayOfWeek = selectedDate.getDay();

    // Check if it's a weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        timeSelect.innerHTML = '<option value="">No slots available on weekends</option>';
        return;
    }

    // Get existing appointments for the selected date
    const existingAppointments = window.mockDataAPI ?
        window.mockDataAPI.getAppointmentsByDate(dateInput.value) :
        [];

    const bookedTimes = existingAppointments
        .filter(apt => apt.status !== 'Cancelled')
        .map(apt => apt.time);

    // Generate available time slots
    const timeSlots = generateTimeSlots(bookedTimes);

    // Update time select options
    timeSelect.innerHTML = timeSlots.length > 0 ?
        '<option value="">Select a time</option>' +
        timeSlots.map(slot => `<option value="${slot}">${formatTime(slot)}</option>`).join('') :
        '<option value="">No available slots</option>';
}

function generateTimeSlots(bookedTimes) {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            if (!bookedTimes.includes(timeString)) {
                slots.push(timeString);
            }
        }
    }

    return slots;
}

function checkProfileComplete() {
    const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');

    const requiredFields = ['fullname', 'dob', 'faculty', 'dept', 'registration_number', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !profile[field]);

    if (missingFields.length > 0) {
        showAlert('Please complete your profile before booking an appointment.', 'error');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
        return false;
    }

    return true;
}

function handleAppointmentSubmit(e) {
    e.preventDefault();

    if (!checkProfileComplete()) {
        return;
    }

    const formData = new FormData(e.target);
    const appointmentData = {};

    // Extract form data
    for (let [key, value] of formData.entries()) {
        appointmentData[key] = value.trim();
    }

    // Validate required fields
    const requiredFields = ['appointmentDate', 'appointmentTime', 'appointmentType', 'symptoms'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);

    if (missingFields.length > 0) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    // Validate appointment date
    const selectedDate = new Date(appointmentData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
        showAlert('Please select a future date for your appointment', 'error');
        return;
    }

    // Check if it's a weekend
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        showAlert('Appointments are not available on weekends. Please select a weekday.', 'error');
        return;
    }

    // Book appointment
    bookAppointment(appointmentData);
}

function bookAppointment(appointmentData) {
    // Get student profile for complete appointment data
    const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');

    const completeAppointmentData = {
        studentName: profile.fullname,
        email: profile.email,
        phone: profile.phone,
        date: appointmentData.appointmentDate,
        time: appointmentData.appointmentTime,
        reason: appointmentData.appointmentType,
        symptoms: appointmentData.symptoms,
        appointmentType: appointmentData.appointmentType
    };

    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        try {
            // Add appointment using mock API
            const newAppointment = window.mockDataAPI ?
                window.mockDataAPI.addAppointment(completeAppointmentData) :
                { ...completeAppointmentData, id: Date.now(), status: 'Confirmed' };

            // Show success message
            showAlert('Appointment booked successfully! Your appointment is automatically confirmed.', 'success');

            // Reset form
            document.getElementById('appointmentForm').reset();

            // Update available slots
            updateAvailableSlots();

            // Redirect to dashboard after a delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            showAlert('Failed to book appointment. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');

    const alertClass = type === 'success' ?
        'bg-green-100 border-green-400 text-green-700' :
        'bg-red-100 border-red-400 text-red-700';

    alertContainer.innerHTML = `
    <div class="${alertClass} border px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">${message}</span>
    </div>
  `;

    alertContainer.classList.remove('hidden');

    // Auto hide after 5 seconds
    setTimeout(() => {
        alertContainer.classList.add('hidden');
    }, 5000);
}