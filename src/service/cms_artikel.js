import fs from 'fs/promises';
import path from 'path';
import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';
import slug from 'slug';

const get = async (req) => {
  if (req.query.search) {
    const result = await prisma.cmsArticle.findMany({
      where: {
        title: {
          search: req.query.search,
        },
        content: {
          search: req.query.search,
        },
      },
    });

    return result;
  }

  const result = await prisma.cmsArticle.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const getDetail = async (id) => {
  const result = await prisma.cmsArticle.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!result) {
    throw new ResponseError(404, 'Data Artikel Tidak Ditemukan');
  }

  return result;
};

const getDetailSlug = async (slug) => {
  const result = await prisma.cmsArticle.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!result) {
    throw new ResponseError(404, 'Data Artikel Tidak Ditemukan');
  }

  return result;
};

const update = async (data, id) => {
  const articles = await prisma.cmsArticle.findMany({
    select: {
      id: true,
      slug: true,
    },
  });
  
  const titles =  articles.filter((article) => article.id !== Number(id)).map((article) => article.slug);

  const find = await prisma.cmsArticle.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!find) {
    throw new ResponseError(404, 'Data Artikel Tidak Ditemukan');
  }

  if (titles.includes(slug(data.title))) {
    throw new ResponseError(400, 'Judul artikel sudah ada');
  }

  if (!data.thumbnail) {
    const result = await prisma.cmsArticle.update({
      where: {
        id: Number(id),
      },
      data: {
        title: data.title,
        slug: slug(data.title),
        content: data.content,
      },
    });

    return result;
  }

  const filePath = path.join(process.cwd(), `storage/${find.thumbnail}`);

  let fileOnDirectory;

  try {
    fileOnDirectory = await fs.access(filePath);
  } catch (error) {
    console.error(error);
  }

  if (fileOnDirectory === undefined) {
    await fs.unlink(filePath, () => {});
  }

  const result = await prisma.cmsArticle.update({
    where: {
      id: Number(id),
    },
    data: {
      title: data.title,
      slug: slug(data.title),
      content: data.content,
      thumbnail: `/cms/artikel/${data.thumbnail.filename}`,
    },
  });

  return result;
};

const store = async (data) => {
  const articles = await prisma.cmsArticle.findMany({
    select: {
      slug: true,
    },
  });
  
  const titles = articles.map((article) => article.slug);

  if (titles.includes(slug(data.title))) {
    throw new ResponseError(400, 'Judul artikel sudah ada');
  }

  const result = await prisma.cmsArticle.create({
    data: {
      title: data.title,
      slug: slug(data.title),
      content: data.content,
      thumbnail: `/cms/artikel/${data.thumbnail.filename}`,
    },
  });

  return result;
};

const destroy = async (id) => {
  const find = await prisma.cmsArticle.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!find) {
    throw new ResponseError(404, 'Data Artikel Tidak Ditemukan');
  }

  const filePath = path.join(process.cwd(), `storage/${find.thumbnail}`);

  let fileOnDirectory;

  try {
    fileOnDirectory = await fs.access(filePath);
  } catch (error) {
    console.error(error);
  }

  if (fileOnDirectory === undefined) {
    await fs.unlink(filePath, () => {});
  }

  await prisma.cmsArticle.delete({
    where: {
      id: Number(id),
    },
  });
};

export default {
  get,
  getDetail,
  getDetailSlug,
  update,
  store,
  destroy,
};
