import prisma from "../../src/application/database.js";
import cms_beranda from "../data/cms_beranda.json" assert { type: "json" };

async function main() {
  try {
    const check = await prisma.cmsDashboard.findMany({});

    if(check.length > 0){
      return;
    }

    await prisma.cmsDashboard.createMany({
      data: cms_beranda,
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;