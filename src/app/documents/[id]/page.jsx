"use client";
import { Plus, Eye, FileDown } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { forms } from "@/lib/forms";
import DocAddModal from "@/components/DocAddModal";
import FilloutFormModal from "@/components/FilloutFormModal";
import DocumentViewer from "@/components/DocumentViewer";

export default function Page({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const [docs, setDocs] = useState([]);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [filloutOpen, setFilloutOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // ✅ Fetch documents for this case
  const getCaseDocs = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("case_id", id);

    if (error) {
      console.error("Error fetching documents:", error);
      return;
    }

    const transformedData =
      data?.map((doc) => ({
        ...doc,
        title: doc.form_data?.title || "Untitled Document",
        submission_id: doc.form_data?.submission_id,
        submitted_at: doc.form_data?.submitted_at,
      })) || [];

    setDocs(transformedData);
  };

  // Fetch case details (optional)
  const getDetails = async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("case_id", id);

    if (error) console.error("Error fetching case details:", error);
    setDetails(data || []);
  };

  useEffect(() => {
    getCaseDocs();
    getDetails();
  }, []);

  // Handle form selection
  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setOpen(false);
    setFilloutOpen(true);
  };

  // ✅ Handle form submission (after Fillout form completed)
  const handleFormSubmit = async (submission) => {
    try {
      if (!user?.id) throw new Error("User ID is missing");

      const formattedSubmission = {
        case_id: id, // ensure this is a valid UUID
        user_id: user.id, // ensure this is a valid UUID
        form_data: {
          title: selectedForm.formName,
          answers: submission.answers || {},
          form_id: submission.form_id || selectedForm.id,
          form_name: selectedForm.formName,
          raw_data: submission,
          questions: submission.questions || [],
          submitted_at: new Date().toISOString(),
          submission_id: submission.submission_id || crypto.randomUUID(),
        },
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("documents")
        .insert([formattedSubmission]);

      if (error) throw error;

      await getCaseDocs();
      setFilloutOpen(false);
      setSelectedForm(null);
    } catch (err) {
      console.error("Error saving form submission:", err);
    }
  };


  

  // View document handler
  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  // Generate Word document
  const handleGenerateDoc = async (doc) => {
    try {
      const res = await fetch("/api/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: doc }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error:", err);
        alert(err.error || "Failed to generate document");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title || "document"}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Something went wrong while generating the document");
    }
  };

  // Empty state view
  const EmptyState = () => (
    <div
      className={`flex flex-col justify-center items-center min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`p-4 rounded-full cursor-pointer transition ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
        onClick={() => setOpen(true)}
      >
        <Plus className={isDarkMode ? "text-white" : "text-black"} />
      </div>
      <h1 className="font-bold py-2">No Documents Found. Create One!</h1>
    </div>
  );

  // Documents list view
  const DocumentsList = () => (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Documents</h1>
      <ul className="space-y-3">
        {docs.map((doc, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg shadow ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-medium">{doc.title}</h2>
                {doc.submission_id && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Submitted:{" "}
                      {new Date(doc.submitted_at).toLocaleDateString()}
                    </p>
                    <p>Submission ID: {doc.submission_id}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewDocument(doc)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Eye size={16} />
                  View
                </button>

                <button
                  onClick={() => handleGenerateDoc(doc)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FileDown size={16} />
                  Download
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setOpen(true)}
        className={`mt-6 px-4 py-2 rounded-md flex items-center gap-2 ${
          isDarkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        <Plus size={18} /> Add Document
      </button>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {docs.length <= 0 ? <EmptyState /> : <DocumentsList />}

      <DocAddModal
        open={open}
        onOpenChange={setOpen}
        onFormSelect={handleFormSelect}
        forms={forms}
      />

      {/* ✅ make sure FilloutFormModal calls onFormSubmit with full data */}
      <FilloutFormModal
        open={filloutOpen}
        onOpenChange={setFilloutOpen}
        formId={selectedForm?.id}
        forms={forms}
        onFormSubmit={handleFormSubmit}
      />

      <DocumentViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
      />
    </div>
  );
}
