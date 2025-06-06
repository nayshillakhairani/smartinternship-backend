import express from "express";
import routeAuth from "./auth.js";
import routeUser from "./user.js";
import routePosisi from "./posisi.js";
import routeInstansi from "./instansi.js";
import routePengajuan from "./pengajuan.js";
import routeKegiatan from "./kegiatan.js";
import routeJurusan from "./jurusan.js";
import routeProject from "./project.js";
import routeAdmin from "./admin.js";
import routeNotification from "./notification.js";
import routeAksesManager from "./akses_manager.js";
import routerCmsBeranda from "./cms_beranda.js";
import routerCmsArticle from "./cms_artikel.js";
import routerDetailProject from "./detail_project.js";
import routerMonitoring from "./monitoring.js";
import routerTestimoni from "./testimoni.js";
import routerPenilaian from "./penilaian.js";
import routerTemplateSertifikat from "./sertifikat_template.js";
import routerTemplatePenilaian from "./penilaian_template.js";
import routerTemplateKriteriaPenilaian from "./kriteria_penilaian_template.js";
import routerSertifikat from "./sertifikat.js";
import routerMentor from "./mentor.js";
import routerDashboardAdmin from "./dashboard_admin.js";

const router = express.Router();

router.use(routeAuth);
router.use(routeAdmin);
router.use(routeUser);
router.use(routePosisi);
router.use(routePengajuan);
router.use(routeInstansi);
router.use(routeKegiatan);
router.use(routeJurusan);
router.use(routeProject);
router.use(routeNotification);
router.use(routeAksesManager);
router.use(routerCmsBeranda);
router.use(routerCmsArticle);
router.use(routerDetailProject);
router.use(routerMonitoring);
router.use(routerTestimoni);
router.use(routerPenilaian);
router.use(routerTemplateSertifikat);
router.use(routerTemplatePenilaian);
router.use(routerTemplateKriteriaPenilaian);
router.use(routerSertifikat);
router.use(routerMentor);
router.use(routerDashboardAdmin);

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "selamat datang di api server smart internship",
  });
});

export default router;
