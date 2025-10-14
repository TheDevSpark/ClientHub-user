"use client";
import { useTheme } from "@/context/ThemeContext";

export function CaseProgress({ percentage, message }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-[15px] p-6 mb-6 border ${
        isDarkMode
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className={`text-[15px] font-[400] ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Case Progress
        </h2>
        <span
          className={`text-sm font-[400] ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className={`w-full rounded-full mt-8 h-2 mb-8 ${
          isDarkMode ? "bg-[#27272a]" : "bg-gray-200"
        }`}
      >
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Message */}
      <p
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
      >
        {message}
      </p>
    </div>
  );
}
