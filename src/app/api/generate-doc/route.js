import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import createReport from "docx-templates";

export async function POST(req) {
  try {
    const body = await req.json();

    const formName = body.form_name || "default";
    const raw = body?.raw_data?.raw_data?.submission?.questions || [];

    // ✅ Flatten all question data dynamically
    const data = {};
    raw.forEach((q) => {
      if (typeof q.value === "object" && q.value !== null) {
        Object.entries(q.value).forEach(([k, v]) => {
          const key = `${q.name.replace(/[^a-zA-Z0-9]/g, "_")}_${k}`;
          data[key] = v;
        });
      } else {
        const key = q.name.replace(/[^a-zA-Z0-9]/g, "_");
        data[key] = q.value ?? "";
      }
    });

    // ✅ Dynamic template path
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

    // ✅ Generate DOCX safely without JS evaluation
    const buffer = await createReport({
      template,
      data,
      noSandbox: true,
      cmdDelimiter: ["{", "}"],
      parser: (tag) => (scope) => scope[tag], // 👈 Key line — prevents ReferenceError
    });

    const fileName = `${formName}-${Date.now()}.docx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error("Generate-doc API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
