const request = require('supertest');


const BASE_URL = `http://localhost:3000`; 

describe('Doctor Booking App API Tests', () => {
  let authToken = '';
  let adminToken = '';
  let testUserId = '';
  let testServiceId = '';

  // User Registration Test
  it('should register a new patient/user successfully', async () => {
    const res = await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: `patient_${Date.now()}`,
        email: `patient_${Date.now()}@test.com`,
        password: 'password123'
      });

    expect(res.statusCode).toBe(201) || expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('successfully');
  });

  // Login & Token Retrieval
  it('should login and return a JWT token', async () => {
    const res = await request(BASE_URL)
      .post('/api/user/login')
      .send({
        email: 'admin@gmail.com', 
        password: 'password123'
      });

    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token; 
  });

  // admin: Add New Service/Doctor
  it('should allow admin to add a new doctor service', async () => {
    const res = await request(BASE_URL)
      .post('/api/service/add_service')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        serviceName: "Cardiology",
        description: "Heart specialist",
        price: 500
      });

    expect(res.body.success).toBe(true);
    testServiceId = res.body.service?._id; 
  });

  // get All Services 
  it('should fetch all available services', async () => {
    const res = await request(BASE_URL)
      .get('/api/service/get_all');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.services)).toBe(true);
  });

  // create Appointment 
  it('should create an appointment for a user', async () => {
    const res = await request(BASE_URL)
      .post('/api/appointments/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        serviceId: testServiceId,
        date: "2024-05-20",
        time: "10:00 AM"
      });

    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('created');
  });

  // favourites
  it('should add/remove doctor from favorites', async () => {
    const res = await request(BASE_URL)
      .post('/api/user/toggle-favorite')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        doctorId: testServiceId
      });

    expect(res.body.success).toBe(true);
  });

  // Admin: Get All Users List
  it('should allow admin to view all registered users', async () => {
    const res = await request(BASE_URL)
      .get('/api/admin/get-all-users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.users).toBeDefined();
  });

  // Security: Unauthorized access check
  it('should deny access to profile update without token', async () => {
    const res = await request(BASE_URL)
      .put('/api/user/update-profile')
      .send({ username: 'hacker' });

    expect(res.statusCode).toBe(401); 
    expect(res.body.success).toBe(false);
  });
});