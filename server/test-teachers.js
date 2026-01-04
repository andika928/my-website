const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const TEACHER_URL = 'http://localhost:5000/api/teachers';

async function testTeachers() {
    try {
        console.log('--- Authenticating as Admin ---');
        const loginRes = await axios.post(`${AUTH_URL}/login`, {
            email: 'admin@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n--- 1. Create Teacher (Admin) ---');
        const createRes = await axios.post(TEACHER_URL, {
            name: 'Mr. Smith',
            nip: '123456789',
            subject: 'Mathematics',
            bio: 'Experienced Math Teacher'
        }, authHeaders);
        console.log('Created Teacher:', createRes.data.name);
        const teacherId = createRes.data.id;

        console.log('\n--- 2. List All Teachers (Public) ---');
        const listRes = await axios.get(TEACHER_URL);
        console.log('Teacher Count:', listRes.data.length);

        console.log('\n--- 3. Update Teacher (Admin) ---');
        const updateRes = await axios.put(`${TEACHER_URL}/${teacherId}`, {
            name: 'Mr. Smith (Senior)',
            subject: 'Advanced Mathematics'
        }, authHeaders);
        console.log('Updated Teacher:', updateRes.data.name);

        console.log('\n--- 4. Delete Teacher (Admin) ---');
        const deleteRes = await axios.delete(`${TEACHER_URL}/${teacherId}`, authHeaders);
        console.log('Delete Response:', deleteRes.data.message);

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testTeachers();
