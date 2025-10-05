"use client";
import { useTheme } from "@/app/ThemeContext";

export function HelpSection() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-[15px] border p-6 ${
        isDarkMode
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Heading */}
      <h2
        className={`text-[15px] font-[400] mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Need Help?
      </h2>

      {/* Description */}
      <p
        className={`text-sm mb-4 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Have questions about your case? Our team is here to help.
      </p>

      {/* Button */}
      <button
        className={`w-full mt-5 py-1.5 px-4 rounded-[15px] text-[13px] font-[500] transition-colors ${
          isDarkMode
            ? "bg-indigo-600 text-white hover:bg-indigo-500"
            : "bg-[#4f46e5] text-white hover:bg-indigo-500"
        }`}
      >
        Contact Support
      </button>
    </div>
  );
}
