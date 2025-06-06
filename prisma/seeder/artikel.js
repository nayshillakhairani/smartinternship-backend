import prisma from "../../src/application/database.js";

async function main(){
  try {
    for (let i = 0; i < 10000; i++) {
      await prisma.cmsArticle.create({
        data: {
          title: `{judul ke-${i}}`,
          content: `{konten ke-${i}}`,
          slug: `{judul-ke-${i}}`,
          thumbnail: `/cms/artikel/1716781637007.png`,
        }
      });
    }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;