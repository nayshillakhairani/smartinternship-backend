import prisma from '../application/database.js';
import path from 'path';
import ejs from 'ejs';
import generatePdf from '../utils/generatePdf.js';
import { capitalize } from '../utils/capitalize.js';
// import convertDate from '../utils/formatDate.js';
import formatDate from '../utils/formatDate.js';
import ResponseError from '../error/response-error.js';

const getAllUserActive = async () => {
  const results = await prisma.pengajuan.findMany({
    where: { is_active: true, status: 'diterima' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          posisi: {
            select: {
              nama: true,
            },
          },
          mentor: true,
          instansi: {
            select: {
              name: true,
            },
          },
        },
      },
      periode: true,
    },
  });

  return results;
};

const getAllUserRegister = async () => {
  const results = await prisma.pengajuan.findMany({
    where: { is_active: false, status: { in: ['wawancara', 'administrasi', 'tes_kemampuan'] } },
    include: {
      posisi: {
        select: {
          nama: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          instansi: {
            select: {
              name: true,
            },
          },
        },
      },
      periode: true,
    },
  });

  return results;
};

const getGrafikUserRegister = async () => {
  const results = await prisma.pengajuan.findMany({
    where: { is_active: false, status: { in: ['wawancara', 'administrasi', 'tes_kemampuan'] } },
    include: {
      user: {
        select: {
          name: true,
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
      periode: true,
    },
  });

  return results;
};

const getFilteredUserActive = async (req) => {
  if (req.detail === 'User Aktif') {
    const results = await prisma.pengajuan.findMany({
      where: { is_active: true, status: 'diterima' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
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
        periode: true,
      },
    });

    return results;
  }

  const posisi_id = await prisma.posisi.findFirst({
    where: {
      nama: req.detail,
    },
    select: {
      id: true,
    },
  });

  const results = await prisma.pengajuan.findMany({
    where: {
      is_active: true,
      posisi_id: posisi_id.id,
      status: 'diterima',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
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
          jurusan: {
            select: {
              name: true,
            },
          },
        },
      },
      periode: true,
    },
  });

  return results;
};

const getFilteredUserRegister = async (req) => {
  if (req.detail === 'User Register') {
    const results = await prisma.pengajuan.findMany({
      where: { is_active: false, status: { in: ['wawancara', 'administrasi', 'tes_kemampuan'] } },
      include: {
        posisi: {
          select: {
            nama: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            instansi: {
              select: {
                name: true,
              },
            },
          },
        },
        periode: true,
      },
    });

    return results;
  }

  const posisi_id = await prisma.posisi.findFirst({
    where: {
      nama: req.detail,
    },
    select: {
      id: true,
    },
  });

  const results = await prisma.pengajuan.findMany({
    where: {
      is_active: false,
      posisi_id: posisi_id.id,
      status: { in: ['wawancara', 'administrasi', 'tes_kemampuan'] },
    },
    include: {
      posisi: {
        select: {
          nama: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          instansi: {
            select: {
              name: true,
            },
          },
          jurusan: {
            select: {
              name: true,
            },
          },
        },
      },
      periode: true,
    },
  });

  return results;
};

const getFilteredAlumni = async (req) => {
  let alumniData;

  if (req.detail === 'Alumni') {
    alumniData = await prisma.pengajuan.findMany({
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
          select: { nama: true },
        },
      },
    });
  } else {
    const posisi = await prisma.posisi.findFirst({
      where: { nama: req.detail },
      select: { id: true },
    });

    if (!posisi) {
      throw new ResponseError(400, `Posisi dengan nama ${req.detail} tidak ditemukan`);
    }

    alumniData = await prisma.pengajuan.findMany({
      where: { is_active: true, status: 'alumni', posisi_id: posisi.id },
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
          select: { nama: true },
        },
      },
    });
  }

  const result = alumniData.map(({ id, user, periode, posisi }) => ({
    alumni: {
      id,
      posisi: posisi.nama,
      periode: `${periode.tanggal_pengajuan} - ${periode.tanggal_selesai}`,
      user: {
        ...user,
        jurusan: user.jurusan?.name,
        instansi: user.instansi?.name,
      },
    },
  }));

  return result;
};

