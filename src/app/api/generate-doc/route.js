import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import createReport from "docx-templates";
import { PDFDocument } from "pdf-lib"; // 👈 for PDF conversion
import { execSync } from "child_process"; // 👈 to call LibreOffice if available

export async function POST(req) {
  try {
    const body = await req.json();

    const formName = body.form_name || "default";
    const raw = body?.raw_data?.raw_data?.submission?.questions || [];

    // ✅ Dynamically flatten question data for placeholders like {Matter Address_address}
    const data = {};
    raw.forEach((q) => {
      if (typeof q.value === "object" && q.value !== null) {
        Object.entries(q.value).forEach(([k, v]) => {
          const key = `${q.name.replace(/\s+/g, "_")}_${k}`;
          data[key] = v;
        });
      } else {
        const key = q.name.replace(/\s+/g, "_");
        data[key] = q.value ?? "";
      }
    });

    // ✅ Dynamic template path based on form name
    const safeFileName = formName.replace(/[^\w\-]/g, "_") + ".docx";
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      safeFileName
    );

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: `Template not found for form: ${formName}`, templatePath },
        { status: 404 }
      );
    }

    const template = fs.readFileSync(templatePath);

    // ✅ Generate DOCX buffer
    const docxBuffer = await createReport({
      template,
      data,
      cmdDelimiter: ["{", "}"],
    });

    // ✅ Convert DOCX → PDF (requires LibreOffice installed)
    const tempDocx = path.join(process.cwd(), "temp.docx");
    const tempPdf = path.join(process.cwd(), "temp.pdf");
    fs.writeFileSync(tempDocx, docxBuffer);

    try {
      execSync(
        `soffice --headless --convert-to pdf "${tempDocx}" --outdir "${process.cwd()}"`
      );
      const pdfBuffer = fs.readFileSync(tempPdf);

      // cleanup
      fs.unlinkSync(tempDocx);
      fs.unlinkSync(tempPdf);

      const fileName = `${formName}-${Date.now()}.pdf`;

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch (pdfErr) {
      console.error("PDF conversion failed:", pdfErr);
      return NextResponse.json(
        {
          error:
            "Failed to convert DOCX to PDF. Make sure LibreOffice is installed.",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Generate-doc API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
