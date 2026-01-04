const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    try {
        console.log('Testing Registration...');
        try {
            const regRes = await axios.post(`${API_URL}/register`, {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'ADMIN'
            });
            console.log('Registration Success:', regRes.data);
        } catch (e) {
            if (e.response && e.response.status === 400 && e.response.data.message === 'User already exists') {
                console.log('User already exists, proceeding to login...');
            } else {
                throw e;
            }
        }

        console.log('Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'admin@test.com',
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data);
        const token = loginRes.data.token;

        console.log('Testing Get Me (Protected)...');
        const meRes = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Me Success:', meRes.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testAuth();
