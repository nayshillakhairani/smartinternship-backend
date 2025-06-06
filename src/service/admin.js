import prisma from '../application/database.js';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import ResponseError from '../error/response-error.js';
import inserDataIntern from '../utils/InsertDataIntern.js';
import { validate } from '../validation/validation.js';
import validator from '../validation/admin.js';
import sendNotif from '../utils/notif.js';
import formatDate from '../utils/formatDate.js';
import nodemailer from '../utils/nodemailer.js';
import generateDocxTemplate from '../utils/formatCertificate.js';
import mergePDFs from '../utils/mergePdf.js';

const getAllDashboard = async () => {
  const [userActive, userRegister, alumni, kuota] = await Promise.all([
    prisma.pengajuan.count({
      where: { is_active: true, status: 'diterima' },
    }),
    prisma.pengajuan.count({
      where: {
        is_active: false,
        status: { in: ['wawancara', 'administrasi', 'tes_kemampuan'] },
      },
    }),
    prisma.pengajuan.count({
      where: { is_active: true, status: { in: 'alumni' } },
    }),
    prisma.posisi.aggregate({
      where: {
        status: 'publish',
      },
      _sum: {
        kuota_tersedia: true,
      },
    }),
  ]);

  const results = [
    {
      name: 'user active',
      total: userActive,
      url_detail: '/admin/dashboard/user-active',
    },
    {
      name: 'remaining_kuota',
      total: kuota._sum.kuota_tersedia,
      url_detail: '/admin/posisi',
    },
    {
      name: 'user register',
      total: userRegister,
      url_detail: '/admin/dashboard/user-register',
    },
    {
      name: 'alumni',
      total: alumni,
      url_detail: '/admin/alumni',
    },
  ];

  return results;
};

const getAllUser = async (request) => {
  const { search, filter = 'proses', field } = request.query;

  const hasilPencarian = await prisma.pengajuan.findMany({
    where: search
      ? {
          AND: [
            {
              OR: [{ user: { name: { in: search } } }, { user: { email: { in: search } } }, { user: { phone: { in: search } } }, { posisi: { nama: { in: search } } }, { user: { instansi: { name: { in: search } } } }],
            },
            { [`status_${field}`]: filter },
          ],
        }
      : {
          [`status_${field}`]: filter,
        },
    include: {
      posisi: {
        select: {
          nama: true,
        },
      },
      periode: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          surat: true,
          cv: true,
          instansi: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'asc',
    },
  });

  const result = hasilPencarian.map((item) => {
    const commonFields = {
      id: item.id,
      status: item[`status_${field}`],
      createdAt: item.createdAt,
      user: {
        name: item.user.name,
        phone: item.user.phone,
        email: item.user.email,
        posisi: item.posisi.nama,
        instansi: item.user.instansi.name,
        status: item[`status_${field}`],
      },
    };

    if (field === 'tes_kemampuan') {
      const tanggalAwal = item[`tanggal_awal_${field}`];
      const tanggalAkhir = item[`tanggal_akhir_${field}`];

      return {
        ...commonFields,
        user: {
          ...commonFields.user,
          tanggal_awal_tes: tanggalAwal,
          tanggal_akhir_tes: tanggalAkhir,
          link: item[`link_${field}`],
        },
      };
    } else if (field === 'wawancara') {
      return {
        ...commonFields,
        user: {
          ...commonFields.user,
          tanggal_tes: item[`tanggal_${field}`],
          link: item[`link_${field}`],
        },
      };
    } else {
      return {
        ...commonFields,
        periode: {
          tanggal_pengajuan: item.periode.tanggal_pengajuan,
          tanggal_selesai: item.periode.tanggal_selesai,
        },
        user: {
          ...commonFields.user,
          surat: item.user.surat,
          cv: item.user.cv,
          phone: item.user.phone,
        },
      };
    }
  });

  return result;
};

