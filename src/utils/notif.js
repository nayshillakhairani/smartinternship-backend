import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

const sendNotif = async (notification) => {
  try {
    // Simpan notifikasi ke database menggunakan Prisma
    await prisma.notification.create({
      data: {
        title: notification.title,
        subtitle: notification.subtitle,
        user_id: notification.user_id
      },
    });

    // Jika berhasil, kembalikan nilai true
    return true;
  } catch (err) {
    // Jika terjadi kesalahan, lemparkan objek error ResponseError
    console.log(err)
    throw new ResponseError(400, "Gagal mengirim notifikasi");
  }
};

export default sendNotif;
