import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';
import bcrypt from 'bcrypt';

const getAllDashboard = async (req) => {
  const mentee_id = await prisma.user.findMany({
    select: {
      id: true,
    },
    where: {
      mentor_id: req.user.id,
    },
  });

  const [menteeActive, monitoring, alumni] = await Promise.all([
   prisma.user.count({
      where: {
        is_active: true,
        mentor_id: Number(req.user.id),
      },
    }),
    prisma.project.count({
      where: {
        user_id: {
          in: mentee_id.map((mentee) => mentee.id),
        },
      },
    }),
    prisma.pengajuan.count({
      where: { is_active: true, status: { in: 'alumni' } },
    }),
  ]);

  const results = [
    {
      name: 'Data Mentee Aktif',
      total: menteeActive,
      url_detail: '/mentee/active',
    },
    {
      name: 'Data Monitoring',
      total: monitoring,
      url_detail: '/monitoring',
    },
    {
      name: 'alumni',
      total: alumni,
      url_detail: '/admin/alumni',
    },
  ];

  return results;
};

const create = async (req, data) => {
  const check_email = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if(check_email){
    throw new ResponseError(422, 'Email Sudah digunakan!');
  }

  const mentor = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      posisi_id: data.posisi_id,
      role_id: 2,
      activation: true,
    },
  });

  if (!mentor) {
    throw new ResponseError(500, 'gagal membuat mentor');
  }

  return mentor;
};

const getAll = async () => {
  const mentor_id = await prisma.role.findFirst({
    where: {
      name: 'MENTOR',
    },
    select: {
      id: true
    }
  });

  const mentor = await prisma.user.findMany({
    where: { 
      role_id: mentor_id.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      mentees: {
        where: {
          is_active: true
        },
        select: {
          id: true,
          name: true,
        },
      },
      posisi: {
        select: {
          nama: true,
        },
      },
      activation: true,
    },
  });

  if (!mentor) {
    throw new ResponseError(500, 'Data mentor tidak ada');
  }

  return mentor;
};

const updateMentor = async (id, data) => {
  if (!id) {
    throw new ResponseError(400, 'mentor tidak ditemukan');
  }

  const mentor = await prisma.user.update({
    data: { activation: data.activation },
    where: { id: +id },
  });

  if (!mentor) {
    throw new ResponseError(500, 'gagal mengubah data mentor');
  }

  return 'Sukses Mengubah Mentor';
};

const deleteMentor = async (id) => {
  if (!id) {
    throw new ResponseError(400, 'mentor tidak ditemukan');
  }

  const mentor = await prisma.user.delete({
    where: { id: +id },
  });

  if (!mentor) {
    throw new ResponseError(500, 'gagal menghapus mentor');
  }

  return 'Sukses Mengubah Mentor';
};

const getAllMentee = async (req) => {
  const mentee = await prisma.user.findMany({
    where: {
      is_active: true,
      mentor_id: Number(req.params.mentor_id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      instansi: true,
      posisi: true,
      pengajuan: {
        where: {
          status: 'diterima',
        },
        select: {
          periode: {
            select: {
              tanggal_pengajuan: true,
              tanggal_selesai: true,
            },
          },
        },
      },
    },
  });

  return mentee;
};

const getAllUser = async () => {
  const user = await prisma.user.findMany({
    where: {
      is_active: true,
      role_id: 3,
      mentor_id: null,
    },
    select: {
      id: true,
      name: true,
      posisi: {
        select: {
          nama: true,
        },
      },
    },
  });

  return user;
};

const updateMentee = async (data, id) => {
  const find = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      mentor_id: Number(data.mentor_id),
    },
  });

  if (!find) {
    throw new ResponseError(404, 'Data Not Found!');
  }

  return user;
};

const deleteMentee = async (data, id) => {
  const find = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      mentor_id: null,
    },
  });

  if (!find) {
    throw new ResponseError(404, 'Data Not Found!');
  }

  return user;
};

export default { create, getAll, updateMentor, deleteMentor, getAllMentee, getAllUser, updateMentee, deleteMentee, getAllDashboard };