const exportDataAlumni = async (data) => {
  const whereConditionPengajuan = {
    is_active: true,
    status: { in: 'alumni' },
  };

  let sortCondition = {
    user: {
      name: 'asc'
    }
  }

  if (data.posisi) {
    whereConditionPengajuan.posisi = {
      nama: data.posisi
    };
  }

  if (data.tanggal_pengajuan || data.tanggal_selesai) {
    const startDate = data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan).toISOString().split('T')[0] : undefined;
    const endDate = data.tanggal_selesai ? new Date(data.tanggal_selesai).toISOString().split('T')[0] : undefined;
    whereConditionPengajuan.periode = {
      tanggal_pengajuan: {
        gte: startDate
      },
      tanggal_selesai: {
        lte: endDate
      },
    };
  }

  if (data.instansi) {
    if (!whereConditionPengajuan.user) {
      whereConditionPengajuan.user = {};
    }
    whereConditionPengajuan.user.instansi = {
      name: data.instansi
    };
  }

  if (data.sort) {
    sortCondition = {
      user: {
        name: data.sort === 'Ascending' ? 'asc' : data.sort === 'Descending' ? 'desc' : ''
      }
    }
  }

  const alumniData = await prisma.pengajuan.findMany({
    where: whereConditionPengajuan,
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
    orderBy: sortCondition
  });

  if (alumniData.length === 0) {
    throw new ResponseError(404, 'Belum ada data Alumni');
  }

  const structuredData = {
    datas: alumniData.map(item => ({
      nama: item.user.name,
      email: item.user.email,
      instansi: item.user.instansi.name,
      posisi: item.posisi.nama,
      periode: `${formatDate.convertDate(item.periode.tanggal_pengajuan, 'id-ID')} - ${formatDate.convertDate(item.periode.tanggal_selesai, 'id-ID')}`
    })),
    meta: {
      judul: 'Laporan Data Alumni',
      posisi: capitalize(data.posisi ? data.posisi : 'Semua Posisi'),
      tanggal: formatDate.convertDate(new Date(), 'id-ID')
    }
  };

  const filePath = path.join(process.cwd(), 'src/views/table/index.ejs');
  const html = await ejs.renderFile(filePath, { structuredData: structuredData });
  const file_evaluation = await generatePdf(html);
  const url = path.join(process.cwd(), '/storage/temp/', file_evaluation)

  return url;
}

const exportDataAktif = async (data) => {
  const whereCondition = {
    is_active: true,
    status: 'diterima',
  };

  let sortCondition = {
    user: {
      name: 'asc'
    }
  }

  if (data.posisi) {
    whereCondition.posisi = {
      nama: data.posisi
    };
  }

  if (data.tanggal_pengajuan || data.tanggal_selesai) {
    const startDate = data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan).toISOString().split('T')[0] : undefined;
    const endDate = data.tanggal_selesai ? new Date(data.tanggal_selesai).toISOString().split('T')[0] : undefined;
    whereCondition.periode = {
      tanggal_pengajuan: {
        gte: startDate
      },
      tanggal_selesai: {
        lte: endDate
      },
    };
  }

  if (data.instansi) {
    if (!whereCondition.user) {
      whereCondition.user = {};
    }
    whereCondition.user.instansi = {
      name: data.instansi
    };
  }

  if (data.sort) {
    sortCondition = {
      user: {
        name: data.sort === 'Ascending' ? 'asc' : data.sort === 'Descending' ? 'desc' : ''
      }
    }
  }

  const datas = await prisma.pengajuan.findMany({
    where: whereCondition,
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
    orderBy: sortCondition
  });

  if (datas.length === 0) {
    throw new ResponseError(404, 'Data tidak ditemukan');
  }

  const structuredData = {
    datas: datas.map(item => ({
      nama: item.user.name,
      email: item.user.email,
      instansi: item.user.instansi.name,
      posisi: item.posisi.nama,
      periode: `${formatDate.convertDate(item.periode.tanggal_pengajuan, 'id-ID')} - ${formatDate.convertDate(item.periode.tanggal_selesai, 'id-ID')}`
    })),
    meta: {
      judul: 'Laporan Peserta Magang Aktif',
      posisi: capitalize(data.posisi ? data.posisi : 'Semua Posisi'),
      tanggal: formatDate.convertDate(new Date(), 'id-ID')
    }
  };

  const filePath = path.join(process.cwd(), 'src/views/table/index.ejs');
  const html = await ejs.renderFile(filePath, { structuredData: structuredData });
  const file_evaluation = await generatePdf(html);
  const url = path.join(process.cwd(), '/storage/temp/', file_evaluation)

  return url;
}

