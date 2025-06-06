import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";

const get = async (req) => {
  const posisi = await prisma.posisi.findMany({
    include: {
      EvaluationCriteriaTemplate: true
    }
  });

  return posisi;
};

const getDetail = async (id) => {
  const template = await prisma.evaluationCriteriaTemplate.findMany({
    where: {
      position_id: Number(id)
    }
  })
  return template;
};

const store = async (data) => {

  const evaluationCriteriaTemplate = await prisma.evaluationCriteriaTemplate.createMany({
    data
  });

  return evaluationCriteriaTemplate;

};

const update = async (data, id) => {
  const checkPosition = await prisma.posisi.findFirst({
    where: {
      id: Number(id)
    }
  });

  if (!checkPosition) {
    throw new ResponseError(404, "Tidak ada data posisi");
  }

  const checkEvaluationTemplate = await prisma.evaluationCriteriaTemplate.findMany({
    where: {
      position_id: Number(id)
    },
    select: {
      id: true
    }
  })

  const id_data = data.map(item => item.id);
  const id_template = checkEvaluationTemplate.map(item => item.id)
  const diff = id_template.filter(id => !id_data.includes(id))

  if (diff.length > 0) {
    await prisma.evaluationCriteriaTemplate.deleteMany({
      where: {
        id: {
          in: diff
        }
      }
    })
  }

  data.map(async (item) => {
    if (Number(item.id) === 0) {
      await prisma.evaluationCriteriaTemplate.create({
        data: {
          position_id: Number(id),
          evaluation_name: item.evaluation_name,
          evaluation_type: item.evaluation_type
        }
      })

      return;
    }

    await prisma.evaluationCriteriaTemplate.update({
      where: {
        id: Number(item.id)
      },
      data: {
        evaluation_name: item.evaluation_name,
        evaluation_type: item.evaluation_type
      }
    })
  })

  return ;
}

export default { store, get, getDetail, update };