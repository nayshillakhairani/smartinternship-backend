import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';

const notification = async (id) => {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      user_id: id,
    },
  });

  if (!notifications || notifications.length === 0) {
    throw new ResponseError(404, 'Notifikasi tidak ditemukan');
  }

  return notifications;
};

const readNotification = async (id) => {
  const unRead = await prisma.notification.count({
    where: {
      user_id: id,
      is_viewed: false
    },
  });

  if (unRead === 0) {
    throw new ResponseError(400, 'Semua notifikasi sudah dibaca');
  }

  const result = await prisma.notification.updateMany({
    where: {
      user_id: id,
      is_viewed: false
    },
    data: {
      is_viewed: true
    }
  });

  return result;
};

const checkNotification = async (id) => {
  const result = await prisma.notification.count({
    where: {
      user_id: id,
      is_viewed: false
    },
  });

  return result;
};

export default { notification, readNotification, checkNotification };