const approveProject = async (req, id) => {
  if (!id || Object.keys(req.body).length === 0) {
    throw new ResponseError(400, 'Project tidak ditemukan');
  }

  const checkProject = await prisma.project.findFirst({
    where: { id: +id },
    select: { status: true },
  });

  if (!checkProject) {
    throw new ResponseError(400, 'Project tidak ditemukan');
  }

  const data = validate(validator.updateLink, req.body);
  const isApproved = data.status.toUpperCase() === 'DITERIMA';
  const updateData = isApproved ? { status: 'diterima' } : { status: 'ditolak' };

  const updatedProject = await prisma.project.update({
    where: { id: +id },
    data: updateData,
  });

  const approvalStatus = isApproved ? 'diterima' : 'ditolak';

  if (!updatedProject) {
    throw new ResponseError(400, 'Gagal memperbarui status project');
  }

  return `Project dengan judul ${updatedProject.judul} telah ${approvalStatus}`;
};

const aproveUserAdministrasi = async (req, id) => {
  if (!id || Object.keys(req.body).length === 0) {
    throw new ResponseError(400, 'Pengajuan tidak ditemukan');
  }

  const checkPengajuan = await prisma.pengajuan.findFirst({
    where: { id: +id },
    select: {
      status_administrasi: true,
      user_id: true,
    },
  });

  if (!checkPengajuan) {
    throw new ResponseError(400, 'Pengajuan tidak ditemukan');
  }

  if (checkPengajuan.status_administrasi === 'diterima') {
    throw new ResponseError(400, 'Pengajuan sudah diterima');
  }

  if (checkPengajuan.status_administrasi === 'ditolak') {
    throw new ResponseError(400, 'Pengajuan sudah ditolak');
  }

  const data = validate(validator.updateLink, req.body);
  const isApproved = data.status.toUpperCase() === 'DITERIMA';
  const updateData = isApproved ? { status_administrasi: 'diterima', status_tes_kemampuan: 'proses', status_wawancara: 'belumDiproses', status: 'tes_kemampuan' } : { status: 'ditolak', status_administrasi: 'ditolak' };

  const pengajuan = await prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: { id: checkPengajuan.user_id },
      data: {
        status: 'tes_kemampuan',
      },
    });

    return await prisma.pengajuan.update({
      where: { id: +id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            id: true,
            instansi: { select: { name: true } },
          },
        },
        posisi: {
          select: {
            nama: true,
          },
        },
      },
    });
  });

  if (!pengajuan) {
    throw new ResponseError(400, 'Pengajuan tidak ditemukan');
  }

  const approvalStatus = isApproved ? 'diluluskan' : 'ditolak';
  const approvalEmail = isApproved ? 'Lolos' : 'Gagal';

  const notif = {
    title: `Validasi Administrasi`,
    subtitle: `Seleksi administrasi dari user ${pengajuan.user.name} dengan asal instansi ${pengajuan.user.instansi.name} telah ${approvalStatus} oleh admin ${req.user.name}`,
    user_id: req.user.id,
  };

  await sendNotif(notif);

  if (!isApproved) {
    const notifUser = {
      title: `Gagal Seleksi Administrasi`,
      subtitle: `Maaf kamu belum berhasil lulus tahap Administrasi di posisi ${pengajuan.posisi.nama}. Terima kasih telah berpartisipasi. Tetap semangat!`,
      user_id: pengajuan.user_id,
    };

    await sendNotif(notifUser);
  }

  if (pengajuan.status_administrasi.toUpperCase() !== 'DITERIMA') {
    const notifEmail = {
      user: {
        name: pengajuan.user.name,
        // subject: `Anda ${approvalEmail} Seleksi Administrasi`,
        description: `Maaf kamu belum berhasil lulus tahap Administrasi di posisi <b>${pengajuan.posisi.nama}</b>. Terima kasih telah berpartisipasi pada Program ini. Tetap semangat ya!`,
      },
    };

    const html = await nodemailer.getHtml('email/notification.ejs', notifEmail);
    nodemailer.sendMail(pengajuan.user.email, `${approvalEmail} Seleksi Administrasi`, html);
  }

  return `User ${pengajuan.user.name} ${approvalStatus} di tahap administrasi`;
};

