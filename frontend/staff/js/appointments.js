// Staff All Appointments JavaScript

// Global variables
let currentPage = 1;
const itemsPerPage = 10;
let allAppointments = [];
let filteredAppointments = [];
let selectedAppointmentId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated() || getUserRole() !== 'staff') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the page
    initializeAppointments();
});

function initializeAppointments() {
    // Initialize mobile menu
    initializeMobileMenu();

    // Load all appointments
    loadAllAppointments();

    // Initialize filters
    initializeFilters();

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

function loadAllAppointments() {
    // Get all appointments from shared mock data
    allAppointments = window.mockDataAPI ?
        window.mockDataAPI.getAllAppointments() :
        [];

    // Sort by date and time (newest first)
    allAppointments.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        if (dateComparison === 0) {
            return b.time.localeCompare(a.time);
        }
        return dateComparison;
    });

    // Apply initial filters
    applyFilters();
}

function initializeFilters() {
    const dateFilter = document.getElementById('dateFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchFilter = document.getElementById('searchFilter');
    const clearFilters = document.getElementById('clearFilters');

    dateFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    searchFilter.addEventListener('input', debounce(applyFilters, 300));

    clearFilters.addEventListener('click', () => {
        dateFilter.value = '';
        statusFilter.value = '';
        searchFilter.value = '';
        applyFilters();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

    filteredAppointments = allAppointments.filter(appointment => {
        const matchesDate = !dateFilter || appointment.date === dateFilter;
        const matchesStatus = !statusFilter || appointment.status === statusFilter;
        const matchesSearch = !searchFilter ||
            appointment.studentName.toLowerCase().includes(searchFilter) ||
            appointment.email.toLowerCase().includes(searchFilter) ||
            appointment.reason.toLowerCase().includes(searchFilter);

        return matchesDate && matchesStatus && matchesSearch;
    });

    // Reset to first page
    currentPage = 1;

    // Render table
    renderAppointmentsTable();

    // Update pagination
    updatePagination();
}

function renderAppointmentsTable() {
    const tableBody = document.getElementById('appointmentsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (filteredAppointments.length === 0) {
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('paginationContainer').classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    document.getElementById('paginationContainer').classList.remove('hidden');

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredAppointments.length);
    const pageAppointments = filteredAppointments.slice(startIndex, endIndex);

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
    document.getElementById('totalAppointments').textContent = filteredAppointments.length;
}

function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-100 hover:bg-green-25 transition-colors';

    const statusClass = getStatusClass(appointment.status);
    const statusText = appointment.status;
    const isToday = appointment.date === new Date().toISOString().split('T')[0];
    const isPast = new Date(appointment.date) < new Date().setHours(0,0,0,0);

    // Only show actions for Confirmed appointments
    const canTakeAction = appointment.status === 'Confirmed';

    row.innerHTML = `
    <td class="py-4 px-4">
      <div class="font-medium ${isToday ? 'text-green-800' : isPast ? 'text-gray-600' : 'text-blue-600'}">
        ${formatDate(appointment.date)}
      </div>
      ${isToday ? '<div class="text-xs text-green-600 font-semibold">TODAY</div>' : ''}
    </td>
    <td class="py-4 px-4 font-medium text-gray-800">${formatTime(appointment.time)}</td>
    <td class="py-4 px-4">
      <div class="font-medium text-gray-900">${appointment.studentName}</div>
      <div class="text-sm text-gray-500 md:hidden">${appointment.email}</div>
    </td>
    <td class="py-4 px-4 text-gray-600 hidden md:table-cell">${appointment.email}</td>
    <td class="py-4 px-4 text-gray-600 hidden lg:table-cell">${appointment.reason}</td>
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
        const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderAppointmentsTable();
            updatePagination();
        }
    });
}

function updatePagination() {
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
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
    const appointment = allAppointments.find(apt => apt.id === appointmentId);

    if (appointment) {
        document.getElementById('modalTitle').textContent = `Appointment - ${appointment.studentName}`;
        document.getElementById('modalMessage').textContent = `What would you like to do with this appointment?`;
        document.getElementById('modalDetails').innerHTML = `
      <strong>Date:</strong> ${formatDate(appointment.date)}<br>
      <strong>Time:</strong> ${formatTime(appointment.time)}<br>
      <strong>Reason:</strong> ${appointment.reason}<br>
      <strong>Symptoms:</strong> ${appointment.symptoms || 'N/A'}<br>
      <strong>Current Status:</strong> ${appointment.status}
    `;

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
        // Update all appointments list
        const appointmentIndex = allAppointments.findIndex(apt => apt.id === appointmentId);
        if (appointmentIndex !== -1) {
            allAppointments[appointmentIndex].status = newStatus;
        }

        // Re-apply filters to update the display
        applyFilters();

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