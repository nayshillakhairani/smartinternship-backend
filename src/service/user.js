import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';
import { validate } from '../validation/validation.js';
import fs from 'fs/promises';
import path from 'path';
import validation from '../validation/user.js';
import bcrypt from 'bcrypt';
import sharp from 'sharp';

const updateUser = async (request) => {
  const data = validate(validation.updateUser, request.body);

  if (request.file) {
    const imageUrl = `${request.file.filename}`;
    data.surat = imageUrl;
  }

  if (Object.keys(data).length === 0) {
    throw new ResponseError(400, 'update gagal, Anda tidak menginputkan nilai');
  }

  if (data.jurusan_id) {
    const checkJurusan = await prisma.jurusan.findUnique({
      where: { id: data.jurusan_id },
    });
    if (!checkJurusan) throw new ResponseError(404, 'jurusan tidak ditemukan');
  }

  if (data.instansi_id) {
    const checkInstansi = await prisma.instansi.findUnique({
      where: { id: data.instansi_id },
    });
    if (!checkInstansi) throw new ResponseError(404, 'instansi tidak ditemukan');
  }

  const check = await prisma.user.findUnique({
    where: { id: request.user.id },
  });

  if (!check) throw new ResponseError(404, 'user tidak ditemukan');

  const checkpengajuan = await prisma.pengajuan.findFirst({
    where: {
      AND: [{ user_id: check.id }, { is_active: false }, { status: { not: 'ditolak' } }],
    },
  });

  if (checkpengajuan) {
    throw new ResponseError(400, 'tidak bisa update profil jika pengajuan sudah terdata!');
  }

  const checkPengajuanAktif = await prisma.pengajuan.findFirst({
    where: {
      AND: [{ user_id: check.id }, { is_active: true }, { status: 'diterima' }],
    },
  });

  if (checkPengajuanAktif) {
    throw new ResponseError(400, 'Tidak bisa update profil, Anda sedang aktif magang!');
  }

  if (check.surat && data.surat) {
    await fs.unlink(path.join(process.cwd(), `storage/dokumen/${check.surat}`), () => { });
  }

  function resetTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  if (resetTime(new Date(data.tanggal_pengajuan)) < resetTime(new Date())) {
    throw new ResponseError(422, "Tanggal tidak sesuai");
  }

  if (new Date(data.tanggal_selesai) < new Date(data.tanggal_pengajuan)) {
    throw new ResponseError(422, "Tanggal tidak sesuai");
  }

  const dataPeriod = {
    tanggal_pengajuan: data.tanggal_pengajuan,
    tanggal_selesai: data.tanggal_selesai,
  };

  delete data.tanggal_pengajuan;
  delete data.tanggal_selesai;
  delete data.jenis_pengajuan;

  if (!data.periode_id) {
    dataPeriod.user_id = check.id;
    const updatePeriod = await prisma.periode.create({
      data: dataPeriod,
    });

    delete data.periode_id;
    const updateUser = await prisma.user.update({
      data: data,
      where: { id: request.user.id },
    });

    if (updateUser || updatePeriod) {
      return true;
    } else {
      throw new ResponseError(404, 'update user gagal');
    }
  }

  const checkPeriod = await prisma.periode.findFirst({
    where: { AND: [{ id: data.periode_id }, { is_active: false }] },
  });

  delete data.periode_id;
  const updateUser = await prisma.user.update({
    data: data,
    where: { id: request.user.id },
  });

  let updatePeriod;
  if (checkPeriod) {
    updatePeriod = await prisma.periode.update({
      data: dataPeriod,
      where: { id: checkPeriod.id },
    });
  } else {
    dataPeriod.user_id = check.id;
    if (
      dataPeriod.tanggal_pengajuan &&
      dataPeriod.tanggal_selesai
      // dataPeriod.jenis_pengajuan
    ) {
      updatePeriod = await prisma.periode.create({
        data: dataPeriod,
      });
    }
  }

  if (updateUser || updatePeriod) {
    return true;
  } else {
    throw new ResponseError(404, 'update user gagal');
  }
};

const updateAdmin = async (id, data) => {
  if (data.name && data.name.trim() === '') {
    throw new ResponseError(400, 'Nama harus diisi');
  }

  const result = await prisma.user.update({
    where: { id },
    data,
  });

  if (result) {
    return true;
  } else {
    throw new ResponseError(404, 'update user gagal');
  }
};