const aproveUserKemampuan = async (req, id) => {
  if (!id || Object.keys(req.body).length === 0) {
    throw new ResponseError(400, 'Pengajuan tidak ditemukan');
  }

  const pengajuan = await prisma.pengajuan.findFirst({
    where: { id: +id },
    select: {
      status_tes_kemampuan: true,
      user_id: true,
    },
  });

  if (pengajuan.status_tes_kemampuan === 'diterima') {
    throw new ResponseError(400, 'Pengajuan sudah diterima');
  }

  if (pengajuan.status_tes_kemampuan === 'ditolak') {
    throw new ResponseError(400, 'Pengajuan sudah ditolak');
  }

  const data = validate(validator.updateLink, req.body);

  if (!data.status) {
    const updatedUser = await prisma.$transaction(async (prisma) => {
      await prisma.pengajuan.update({
        where: { id: +id },
        data: {
          status: 'tes_kemampuan',
          link_tes_kemampuan: data.link,
          tanggal_awal_tes_kemampuan: data.tanggal_awal,
          tanggal_akhir_tes_kemampuan: data.tanggal_akhir,
        },
      });

      return await prisma.user.update({
        where: { id: pengajuan.user_id },
        data: { status: 'tes_kemampuan' },
        select: { name: true, email: true },
      });
    });

    const notif = {
      title: `Tes Kemampuan`,
      subtitle: `Selamat! Anda lolos Administrasi, silahkan lanjutkan dengan mengikuti Tes Kemampuan pada tanggal ${formatDate.convertDate(data.tanggal_awal, 'id-ID')} - ${formatDate.convertDate(
        data.tanggal_akhir,
        'id-ID'
      )}. Link tes dapat ditemukan di menu kegiatan akun Anda.`,
      user_id: pengajuan.user_id,
    };

    await sendNotif(notif);

    const resultEmail = {
      user: {
        name: updatedUser.name,
        subject: 'Lolos Seleksi Administrasi',
        description: `Selamat! Anda lolos <b>Administrasi</b>, silahkan lanjutkan dengan mengikuti <b>Tes Kemampuan</b> pada tanggal <b><i>${formatDate.convertDate(data.tanggal_awal, 'id-ID')} - ${formatDate.convertDate(
          data.tanggal_akhir,
          'id-ID'
        )}</i></b>. Link tes dapat ditemukan di menu kegiatan akun Anda.`,
      },
    };

    const html = await nodemailer.getHtml('email/notification.ejs', resultEmail);
    nodemailer.sendMail(updatedUser.email, 'Lolos Seleksi Administrasi', html);

    return 'Sukses mengirim link tes kemampuan';
  }

  const isApproved = data.status.toUpperCase() === 'DITERIMA';
  const updateData = isApproved ? { status_tes_kemampuan: 'diterima', status_wawancara: 'proses', status: 'wawancara' } : { status: 'ditolak', status_tes_kemampuan: 'ditolak' };

  const updatedPengajuan = await prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: { id: pengajuan.user_id },
      data: { status: 'wawancara' },
      select: { name: true, email: true },
    });

    return await prisma.pengajuan.update({
      where: { id: +id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            id: true,
            instansi: { select: { name: true } },
          },
        },
        posisi: {
          select: {
            nama: true,
          },
        },
      },
    });
  });

  if (!updatedPengajuan) {
    throw new ResponseError(400, 'Pengajuan tidak ditemukan');
  }

  const approvalStatus = isApproved ? 'diluluskan' : 'ditolak';
  const approvalEmail = isApproved ? 'Lolos' : 'Gagal';

  const notif = {
    title: `Validasi Tes Kemampuan`,
    subtitle: `Seleksi tes kemampuan dari user ${updatedPengajuan.user.name} dengan asal instansi ${updatedPengajuan.user.instansi.name} telah ${approvalStatus} oleh admin ${req.user.name}`,
    user_id: req.user.id,
  };

  await sendNotif(notif);

  if (!isApproved) {
    const notifUser = {
      title: `Gagal Seleksi Tes Kemampuan`,
      subtitle: `Maaf kamu belum berhasil lulus tahap Tes Kemampuan di posisi ${updatedPengajuan.posisi.nama}. Terima kasih telah berpartisipasi. Tetap semangat!`,
      user_id: pengajuan.user_id,
    };

    await sendNotif(notifUser);
  }

  if (updatedPengajuan.status_tes_kemampuan === 'ditolak') {
    const notifEmail = {
      user: {
        name: updatedPengajuan.user.name,
        description: `Maaf kamu belum berhasil lulus tahap Tes Kemampuan di posisi <b>${updatedPengajuan.posisi.nama}</b>. Terima kasih telah berpartisipasi pada Program ini. Tetap semangat ya!`,
      },
    };

    const html = await nodemailer.getHtml('email/notification.ejs', notifEmail);
    nodemailer.sendMail(updatedPengajuan.user.email, `${approvalEmail} Seleksi Tes Kemampuan`, html);
  }

  return `User ${updatedPengajuan.user.name} ${approvalStatus} di Tes Kemampuan`;
};

