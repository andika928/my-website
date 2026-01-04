const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Creating test student...");

        // 1. Create Student
        const student = await prisma.student.create({
            data: {
                registrationNumber: 'REG-TEST-001',
                name: 'Budi Santoso (Test)',
                nisn: '1234567890',
                dateOfBirth: new Date('2005-01-01'),
                placeOfBirth: 'Jakarta',
                address: 'Jl. Test No. 1',
                gender: 'L',
                parentName: 'Bapak Budi',
                parentPhone: '08123456789',
                status: 'ACTIVE'
            }
        });

        console.log(`Student created: ${student.name} (${student.registrationNumber})`);

        // 2. Create User Account
        const email = `${student.registrationNumber}@student.school`;
        const password = 'Siswa123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: student.name,
                email: email,
                password: hashedPassword,
                role: 'STUDENT'
            }
        });

        console.log("\n=== CREDENTIALS GENERATED ===");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("=============================");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
