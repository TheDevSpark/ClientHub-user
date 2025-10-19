"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function CaseUpdates({ caseId }) {
  const { isDarkMode } = useTheme();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("CASE ID:", caseId);
  }, [caseId]);

  // 🧠 Fetch updates from Supabase
  useEffect(() => {
    if (!caseId) return;

    async function fetchUpdates() {
      setLoading(true);
      const { data, error } = await supabase
        .from("cases")
        .select("case_updates")
        .eq("case_id", caseId)
        .single();

      if (error) {
        console.error("Error fetching case updates:", error);
        setUpdates([]);
      } else if (data?.case_updates) {
        console.log("Raw case_updates:", data.case_updates);
        console.log("Type:", typeof data.case_updates);

        // ✅ Handle different data types
        if (Array.isArray(data.case_updates)) {
          // Already an array of objects
          setUpdates(data.case_updates);
        } else if (typeof data.case_updates === "string") {
          // If it's a string, try to parse or wrap it
          try {
            const parsed = JSON.parse(data.case_updates);
            if (Array.isArray(parsed)) {
              setUpdates(parsed);
            } else {
              setUpdates([{
                title: "Latest Update",
                date: new Date().toLocaleDateString(),
                description: data.case_updates,
              }]);
            }
          } catch {
            // Plain text
            setUpdates([{
              title: "Latest Update",
              date: new Date().toLocaleDateString(),
              description: data.case_updates,
            }]);
          }
        } else if (typeof data.case_updates === "object") {
          // Single object, wrap in array
          setUpdates([{
            title: data.case_updates.title || "Latest Update",
            date: data.case_updates.date || new Date().toLocaleDateString(),
            description: data.case_updates.description || String(data.case_updates),
          }]);
        } else {
          setUpdates([]);
        }
      } else {
        setUpdates([]);
      }

      setLoading(false);
    }

    fetchUpdates();
  }, [caseId]);

  // 🧩 UI
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

      {loading ? (
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Loading updates...
        </p>
      ) : updates.length === 0 ? (
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          No updates available yet.
        </p>
      ) : (
        <div className="space-y-4">
          {updates.map((update, index) => (
            <div key={index} className="flex gap-4">
              {/* Timeline Left Side */}
              <div className="flex flex-col items-center">
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
      )}
    </div>
  );
}