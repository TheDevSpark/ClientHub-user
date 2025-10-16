"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Plus } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FilloutFullScreenEmbed, FilloutPopupEmbed } from "@fillout/react"; // Import Fillout React component

const forms = [
  {
    formName: "Notice To Pay Rent Or Quit",
    id: "8yEiqn7TStus",
  },
  {
    formName: "231 - c",
    id: "7K4HXSa5gLus",
  },
];

const DocAddModal = ({ open, onOpenChange, onFormSelect }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Add New Document
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col gap-y-3">
            {forms.map((form, index) => (
              <div
                key={index}
                className="border p-4 border-black rounded-2xl text-black hover:border-gray-300 cursor-pointer"
                onClick={() => onFormSelect(form)}
              >
                {form.formName}
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

const FilloutFormModal = ({
  open,
  onOpenChange,
  formId,
  caseId,
  onFormSubmit,
}) => {
  const { isDarkMode } = useTheme();
  useEffect(() => {
    console.log(formId);
  });

  const handleSubmission = (submission) => {
    console.log("Form submitted with data:", submission);

    // The submission object contains all the form data
    // You can access specific fields or the entire submission
    onFormSubmit({
      submissionId: submission.submissionId,
      formId: submission.formId,
      answers: submission.answers, // This contains all the form answers
      submittedAt: submission.submittedAt,
      // You can also extract specific data based on your form structure
      extractedData: extractFormData(submission.answers),
    });
  };

  // Helper function to extract and structure form data
  const extractFormData = (answers) => {
    const data = {};
    answers.forEach((answer) => {
      // Handle different types of questions
      if (
        answer.type === "text" ||
        answer.type === "email" ||
        answer.type === "phone"
      ) {
        data[answer.fieldId] = answer.value;
      } else if (answer.type === "multiple_choice") {
        data[answer.fieldId] = answer.value;
      } else if (answer.type === "file_upload") {
        data[answer.fieldId] = answer.value; // This would be file URLs
      }
      // Add more type handlers as needed
    });
    return data;
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Fill out Form
          </DialogTitle>
        </DialogHeader>
        <div className="w-full h-[70vh]">
          {formId && (
            <FilloutFullScreenEmbed
              filloutId={formId}
              onSubmission={handleSubmission}
              mode="popup" // or "inline" depending on your preference
              onClose={handleClose}
              style={{ width: "100%", height: "100%", border: "none" }}
              // You can pass additional props like custom variables
              customVariables={{
                caseId: caseId,
                userId: "current-user-id", // You'd get this from your auth context
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Page({ params }) {
  const { id } = use(params);
  const { isDarkMode } = useTheme();
  const [docs, setDocs] = useState([]);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [filloutOpen, setFilloutOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCaseDocs = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("case_id", id);
    setDocs(data || []);
  };

  const getDetails = async () => {
    const { data } = await supabase.from("cases").select("*").eq("case_id", id);
    console.log(data);
    setDetails(data || []);
  };

  const handleFormSelect = (form) => {
    console.log(form);

    setSelectedForm(form);
    setOpen(false);
    setFilloutOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      // Save the complete form submission to your database
      const { data, error } = await supabase
        .from("documents")
        .insert([
          {
            case_id: id,
            title: selectedForm.formName,
            form_id: selectedForm.id,
            form_data: formData, // This now contains the actual submission data
            submission_id: formData.submissionId,
            submitted_at: formData.submittedAt,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Error saving form data:", error);
        return;
      }

      // Refresh the documents list
      await getCaseDocs();

      // Close the form modal
      setFilloutOpen(false);
      setSelectedForm(null);

      console.log("Form data saved successfully:", data);
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCaseDocs();
    getDetails();
  }, []);

  if (docs.length <= 0) {
    return (
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

        <DocAddModal
          open={open}
          onOpenChange={setOpen}
          onFormSelect={handleFormSelect}
        />

        <FilloutFormModal
          open={filloutOpen}
          onOpenChange={setFilloutOpen}
          formId={selectedForm?.id}
          caseId={id}
          onFormSubmit={handleFormSubmit}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Documents</h1>
        <ul className="space-y-3">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className={`p-4 rounded-lg shadow ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="font-medium">{doc.title}</h2>
              {doc.submission_id && (
                <div className="mt-2 text-sm text-gray-500">
                  <p>
                    Submitted: {new Date(doc.submitted_at).toLocaleDateString()}
                  </p>
                  <p>Submission ID: {doc.submission_id}</p>
                </div>
              )}
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

        <DocAddModal
          open={open}
          onOpenChange={setOpen}
          onFormSelect={handleFormSelect}
        />

        <FilloutFormModal
          open={filloutOpen}
          onOpenChange={setFilloutOpen}
          formId={selectedForm?.id}
          caseId={id}
          onFormSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}

export default Page;
