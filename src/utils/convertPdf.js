'use strict';

import { readFile, writeFile } from "fs/promises";
import ResponseError from "../error/response-error.js";
import libre from 'libreoffice-convert';
import util from "util";

libre.convertAsync = util.promisify(libre.convert);

const convertPdf = async (file) => {
  try{
    const docxBuf = await readFile(file);
  
    const pdfBuf = await libre.convertAsync(docxBuf, ".pdf", undefined);

    await writeFile(file.replace(".docx", ".pdf"), pdfBuf);
  
    return file.replace(".docx", ".pdf");
  }catch(err){
    throw new ResponseError(500, err.message);
  }
}

export default convertPdf;