const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

beforeAll(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartjob_test';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth routes', () => {
  test('Register and login', async () => {
    const email = 'jestuser@example.com';
    const res = await request(app).post('/api/auth/register').send({ name:'Jest User', email, password:'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    const login = await request(app).post('/api/auth/login').send({ email, password:'password123' });
    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty('token');
  });
});
