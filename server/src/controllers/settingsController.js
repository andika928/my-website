const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSettings = async (req, res) => {
    try {
        // There should be only one settings record
        let settings = await prisma.appSettings.findFirst();

        // Create default if not exists
        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {
                    id: 'settings',
                    schoolName: 'SMA Negeri 1',
                    schoolAddress: 'Jl. Pendidikan No. 1',
                    ppdbStatus: 'OPEN'
                }
            });
        }

        res.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const settings = await prisma.appSettings.findFirst();
        const id = settings ? settings.id : 'settings';

        const updatedSettings = await prisma.appSettings.upsert({
            where: { id },
            update: req.body,
            create: {
                id: 'settings',
                ...req.body
            }
        });
        res.json(updatedSettings);
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
