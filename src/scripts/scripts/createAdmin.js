import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: "admin@popfresh.in",
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.admin.create({
      data: {
        name: "Mohit",
        email: "admin@popfresh.in",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ Admin created successfully.");
    console.log("Email: admin@popfresh.in");
    console.log("Password: admin123");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();