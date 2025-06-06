import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import convertEvaluation from "../utils/formatEvaluation.js";
import convertCertificate from "../utils/formatCertificate.js";
import mergePDFs from "../utils/mergePdf.js";
import path from "path";
import fs from "fs/promises";
import sendNotif from "../utils/notif.js";
import { capitalize } from '../utils/capitalize.js';
import ejs from 'ejs';
import generateEvaluation from '../utils/generateEvaluation.js';

const get = async () => {
  const sertifikat = await prisma.setting.findFirst({
    where: {
      key: 'sertifikat_pdf'
    }
  });

  if (!sertifikat) {
    throw new ResponseError(404, "Tidak ada data");
  }

  return sertifikat;
}

const assign = async (id) => {
  const pengajuan = await prisma.pengajuan.findFirst({
    where: {
      id: Number(id)
    },
    include: {
      project: {
        include: {
          ProjectDetail: true
        }
      },
      user: {
        include: {
          Testimonial: true,
          instansi: true
        }
      },
      Evaluation: true,
      periode: true,
      posisi: true
    }
  });

  const check = {
    project: pengajuan.project.some(item => item.ProjectDetail.some(item2 => item2.percentage === 100 && item2.status === 'diterima')),
    user: pengajuan.user.Testimonial.length > 0,
    evaluation: pengajuan.Evaluation.length > 0
  }

  if (!check.project || !check.user || !check.evaluation) {
    throw new ResponseError(422, "Salah satu dari ketiga syarat harus terpenuhi")
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.instansi.update({
      where: {
        id: pengajuan.user.instansi.id
      },
      data: {
        kuota_tersedia: {
          increment: 1
        }
      }
    });

    await prisma.posisi.update({
      where: {
        id: pengajuan.posisi_id
      },
      data: {
        kuota_tersedia: {
          increment: 1
        }
      }
    });

    await prisma.pengajuan.update({
      where: {
        id: Number(id)
      },
      data: {
        status: 'alumni',
      }
    });

    await prisma.user.update({
      where: {
        id: Number(pengajuan.user.id)
      },
      data: {
        is_active: false,
        status: 'alumni'
      }
    });
  });

  const notifMentor = {
    title: "Kelulusan",
    subtitle: "Selamat Kamu Telah Menyelesaikan Proses Magang, Silahkan download Sertifikat",
    user_id: pengajuan.user.id,
  }

  sendNotif(notifMentor);
}

const generate = async (id_pengajuan) => {
  const pengajuan = await prisma.pengajuan.findFirst({
    where: {
      id: Number(id_pengajuan)
    },
    include: {
      project: {
        include: {
          ProjectDetail: true
        }
      },
      user: {
        include: {
          Testimonial: true
        }
      },
      Evaluation: true,
      periode: true,
      posisi: true
    }
  });

  if (pengajuan.status != 'alumni') {
    throw new ResponseError(422, "Kamu masih belum menjadi alumni")
  }

  const evaluation_template_docx = await prisma.setting.findUnique({
    where: {
      key: 'sertifikat_docx'
    }
  })

  if (!evaluation_template_docx) {
    throw new ResponseError(404, "Template Sertifikat Belum Di Upload");
  }

  const formatedPengajuan = {
    name: capitalize(pengajuan.user.name),
    title: capitalize(pengajuan.posisi.nama),
    start_date: pengajuan.periode.tanggal_pengajuan,
    end_date: pengajuan.periode.tanggal_selesai
  }

  const file_certificate = await convertCertificate(evaluation_template_docx.value, formatedPengajuan)

  const evaluation_values = await prisma.evaluation.findMany({
    where: {
      pengajuan_id: Number(id_pengajuan)
    },
  });

  const structuredData = evaluation_values.reduce((acc, evaluation) => {
    const { evaluation_type, evaluation_name, value } = evaluation;
    if (!acc[evaluation_type]) {
      acc[evaluation_type] = [];
    }
    acc[evaluation_type].push({
      evaluation_name,
      evaluation_type,
      value,
      no: acc[evaluation_type].length + 1
    });
    return acc;
  }, {});

  const filePath = path.join(process.cwd(), 'src/views/evaluation/evaluation.ejs');
  const html = await ejs.renderFile(filePath, { evaluations: structuredData });

  const file_evaluation = await generateEvaluation(html);

  try {
    const mergedFileName = await mergePDFs(file_certificate, file_evaluation, "/storage/sertifikat", id_pengajuan);
    const url = path.join(process.cwd(), '/storage/sertifikat/', mergedFileName)
    return url
  } catch (error) {
    console.error("Error merging PDFs:", error);
  }
}

const destroy = async (id_pengajuan) => {
  const pathName = path.join(
    process.cwd(),
    `/storage/sertifikat/${id_pengajuan}.pdf`
  );
  await fs.access(pathName).then(async () => await fs.unlink(pathName));
}

export default {
  get, assign, generate, destroy
}