const getAll = async () => {
  const users = await prisma.user.findMany();
  if (!users) throw new ResponseError(500, 'data users tidak ada');

  return users;
};

const getById = async (id) => {
  if (!id) {
    throw new ResponseError(400, 'id user tidak boleh kosong');
  }
  const user = await prisma.user.findFirst({
    where: { id: +id },

    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      nim: true,
      phone: true,
      religion: true,
      surat: true,
      posisi_id: true,
      image: true,
      status: true,
      cv: true,
      status: true,
      mentor_id: true,
      jurusan: { select: { id: true, name: true } },
      instansi: { select: { id: true, name: true } },
      posisi: {
        select: {
          id: true,
          nama: true,
        },
      },
      pengajuan: true
    },
  });

  if (!user) throw new ResponseError(404, `user dengan id ${id} tidak ada`);

  const periode = await prisma.periode.findFirst({
    where: { AND: [{ user_id: user.id }, { is_active: false }] },
  });

  return { ...user, periode: periode };
};

const deleteById = async (id) => {
  if (!id) {
    throw new ResponseError(400, 'id user tidak boleh kosong');
  }

  await prisma.user.update({ 
    where: { id: +id },
    data: {
      image: null
    }
  });

  return true;
};

const changePassword = async (request) => {
  const data = validate(validation.changePassword, request.body);

  const checkPassword = await prisma.user.findUnique({
    where: { id: request.user.id },
  });

  const isPasswordValid = await bcrypt.compare(data.password, checkPassword.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, 'password sekarang yang anda masukkan tidak sesuai!');
  }

  const hashPassword = await bcrypt.hash(data.new_password, 10);

  const updated = await prisma.user.update({
    data: { password: hashPassword },
    where: { id: request.user.id },
  });
  if (!updated) {
    throw new ResponseError(400, 'gagal mengubah sandi');
  }

  return 'ganti password suksess';
};

const uploadSurat = async (req) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.user.id),
    },
  });

  if (!user) {
    throw new ResponseError(400, 'data user tidak ditemukan');
  }

  if (user.is_active) {
    throw new ResponseError(400, 'Tidak dapat melakukan update profile anda sedang aktif magang');
  }

  if (user.surat) {
    const fileSurat = path.join(process.cwd(), `storage/dokumen/${user.surat}`);

    await fs.access(fileSurat).then(async () => await fs.unlink(fileSurat, () => { }));
  }

  const uploadSurat = await prisma.user.update({
    where: {
      id: Number(req.user.id),
    },
    data: {
      surat: req.file.filename,
    },
  });

  return uploadSurat;
};

const uploadCv = async (req) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.user.id),
    },
  });

  if (!user) {
    throw new ResponseError(400, 'data user tidak ditemukan');
  }

  if (user.cv) {
    const fileCv = path.join(process.cwd(), `storage/dokumen/${user.cv}`);

    await fs.access(fileCv).then(async () => await fs.unlink(fileCv, () => { }));
  }

  const uploadCv = await prisma.user.update({
    where: {
      id: Number(req.user.id),
    },
    data: {
      cv: req.file.filename,
    },
  });

  return uploadCv;
};

const uploadImage = async (req) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.user.id),
    },
  });

  if (!user) {
    throw new ResponseError(400, 'data user tidak ditemukan');
  }

  if (user.image) {
    const fileImage = path.join(process.cwd(), `storage/image/${user.image}`);

    await fs.access(fileImage)
      .then(async () => await fs.unlink(fileImage))
      .catch((e) => {
        return e;
      });
  }

  const fileImage = path.join(process.cwd(), `storage/image/${req.file.filename}`);

  const fileResizedBuffer = await sharp(fileImage).resize(480, 480).toFormat('webp').toBuffer();

  const fileName = `${Date.now()}.webp`;

  const filePath = path.join(process.cwd(), `storage/image/${fileName}`);

  await fs.writeFile(filePath, fileResizedBuffer).then(async () => await fs.unlink(fileImage));

  sharp.cache(false);

  const uploadImage = await prisma.user.update({
    where: {
      id: Number(req.user.id),
    },
    data: {
      image: fileName,
    },
  });

  return uploadImage;
};

export default { uploadSurat, uploadImage, uploadCv, updateUser, getAll, getById, deleteById, changePassword, updateAdmin };
