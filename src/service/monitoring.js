import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';
import { validate } from '../validation/validation.js';
import { updateDetailProject } from '../validation/monitoring.js';
import sendNotif from '../utils/notif.js';

const get = async (req) => {
  const mentee_id = await prisma.user.findMany({
    select: {
      id: true,
    },
    where: {
      mentor_id: req.user.id,
    },
  });

  const result = await prisma.project.findMany({
    where: {
      user_id: {
        in: mentee_id.map((mentee) => mentee.id),
      },
    },
    include: {
      user: true,
      pengajuan: {
        include: {
          posisi: true,
        },
      },
      ProjectDetail: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return result;
};

const getDetail = async (id) => {
  const result = await prisma.project.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      pengajuan: {
        include: {
          posisi: true,
        },
      },
      ProjectDetail: {
        orderBy: {
          percentage: 'desc',
        },
      },
    },
  });

  if (result.length === 0) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }

  return result;
};

const update = async (req, id) => {
  const data = validate(updateDetailProject, req.body);

  const checkDetailProject = await prisma.projectDetail.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!checkDetailProject) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }

  const result = await prisma.projectDetail.update({
    where: {
      id: Number(id),
    },
    include: {
      project: true,
    },
    data: {
      status: data.status,
      ...(data.revision_note ? { revision_note: data.revision_note } : {}),
    },
  });

  const showDi = result.status === 'revisi';
  const lulus = result.percentage === 100 && result.status === 'diterima';

  const nofitUser = {
    title: 'Laporan Proyek',
    subtitle: showDi
      ? `Laporan proyek ${result.project.title} dengan persentase ${result.percentage}% di ${result.status} oleh ${req.user.name}`
      : lulus
      ? `Laporan proyek ${result.project.title} dengan persentase ${result.percentage}% ${result.status} oleh ${req.user.name}, Silahkan Isi Testimoni untuk dapat mengunduh Sertifikat`
      : `Laporan proyek ${result.project.title} dengan persentase ${result.percentage}% ${result.status} oleh ${req.user.name}`,
    user_id: result.project.user_id,
  };

  sendNotif(nofitUser);

  if (checkDetailProject.percentage === 100 && checkDetailProject.status === 'diterima') {
    const nofitUser = {
      title: 'Laporan Proyek',
      subtitle: `Proyek yang kamu kerjakan sudah selesai 100% Silahkan Isi Testimoni Untuk Mengunduh Sertifikat`,
      user_id: result.project.user_id,
    };

    sendNotif(nofitUser);
  }

  return result;
};

export default {
  get,
  getDetail,
  update,
};
