"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Search, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function MyCasesPage() {
  const { isDarkMode } = useTheme();
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const itemsPerPage = 12;
  const { user } = useAuth();

  // ✅ Fetch cases from Supabase
  const fetchCases = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cases")
      .select("case_id, name, description, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching cases:", error.message);
    } else {
      setCases(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, [user]);

  // ✅ Handle delete confirmation
  const confirmDelete = (caseId) => {
    setCaseToDelete(caseId);
    setShowDeleteModal(true);
  };

  // ✅ Delete case
  const handleDelete = async () => {
    if (!caseToDelete) return;

    const { error } = await supabase
      .from("cases")
      .delete()
      .eq("case_id", caseToDelete);

    if (error) {
      console.error("Error deleting case:", error.message);
    } else {
      fetchCases(); // Refresh list
    }

    setShowDeleteModal(false);
    setCaseToDelete(null);
  };

  // ✅ Filter cases
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

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`p-[45px] max-w-7xl mx-auto transition-colors duration-300 ${
        isDarkMode ? "text-white bg-[#0a0a0a]" : "text-gray-900 bg-gray-50"
      }`}
    >
      <h1
        className={`${
          isDarkMode ? "text-gray-400" : "text-gray-900"
        } text-2xl font-bold mt-[50px] mb-7`}
      >
        My Cases
      </h1>

      {/* 🔍 Search bar */}
      <div
        className={`flex items-center gap-2 px-3 mb-5 py-2 rounded-[15px] border flex-1 ${
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
          placeholder="Search cases..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      {/* 🧾 Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading cases...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCases.length > 0 ? (
            displayedCases.map((c) => (
              <div
                key={c.case_id}
                className={`border rounded-[15px] p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                  isDarkMode
                    ? "bg-[#18181b] border-[#27272a] text-white"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              >
                <h2 className="font-semibold text-lg">
                  {c.name || "Untitled Case"}
                </h2>

                <p className="text-sm mt-2 mb-4 text-gray-400">
                  {c.description || "No description provided."}
                </p>

                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-400">
                      Created {formatDate(c.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="inline w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-400">
                      Updated {formatDate(c.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/casedetail-page/${c.case_id}`}
                    className={`flex-1 inline-flex items-center justify-center border rounded-full py-1.5 text-sm font-[400] transition ${
                      isDarkMode
                        ? "text-white border-[#27272a] hover:bg-[#27272a] hover:text-indigo-500"
                        : "text-black border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Eye className="inline w-4 h-4 mr-1" /> View
                  </Link>

                  <button
                    onClick={() => confirmDelete(c.case_id)}
                    className={`flex-1 inline-flex items-center justify-center border rounded-full py-1.5 text-sm font-[400] transition ${
                      isDarkMode
                        ? "text-red-400 border-[#27272a] hover:bg-[#27272a]"
                        : "text-red-500 border-gray-200 hover:border-red-200 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 className="inline w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No cases found.
            </p>
          )}
        </div>
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

      {/* 🗑️ ShadCN Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className={`w-full max-w-sm rounded-xl shadow-lg border ${
              isDarkMode
                ? "bg-[#18181b] border-[#27272a] text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="font-semibold text-base">Delete Case</div>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-6 text-sm text-muted-foreground">
              Are you sure you want to delete this case? This action cannot be
              undone.
            </div>

            <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
              <button
                className={`rounded-md border px-3 py-2 text-sm ${
                  isDarkMode
                    ? "border-[#27272a] bg-[#18181b] hover:bg-[#222226]"
                    : "border-gray-200 bg-white hover:bg-gray-100"
                }`}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="rounded-md bg-red-600 text-white px-3 py-2 text-sm hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
