const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = await prisma.contactMessage.create({
            data: { name, email, subject, message }
        });
        res.status(201).json(contact);
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.contactMessage.delete({ where: { id } });
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

module.exports = { createMessage, getAllMessages, deleteMessage };
