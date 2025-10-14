"use client";
import { useTheme } from "@/context/ThemeContext";
import { Download, FileText, Upload } from "lucide-react";

export function Documents({ documents }) {
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
        <button
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-900 hover:bg-indigo-50"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 border rounded-[15px] transition-colors ${
              isDarkMode
                ? "border-[#27272a]  hover:bg-blue-900/40"
                : "border-gray-200 hover:bg-blue-50"
            }`}
          >
            {/* Left Side */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-[20px] ${
                  isDarkMode ? "bg-indigo-900/40" : "bg-indigo-100"
                }`}
              >
                <FileText
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-indigo-400" : "text-[#4f46e5]"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-[400] truncate ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {doc.name}
                </p>
                <p
                  className={`text-[13px] ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {doc.size}
                </p>
              </div>
            </div>

            {/* Download Button */}
            <button
              className={`ml-3 p-2 rounded-[15px] transition-colors flex-shrink-0 ${
                isDarkMode
                  ? "text-gray-300 hover:text-indigo-400 hover:bg-indigo-900/40"
                  : "text-gray-900 hover:text-[#4f46e5] hover:bg-blue-100"
              }`}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