const aproveUserWawancara = async (req, id) => {
  if (!id || Object.keys(req.body).length == 0) {
    throw new ResponseError(400, 'pengajuan tidak ditemukan');
  }

  const checkPengajuan = await prisma.pengajuan.findFirst({
    where: { id: +id },
    select: {
      status_tes_kemampuan: true,
      status_wawancara: true,
      user_id: true,
      posisi: { select: { kuota_tersedia: true, nama: true } },
      user: {
        select: {
          is_active: true,
          instansi: { select: { kuota_tersedia: true } },
        },
      },
      periode: { select: { tanggal_pengajuan: true, tanggal_selesai: true } },
    },
  });

  if (req.body.status === 'diterima') {
    if (!checkPengajuan) {
      throw new ResponseError(400, 'pengajuan tidak ditemukan');
    }

    if (checkPengajuan.posisi.kuota_tersedia <= 0 || checkPengajuan.user.instansi.kuota_tersedia <= 0) {
      throw new ResponseError(400, `kuota pendaftaran sudah terpenuhi untuk posisi ${checkPengajuan.posisi.nama}`);
    }

    if (checkPengajuan.status_wawancara === 'diterima') {
      throw new ResponseError(400, 'pengajuan sudah diterima');
    }

    if (checkPengajuan.status_wawancara === 'ditolak') {
      throw new ResponseError(400, 'pengajuan sudah ditolak');
    }
  }

  const data = validate(validator.updateLink, req.body);
  if (!data.status) {
    const [user] = await prisma.$transaction(async (prisma) => {
      await prisma.pengajuan.update({
        where: { id: +id },
        data: {
          status: 'wawancara',
          link_wawancara: data.link,
          tanggal_wawancara: data.tanggal,
        },
      });

      const user = await prisma.user.update({
        where: { id: checkPengajuan.user_id },
        data: {
          status: 'wawancara',
        },
        select: {
          name: true,
          email: true,
        },
      });

      return [user];
    });

    if (!user) {
      throw new ResponseError(400, 'pengajuan tidak ditemukan');
    }

    const notif = {
      title: `Wawancara`,
      subtitle: `Selamat! anda lolos Tes kemampuan, silahkan lanjutkan dengan mengikuti seleksi Wawancara pada tanggal ${formatDate.convertDate(data.tanggal, 'id-ID')}. Link tes dapat ditemukan di menu kegiatan Anda.`,
      user_id: checkPengajuan.user_id,
    };

    await sendNotif(notif);

    const resultEmail = {
      user: {
        name: user.name,
        subject: 'Lolos Seleksi Tes Kemampuan',
        description: `Selamat! anda lolos <b>Tes kemampuan</b>, silahkan lanjutkan dengan mengikuti seleksi <b>Wawancara</b> pada tanggal <b>${formatDate.convertDate(
          data.tanggal,
          'id-ID'
        )}</b>. Link tes dapat ditemukan di menu kegiatan akun Anda.`,
      },
    };

    const html = await nodemailer.getHtml('email/notification.ejs', resultEmail);
    nodemailer.sendMail(user.email, 'Lolos Seleksi Tes Kemampuan', html);

    return 'sukses mengirim link wawancara';
  }

  let pengajuan, kuotaPosisi, kuotaInstansi, user;
  const isApproved = data.status.toUpperCase() === 'DITERIMA';
  const approvalStatus = isApproved ? 'diluluskan' : 'ditolak';
  const approvalEmail = isApproved ? 'Lolos' : 'Gagal';

  if (isApproved) {
    if (checkPengajuan.user.is_active) {
      throw new ResponseError(400, 'user sudah aktif pada posisi lain');
    }
    [pengajuan, kuotaPosisi, kuotaInstansi, user] = await prisma.$transaction(async (prisma) => {
      const pengajuan = await prisma.pengajuan.update({
        where: { id: +id },
        data: {
          status: 'diterima',
          status_wawancara: 'diterima',
          is_active: true,
        },
        include: {
          user: { select: { instansi_id: true } },
        },
      });

      const kuotaPosisi = await prisma.posisi.update({
        where: { id: pengajuan.posisi_id },
        data: {
          kuota_tersedia: {
            decrement: 1,
          },
        },
      });

      const kuotaInstansi = await prisma.instansi.update({
        where: { id: pengajuan.user.instansi_id },
        data: {
          kuota_tersedia: {
            decrement: 1,
          },
        },
      });

      const user = await prisma.user.update({
        where: { id: pengajuan.user_id },
        data: {
          posisi_id: pengajuan.posisi_id,
          is_active: true,
          status: 'lulus',
        },
        include: {
          instansi: { select: { name: true } },
        },
      });

      await prisma.pengajuan.updateMany({
        where: {
          user_id: pengajuan.user_id,
          posisi_id: { not: pengajuan.posisi_id },
          status: { not: 'alumni' },
        },
        data: {
          status: 'ditolak',
          status_administrasi: 'ditolak',
          status_tes_kemampuan: 'ditolak',
          status_wawancara: 'ditolak',
          is_active: false,
        },
      });

      return [pengajuan, kuotaPosisi, kuotaInstansi, user];
    });

    if (!pengajuan || !kuotaPosisi || !kuotaInstansi || !user) {
      throw new ResponseError(400, 'gagal mengupdate status wawancara');
    }

    const notif = {
      title: `Validasi Wawancara`,
      subtitle: `selesksi Wawancara dari user ${user.name} dengan asal instansi ${user.instansi.name} telah ${approvalStatus} oleh admin ${req.user.name}`,
      user_id: req.user.id,
    };

    const notifUser = {
      title: `Selamat! Kamu diterima magang di posisi ${kuotaPosisi.nama}`,
      subtitle: `Cek menu Kegiatanku untuk melihat detail kegiatan`,
      user_id: pengajuan.user_id,
    };

    const resultSendNotif = await sendNotif(notif);
    const resultSendNotifUser = await sendNotif(notifUser);

    const dataIntern = {
      name: user.name,
      username: user.name.split(' ')[0],
      gender: user.gender[0].toUpperCase(),
      religion: user.religion,
      phone: user.phone,
      starDate: checkPengajuan.periode.tanggal_pengajuan,
      endDate: checkPengajuan.periode.tanggal_selesai,
    };

    await inserDataIntern(dataIntern);

    const resultEmail = {
      user: {
        name: user.name,
        // subject: isApproved ? `Selamat Anda ${approvalEmail}` : `Maaf kamu belum berhasil lulus tahap Wawanca`,
        description: `Selamat! anda <b>${approvalEmail}</b> semua tahap Tes, anda diterima di posisi <b>${kuotaPosisi.nama}</b>. Cek menu Kegiatanku di akun anda untuk melihat detail kegiatan.`,
      },
    };

    const html = await nodemailer.getHtml('email/notification.ejs', resultEmail);
    nodemailer.sendMail(user.email, 'Selamat Anda Diterima', html);

    if (!resultSendNotif && !resultSendNotifUser) {
      throw new ResponseError(400, 'notifikasi gagal dikirim');
    }

    return `User ${user.name} berhasil ${approvalStatus} sebagai ${kuotaPosisi.nama}`;
  } else {
    pengajuan = await prisma.pengajuan.update({
      where: { id: +id },
      data: {
        status: 'ditolak',
        status_wawancara: 'ditolak',
      },
      include: {
        user: {
          select: {
            instansi_id: true,
            name: true,
            email: true,
            instansi: { select: { name: true } },
          },
        },
        posisi: {
          select: {
            nama: true,
          },
        },
      },
    });

    if (!pengajuan) {
      throw new ResponseError(400, 'pengajuan tidak ditemukan');
    }

    await prisma.user.update({
      where: { id: checkPengajuan.user_id },
      data: {
        status: 'ditolak',
      },
      select: {
        name: true,
        email: true,
      },
    });

    const resultEmail = {
      user: {
        name: pengajuan.user.name,
        // subject: `Selamat Anda ${approvalEmail}`,
        description: `Maaf kamu belum berhasil lulus tahap Wawancara di posisi ${pengajuan.posisi.nama}. Terima kasih telah berpartisipasi pada Program ini. Tetap semangat ya!`,
      },
    };

    const notifUserGagal = {
      title: `Gagal Seleksi Wawancara`,
      subtitle: `Maaf kamu belum berhasil lulus tahap Wawancara di posisi ${pengajuan.posisi.nama}. Terima kasih telah berpartisipasi. Tetap semangat!`,
      user_id: pengajuan.user_id,
    };

    const resultSendNotifUserGagal = await sendNotif(notifUserGagal);

    if (!resultSendNotifUserGagal) {
      throw new ResponseError(400, 'notifikasi gagal dikirim');
    }

    const html = await nodemailer.getHtml('email/notification.ejs', resultEmail);
    nodemailer.sendMail(pengajuan.user.email, 'Gagal Seleksi Wawancara', html);

    return `User ${pengajuan.user.name} berhasil ${approvalStatus}`;
  }
};

