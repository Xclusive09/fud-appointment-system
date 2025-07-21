// Shared mock data for appointments across student and staff portals

// Global appointments storage
let globalAppointments = [
    // Past appointments
    {
        id: 101,
        studentName: "Alex Johnson",
        email: "alex.johnson@university.edu",
        phone: "+1234567801",
        date: "2025-07-08",
        time: "09:00",
        status: "Completed",
        reason: "General checkup",
        symptoms: "Regular health check",
        appointmentType: "General Consultation"
    },
    {
        id: 102,
        studentName: "Maria Garcia",
        email: "maria.garcia@university.edu",
        phone: "+1234567802",
        date: "2025-07-09",
        time: "10:30",
        status: "Completed",
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
        date: "2025-07-10",
        time: "09:00",
        status: "Confirmed",
        reason: "General checkup",
        symptoms: "Regular health screening",
        appointmentType: "General Consultation"
    },
    {
        id: 2,
        studentName: "Jane Smith",
        email: "jane.smith@university.edu",
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
        date: "2025-07-10",
        time: "10:00",
        status: "Confirmed",
        reason: "Vaccination",
        symptoms: "Annual vaccination",
        appointmentType: "Vaccination"
    },
    {
        id: 4,
        studentName: "Sarah Wilson",
        email: "sarah.wilson@university.edu",
        phone: "+1234567893",
        date: "2025-07-10",
        time: "10:30",
        status: "Completed",
        reason: "Medical certificate",
        symptoms: "Need medical certificate for sports",
        appointmentType: "Medical Certificate"
    },
    {
        id: 5,
        studentName: "David Brown",
        email: "david.brown@university.edu",
        phone: "+1234567894",
        date: "2025-07-10",
        time: "11:00",
        status: "Confirmed",
        reason: "Health screening",
        symptoms: "Annual health screening",
        appointmentType: "Health Screening"
    },
    // Sample Student Appointments - These will be used for demo purposes
    {
        id: 301,
        studentName: "Demo Student",
        email: "demo.student@university.edu",
        phone: "+1234567999",
        date: "2025-07-06",
        time: "14:00",
        status: "Completed",
        reason: "Health Checkup",
        symptoms: "Annual health screening and blood test",
        appointmentType: "Health Checkup"
    },
    {
        id: 302,
        studentName: "Demo Student",
        email: "demo.student@university.edu",
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
        studentName: "Demo Student",
        email: "demo.student@university.edu",
        phone: "+1234567999",
        date: "2025-07-10",
        time: "15:30",
        status: "Confirmed",
        reason: "General Consultation",
        symptoms: "Feeling tired and having headaches",
        appointmentType: "General Consultation"
    },
    {
        id: 304,
        studentName: "Demo Student",
        email: "demo.student@university.edu",
        phone: "+1234567999",
        date: "2025-07-12",
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

// Function to get all appointments
function getAllAppointments() {
    return [...globalAppointments];
}

// Function to get appointments for a specific date
function getAppointmentsByDate(date) {
    return globalAppointments.filter(apt => apt.date === date);
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
    return newAppointment;
}

// Function to update appointment status
function updateAppointmentStatus(appointmentId, newStatus) {
    const appointmentIndex = globalAppointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex !== -1) {
        globalAppointments[appointmentIndex].status = newStatus;
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