"use client";
import { useTheme } from "@/context/ThemeContext";
import { Download, FileText, Upload } from "lucide-react";
import Link from "next/link";

export function Documents({ case_id }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-[15px] border p-6 mb-6 ${
        isDarkMode
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className={`text-[15px] font-[400] ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Documents
        </h2>
        <Link
          href={`/documents/${case_id}`}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-900 hover:bg-indigo-50"
          }`}
        >
          View Documents
        </Link>
      </div>
    </div>
  );
}
