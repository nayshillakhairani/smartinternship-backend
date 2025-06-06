import fs from "fs/promises";
import path from "path";
import prisma from "../application/database.js";
import ResponseError from "../error/response-error.js";
import convertPdf from "../utils/convertPdf.js";
import { readFile } from "fs/promises";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const get = async () => {
  const penilaian_pdf = await prisma.setting.findUnique({
    where: {
      key: 'penilaian_pdf'
    }
  })

  if (!penilaian_pdf) {
    throw new ResponseError(404, "Tidak ada data");
  }

  return penilaian_pdf;
}

// TODO: 
const update = async (req) => {
  const penilaian_docx = await prisma.setting.findUnique({
    where: {
      key: 'penilaian_docx'
    }
  })

  const penilaian_pdf = await prisma.setting.findUnique({
    where: {
      key: 'penilaian_pdf'
    }
  })

  if (req.file) {
    const docx_path = `${req.file.destination}/${req.file.filename}`
    await convertPdf(docx_path)

    req.body.location_docx = `/template/${req.file.filename}`;
    req.body.location_pdf = `/template/${req.file.filename.replace(".docx", ".pdf")}`

    const expected_placeholders = [
      '{#competence}',
      '{evaluation_name}',
      '{#personal}',
      '{evaluation_name}',
      '{value}',
      '{/competence}',
      '{/personal}'
    ]
    
    try{
      const doc = await readFile(path.join(process.cwd(), '/storage',req.body.location_docx), "binary");
      const zip = new PizZip(doc);
      const d = new Docxtemplater(zip);
      const outputText = d.getFullText();

      const valid_certificate = expected_placeholders.some((expected_placeholder) => outputText.includes(expected_placeholder))

      if(!valid_certificate){
        fs.unlink(path.join(process.cwd(), '/storage/', req.body.location_docx))
        fs.unlink(path.join(process.cwd(), '/storage/', req.body.location_pdf))
        throw new ResponseError(422, "Placeholder Template Tidak Sesuai");  
      }
    }catch(error){
      console.log(error)
      throw new ResponseError(422, "Placeholder Template Tidak Sesuai");
    }

    if (!penilaian_pdf && !penilaian_docx) {
      const template_docx = await prisma.setting.create({
        data: {
          key: 'penilaian_docx',
          value: req.body.location_docx
        }
      })

      const template_pdf = await prisma.setting.create({
        data: {
          key: 'penilaian_pdf',
          value: req.body.location_pdf
        }
      })

      const template = {
        template_docx,
        template_pdf
      }

      return template;
    }

    if (penilaian_docx && penilaian_pdf) {
      const filePathDocx = path.join(
        process.cwd(),
        `storage/${penilaian_docx.value}`
      );

      const filePathPdf = path.join(
        process.cwd(),
        `storage/${penilaian_pdf.value}`
      );

      try {
        await fs.access(filePathDocx).then(async () => await fs.unlink(filePathDocx, () => { }));
        await fs.access(filePathPdf).then(async () => await fs.unlink(filePathPdf, () => { }));

      } catch (error) {
        console.error(error);
      }
    }
  }

  await prisma.setting.update({
    where: {
      key: 'penilaian_docx'
    },
    data: {
      value: req.body.location_docx
    }
  })
  
  const penilaian_pdf_updated = await prisma.setting.update({
    where: {
      key: 'penilaian_pdf'
    },
    data: {
      value: req.body.location_pdf
    }
  })

  return penilaian_pdf_updated;
}


export default {
  get,
  update,
}