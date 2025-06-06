import fs from 'fs/promises';
import path from 'path';
import prisma from '../application/database.js';
import ResponseError from '../error/response-error.js';
import convertPdf from '../utils/convertPdf.js';
import { readFile } from 'fs/promises';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const get = async () => {
  const sertifikat_pdf = await prisma.setting.findFirst({
    where: {
      key: 'sertifikat_pdf',
    },
  });

  if (!sertifikat_pdf) {
    throw new ResponseError(404, 'Tidak ada data');
  }

  return sertifikat_pdf;
};

const update = async (req) => {
  const sertifikat_docx = await prisma.setting.findFirst({
    where: {
      key: 'sertifikat_docx',
    },
  });

  const sertifikat_pdf = await prisma.setting.findFirst({
    where: {
      key: 'sertifikat_pdf',
    },
  });

  if (req.file) {
    const docx_path = `${req.file.destination}/${req.file.filename}`;
    await convertPdf(docx_path);

    req.body.location_docx = `/template/${req.file.filename}`;
    req.body.location_pdf = `/template/${req.file.filename.replace('.docx', '.pdf')}`;

    const expected_placeholders = ['{name}', '{title}', '{start_date}', '{end_date}'];

    try {
      const doc = await readFile(path.join(process.cwd(), '/storage', req.body.location_docx), 'binary');
      const zip = new PizZip(doc);
      const d = new Docxtemplater(zip);
      const outputText = d.getFullText();

      const valid_certificate = expected_placeholders.some((expected_placeholder) => outputText.includes(expected_placeholder));
      if (!valid_certificate) {
        fs.unlink(path.join(process.cwd(), '/storage/', req.body.location_docx));
        fs.unlink(path.join(process.cwd(), '/storage/', req.body.location_pdf));
        throw new ResponseError(422, 'Placeholder Template Tidak Sesuai');
      }
    } catch (error) {
      throw new ResponseError(422, 'Placeholder Template Tidak Sesuai');
    }

    if (!sertifikat_docx && !sertifikat_pdf) {
      const template_docx = await prisma.setting.create({
        data: {
          key: 'sertifikat_docx',
          value: req.body.location_docx,
        },
      });

      const template_pdf = await prisma.setting.create({
        data: {
          key: 'sertifikat_pdf',
          value: req.body.location_pdf,
        },
      });

      const template = {
        template_docx,
        template_pdf,
      };

      return template;
    }

    if (sertifikat_docx && sertifikat_pdf) {
      const filePathDocx = path.join(process.cwd(), `storage/${sertifikat_docx.value}`);

      const filePathPdf = path.join(process.cwd(), `storage/${sertifikat_pdf.value}`);

      try {
        await fs.access(filePathDocx).then(async () => await fs.unlink(filePathDocx, () => {}));
        await fs.access(filePathPdf).then(async () => await fs.unlink(filePathPdf, () => {}));
      } catch (error) {
        console.error(error);
      }
    }
  }

  await prisma.setting.update({
    where: {
      key: 'sertifikat_docx',
    },
    data: {
      value: req.body.location_docx,
    },
  });

  const sertifikat_pdf_updated = await prisma.setting.update({
    where: {
      key: 'sertifikat_pdf',
    },
    data: {
      value: req.body.location_pdf,
    },
  });

  return sertifikat_pdf_updated;
};

export default {
  get,
  update,
};
