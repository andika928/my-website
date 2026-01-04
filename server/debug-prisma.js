const { PrismaClient } = require('@prisma/client');

console.log('Imported PrismaClient');

try {
    const prisma = new PrismaClient();
    console.log('Initialized PrismaClient successfully');

    async function testParam() {
        try {
            const users = await prisma.user.findMany();
            console.log('Database connected, users count:', users.length);
        } catch (e) {
            console.error('Database connection failed:', e);
        }
    }

    testParam();

} catch (error) {
    console.error('Failed to initialize PrismaClient:', error);
}
