// Shared mock data for appointments across student and staff portals

// Today's appointments (October 15, 2025)
const todayAppointments = [
    {
        id: 501,
        studentName: "Ibrahim Suleiman",
        email: "ibrahim.s@fud.edu.ng",
        phone: "+2347012345678",
        date: "2025-10-15",
        time: "09:00",
        status: "Confirmed",
        reason: "General Checkup",
        symptoms: "Regular health screening",
        appointmentType: "General Consultation"
    },
    {
        id: 502,
        studentName: "Aisha Mohammed",
        email: "aisha.m@fud.edu.ng",
        phone: "+2347023456789",
        date: "2025-10-15",
        time: "10:30",
        status: "Confirmed",
        reason: "Vaccination",
        symptoms: "Scheduled vaccination",
        appointmentType: "Vaccination"
    },
    {
        id: 503,
        studentName: "Hassan Umar",
        email: "hassan.u@fud.edu.ng",
        phone: "+2347034567890",
        date: "2025-10-15",
        time: "11:30",
        status: "Completed",
        reason: "Follow-up",
        symptoms: "Follow-up consultation",
        appointmentType: "Follow-up"
    },
    {
        id: 504,
        studentName: "Fatima Yusuf",
        email: "fatima.y@fud.edu.ng",
        phone: "+2347045678901",
        date: "2025-10-15",
        time: "14:00",
        status: "Confirmed",
        reason: "Medical Certificate",
        symptoms: "Sports clearance certificate needed",
        appointmentType: "Medical Certificate"
    },
    {
        id: 505,
        studentName: "Abdullahi Musa",
        email: "abdullahi.m@fud.edu.ng",
        phone: "+2347056789012",
        date: "2025-10-15",
        time: "15:30",
        status: "Confirmed",
        reason: "Health Screening",
        symptoms: "Annual medical examination",
        appointmentType: "Health Screening"
    }
];

// Function to save appointments to localStorage
function saveAppointmentsToStorage() {
    localStorage.setItem('globalAppointments', JSON.stringify(globalAppointments));
}

// Function to load appointments from localStorage or use initial data
function loadAppointments() {
    const storedAppointments = localStorage.getItem('globalAppointments');
    if (storedAppointments) {
        return JSON.parse(storedAppointments);
    }
    // If nothing in storage, return the initial mock data
    return getInitialMockData();
}

// Function to provide the initial set of mock data
function getInitialMockData() {
    return [
    {
        id: 101,
        studentName: "Quadri Ilufoye",
        email: "quadri.ilufoye@fud.edu",
        phone: "+1234567801",
        date: "2025-11-08",
        time: "09:00",
        status: "Completed",
        reason: "General checkup",
        symptoms: "Regular health check",
        appointmentType: "General Consultation"
    },
    {
        id: 102,
        studentName: "Divine Favour",
        email: "dev.fav@fud.edu",
        phone: "+1234567802",
        date: "2025-10-10",
        time: "10:30",
        status: "Confirmed",
        reason: "Follow-up consultation",
        symptoms: "Follow-up on previous visit",
        appointmentType: "Follow-up"
    },
    // Today's appointments
    {
        id: 1,
        studentName: "John Doe",
        email: "john.doe@university.edu",
        phone: "+1234567890",
        date: "2025-09-08",
        time: "09:00",
        status: "Confirmed",
        reason: "General checkup",
        symptoms: "Regular health screening",
        appointmentType: "General Consultation"
    },
    {
        id: 2,
        studentName: "Aisha Hassan",
        email: "aisha.humaira@fud.edu",
        phone: "+1234567891",
        date: "2025-07-10",
        time: "09:30",
        status: "Confirmed",
        reason: "Follow-up consultation",
        symptoms: "Follow-up on medication",
        appointmentType: "Follow-up"
    },
    {
        id: 3,
        studentName: "Mike Johnson",
        email: "mike.johnson@university.edu",
        phone: "+1234567892",
        date: "2025-10-10",
        time: "10:00",
        status: "Confirmed",
        reason: "Vaccination",
        symptoms: "Annual vaccination",
        appointmentType: "Vaccination"
    },
    {
        id: 4,
        studentName: "Sarah Wilson",
        email: "sarah.wilson@fud.edu",
        phone: "+1234567893",
        date: "2025-10-10",
        time: "10:30",
        status: "Completed",
        reason: "Medical certificate",
        symptoms: "Need medical certificate for sports",
        appointmentType: "Medical Certificate"
    },
    {
        id: 5,
        studentName: "Kayode  Brown",
        email: "kay.brown@fud.edu",
        phone: "+1234567894",
        date: "2025-12-10",
        time: "11:00",
        status: "Confirmed",
        reason: "Health screening",
        symptoms: "Annual health screening",
        appointmentType: "Health Screening"
    },
    // Sample Student Appointments - These will be used for demo purposes
    {
        id: 301,
        studentName: "Garko Faruk",
        email: "faruq.garko@fud.edu",
        phone: "+1234567999",
        date: "2025-10-10",
        time: "14:00",
        status: "Completed",
        reason: "Health Checkup",
        symptoms: "Annual health screening and blood test",
        appointmentType: "Health Checkup"
    },
    {
        id: 302,
        studentName: "Ibrahim hussain",
        email: "IB.huss@fud.edu",
        phone: "+1234567999",
        date: "2025-07-08",
        time: "10:30",
        status: "Completed",
        reason: "Follow-up",
        symptoms: "Follow-up on blood test results",
        appointmentType: "Follow-up"
    },
    {
        id: 303,
        studentName: "Jane Onome",
        email: "jane.onome@fud.edu",
        phone: "+1234567999",
        date: "2025-11-10",
        time: "15:30",
        status: "Confirmed",
        reason: "General Consultation",
        symptoms: "Feeling tired and having headaches",
        appointmentType: "General Consultation"
    },
    {
        id: 304,
        studentName: "Peace llateral",
        email: "peace.teral@fud.edu",
        phone: "+1234567999",
        date: "2025-11-12",
        time: "11:30",
        status: "Confirmed",
        reason: "Vaccination",
        symptoms: "Need flu vaccination for the season",
        appointmentType: "Vaccination"
    },
    {
        id: 305,
        studentName: "Demo Student",
        email: "demo.student@university.edu",
        phone: "+1234567999",
        date: "2025-07-15",
        time: "09:30",
        status: "Confirmed",
        reason: "Prescription Renewal",
        symptoms: "Need to renew prescription for allergy medication",
        appointmentType: "Prescription Renewal"
    },
    // Future appointments for other students
    {
        id: 201,
        studentName: "Sarah Connor",
        email: "sarah.connor@university.edu",
        phone: "+1234567803",
        date: "2025-07-12",
        time: "09:00",
        status: "Confirmed",
        reason: "Medical examination",
        symptoms: "Pre-employment medical exam",
        appointmentType: "Medical Examination"
    },
    {
        id: 202,
        studentName: "Tom Wilson",
        email: "tom.wilson@university.edu",
        phone: "+1234567804",
        date: "2025-07-12",
        time: "11:00",
        status: "Confirmed",
        reason: "Health screening",
        symptoms: "Regular health check",
        appointmentType: "Health Screening"
    },
    {
        id: 203,
        studentName: "Emma Davis",
        email: "emma.davis@university.edu",
        phone: "+1234567805",
        date: "2025-07-15",
        time: "14:00",
        status: "Confirmed",
        reason: "Consultation",
        symptoms: "General health concerns",
        appointmentType: "General Consultation"
    }
    ];
}

