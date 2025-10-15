// Case Header Component
"use client";
import { useTheme } from "@/app/ThemeContext";

export function CaseHeader({ title, caseId, status }) {
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
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        <p
          className={`text-[14px] sm:text-[14px] font-[500] ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </p>
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-medium w-fit ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>
      <p
        className={`text-[15px] ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Case {caseId}
      </p>
    </div>
  );
}
