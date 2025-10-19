// src/lib/document-service.js
export async function generateDocument(raw_data, form_name) {
  try {
    console.log(raw_data);

    const res = await fetch("/api/generate-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raw_data, // ✅ matches what the API expects
        form_name, // ✅ correct key
      }),
    });

    if (!res.ok) {
      let err;
      try {
        err = await res.json();
      } catch (error) {
        err = { error: error };
      }
      console.error("Error from API:", err);
      return { success: false, error: err.error || err };
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${(form_name || "document").replace(/\s+/g, "-")}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => window.URL.revokeObjectURL(url), 2000);
    return { success: true };
  } catch (error) {
    console.error("generateDocument error:", error);
    return { success: false, error: error.message };
  }
}
