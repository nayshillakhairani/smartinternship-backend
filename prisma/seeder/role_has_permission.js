import prisma from "../../src/application/database.js";
import role_has_permissions from "../data/role_has_permission.json" assert { type: "json" };

// jika ingin menambahkan role_has_permission baru, tambahkan ke dalam file role_has_permission.json
// dan lakukan pemanggilan db seed

async function main() {
  try {
    for (const role_has_permission of role_has_permissions) {
      const { role, permission } = role_has_permission;

      try {
        const roleData = await prisma.role.findUnique({
          where: {
            name: role,
          },
        });

        const permissionData = await prisma.permission.findUnique({
          where: {
            name: permission,
          },
        });

        if (!roleData || !permissionData) {
          throw new Error("Role atau permission tidak ditemukan");
        }

        const checkRoleHasPermission = await prisma.roleHasPermission.findFirst({
          where: {
            role_id: roleData.id,
            permission_id: permissionData.id,
          },
        })

        if (checkRoleHasPermission) {
          throw new Error("Data telah ditambahkan sebelumnya");
        }

        await prisma.roleHasPermission.create({
          data: {
            role_id: roleData.id,
            permission_id: permissionData.id,
          },
        });
      } catch (e) {
        console.error(e.message);
        continue;
      }
    }

  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default main;
