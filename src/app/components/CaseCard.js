'use client';

import { useState } from 'react';
import { Calendar, Clock, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../ThemeContext';

export default function CaseCards({ cases = [], limit }) {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');

  // ✅ Filtered cases
  const filteredCases = cases.filter(
    (c) =>
      c.title?.toLowerCase().includes(query.toLowerCase()) ||
      c.id?.toString().includes(query)
  );

  // ✅ Limit cases if `limit` prop provided
  const displayedCases = limit ? filteredCases.slice(0, limit) : filteredCases;

  // ✅ Date formatter
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date)) return '—';
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* 🔍 Search Bar */}
      <div className="flex gap-3 mb-4 items-center max-w-xl">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-[15px] border flex-1 ${
            isDarkMode
              ? 'bg-[#18181b] border-[#27272a] text-white'
              : 'bg-white border-gray-200 text-gray-700'
          }`}
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* 🧾 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedCases.length > 0 ? (
          displayedCases.map((c) => (
            <div
              key={c.id}
              className={`border rounded-[15px] p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#18181b] border-[#27272a] text-white hover:bg-[#1f1f23]'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              <h2 className="font-semibold text-lg">{c.title}</h2>
              <p className="text-sm text-gray-400 mb-2">#{c.id}</p>
              <p
                className={`text-sm mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {c.description || 'No description provided.'}
              </p>

              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                  Created {formatDate(c.created_at)}
                </span>
                <span>
                  <Clock className="inline w-4 h-4 mr-1 text-gray-400" />
                  Updated {formatDate(c.updated_at)}
                </span>
              </div>

              <Link
                href={`/casedetail-page/${c.id}`}
                className={`mt-3 inline-block text-blue-500 hover:underline ${
                  isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
                }`}
              >
                <Eye className="inline w-4 h-4 mr-1" /> View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No cases found.
          </p>
        )}
      </div>
    </>
  );
}
