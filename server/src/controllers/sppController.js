const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPayments = async (req, res) => {
    try {
        const payments = await prisma.studentPayment.findMany({
            include: { student: { select: { name: true, registrationNumber: true, status: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

const getStudentPayments = async (req, res) => {
    const { studentId } = req.params;
    try {
        const payments = await prisma.studentPayment.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(payments);
    } catch (error) {
        console.error("Error fetching student payments:", error);
        res.status(500).json({ error: 'Failed to fetch student payments' });
    }
};

const createPayment = async (req, res) => {
    try {
        const { studentId, month, year, amount, status } = req.body;

        // Check if payment already exists for that month/year
        const existingPayment = await prisma.studentPayment.findFirst({
            where: { studentId, month, year }
        });

        if (existingPayment) {
            return res.status(400).json({ error: 'Payment for this month already exists' });
        }

        const newPayment = await prisma.studentPayment.create({
            data: {
                studentId,
                month,
                year,
                amount: parseFloat(amount),
                status: status || 'PAID',
                paymentDate: status === 'PAID' ? new Date() : null
            }
        });

        res.status(201).json(newPayment);
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: 'Failed to record payment' });
    }
};

const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedPayment = await prisma.studentPayment.update({
            where: { id },
            data: {
                status,
                paymentDate: status === 'PAID' ? new Date() : undefined
            }
        });
        res.json(updatedPayment);
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ error: 'Failed to update payment' });
    }
};

const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.studentPayment.delete({
            where: { id }
        });
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ error: 'Failed to delete payment' });
    }
};

const uploadPaymentProof = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const payment = await prisma.studentPayment.update({
            where: { id },
            data: {
                proofFile: req.file.path,
                status: 'VERIFYING'
            }
        });

        res.json({ message: 'Proof uploaded successfully', payment });
    } catch (error) {
        console.error("Error uploading proof:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Data pembayaran tidak ditemukan (mungkin sudah dihapus admin)' });
        }
        res.status(500).json({ error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // PAID or REJECTED

    if (!['PAID', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Use PAID or REJECTED' });
    }

    try {
        const payment = await prisma.studentPayment.update({
            where: { id },
            data: {
                status,
                paymentDate: status === 'PAID' ? new Date() : undefined
            }
        });

        res.json({ message: `Payment ${status.toLowerCase()}`, payment });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};

const getMyPayments = async (req, res) => {
    try {
        // req.userId comes from auth middleware
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!user || user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Extract Registration Number from email (format: REG...@student.school)
        const registrationNumber = user.email.split('@')[0];

        const student = await prisma.student.findUnique({
            where: { registrationNumber }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student record not found' });
        }

        const payments = await prisma.studentPayment.findMany({
            where: { studentId: student.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(payments);

    } catch (error) {
        console.error("Error fetching my payments:", error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

module.exports = {
    getAllPayments,
    getStudentPayments,
    createPayment,
    updatePaymentStatus,
    deletePayment,
    getMyPayments,
    uploadPaymentProof,
    verifyPayment
};
