import notifService from '../service/notification.js';

export default class Notifikasi {
  static notification = async (req, res, next) => {
    try {
      const result = await notifService.notification(req.user.id);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data notifikasi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static readNotification = async (req, res, next) => {
    try {
      const result = await notifService.readNotification(req.user.id);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data notifikasi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static checkNotification = async (req, res, next) => {
    try {
      const result = await notifService.checkNotification(req.user.id);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data notifikasi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
