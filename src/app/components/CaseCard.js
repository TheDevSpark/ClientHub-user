'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Eye, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';
import { supabase } from '@/lib/supabaseClient';
import CaseModal from './CaseModal';

export default function CaseCards() {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  async function fetchCases() {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase.from('cases').select('*');
      if (error) {
        console.error('Supabase fetch error:', error);
        setFetchError(error.message);
        setCases([]);
      } else {
        const sorted = (data || []).sort((a, b) => {
          const da = a?.['created-at'] ? new Date(a['created-at']) : new Date(0);
          const db = b?.['created-at'] ? new Date(b['created-at']) : new Date(0);
          return db - da;
        });
        setCases(sorted);
      }
    } catch (err) {
      console.error('Unexpected fetch error:', err);
      setFetchError(err.message || 'Unexpected error');
      setCases([]);
    } finally {
      setLoading(false);
    }
  }

  function handleAddCase(newCase) {
    setCases((prev) => [newCase, ...prev]);
  }

  function getStatusColors(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('progress')) {
      return { dark: 'bg-blue-950 text-blue-300', light: 'bg-blue-100 text-blue-700' };
    }
    if (s.includes('complete')) {
      return { dark: 'bg-green-950 text-green-300', light: 'bg-green-100 text-green-700' };
    }
    if (s.includes('pending')) {
      return { dark: 'bg-yellow-950 text-yellow-300', light: 'bg-yellow-100 text-yellow-700' };
    }
    return { dark: 'bg-gray-800 text-gray-200', light: 'bg-gray-100 text-gray-700' };
  }

  const filteredCases = cases.filter((c) => {
    const name = (c?.['case-name'] || '').toString().toLowerCase();
    const id = (c?.['case-id'] || c?.id || '').toString();
    const q = query.toLowerCase();
    return name.includes(q) || id.includes(q);
  });

  return (
    <>
      {/* Search + New Case */}
      <div className="max-w-6xl mt-6 mb-4 flex gap-3 items-center mx-auto">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-[15px] border transition-all duration-200 flex-1
            ${
              isDarkMode
                ? 'bg-[#18181b] border-[#27272a] text-white focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1]'
                : 'bg-white border-gray-200 text-gray-700 focus-within:border-[#4f46e5] focus-within:ring-1 focus-within:ring-[#4f46e5]'
            }`}
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases..."
            className={`w-full bg-transparent outline-none text-sm ${
              isDarkMode ? 'placeholder-gray-500 text-white' : 'placeholder-gray-400 text-gray-900'
            }`}
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-[15px] font-medium transition-colors duration-200
            ${
              isDarkMode
                ? 'bg-[#6366f1] text-white hover:bg-[#5558e3]'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">New Case</span>
        </button>
      </div>

      {/* Container */}
      <div className={`${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'} max-w-7xl mx-auto p-4`}>
        {loading && (
          <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Loading cases...</div>
        )}
        {fetchError && <div className="text-red-500 mb-4">Error: {fetchError}</div>}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => {
            const statusColors = getStatusColors(caseItem?.status);
            const created = caseItem?.['created-at']
              ? new Date(caseItem['created-at']).toLocaleDateString()
              : '—';
            const updated = caseItem?.['updated-at']
              ? new Date(caseItem['updated-at']).toLocaleDateString()
              : created;
            const caseId = caseItem?.['case-id'] ?? caseItem?.id ?? '—';
            return (
              <div
                key={caseId}
                className={`${
                  isDarkMode
                    ? 'bg-[#18181b] border border-[#27272a]'
                    : 'bg-white border border-gray-200'
                } hover:shadow-lg shadow-sm rounded-[15px] p-6 transition-shadow duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2
                      className={`text-[18px] font-semibold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {caseItem?.['case-name'] ?? 'Untitled Case'}
                    </h2>
                    <p
                      className={`text-[15px] ${
                        isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'
                      } mb-2`}
                    >
                      #{caseId}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-[600] ${
                      isDarkMode ? statusColors.dark : statusColors.light
                    }`}
                  >
                    {caseItem?.status ?? 'Pending'}
                  </span>
                </div>

                <p
                  className={`text-[15px] leading-relaxed ${
                    isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'
                  } mb-6`}
                >
                  {caseItem?.['case-description'] ?? 'No description provided.'}
                </p>

                <div className="space-y-2 mb-4">
                  <div
                    className={`flex items-center text-[15px] ${
                      isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Created {created}</span>
                  </div>
                  <div
                    className={`flex items-center text-[15px] ${
                      isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Updated {updated}</span>
                  </div>
                </div>

                <Link
                  href={`/casedetail-page/${encodeURIComponent(caseId)}`}
                  className={`w-full text-[13px] flex items-center justify-center gap-2 px-4 py-1.5 rounded-[15px] font-medium transition-colors duration-200
                    ${
                      isDarkMode
                        ? 'text-white border border-[#27272a] hover:bg-[#27272a] hover:text-[#4f46e5]'
                        : 'text-gray-900 border border-gray-300 hover:bg-blue-50 hover:text-[#4f46e5]'
                    }`}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            );
          })}

          {filteredCases.length === 0 && !loading && (
            <p
              className={`col-span-full text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No cases found.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      <CaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCase={(newRow) => {
          handleAddCase(newRow);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
