import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

const getPermissions = async () => {
  const permissions = await prisma.permission.findMany();

  return permissions;
}

const getRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
}

const createRole = async (data) => {

  const role = await prisma.role.create({
    data: {
      name: data.name.toUpperCase(),
    }
  });

  return role;
}

const get = async (req) => {
  const role_id = Number(req.query.role_id) ? Number(req.query.role_id) : 0;
  const { role_name } = req.query

  if (!role_id && !role_name) {
    const role_has_permissions = await prisma.roleHasPermission.findMany({
      include: {
        permission: true,
        role: true
      }
    });

    return role_has_permissions;
  }

  const role_has_permissions = await prisma.roleHasPermission.findMany({
    where: {
      OR: [{
        role_id: role_id,
      }, {
        role: {
          name: role_name
        }
      }]
    },
    include: {
      permission: true,
      role: true
    }
  });

  if (role_has_permissions.length === 0) {
    throw new ResponseError(404, "Data tidak ditemukan");
  }

  return role_has_permissions;
}

const update = async (datas) => {
  const dataDB = await prisma.roleHasPermission.findMany({
    where: {
      role_id: datas[0].role_id,
    },
    select: {
      role_id: true,
      permission_id: true
    }
  });

  const dataToAdd = datas.filter((data) => {
    return !dataDB.some((dbData) => {
      return (
        dbData.role_id === data.role_id &&
        dbData.permission_id === data.permission_id
      );
    });
  });

  const dataToDelete = dataDB.filter((dbData) => {
    return !datas.some((data) => {
      return (
        dbData.role_id === data.role_id &&
        dbData.permission_id === data.permission_id
      );
    });
  })
  
  if(dataToAdd.length > 0) {
    await prisma.roleHasPermission.createMany({
      data: dataToAdd
    });
  }

  if(dataToDelete.length > 0) {
    await prisma.roleHasPermission.deleteMany({
      where: {
        OR: dataToDelete.map((data) => {
          return {
            role_id: data.role_id,
            permission_id: data.permission_id
          }
        })
      }
    });
  }

  const data = await prisma.roleHasPermission.findMany({
    where: {
      role_id: datas[0].role_id
    },
  });

  return data;

}

export default {
  get,
  getPermissions,
  update,
  getRoles,
  createRole
}