const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking Prisma Models...");
        // Check if pPDBSubmission exists
        if (prisma.pPDBSubmission) {
            console.log("✅ prisma.pPDBSubmission exists");
            const count = await prisma.pPDBSubmission.count();
            console.log(`Current Count: ${count}`);
        } else {
            console.log("❌ prisma.pPDBSubmission DOES NOT exist");
            console.log("Available models:", Object.keys(prisma).filter(k => !k.startsWith('_')));
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
