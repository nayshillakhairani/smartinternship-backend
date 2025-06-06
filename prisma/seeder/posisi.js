import prisma from "../../src/application/database.js";
import posisi from "../data/posisi.json" assert { type: "json" };

// ini berubah
async function main() {
  try {
    await prisma.posisi.createMany({
      data: posisi,
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
