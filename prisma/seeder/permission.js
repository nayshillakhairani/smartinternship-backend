import prisma from "../../src/application/database.js";
import permission from "../data/permission.json" assert { type: "json" };

async function main() {
  // Untuk aturan penamaan permission aksi_namaModul contoh
  // tambah_mitra, lihat_mitra, ubah_mitra, hapus_mitra
  try {
    await prisma.permission.createMany({
      data: permission,
      skipDuplicates: true,
    });

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
