"use client";
import { useTheme } from "@/app/ThemeContext";

export function CaseUpdates({ updates }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-[15px] border p-6 mb-6 ${
        isDarkMode
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-base font-semibold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Case Updates
      </h2>

      <div className="space-y-4">
        {updates.map((update, index) => (
          <div key={index} className="flex gap-4">
            {/* Timeline Left Side */}
            <div className="flex flex-col items-center">
              {/* Bullet Point */}
              <div
                className={`flex items-center justify-center w-8 h-8 mt-1 rounded-full ${
                  isDarkMode ? "bg-indigo-900/40" : "bg-indigo-100"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDarkMode ? "bg-indigo-400" : "bg-indigo-600"
                  }`}
                ></div>
              </div>

              {/* Connecting Line */}
              {index !== updates.length - 1 && (
                <div
                  className={`w-[2px] flex-1 mt-1 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>

            {/* Timeline Content */}
            <div className="flex-1 mb-5 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {update.title}
                </h3>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {update.date}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {update.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
