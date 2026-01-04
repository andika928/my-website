const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const STUDENT_URL = 'http://localhost:5000/api/students';

async function testStudents() {
    try {
        console.log('\n--- 1. Public Registration (PPDB) ---');
        const registerRes = await axios.post(`${STUDENT_URL}/register`, {
            name: 'John Doe',
            placeOfBirth: 'Jakarta',
            dateOfBirth: '2010-05-15',
            address: 'Jl. Merdeka No. 1',
            gender: 'MALE',
            parentName: 'Jane Doe',
            parentPhone: '08123456789'
        });
        console.log('Registered Student:', registerRes.data.data.name);
        console.log('Reg Number:', registerRes.data.data.registrationNumber);
        const regNumber = registerRes.data.data.registrationNumber;
        const studentId = registerRes.data.data.id;

        console.log('\n--- 2. Public Status Check ---');
        const statusRes = await axios.get(`${STUDENT_URL}/status/${regNumber}`);
        console.log(`Status for ${regNumber}:`, statusRes.data.status);

        console.log('\n--- Authenticating as Admin ---');
        const loginRes = await axios.post(`${AUTH_URL}/login`, {
            email: 'admin@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n--- 3. List All Students (Admin) ---');
        const listRes = await axios.get(STUDENT_URL, authHeaders);
        console.log('Total Students:', listRes.data.meta.total);

        console.log('\n--- 4. Update Student Status (Admin) ---');
        const updateRes = await axios.put(`${STUDENT_URL}/${studentId}/status`, {
            status: 'ACTIVE'
        }, authHeaders);
        console.log('New Status:', updateRes.data.status);

        console.log('\n--- 5. Delete Student (Admin) ---');
        const deleteRes = await axios.delete(`${STUDENT_URL}/${studentId}`, authHeaders);
        console.log('Delete Response:', deleteRes.data.message);

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testStudents();
