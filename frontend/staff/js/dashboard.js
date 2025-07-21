
// Staff Dashboard JavaScript

// Global variables
let currentPage = 1;
const itemsPerPage = 10;
let currentAppointments = [];
let selectedAppointmentId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'staff') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize mobile menu
    initializeMobileMenu();

    // Set current date
    setCurrentDate();

    // Load today's appointments
    loadTodaysAppointments();

    // Initialize pagination controls
    initializePagination();

    // Initialize action modal
    initializeActionModal();
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

function setCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
}

function loadTodaysAppointments() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get appointments from shared mock data
    currentAppointments = window.mockDataAPI ?
        window.mockDataAPI.getAppointmentsByDate(today) :
        [];

    // Sort by time
    currentAppointments.sort((a, b) => a.time.localeCompare(b.time));

    // Update stats
    updateStats();

    // Reset to first page
    currentPage = 1;

    // Render table
    renderAppointmentsTable();

    // Update pagination
    updatePagination();
}

function updateStats() {
    const totalToday = currentAppointments.length;
    const pending = currentAppointments.filter(apt => apt.status === 'Confirmed').length;
    const completed = currentAppointments.filter(apt => apt.status === 'Completed').length;

    document.getElementById('todayTotal').textContent = totalToday;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('completedCount').textContent = completed;
}

function renderAppointmentsTable() {
    const tableBody = document.getElementById('appointmentsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (currentAppointments.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('paginationContainer').classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    document.getElementById('paginationContainer').classList.remove('hidden');

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, currentAppointments.length);
    const pageAppointments = currentAppointments.slice(startIndex, endIndex);

    // Clear table body
    tableBody.innerHTML = '';

    // Render appointments
    pageAppointments.forEach(appointment => {
        const row = createAppointmentRow(appointment);
        tableBody.appendChild(row);
    });

    // Update showing info
    document.getElementById('showingStart').textContent = startIndex + 1;
    document.getElementById('showingEnd').textContent = endIndex;
    document.getElementById('totalAppointments').textContent = currentAppointments.length;
}

function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-100 hover:bg-green-25 transition-colors';

    const statusClass = getStatusClass(appointment.status);
    const statusText = appointment.status;

    // Only show actions for Confirmed appointments
    const canTakeAction = appointment.status === 'Confirmed';

    row.innerHTML = `
    <td class="py-4 px-4 font-medium text-green-800">${formatTime(appointment.time)}</td>
    <td class="py-4 px-4">
      <div class="font-medium text-gray-900">${appointment.studentName}</div>
      <div class="text-sm text-gray-500 md:hidden">${appointment.email}</div>
    </td>
    <td class="py-4 px-4 text-gray-600 hidden md:table-cell">${appointment.email}</td>
    <td class="py-4 px-4 text-gray-600 hidden md:table-cell">${appointment.phone}</td>
    <td class="py-4 px-4">
      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
        ${statusText}
      </span>
    </td>
    <td class="py-4 px-4">
      ${canTakeAction ?
        `<button 
          onclick="showActionModal(${appointment.id})" 
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Actions
        </button>` :
        `<span class="text-gray-400 text-sm">${appointment.status === 'Completed' ? 'Done' : 'Cancelled'}</span>`
    }
    </td>
  `;

    return row;
}

function getStatusClass(status) {
    switch (status) {
        case 'Confirmed':
            return 'bg-green-100 text-green-800';
        case 'Completed':
            return 'bg-blue-100 text-blue-800';
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function initializePagination() {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderAppointmentsTable();
            updatePagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(currentAppointments.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderAppointmentsTable();
            updatePagination();
        }
    });
}

function updatePagination() {
    const totalPages = Math.ceil(currentAppointments.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function initializeActionModal() {
    const modal = document.getElementById('actionModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const completeBtn = document.getElementById('completeBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    closeBtn.addEventListener('click', hideActionModal);

    completeBtn.addEventListener('click', () => {
        updateAppointmentStatus(selectedAppointmentId, 'Completed');
        hideActionModal();
    });

    cancelBtn.addEventListener('click', () => {
        updateAppointmentStatus(selectedAppointmentId, 'Cancelled');
        hideActionModal();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideActionModal();
        }
    });
}

function showActionModal(appointmentId) {
    selectedAppointmentId = appointmentId;
    const appointment = currentAppointments.find(apt => apt.id === appointmentId);

    if (appointment) {
        document.getElementById('modalTitle').textContent = `Appointment - ${appointment.studentName}`;
        document.getElementById('modalMessage').textContent =
            `Time: ${formatTime(appointment.time)} | Reason: ${appointment.reason}`;

        const modal = document.getElementById('actionModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function hideActionModal() {
    const modal = document.getElementById('actionModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    selectedAppointmentId = null;
}

function updateAppointmentStatus(appointmentId, newStatus) {
    // Update using shared mock data API
    const updatedAppointment = window.mockDataAPI ?
        window.mockDataAPI.updateAppointmentStatus(appointmentId, newStatus) :
        null;

    if (updatedAppointment) {
        // Update current appointments list
        const appointmentIndex = currentAppointments.findIndex(apt => apt.id === appointmentId);
        if (appointmentIndex !== -1) {
            currentAppointments[appointmentIndex].status = newStatus;
        }

        // Update display
        updateStats();
        renderAppointmentsTable();

        // Show success message
        showToast(`Appointment ${newStatus.toLowerCase()} successfully!`, 'success');
    } else {
        showToast('Failed to update appointment status', 'error');
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;

    // Add to page
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}