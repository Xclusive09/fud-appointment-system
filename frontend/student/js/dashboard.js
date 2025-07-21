
// Student Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize demo student data if needed
    if (window.mockDataAPI) {
        window.mockDataAPI.initializeDemoStudent();
    }

    // Initialize the dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize mobile menu
    initializeMobileMenu();

    // Load student appointments
    loadStudentAppointments();

    // Initialize book appointment button
    initializeBookAppointmentButton();
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

function initializeBookAppointmentButton() {
    const bookBtn = document.getElementById('bookAppointmentBtn');
    if (bookBtn) {
        bookBtn.addEventListener('click', function(e) {
            // Check if profile is filled
            const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');
            if (
                !profile.fullname ||
                !profile.dob ||
                !profile.faculty ||
                !profile.dept ||
                !profile.registration_number ||
                !profile.phone ||
                !profile.email
            ) {
                e.preventDefault();
                sessionStorage.setItem('redirectToAppointment', '1');
                window.location.href = 'profile.html';
                return false;
            }
        });
    }
}

function loadStudentAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;

    // Get student email from profile
    const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}');
    const studentEmail = profile.email || getUserEmail();

    if (!studentEmail) {
        showNoAppointments('Please complete your profile first.');
        return;
    }

    // Get student appointments from mock data
    const studentAppointments = window.mockDataAPI ?
        window.mockDataAPI.getStudentAppointments(studentEmail) :
        [];

    // Sort appointments by date and time (newest first)
    studentAppointments.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        if (dateComparison === 0) {
            return b.time.localeCompare(a.time);
        }
        return dateComparison;
    });

    // Clear previous content
    appointmentsList.innerHTML = '';

    // Add section header
    const historyHeader = document.createElement('h2');
    historyHeader.className = "text-xl font-semibold mb-4 text-blue-700";
    historyHeader.textContent = "My Appointments History";
    appointmentsList.appendChild(historyHeader);

    if (studentAppointments.length > 0) {
        // Group appointments by status
        const upcomingAppointments = studentAppointments.filter(apt =>
            apt.status === 'Confirmed' && new Date(apt.date) >= new Date().setHours(0,0,0,0)
        );
        const pastAppointments = studentAppointments.filter(apt =>
            apt.status === 'Completed' || (apt.status === 'Confirmed' && new Date(apt.date) < new Date().setHours(0,0,0,0))
        );

        // Show upcoming appointments first
        if (upcomingAppointments.length > 0) {
            const upcomingSection = document.createElement('div');
            upcomingSection.className = "mb-6";
            upcomingSection.innerHTML = `
        <h3 class="text-lg font-medium text-green-700 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"/>
          </svg>
          Upcoming Appointments (${upcomingAppointments.length})
        </h3>
      `;
            appointmentsList.appendChild(upcomingSection);

            upcomingAppointments.forEach(appointment => {
                const appointmentCard = createAppointmentCard(appointment);
                appointmentsList.appendChild(appointmentCard);
            });
        }

        // Show past appointments
        if (pastAppointments.length > 0) {
            const pastSection = document.createElement('div');
            pastSection.className = "mb-6";
            pastSection.innerHTML = `
        <h3 class="text-lg font-medium text-gray-600 mb-3 flex items-center gap-2 mt-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
          </svg>
          Past Appointments (${pastAppointments.length})
        </h3>
      `;
            appointmentsList.appendChild(pastSection);

            pastAppointments.forEach(appointment => {
                const appointmentCard = createAppointmentCard(appointment);
                appointmentsList.appendChild(appointmentCard);
            });
        }

        // Add appointment summary statistics
        const statsCard = createStatsCard(studentAppointments);
        appointmentsList.appendChild(statsCard);

    } else {
        showNoAppointments('No appointments found. Book your first appointment!');
    }
}

function showNoAppointments(message) {
    const appointmentsList = document.getElementById('appointmentsList');
    const noAppointments = document.createElement('div');
    noAppointments.className = "text-center py-12 text-gray-500";
    noAppointments.innerHTML = `
    <div class="bg-white/90 rounded-xl shadow-lg border border-blue-100 p-8">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="text-lg mb-4">${message}</p>
      <a href="appointment.html" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        Book Your First Appointment
      </a>
    </div>
  `;
    appointmentsList.appendChild(noAppointments);
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = "bg-white/90 p-6 shadow-lg rounded-xl border border-blue-100 transition-all hover:shadow-xl";

    const statusClass = getStatusClass(appointment.status);
    const isToday = appointment.date === new Date().toISOString().split('T')[0];
    const isPast = new Date(appointment.date) < new Date().setHours(0,0,0,0);
    const isUpcoming = new Date(appointment.date) > new Date().setHours(0,0,0,0);

    card.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="inline-block bg-blue-100 text-blue-700 rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </span>
      <div class="flex-1">
        <p class="font-semibold text-lg text-blue-800">${appointment.reason}</p>
        <p class="text-gray-500 text-sm">Appointment #${appointment.id}</p>
      </div>
      <div class="flex gap-2">
        ${isToday ? '<span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">TODAY</span>' : ''}
        ${isUpcoming ? '<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">UPCOMING</span>' : ''}
        ${isPast && appointment.status === 'Completed' ? '<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">PAST</span>' : ''}
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div class="flex items-center gap-2 text-gray-700">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="${isToday ? 'font-semibold text-green-700' : isPast ? 'text-gray-500' : 'text-blue-600'}">${formatDate(appointment.date)}</span>
      </div>
      <div class="flex items-center gap-2 text-gray-700">
        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"/>
        </svg>
        <span class="${isToday ? 'font-semibold text-green-700' : ''}">${formatTime(appointment.time)}</span>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="flex items-center gap-2 text-gray-700 mb-2">
        <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="text-sm font-medium">Symptoms/Reason:</span>
      </div>
      <p class="text-sm text-gray-600 italic ml-6">${appointment.symptoms || 'No specific symptoms mentioned'}</p>
    </div>
    
    <div class="flex items-center justify-between">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}">
        ${appointment.status}
      </span>
      <div class="text-right">
        <p class="text-xs text-gray-500">Type: ${appointment.appointmentType}</p>
      </div>
    </div>
  `;

    return card;
}

function createStatsCard(appointments) {
    const total = appointments.length;
    const completed = appointments.filter(apt => apt.status === 'Completed').length;
    const upcoming = appointments.filter(apt =>
        apt.status === 'Confirmed' && new Date(apt.date) >= new Date().setHours(0,0,0,0)
    ).length;

    const statsCard = document.createElement('div');
    statsCard.className = "bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white mt-8";

    statsCard.innerHTML = `
    <h3 class="text-lg font-semibold mb-4">Your Appointment Summary</h3>
    <div class="grid grid-cols-3 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold">${total}</div>
        <div class="text-sm opacity-90">Total</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">${upcoming}</div>
        <div class="text-sm opacity-90">Upcoming</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">${completed}</div>
        <div class="text-sm opacity-90">Completed</div>
      </div>
    </div>
  `;

    return statsCard;
}

function getStatusClass(status) {
    switch (status) {
        case 'Confirmed':
            return 'bg-green-100 text-green-700';
        case 'Completed':
            return 'bg-blue-100 text-blue-700';
        case 'Cancelled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-yellow-100 text-yellow-700';
    }
}