import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';
import { validate } from '../validation/validation.js';
import { updateDetailProject, storeDetailProject } from '../validation/detail_project.js';
import sendNotif from '../utils/notif.js';
import Nodemailer from '../utils/nodemailer.js';

const get = async (req) => {
  if (req.query.project_id) {
    const result = await prisma.projectDetail.findMany({
      where: {
        project_id: Number(req.query.project_id),
      },
      orderBy: {
        percentage: 'desc',
      },
    });
    return result;
  }
  const result = await prisma.projectDetail.findMany();
  return result;
};

const getDetail = async (id) => {
  const result = await prisma.projectDetail.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!result) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }

  return result;
};

const update = async (req, id) => {
  const data = {
    project_id: Number(req.body.project_id),
    description: req.body.description,
    status: req.body.status,
    percentage: Number(req.body.percentage)
  };

  // Parallel queries for project and project detail checks
  const [checkProject, checkDetailProject] = await Promise.all([
    prisma.project.findFirst({
      where: {
        id: data.project_id
      }
    }),
    prisma.projectDetail.findFirst({
      where: {
        id: Number(id)
      }
    })
  ]);

  if (!checkProject) {
    throw new ResponseError(404, `Data Project Tidak di Temukan`);
  }

  if (!checkDetailProject) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }

  const result = await prisma.projectDetail.update({
    where: {
      id: Number(id)
    },
    data
  });

  // Fetch mentor details in parallel
  const mentorDetails = await prisma.user.findFirst({
    where: {
      id: req.user.id
    },
    select: {
      mentor_id: true,
      email: true
    }
  });

  const mentor = await prisma.user.findFirst({
    where: {
      id: Number(mentorDetails.mentor_id)
    },
    select:{
      id: true,
      name: true,
      email: true
    }
  });

  const notifMentor = {
    title: "Laporan Proyek",
    subtitle: `Laporan Proyek ${checkProject.title} telah direvisi oleh ${req.user.name} Silahkan direview kembali`,
    user_id: mentorDetails.mentor_id,
  };

  sendNotif(notifMentor);

  const notifEmail = {
    user: {
      name: mentor.name,
      description: `Laporan Proyek <b>${checkProject.title}</b> dengan persentase <b>${data.percentage}%</b> telah direvisi oleh <b>${req.user.name}</b> Silahkan direview kembali.`,
    },
  };

  Nodemailer.getHtml('email/notification.ejs', notifEmail).then(html => {
    Nodemailer.sendMail(mentor.email, `Laporan Proyek Mentee`, html);
  });

  return result;
}


const store = async (req) => {
  const data = validate(storeDetailProject, req.body);

  const [checkProject, mentorDetails] = await Promise.all([
    prisma.project.findFirst({
      where: {
        id: data.project_id,
      },
      include: {
        ProjectDetail: {
          select: {
            percentage: true,
          },
        },
      },
    }),
    prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      select: {
        mentor_id: true,
        email: true,
      },
    }),
  ]);

  if (!checkProject) {
    throw new ResponseError(404, `Data Project Tidak di Temukan`);
  }

  if (checkProject.ProjectDetail.some((item) => item.percentage === 100)) {
    throw new ResponseError(422, `Project Selesai 100%`);
  }

  const mentor = await prisma.user.findFirst({
    where: {
      id: Number(mentorDetails.mentor_id),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const result = await prisma.projectDetail.create({ data });

  const notifMentor = {
    title: 'Laporan Proyek',
    subtitle: `Laporan Proyek ${checkProject.title} telah dibuat oleh ${req.user.name} Silahkan review`,
    user_id: mentorDetails.mentor_id,
  };

  sendNotif(notifMentor);

  const notifEmail = {
    user: {
      name: mentor.name,
      description: `Laporan Proyek <b>${checkProject.title}</b> dengan persentase <b>${data.percentage}%</b> telah dibuat oleh <b>${req.user.name}</b> Silahkan review.`,
    },
  };

  Nodemailer.getHtml('email/notification.ejs', notifEmail).then((html) => {
    Nodemailer.sendMail(mentor.email, `Laporan Proyek Mentee`, html);
  });

  return result;
};

const destroy = async (id) => {
  const checkDetailProject = await prisma.projectDetail.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!checkDetailProject) {
    throw new ResponseError(404, `Data Tidak di Temukan`);
  }

  await prisma.projectDetail.delete({
    where: {
      id: Number(id),
    },
  });
};

export default {
  get,
  getDetail,
  update,
  store,
  destroy,
};
