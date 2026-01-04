const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSubmission = async (req, res) => {
    try {
        const {
            fullName, birthPlace, birthDate, gender, address,
            phone, nisn, previousSchool, previousSchoolAddress, graduationYear,
            parentName, parentPhone
        } = req.body;

        // Validasi minimal field required (simple check)
        if (!fullName || !birthDate || !gender || !address || !phone || !previousSchool || !graduationYear || !parentName || !parentPhone) {
            return res.status(400).json({ error: 'Mohon lengkapi semua data wajib.' });
        }

        // Check date validity
        const parsedDate = new Date(birthDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Format tanggal lahir tidak valid.' });
        }

        // Handle file uploads
        const documents = {};
        if (req.files) {
            if (req.files.ijazah) documents.ijazah = req.files.ijazah[0].path;
            if (req.files.kk) documents.kk = req.files.kk[0].path;
            if (req.files.akta) documents.akta = req.files.akta[0].path;
            if (req.files.photo) documents.photo = req.files.photo[0].path;
        }

        // Simple Registration ID Generation (e.g., PPDB-Timestamp)
        const registrationId = `PPDB-${Date.now()}`;

        const newSubmission = await prisma.pPDBSubmission.create({
            data: {
                registrationId,
                fullName,
                birthPlace,
                birthDate: parsedDate,
                gender,
                address,
                phone,
                nisn,
                previousSchool,
                previousSchoolAddress,
                graduationYear,
                parentName,
                parentPhone,
                documents: JSON.stringify(documents),
                status: 'PENDING'
            }
        });

        res.status(201).json(newSubmission);
    } catch (error) {
        console.error("Error creating submission:", error);
        res.status(500).json({ error: 'Failed to create submission' });
    }
};

const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await prisma.pPDBSubmission.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

const getSubmissionDetail = async (req, res) => {
    const { id } = req.params;
    try {
        // Try to find by Registration ID first (public check)
        let submission = await prisma.pPDBSubmission.findUnique({
            where: { registrationId: id },
        });

        // If not found, try by internal ID (UUID) (admin view)
        if (!submission) {
            submission = await prisma.pPDBSubmission.findUnique({
                where: { id },
            });
        }

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        res.json(submission);
    } catch (error) {
        console.error("Error fetching submission details:", error);
        res.status(500).json({ error: 'Failed to fetch submission details' });
    }
};

const updateSubmissionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED, REJECTED, VERIFIED

    if (!['PENDING', 'VERIFIED', 'ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const updatedSubmission = await prisma.pPDBSubmission.update({
            where: { id },
            data: { status },
        });

        // Auto-create Student if Accepted
        if (status === 'ACCEPTED') {
            const existingStudent = await prisma.student.findUnique({
                where: { registrationNumber: updatedSubmission.registrationId }
            });
            if (!existingStudent) {
                await prisma.student.create({
                    data: {
                        registrationNumber: updatedSubmission.registrationId,
                        name: updatedSubmission.fullName,
                        dateOfBirth: updatedSubmission.birthDate,
                        placeOfBirth: updatedSubmission.birthPlace,
                        address: updatedSubmission.address,
                        gender: updatedSubmission.gender,
                        parentName: updatedSubmission.parentName,
                        parentPhone: updatedSubmission.parentPhone,
                        nisn: updatedSubmission.nisn,
                        status: 'ACTIVE'
                    }
                });
            }
        }

        res.json(updatedSubmission);
    } catch (error) {
        console.error("Error updating submission status:", error);
        res.status(500).json({ error: 'Failed to update submission status' });
    }
};

const deleteSubmission = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.pPDBSubmission.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Submission deleted successfully' });
    } catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).json({ error: 'Failed to delete submission' });
    }
};

module.exports = {
    createSubmission,
    getAllSubmissions,
    getSubmissionDetail,
    updateSubmissionStatus,
    deleteSubmission
};
