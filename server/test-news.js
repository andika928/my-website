const axios = require('axios');

const AUTH_URL = 'http://localhost:5000/api/auth';
const NEWS_URL = 'http://localhost:5000/api/news';

async function testNews() {
    try {
        console.log('--- Authenticating as Admin ---');
        const loginRes = await axios.post(`${AUTH_URL}/login`, {
            email: 'admin@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n--- 1. Create News ---');
        const createRes = await axios.post(NEWS_URL, {
            title: 'School Sports Day 2025',
            content: 'The annual sports day will be held on...',
            excerpt: 'Join us for the annual sports day!',
            category: 'Events'
        }, authHeaders);
        console.log('Created News:', createRes.data.title, `(ID: ${createRes.data.id})`);
        const newsId = createRes.data.id;
        const newsSlug = createRes.data.slug;

        console.log('\n--- 2. Get All News (Public) ---');
        const getAllRes = await axios.get(NEWS_URL);
        console.log('News Count:', getAllRes.data.meta.total);

        console.log('\n--- 3. Get News By Slug (Public) ---');
        const getOneRes = await axios.get(`${NEWS_URL}/${newsSlug}`);
        console.log('Retrieved News:', getOneRes.data.title);

        console.log('\n--- 4. Update News ---');
        const updateRes = await axios.put(`${NEWS_URL}/${newsId}`, {
            title: 'School Sports Day 2025 - UPDATED',
            published: true
        }, authHeaders);
        console.log('Updated News:', updateRes.data.title);

        console.log('\n--- 5. Delete News ---');
        const deleteRes = await axios.delete(`${NEWS_URL}/${newsId}`, authHeaders);
        console.log('Delete Response:', deleteRes.data.message);

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testNews();
