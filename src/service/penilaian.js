import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

const store = async (data) => {
  data.forEach(async (item) => {
    const checkData = await prisma.evaluation.findFirst({
      where: {
        evaluation_name: item.evaluation_name,
        pengajuan_id: item.pengajuan_id
      }
    });

    if (checkData) {
      return;
    }

    await prisma.evaluation.create({
      data: {
        pengajuan_id: item.pengajuan_id,
        evaluation_name: item.evaluation_name,
        evaluation_type: item.evaluation_type,
        value: item.value
      }
    })

  });
};

const get = async (req) => {
  const mentee_id = await prisma.user.findMany({
    where: {
      mentor_id: req.user.id
    },
    select: {
      id: true,
    }
  });

  const pengajuan = await prisma.pengajuan.findMany({
    where: {
      user_id: {
        in: mentee_id.map((mentee) => mentee.id)
      },
      status: "diterima"
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
          mentor: true,
          Testimonial: {
            select: {
              id: true
            }
          }
        }
      },
      posisi: {
        select: {
          id: true,
          nama: true,
        }
      },
      Evaluation: true,
      project: {
        select: {
          ProjectDetail: {
            select: {
              percentage: true,
              status: true
            }
          }
        }
      },
    }
  });

  const check = pengajuan.map(item => {
    return {
      project: item.project.some(project => project.ProjectDetail.some(project_detail => project_detail.percentage === 100 && project_detail.status === 'diterima')),
      user: item.user.Testimonial.length > 0,
      evaluation: item.Evaluation.length > 0,
      admin_evaluation: item.Evaluation.some(item => item.evaluation_type === 'personal'),
    }
  })

  const pengajuanWithCheck = pengajuan.map((item, index) => {
    return {
      ...item,
      check: check[index]
    }
  })

  return pengajuanWithCheck;
};

const update = async (data, id) => {
  const evaluation_id = await prisma.evaluation.findMany({
    where: {
      pengajuan_id: Number(id)
    },
    select: {
      id: true
    },
  });

  const list_evaluation_id_db = evaluation_id.map(evaluation => evaluation.id);
  const list_evaluation_id_param = data.map(item => item.id)
  const diff = list_evaluation_id_db.filter(id => !list_evaluation_id_param.includes(id));

  if (diff.length > 0) {
    diff.map(async (item) => {
      await prisma.evaluation.delete({
        where: {
          id: item
        }
      })
    })
  }

  const promises = data.map(async (item) => {
    if (item.id == 0) {
      await prisma.evaluation.create({
        data: {
          evaluation_name: item.evaluation_name,
          evaluation_type: item.evaluation_type,
          value: item.value,
          pengajuan_id: item.pengajuan_id
        }
      })

      return;
    }

    await prisma.evaluation.update({
      where: {
        id: Number(item.id)
      },
      data: {
        evaluation_name: item.evaluation_name,
        evaluation_type: item.evaluation_type,
        value: Number(item.value)
      }
    });
  });

  await Promise.all(promises);
}

const getDetail = async (id) => {
  const data = await prisma.pengajuan.findFirst({
    where: {
      id: Number(id)
    },
    select: {
      Evaluation: true
    }
  })

  if (!data) {
    throw new ResponseError(400, 'Data tidak ditemukan');
  }

  return data;
};

const getTemplate = async (id) => {
  const pengajuan = await prisma.pengajuan.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      posisi: {
        select: {
          EvaluationCriteriaTemplate: true,
        }
      }
    }
  })
  return pengajuan;
}

const destroy = async (id) => {
  const find = await prisma.evaluation.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!find) {
    throw new ResponseError(404, "Data not found");
  }


  await prisma.evaluation.delete({
    where: {
      id: Number(id)
    }
  });
};

const getAllMentees = async () => {
  const mentee_id = await prisma.user.findMany({
    where: {
      mentor_id: {
        not: null,
      }
    },
    select: {
      id: true,
    }
  });

  const pengajuan = await prisma.pengajuan.findMany({
    where: {
      user_id: {
        in: mentee_id.map((mentee) => mentee.id)
      },
      status: "diterima"
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
          mentor: true,
          Testimonial: {
            select: {
              id: true
            }
          }
        }
      },
      posisi: {
        select: {
          id: true,
          nama: true,
        }
      },
      Evaluation: {
        select: {
          id: true
        }
      },
      project: {
        select: {
          ProjectDetail: {
            select: {
              percentage: true,
              status: true
            }
          }
        }
      },
    }
  });

  const check = pengajuan.map(item => {
    return {
      project: item.project.some(project => project.ProjectDetail.some(project_detail => project_detail.percentage === 100 && project_detail.status === 'diterima')),
      user: item.user.Testimonial.length > 0,
      evaluation: item.Evaluation.length > 0
    }
  })

  const pengajuanWithCheck = pengajuan.map((item, index) => {
    return {
      ...item,
      check: check[index]
    }
  })

  return pengajuanWithCheck;
}

export default { store, get, getDetail, destroy, update, getTemplate, getAllMentees };