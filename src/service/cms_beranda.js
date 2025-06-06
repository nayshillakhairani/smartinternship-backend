import fs from 'fs';
import path from 'path';
import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';

const get = async () => {
  const result = await prisma.cmsDashboard.findMany({
    where: {
      parent_id: null,
    },
    include: {
      sub_contents: true,
    },
  });

  return result;
};

const getDetail = async (id) => {
  const result = await prisma.cmsDashboard.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      sub_contents: true,
    },
  });

  if (!result) {
    throw new ResponseError(404, 'Data not found');
  }

  return result;
};

const update = async (data, id) => {
  const phoneRegex = /^\+62\d{9,11}$/;
  if (data.phone && !phoneRegex.test(data.phone)) {
    throw new ResponseError(400, 'Gunakan format +62 dan Nomor Telepon yang valid');
  }

  const find = await prisma.cmsDashboard.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!find) {
    throw new ResponseError(404, 'Data not found');
  }

  if (find.parent_id !== null && data.content === '') {
    throw new ResponseError(404, 'Content harus diisi!');
  }

  if (data.image) {
    if (find.image) {
      const filePath = path.join(process.cwd(), `storage/${find.image}`);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }
    data.image = `/cms/beranda/${data.image.filename}`;
  }

  const result = await prisma.cmsDashboard.update({
    where: {
      id: Number(id),
    },
    data: {
      title: data.title,
      content: data.content,
      element: data.element,
      parent_id: data.parent_id,
      image: data.image,
      email: data.email,
      phone: data.phone
    },
  });

  return result;
};

const store = async (data, file) => {
  if (file) {
    const result = await prisma.cmsDashboard.create({
      data: {
        title: data.title,
        content: data.content,
        image: `/cms/beranda/${file.filename}`,
        element: data.element,
        parent_id: data.parent_id,
      },
    });

    return result;
  }
  const result = await prisma.cmsDashboard.create({
    data: {
      title: data.title,
      content: data.content,
      element: data.element,
      parent_id: data.parent_id,
    },
  });

  return result;
};

const destroy = async (id) => {
  const find = await prisma.cmsDashboard.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!find) {
    throw new ResponseError(404, 'Data not found');
  }

  if (find.image) {
    const filePath = path.join(process.cwd(), `storage/${find.image}`);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
  }
  
  await prisma.cmsDashboard.delete({
    where: {
      id: Number(id),
    },
  });
};

export default {
  get,
  getDetail,
  update,
  store,
  destroy,
};
