const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: { payments: true }
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
};

const createStudent = async (req, res) => {
    try {
        const {
            registrationNumber, name, nisn, dateOfBirth, placeOfBirth,
            address, gender, parentName, parentPhone, status
        } = req.body;

        const newStudent = await prisma.student.create({
            data: {
                registrationNumber,
                name,
                nisn,
                dateOfBirth: new Date(dateOfBirth),
                placeOfBirth,
                address,
                gender,
                parentName,
                parentPhone,
                status: status || 'ACTIVE'
            }
        });
        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ error: 'Failed to create student' });
    }
};

const updateStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const { dateOfBirth, ...otherData } = req.body;
        const updateData = { ...otherData };
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

        const updatedStudent = await prisma.student.update({
            where: { id },
            data: updateData
        });
        res.json(updatedStudent);
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: 'Failed to update student' });
    }
};

const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch student first to get registration number for email reconstruction
        const student = await prisma.student.findUnique({
            where: { id },
            select: { registrationNumber: true }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentEmail = `${student.registrationNumber}@student.school`;

        // Use transaction to ensure all operations succeed or fail together
        await prisma.$transaction([
            // 1. Delete related payments
            prisma.studentPayment.deleteMany({
                where: { studentId: id }
            }),
            // 2. Delete the student record
            prisma.student.delete({
                where: { id }
            }),
            // 3. Delete the associated User account (Revoke Login Access)
            prisma.user.deleteMany({
                where: { email: studentEmail }
            })
        ]);

        res.json({ message: 'Student, payments, and user account deleted successfully' });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: 'Failed to delete student. Ensure all related data is handled.' });
    }
};

const createStudentAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const email = `${student.registrationNumber}@student.school`;
        const password = 'Siswa123!'; // Default password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update password if user exists
            user = await prisma.user.update({
                where: { email },
                data: { password: hashedPassword, role: 'STUDENT' }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    name: student.name,
                    email,
                    password: hashedPassword,
                    role: 'STUDENT'
                }
            });
        }

        res.json({
            message: 'Student status updated',
            email,
            password
        });

    } catch (error) {
        console.error("Error creating student account:", error);
        res.status(500).json({ error: 'Failed to create student account' });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    createStudentAccount
};
