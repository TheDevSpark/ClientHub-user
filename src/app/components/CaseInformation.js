"use client";
import { Calendar } from "lucide-react";
import { useTheme } from "@/app/ThemeContext";

export function CaseInformation({ caseType, status, createdDate, lastUpdated, description }) {
  const { isDarkMode } = useTheme();

  const statusColors = {
      'In Progress': isDarkMode 
      ? 'bg-blue-900/40 text-blue-400' 
      : 'bg-blue-100 text-blue-700',
    'Completed': isDarkMode 
      ? 'bg-green-900/40 text-green-300' 
      : 'bg-green-100 text-green-700',
    'Pending': isDarkMode 
      ? 'bg-yellow-900/40 text-yellow-400' 
      : 'bg-yellow-100 text-yellow-700'
 };
  return (
    <div
      className={`rounded-[15px] border p-6 mb-6 ${
        isDarkMode
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-[15px] font-[400] mb-8 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Case Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Case Type */}
        <div>
          <p
            className={`text-[14px] mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Case Type
          </p>
          <p
            className={`text-[14px] font-[400] ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {caseType}
          </p>
        </div>

        {/* Status */}
        <div>
          <p
            className={`text-[14px] mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Status
          </p>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              statusColors[status]
            }`}
          >
            {status}
          </span>
        </div>

        {/* Created Date */}
        <div>
          <p
            className={`text-[14px] mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Created Date
          </p>
          <div
            className={`flex items-center gap-2 text-sm ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <Calendar
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <span>{createdDate}</span>
          </div>
        </div>

        {/* Last Updated */}
        <div>
          <p
            className={`text-[14px] mb-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Last Updated
          </p>
          <div
            className={`flex items-center gap-2 text-sm ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <Calendar
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <span>{lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        className={`mt-9 pt-6 border-t ${
          isDarkMode ? "border-[#27272a]" : "border-gray-200"
        }`}
      >
        <p
          className={`text-[14px] mb-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Description
        </p>
        <p
          className={`text-sm leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-900"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