const getMonitoring = async () => {
  const monitoring = await prisma.project.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          posisi: { select: { nama: true } },
        },
      },
      kegiatan: {
        select: {
          posisi: { select: { nama: true } },
          sertifikat: { select: { location: true } },
        },
      },
    },
  });

  if (!monitoring) {
    throw new ResponseError(500, 'data monitoring belom ada');
  }

  const sertifikat = await prisma.storage.findFirst({
    where: { name: 'sertifikat' },
    select: { location: true },
  });

  const user = monitoring.map((project) => {
    return {
      id: project.id,
      name: project.user.name,
      email: project.user.email,
      posisi: project.kegiatan.posisi.nama,
      sertifikat: project.kegiatan.sertifikat?.location ? project.kegiatan.sertifikat?.location : 'null',
      judul: project.judul,
      persentase: project.persentase,
      keterangan: project.keterangan,
    };
  });

  return { user, sertifikat };
};

const insertCertificate = async (req) => {
  const data = validate(validator.insertTemplate, req.body);

  if (req.file) {
    const certificateUrl = `${req.file.filename}`;
    data.location = certificateUrl;
  } else {
    throw new ResponseError(400, `Certificate not found`);
  }

  const checkCertificate = await prisma.storage.findFirst({
    where: { name: { in: data.name } },
  });

  let certificate;

  if (!checkCertificate) {
    certificate = await prisma.storage.create({ data });

    if (!certificate) {
      throw new ResponseError(400, `Certificate not found`);
    }
  } else {
    if (checkCertificate.location) {
      const filePath = path.join(process.cwd(), `storage/sertifikat/${checkCertificate.location}`);

      let file;

      try {
        file = await fs.access(filePath);
      } catch (error) {
        console.error(error);
      }

      if (file) {
        await fs.unlink(filePath, () => {});
      }
    }
    certificate = await prisma.storage.update({
      data: { location: data.location },
      where: { name: checkCertificate.name },
    });
  }

  return 'sukses menambahkan template sertifikat';
};

