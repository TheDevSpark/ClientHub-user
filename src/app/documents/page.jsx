"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Search, Eye } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function DocumentPage() {
  const { isDarkMode } = useTheme();
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const { user } = useAuth();

  // ✅ Fetch cases from Supabase
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cases")
        .select("case_id, name, description, created_at, updated_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cases:", error.message);
      } else {
        setCases(data || []);
      }
      setLoading(false);
    };

    fetchCases();
  }, []);

  // ✅ Filter cases based on query
  const filteredCases = useMemo(() => {
    return cases.filter(
      (c) =>
        c.name?.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [cases, query]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCases = filteredCases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`p-6 max-w-7xl mx-auto min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <p
        className={`${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } text-2xl font-bold mt-3 mb-4`}
      >
        Documents
      </p>

      {/* 🔍 Search Bar */}
      <div className="w-full max-w-md mb-8">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-[15px] border w-full ${
            isDarkMode
              ? "bg-[#18181b] border-[#27272a] text-white"
              : "bg-white border-gray-200 text-gray-700"
          }`}
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search documents..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* 🧾 Case Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading cases...</p>
      ) : displayedCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCases.map((c) => (
            <div
              key={c.case_id}
              className={`border rounded-[15px] p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                isDarkMode
                  ? "bg-[#18181b] border-[#27272a]"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="font-semibold text-lg">
                {c.name || "Untitled Case"}
              </h2>
              <p
                className={`text-sm mt-2 mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {c.description || "No description provided."}
              </p>

              <div className="text-sm space-y-1 text-gray-400">
                <div className="flex items-center">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  <span>Created {formatDate(c.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="inline w-4 h-4 mr-1" />
                  <span>Updated {formatDate(c.updated_at)}</span>
                </div>
              </div>

              <Link
                href={`/documents/${c.case_id}`}
                className={`mt-4 inline-flex items-center justify-center w-full border rounded-full py-2 text-sm font-[400] transition ${
                  isDarkMode
                    ? "text-white border-[#27272a] hover:bg-[#27272a] hover:text-indigo-500"
                    : "text-black border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Eye className="inline w-4 h-4 mr-1" /> View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No cases found.</p>
      )}

      {/* 🔢 Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border transition disabled:opacity-50 ${
              isDarkMode
                ? "bg-[#18181b] border-[#27272a] hover:bg-[#222226]"
                : "bg-white border-gray-200 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          <span className="text-sm">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border transition disabled:opacity-50 ${
              isDarkMode
                ? "bg-[#18181b] border-[#27272a] hover:bg-[#222226]"
                : "bg-white border-gray-200 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