// Global appointments storage, loaded from localStorage
let globalAppointments = [];

// Initialize appointments by combining today's appointments with stored ones
function initializeAppointments() {
    const storedAppointments = loadAppointments();
    globalAppointments = [...todayAppointments, ...storedAppointments];
    saveAppointmentsToStorage();
}

// Initialize on load
initializeAppointments();

// Function to get all appointments
function getAllAppointments() {
    return [...globalAppointments]; // Return a copy to prevent direct mutation
}

// Function to get appointments for a specific date
function getAppointmentsByDate(date) {
    console.log('Getting appointments for date:', date);
    console.log('All appointments:', globalAppointments);
    const appointments = globalAppointments.filter(apt => apt.date === date);
    console.log('Filtered appointments:', appointments);
    return appointments;
}

// Function to get appointments for a specific student
function getStudentAppointments(studentEmail) {
    return globalAppointments.filter(apt => apt.email === studentEmail);
}

// Function to add new appointment
function addAppointment(appointmentData) {
    const newAppointment = {
        id: Date.now(), // Generate unique ID
        ...appointmentData,
        status: 'Confirmed' // Automatically confirmed
    };

    globalAppointments.push(newAppointment);
    saveAppointmentsToStorage(); // Save to localStorage
    return newAppointment;
}

// Function to update appointment status
function updateAppointmentStatus(appointmentId, newStatus) {
    const appointmentIndex = globalAppointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex !== -1) {
        globalAppointments[appointmentIndex].status = newStatus;
        saveAppointmentsToStorage(); // Save to localStorage
        return globalAppointments[appointmentIndex];
    }
    return null;
}

// Function to cancel appointment
function cancelAppointment(appointmentId) {
    return updateAppointmentStatus(appointmentId, 'Cancelled');
}

// Function to complete appointment
function completeAppointment(appointmentId) {
    return updateAppointmentStatus(appointmentId, 'Completed');
}

// Function to initialize demo student profile if not exists
function initializeDemoStudent() {
    const existingProfile = localStorage.getItem('studentProfile');
    if (!existingProfile) {
        const demoProfile = {
            fullname: "Demo Student",
            email: "demo.student@university.edu",
            phone: "+1234567999",
            dob: "2000-01-15",
            faculty: "Computer Science",
            dept: "Information Technology",
            registration_number: "CS2024001",
            address: "123 University Street, Campus City",
            emergency_contact: "+1234567998",
            blood_group: "A+",
            allergies: "None",
            medical_history: "No significant medical history"
        };
        localStorage.setItem('studentProfile', JSON.stringify(demoProfile));
    }
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.mockDataAPI = {
        getAllAppointments,
        getAppointmentsByDate,
        getStudentAppointments,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        completeAppointment,
        initializeDemoStudent
    };
}