const insertCertificatePosisi = async (req) => {
  const data = validate(validator.insertTemplatePosisi, req.body);

  if (req.file) {
    const certificateUrl = `${req.file.filename}`;
    data.sertifikat = certificateUrl;
  } else {
    throw new ResponseError(400, `Certificate not found`);
  }

  const checkCertificate = await prisma.posisi.findFirst({
    where: { id: data.id },
    select: { sertifikat: true },
  });

  if (checkCertificate.sertifikat) {
    const filePath = path.join(process.cwd(), `storage/sertifikat/${checkCertificate.sertifikat}`);

    let file;

    try {
      file = await fs.access(filePath);
    } catch (error) {
      console.error(error);
    }

    if (file) {
      await fs.unlink(filePath, () => {});
    }
  }

  await prisma.posisi.update({
    data: { sertifikat: data.sertifikat },
    where: { id: data.id },
  });

  return 'sukses menambahkan template sertifikat nilai';
};

const giveCertificate = async (req) => {
  const { id } = validate(validator.createSertifikat, req.body);

  const certificate = await prisma.storage.findFirst({
    where: { name: 'sertifikat' },
  });

  if (!certificate) {
    throw new ResponseError(404, `template sertifikat belum di masukkan`);
  }

  const checkProject = await prisma.project.findFirst({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          instansi: { select: { id: true, name: true } },
          jurusan: { select: { name: true } },
        },
      },
      kegiatan: {
        include: {
          sertifikat: true,
          periode: true,
          posisi: { select: { nama: true, sertifikat: true } },
        },
      },
    },
  });

  if (!checkProject) {
    throw new ResponseError(404, `project tidak ditemukan gagal memberikan sertifikat`);
  }

  if (checkProject.kegiatan?.sertifikat) {
    throw new ResponseError(400, 'sertifikat sudah diberikan');
  }

  if (checkProject.kegiatan.periode.is_active != false) {
    throw new ResponseError(400, 'gagal mengirim sertifikat');
  }

  if (!checkProject.kegiatan.posisi.sertifikat) {
    throw new ResponseError(400, `template sertifikat nilai untuk posisi ${checkProject.kegiatan.posisi.nama} belum di masukkan`);
  }

  const data = {
    name: checkProject.user.name,
    title: `${checkProject.user.instansi.name} - ${checkProject.user.jurusan.name}`,
    start_date: checkProject.kegiatan.periode.tanggal_pengajuan,
    end_date: checkProject.kegiatan.periode.tanggal_selesai,
  };

  const sertifikat = await generateDocxTemplate(certificate.location, data);
  const file = await mergePDFs(sertifikat, checkProject.kegiatan.posisi.sertifikat);

  await prisma.$transaction(async (prisma) => {
    await prisma.sertifikat.create({
      data: {
        user_id: checkProject.user_id,
        pengajuan_id: checkProject.pengajuan_id,
        location: file,
      },
    });

    await prisma.pengajuan.update({
      where: { id: checkProject.pengajuan_id },
      data: {
        status: 'alumni',
      },
    });

    await prisma.posisi.update({
      where: { id: checkProject.kegiatan.posisi_id },
      data: {
        kuota_tersedia: {
          increment: 1,
        },
      },
    });

    await prisma.instansi.update({
      where: { id: checkProject.user.instansi.id },
      data: {
        kuota_tersedia: {
          increment: 1,
        },
      },
    });

    await prisma.user.update({
      where: { id: checkProject.user_id },
      data: {
        status: 'alumni',
        is_active: false,
        posisi_id: null,
      },
    });

    await prisma.periode.update({
      where: { id: checkProject.kegiatan.periode_id },
      data: {
        is_active: true,
      },
    });
  });

  return 'sukses memberikan sertifikat';
};

