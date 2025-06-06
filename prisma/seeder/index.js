import instansiSeeder from "./instansi.js";
import jurusanSeeder from "./jurusan.js";
import posisiSeeder from "./posisi.js";
import userSeeder from "./user.js";
import permissionSeeder from "./permission.js";
import roleSeeder from "./role.js";
import roleHasPermissionSeeder from "./role_has_permission.js";
import cms_beranda from "./cms_beranda.js";
import artikel from "./artikel.js";

async function runSeeders() {
  try {
    await instansiSeeder();
    await jurusanSeeder();
    await roleSeeder();
    await userSeeder();
    await cms_beranda();
    await permissionSeeder();
    await roleHasPermissionSeeder();
    await posisiSeeder();
    // await artikel();
  } catch (error) {
    throw error;
  } finally {
    console.log("Seeders finished.");
  }
}

runSeeders();
