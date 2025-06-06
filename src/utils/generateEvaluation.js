import PuppeteerHTMLPDF from 'puppeteer-html-pdf';
import path from 'path';

export default async function generateEvaluationPdf(html) {
  try {
    const outputPath = path.join(
      process.cwd(),
      "/storage/sertifikat",
      `${Date.now()}.pdf`
    );

    const htmlPDF = new PuppeteerHTMLPDF();
    const options = {
      format: "A4",
      landscape: true,
      path: outputPath,
    };
    htmlPDF.setOptions(options);

    await htmlPDF.getPage();
    await htmlPDF.create(html);
    await htmlPDF.closeBrowser();

    return path.basename(outputPath);
  } catch (error) {
    console.log("Error in generateEvaluationPdf:", error);
  }
}
