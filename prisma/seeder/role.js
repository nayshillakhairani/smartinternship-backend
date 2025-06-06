import prisma from "../../src/application/database.js";
import role from "../data/role.json" assert { type: "json" };

async function main() {
  try {
    await prisma.role.createMany({
      data: role,
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
