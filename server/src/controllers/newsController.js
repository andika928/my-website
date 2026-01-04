const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } }
        });
        res.json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

const getNewsById = async (req, res) => {
    const { id } = req.params;
    try {
        const newsItem = await prisma.news.findUnique({
            where: { id },
            include: { author: { select: { name: true } } }
        });
        if (!newsItem) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json(newsItem);
    } catch (error) {
        console.error("Error fetching news item:", error);
        res.status(500).json({ error: 'Failed to fetch news item' });
    }
};

const createNews = async (req, res) => {
    try {
        const { title, content, category, thumbnail, published, authorId } = req.body;

        // Simple slug generator
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

        // Default author if not provided (should come from auth middleware usually)
        // For now, let's find the first user to assign as author if not provided
        let finalAuthorId = authorId;
        if (!finalAuthorId) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) finalAuthorId = firstUser.id;
            else {
                // Create a default admin user if none exists (safety fallback)
                const newUser = await prisma.user.create({
                    data: {
                        email: 'admin@school.com',
                        password: 'password123', // In real app, hash this!
                        name: 'Admin',
                        role: 'ADMIN'
                    }
                });
                finalAuthorId = newUser.id;
            }
        }

        const newNews = await prisma.news.create({
            data: {
                title,
                slug,
                content,
                excerpt: content.substring(0, 150) + '...',
                category,
                thumbnail,
                published: published || false,
                authorId: finalAuthorId
            }
        });
        res.status(201).json(newNews);
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ error: 'Failed to create news' });
    }
};

const updateNews = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedNews = await prisma.news.update({
            where: { id },
            data: req.body
        });
        res.json(updatedNews);
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ error: 'Failed to update news' });
    }
};

const deleteNews = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.news.delete({
            where: { id }
        });
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
};

module.exports = {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};
