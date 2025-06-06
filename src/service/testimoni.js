import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';

const create = async (req, data) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  const result = await prisma.testimonial.create({
    data: {
      user_id: req.user.id,
      mentor_id: user.mentor_id,
      content: data.content,
    },
  });

  return result;
};

const getAll = async () => {

  const testimoniData = await prisma.testimonial.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
          posisi: {
            select: {
              nama: true,
            },
          },
          instansi: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (testimoniData.length === 0) {
    throw new ResponseError(400, 'Belum ada data Testimoni');
  }

  const result = testimoniData.map((testimoni) => ({
    testimoni: {
      ...testimoni,
    },
  }));

  return result;
};

const getDetail = async (req) => {
  const result = await prisma.testimonial.findMany({
    where: {
      user_id: req.user.id
    }
  });

  return result;
};

const getAlumni = async () => {
  const result = await prisma.testimonial.findMany({
    where: {
      status: "dipublish",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          posisi: {
            select: {
              nama: true,
            },
          },
          instansi: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const updateTestimoni = async (data, id) => {

  const checkTestimonial = await prisma.testimonial.findFirst({
    where: {
      id: Number(id)
    }
  });

  if (!checkTestimonial) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }
  
  const result = await prisma.testimonial.update({
    where: {
      id: Number(id),
    },
    data: {
      status: data.status,
      content: data.content,
    },
  });

  return result;
};

const check = async (req) => {
  const pengajuan = await prisma.pengajuan.findFirst({
    where: {
      user_id: Number(req.user.id)
    },
    include: {
      project: {
        select: {
          ProjectDetail: {
            select: {
              percentage: true,
              status: true
            }
          }
        }
      }
    }
  });

  return {
    project: pengajuan.project.some(project => project.ProjectDetail.some(project_detail => project_detail.percentage === 100 && project_detail.status === 'diterima'))
  }
}

export default {
  check,
  create,
  getAll,
  getDetail,
  getAlumni,
  updateTestimoni,
};
