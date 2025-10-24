"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilloutFullScreenEmbed } from "@fillout/react";
import { Edit, Plus } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { forms } from "@/lib/forms";
import DocumentViewer from "@/components/DocumentViewer";

export default function Page({ params }) {
  const { id } = use(params); // ✅ fixed
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const formToUse = "cVwc6SbbX9us";

  const [docs, setDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [allFormData, setAllFormData] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // ✅ NEW STATE

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

    const allFormDataArr = [];
    transformedData.map((data) => {
      allFormDataArr.push(data.form_data);
    });

    setAllFormData(allFormDataArr[0]);
    setDocs(transformedData);
  };

  useEffect(() => {
    getCaseDocs();
  }, []);

  // ✅ Handle Fillout form submission (merged logic + edit handling)
  const handleFormSubmit = async (submissionId, formId) => {
    try {
      console.log("🎯 Fillout form submitted!", submissionId);

      const res = await fetch(
        `https://api.fillout.com/v1/api/forms/${formId}/submissions/${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FILLOUT_API_KEY}`,
          },
        }
      );

      const data = await res.json();

      // 🔹 Extract answers in key:value form
      const answersObj = {};
      data.answers?.forEach((ans) => {
        if (typeof ans.value === "object" && ans.value !== null) {
          Object.entries(ans.value).forEach(([key, val]) => {
            answersObj[`${ans.id}_${key}`] = val;
          });
        } else {
          answersObj[ans.id] = ans.value;
        }
      });

      // 🔹 Format submission data
      const formattedSubmission = {
        submitter_name: user?.user_metadata?.full_name,
        form_id: formId,
        data: data?.submission?.questions,
        submitted_at: data?.submission?.submissionTime,
        submission_id: submissionId,
      };

      const formattedDoc = {
        case_id: id,
        user_id: user.id,
        form_data: {
          title:
            forms.find((f) => f.id === formId)?.formName ||
            "Eviction Notice Form",
          ...formattedSubmission,
        },
        created_at: new Date().toISOString(),
      };

      // ✅ If editing, update the existing record instead of inserting
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("documents")
          .update(formattedDoc)
          .eq("case_id", id)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
        console.log("✅ Document updated successfully");
        setIsEditing(false);
      } else {
        const { error } = await supabase
          .from("documents")
          .insert([formattedDoc]);
        if (error) throw error;
        console.log("✅ Document added successfully");
      }

      await getCaseDocs();
      setOpen(false);
    } catch (err) {
      console.error("❌ Error fetching or saving submission:", err);
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
        onClick={() => {
          setIsEditing(false);
          setOpen(true);
        }}
      >
        <Plus className={isDarkMode ? "text-white" : "text-black"} />
      </div>
      <h1 className="font-bold py-2">No Data Found. Fill Out The Form!</h1>
    </div>
  );

  // Documents list view
  const DocumentsList = () => (
    <div className="p-6 mt-[5%] flex flex-col">
      <div className="flex justify-between">
        <div></div>
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {allFormData?.title}
        </h1>
        <div
          className="cursor-pointer"
          onClick={() => {
            setIsEditing(true);
            setOpen(true);
          }}
        >
          <Edit />
        </div>
      </div>

      <div className="flex flex-col px-10 ">
        {allFormData?.data
          ?.filter((data) => {
            const val = data.value;
            const displayValue =
              typeof val === "object" && val !== null
                ? val.value ?? JSON.stringify(val)
                : val;

            // Skip null, "null", undefined, or empty string values
            return (
              displayValue !== null &&
              displayValue !== "null" &&
              displayValue !== undefined &&
              displayValue !== ""
            );
          })
          .map((data, index) => {
            const val = data.value;
            const displayValue =
              typeof val === "object" && val !== null
                ? val.value ?? JSON.stringify(val)
                : val;

            return (
              <div key={index}>
                <h1 className="font-bold">{data.name}</h1>
                <p>{String(displayValue)}</p>
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {docs.length <= 0 ? <EmptyState /> : <DocumentsList />}

      {/* ✅ Fillout Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              {isEditing ? "Edit Form" : "Fill out Form"} -{" "}
              {forms.find((f) => f.id === formToUse)?.formName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Fill out the form to generate your document
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-[70vh]">
            <FilloutFullScreenEmbed
              filloutId={formToUse}
              onSubmit={(submissionId) =>
                handleFormSubmit(submissionId, formToUse)
              }
            />
          </div>
        </DialogContent>
      </Dialog>

      <DocumentViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
      />
    </div>
  );
}