const getAllAlumni = async () => {
  const alumniData = await prisma.pengajuan.findMany({
    where: { is_active: true, status: 'alumni' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          instansi: { select: { name: true } },
          nim: true,
          religion: true,
          gender: true,
          phone: true,
          jurusan: { select: { name: true } },
        },
      },
      periode: {
        select: {
          tanggal_selesai: true,
          tanggal_pengajuan: true,
        },
      },
      posisi: {
        select: {
          nama: true,
        },
      },
    },
  });

  const result = alumniData.map(({ id, user, periode, posisi }) => ({
    alumni: {
      id,
      posisi: posisi.nama,
      periode: `${periode.tanggal_pengajuan} - ${periode.tanggal_selesai}`,
      user: {
        ...user,
        jurusan: user.jurusan?.name,
        instansi: user.instansi?.name,
        posisi: user.posisi?.nama,
        tanggal_mulai: periode.tanggal_pengajuan,
        tanggal_selesai: periode.tanggal_selesai,
      },
    },
  }));

  return result;
};

const getAllAdmin = async () => {
  const roleId = await prisma.role.findUnique({
    where: {
      name: 'ADMIN',
    },
    select: {
      id: true,
    },
  });

  const admin = await prisma.user.findMany({
    where: { role_id: roleId.id },
    select: {
      id: true,
      name: true,
      email: true,
      activation: true,
    },
  });

  if (!admin) {
    throw new ResponseError(500, 'data admin tidak ada');
  }

  return admin;
};

