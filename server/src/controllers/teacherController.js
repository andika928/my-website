const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
};

const getTeacherById = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id },
        });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error("Error fetching teacher:", error);
        res.status(500).json({ error: 'Failed to fetch teacher' });
    }
};

const createTeacher = async (req, res) => {
    try {
        const { name, nip, subject, photo, bio } = req.body;
        const newTeacher = await prisma.teacher.create({
            data: { name, nip, subject, photo, bio }
        });
        res.status(201).json(newTeacher);
    } catch (error) {
        console.error("Error creating teacher:", error);
        res.status(500).json({ error: 'Failed to create teacher' });
    }
};

const updateTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTeacher = await prisma.teacher.update({
            where: { id },
            data: req.body
        });
        res.json(updatedTeacher);
    } catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).json({ error: 'Failed to update teacher' });
    }
};

const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.teacher.delete({
            where: { id }
        });
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error("Error deleting teacher:", error);
        res.status(500).json({ error: 'Failed to delete teacher' });
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};
