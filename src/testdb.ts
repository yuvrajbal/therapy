import prisma from "./lib/prisma"; // Adjust the import path as necessary


async function testDB() {
  try {
    console.log("Connecting to DB...");
    await prisma.$connect();
    console.log("Connected!");
    await prisma.$disconnect();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testDB();
