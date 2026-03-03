import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000'; 

const Api = axios.create({
  baseURL: API_BASE_URL, 
  withCredentials: true,
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// user apis
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const forgotPasswordApi = (data) => Api.post('/api/user/forgot-password', data);
export const verifyOtpApi = (data) => Api.post('/api/user/verify-otp', data);
export const resetPasswordApi = (data) => Api.post('/api/user/reset-password', data);
export const getMyAppointmentsApi = () => Api.get("/api/user/get-my-appointments");

//admin managemnet
export const getAllUsersApi = () => Api.get("/api/admin/get-all-users"); 
export const deleteUserApi = (id) => Api.delete(`/api/admin/delete-user/${id}`);
export const getUserCountApi = () => Api.get("/api/admin/get-user-count");
export const getAllAppointmentsApi = () => Api.get("/api/admin/get-all-appointments");



// Service
export const addServiceApi = (data) => Api.post('/api/service/add_service', data); 
export const getAllServicesApi = () => Api.get('/api/service/get_all');
export const deleteServiceApi = (id) => Api.delete(`/api/service/delete/${id}`);

export const createAppointmentApi = (data) => Api.post('/api/appointments/create', data);

// favourites 
export const toggleFavoriteApi = (data) => Api.post('/api/user/toggle-favorite', data);
export const getUserFavoritesApi = () => Api.get('/api/user/get-my-favorites');
export const checkFavoriteStatusApi = (data) => Api.post('/api/user/check-favorite-status', data);

// hospitals
export const postHospitalBookingApi = (data) => Api.post('/api/hospital-bookings', data);
export const addHospitalApi = (data) => Api.post('/api/hospital/add', data);
export const getAllHospitalsApi = () => Api.get('/api/hospital/all');
export const deleteHospitalApi = (id) => Api.delete(`/api/hospital/delete/${id}`);


export const getUserBookingsApi = (email) => Api.get(`/api/user-bookings/${email}`);
export const deleteHospitalBookingApi = (id) => Api.delete(`/api/hospital-bookings/${id}`);


// review
export const postReviewApi = (payload) => Api.post('/api/reviews', payload);
export const getReviewsApi = (doctorId) => Api.get(`/api/reviews/${doctorId}`);

// delete
export const deleteReviewApi = (reviewId) => Api.delete(`/api/reviews/${reviewId}`);
export const getMyReviewsApi = (userId) => Api.get(`/api/reviews/user/${userId}`);

// Notification APIs
export const getNotificationsApi = (userId) => Api.get(`/api/notifications/${userId}`);
export const markAllNotificationsAsReadApi = (userId) => Api.put(`/api/notifications/mark-all-read/${userId}`);
export const createNotificationApi = (data) => Api.post(`/api/notifications`, data);

export const getUserProfileApi = (id) => Api.get(`/api/users/${id}`);


export const uploadProfilePictureApi = (formData) => {
  return Api.post("/api/user/upload-profile-picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProfileApi = (data) => Api.put('/api/user/update-profile', data);

export const changePasswordApi = (data) => Api.put('/api/user/change-password', data);

// admin noti
export const getAdminNotificationsApi = () => api.get('/notifications/admin/all');
export const markNotificationReadApi = (id) => Api.put(`/api/admin/notifications/${id}/read`);

export const getAllReviewsApi = () => Api.get('/api/reviews/all');

export const updateAppointmentStatusApi = (appointmentId, statusData) => 
    Api.patch(`/api/admin/appointments/${appointmentId}/status`, statusData);
export default Api;

