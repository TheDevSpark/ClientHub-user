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
import { useTheme } from "@/context/ThemeContext"; // ✅ added

const DocAddModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Add New Document
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Here you can add details for the new document.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

function Page({ params }) {
  const { id } = use(params);
  const { isDarkMode } = useTheme(); // ✅ added theme hook
  const [docs, setDocs] = useState([]);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);

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

        <DocAddModal open={open} onOpenChange={setOpen} />
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
        {/* Render documents list here */}
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

        <DocAddModal open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}

export default Page;