const exportDataPendaftar = async (data) => {
  const whereCondition = {
    is_active: false,
    status: { in: ['wawancara', 'administrasi', 'tes_kemampuan'] },
  };

  let sortCondition = {
    user: {
      name: 'asc'
    }
  }

  if (data.posisi) {
    whereCondition.posisi = {
      nama: data.posisi
    };
  }

  if (data.tanggal_pengajuan || data.tanggal_selesai) {
    const startDate = data.tanggal_pengajuan ? new Date(data.tanggal_pengajuan).toISOString().split('T')[0] : undefined;
    const endDate = data.tanggal_selesai ? new Date(data.tanggal_selesai).toISOString().split('T')[0] : undefined;
    whereCondition.periode = {
      tanggal_pengajuan: {
        gte: startDate
      },
      tanggal_selesai: {
        lte: endDate
      },
    };
  }

  if (data.instansi) {
    if (!whereCondition.user) {
      whereCondition.user = {};
    }
    whereCondition.user.instansi = {
      name: data.instansi
    };
  }

  if (data.sort) {
    sortCondition = {
      user: {
        name: data.sort === 'Ascending' ? 'asc' : data.sort === 'Descending' ? 'desc' : ''
      }
    }
  }

  const datas = await prisma.pengajuan.findMany({
    where: whereCondition,
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
    orderBy: sortCondition
  });

  if (datas.length === 0) {
    throw new ResponseError(404, 'Belum ada data pendaftar');
  }

  const structuredData = {
    datas: datas.map(item => ({
      nama: item.user.name,
      email: item.user.email,
      instansi: item.user.instansi.name,
      posisi: item.posisi.nama,
      periode: `${formatDate.convertDate(item.periode.tanggal_pengajuan, 'id-ID')} - ${formatDate.convertDate(item.periode.tanggal_selesai, 'id-ID')}`
    })),
    meta: {
      judul: 'Laporan Peserta Pendaftar',
      posisi: capitalize(data.posisi ? data.posisi : 'Semua Posisi'),
      tanggal: formatDate.convertDate(new Date(), 'id-ID')
    }
  };

  const filePath = path.join(process.cwd(), 'src/views/table/index.ejs');
  const html = await ejs.renderFile(filePath, { structuredData: structuredData });

  const file_evaluation = await generatePdf(html);
  const url = path.join(process.cwd(), '/storage/temp/', file_evaluation)

  return url;
}

const exportDataMentee = async (mentor_id) => {
  const mentor = await prisma.user.findFirst({
    where: {
      id: Number(mentor_id)
    },
    select: {
      name: true
    }
  });

  const datas = await prisma.user.findMany({
    where: {
      is_active: true,
      mentor_id: Number(mentor_id)
    },
    include: {
      posisi: true,
      periode: true,
      instansi: true,
      mentor: mentor_id
    }
  });

  if (datas.length === 0) {
    throw new ResponseError(404, 'Belum ada data Mentee');
  }

  const structuredData = {
    datas: datas.map(item => ({
      nama: item.name,
      email: item.email,
      instansi: item.instansi.name,
      posisi: item.posisi.nama,
      periode: `${item.periode[0].tanggal_pengajuan} - ${item.periode[0].tanggal_selesai}`
    })),
    meta: {
      judul: 'Laporan Data Mentee',
      mentor: mentor.name,
      posisi: 'Semua Posisi',
      tanggal: formatDate.convertDate(new Date(), 'id-ID')
    }
  };

  const filePath = path.join(process.cwd(), 'src/views/table/index.ejs');
  const html = await ejs.renderFile(filePath, { structuredData: structuredData });

  const file_evaluation = await generatePdf(html);
  const url = path.join(process.cwd(), '/storage/temp/', file_evaluation)

  return url;
}

export default { getAllUserActive, getAllUserRegister, getFilteredUserActive, getGrafikUserRegister, exportDataAlumni, exportDataAktif, exportDataPendaftar, exportDataMentee, getFilteredUserRegister, getFilteredAlumni };
