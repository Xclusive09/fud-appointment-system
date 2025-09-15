// Student Mock Data API - combines shared mock data with localStorage
window.mockDataAPI = {
    initializeDemoData: function() {
        const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        if (storedAppointments.length === 0) {
            // Get demo appointments from shared mock data
            const sharedMockData = window.mockDataAPI.getStudentAppointments('demo.student@university.edu') || [];
            localStorage.setItem('appointments', JSON.stringify(sharedMockData));
        }
    },

    getAppointmentsByDate: function(date) {
        // Combine shared mock data with localStorage data
        const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const sharedAppointments = window.mockDataAPI.getAppointmentsByDate(date) || [];
        return [...new Set([...storedAppointments, ...sharedAppointments])];
    },

    getStudentAppointments: function(studentEmail) {
        // Combine shared mock data with localStorage data
        const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const sharedAppointments = window.mockDataAPI.getStudentAppointments(studentEmail) || [];
        return [...new Set([...storedAppointments, ...sharedAppointments])];
    },

    addAppointment: function(appointmentData) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const newAppointment = {
            ...appointmentData,
            id: Date.now(),
            status: 'Confirmed'
        };
        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return newAppointment;
    }
};