const createAdmin = async (req) => {
  const data = validate(validator.createAdmin, req.body);

  const admin = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      role_id: 1,
      activation: true,
    },
  });

  if (!admin) {
    throw new ResponseError(500, 'gagal membuat admin');
  }

  return admin;
};

const updateAdmin = async (req) => {
  const { id } = req.params;
  if (!id) {
    throw new ResponseError(400, 'admin tidak ditemukan');
  }

  const data = validate(validator.updateAdmin, req.body);

  const admin = await prisma.user.update({
    data: { activation: data.activation },
    where: { id: +id },
  });

  if (!admin) {
    throw new ResponseError(500, 'gagal mengubah admin');
  }

  return 'Sukses Mengubah Admin';
};

const deleteAdmin = async (req) => {
  const { id } = req.params;

  if (!id) {
    throw new ResponseError(400, 'admin tidak ditemukan');
  }

  const admin = await prisma.user.delete({
    where: { id: +id },
  });

  if (!admin) {
    throw new ResponseError(500, 'gagal menghapus admin');
  }

  return 'Sukses Menghapus Admin';
};

export default {
  getAllDashboard,
  getAllUser,
  getMonitoring,
  approveProject,
  aproveUserAdministrasi,
  aproveUserKemampuan,
  aproveUserWawancara,
  insertCertificate,
  insertCertificatePosisi,
  giveCertificate,
  getAllAlumni,
  getAllAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
