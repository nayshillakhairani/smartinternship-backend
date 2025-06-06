import prisma from "../application/database.js";
import { validate } from "../validation/validation.js";
import ResponseError from "../error/response-error.js";
import { createProject, updateProject } from "../validation/project.js";
import sendNotif from "../utils/notif.js";

const create = async (req) => {
  const data = validate(createProject, req.body);

  const checkCertificate = await prisma.sertifikatMentee.findFirst({
    where: {
      pengajuan_id: data.pengajuan_id,
    },
  });

  if (checkCertificate) {
    throw new ResponseError(
      404,
      `project tidak bisa ditambah karena sudah memiliki sertifikat`
    );
  }

  const countProject = await prisma.project.findFirst({
    where: {
      AND: [{ user_id: req.user.id }, { title: { contains: data.title } }],
    },
  });

  if (countProject) {
    throw new ResponseError(400, "Project sudah ditambahkan!");
  }

  const checkPengajuan = await prisma.pengajuan.count({
    where: {
      AND: [
        { user_id: req.user.id },
        { is_active: true },
        { id: data.pengajuan_id },
      ],
    },
  });

  if (checkPengajuan == 0) {
    throw new ResponseError(400, "Pengajuan id yang dimasukkan salah");
  }

  const result = prisma.project.create({ 
    data: {
      user_id: req.user.id,
      pengajuan_id: data.pengajuan_id,
      title: data.title
    }
   });

  return result;
};

const getAll = async (req) => {

  const project = await prisma.project.findMany({
    where: {
      user_id: req.user.id,
      pengajuan_id: Number(req.query.pengajuan_id),
    },
    include: {
      ProjectDetail: {
        orderBy: {
          percentage: 'desc'
        }
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!project) throw new ResponseError(500, "data project tidak ada");

  return project;
};

const getById = async (id) => {
  const project = await prisma.project.findUnique({
    where: { id: +id },
    include: {
      ProjectDetail: {
        orderBy: {
          createdAt: 'desc'
        }
      },
    }
  });

  if (!project) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }

  return project;
};

const updateById = async (req, id) => {
  const data = validate(updateProject, req.body);

  const checkProject = await prisma.project.findFirst({
    where: {
      id: Number(id)
    }
  })

  if (!checkProject) {
    throw new ResponseError(
      404, `Data Tidak di Temukan`
    );
  }

  // TODO: tambahkan validasi status user

  // if (checkCertificate) {
  //   throw new ResponseError(
  //     400, `Project tidak bisa diubah karena sudah memiliki sertifikat`
  //   );
  // }

  const result = await prisma.project.update({
    where: {
      id: Number(id)
    },
    data: {
      user_id: req.user.id,
      pengajuan_id: data.pengajuan_id,
      title: data.title
    }
  })

  return result;
};

const deleteById = async (id) => {

  const checkProject = await prisma.project.findFirst({
    where: {
      id: Number(id)
    }
  })

  if (!checkProject) {
    throw new ResponseError(
      404, `Data Tidak di Temukan`
    );
  }

  const checkCertificate = await prisma.sertifikat.findFirst({
    where: {
      pengajuan_id: checkProject.pengajuan_id
    }
  });

  if (checkCertificate) {
    throw new ResponseError(
      400, `Project tidak bisa dihapus karena sudah memiliki sertifikat`
    );
  }

  const deleted = await prisma.project.delete({ where: { id: +id } });
  if (!deleted) {
    throw new ResponseError(404, `gagal menghapus project dengan id ${id}`);
  }

  return true;
};

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
