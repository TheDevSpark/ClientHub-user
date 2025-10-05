'use client';

import { Calendar, Clock, Eye, Search, Plus } from 'lucide-react';
import Link from "next/link";
import { useTheme } from '../ThemeContext';
import { useState } from "react";
import CaseModal from './CaseModal'; // Import modal

export default function CaseCards() {
  const { isDarkMode } = useTheme(); 
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const cases = [
    {
      id: '0001',
      title: 'Contract Review',
      status: 'In Progress',
      statusColor: { 
        dark:'bg-blue-950 text-blue-300',
        light:'bg-blue-100 text-blue-700'},
      description: 'Review and analysis of employment contract with non-compete clause.',
      created: '9/15/2024',
      updated: '10/3/2024'
    },
    {
      id: '0002',
      title: 'Property Dispute',
      status: 'Completed',
      statusColor: { 
        dark:'bg-green-950 text-green-300',
        light:'bg-green-100 text-green-700'},
      description: 'Boundary dispute resolution with neighbor.',
      created: '8/10/2024',
      updated: '9/28/2024'
    }
  ];

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.id.includes(query)
  );

  return (
    <>
    {/* Search Bar with Button */}
    <div className="max-w-xl mt-6 mb-4 flex gap-3 items-center">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-[15px] border transition-all duration-200 flex-1
          ${isDarkMode 
            ? 'bg-[#18181b] border-[#27272a] text-white focus-within:border-[#6366f1] focus-within:ring-1 focus-within:ring-[#6366f1]' 
            : 'bg-white border-gray-200 text-gray-700 focus-within:border-[#4f46e5] focus-within:ring-1 focus-within:ring-[#4f46e5]'}`
        }
      >
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cases..."
          className={`w-full bg-transparent outline-none text-sm
            ${isDarkMode ? 'placeholder-gray-500 text-white' : 'placeholder-gray-400 text-gray-900'}`}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-[15px] font-medium transition-colors duration-200
          ${isDarkMode 
            ? 'bg-[#6366f1] text-white hover:bg-[#5558e3]' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">New Case</span>
      </button>
    </div>

    <div className={`${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'} max-w-3xl md:mx-0 mx-auto`}>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-4">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className={`${isDarkMode ? 'bg-[#18181b] border border-[#27272a]' : 'bg-white border border-gray-200'}  
              hover:shadow-lg shadow-sm rounded-[15px] p-6 transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between mb-9">
              <div>
                <h2 className={`text-[18px] font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {caseItem.title}
                </h2>
                <p className={`text-[15px] ${isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'} mb-2`}>
                  #{caseItem.id}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-[600] ${
                  isDarkMode ? caseItem.statusColor.dark : caseItem.statusColor.light
                }`}
              >
                {caseItem.status}
              </span>
            </div>

            <p className={`text-[15px] mb-8 leading-relaxed ${isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'} mb-2`}>
              {caseItem.description}
            </p>

            <div className="space-y-2 mb-9">
              <div className={`flex items-center text-[15px] ${isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'} mb-2`}>
                <Calendar className="w-4 h-4 mr-2" />
                <span>Created {caseItem.created}</span>
              </div>
              <div className={`flex items-center text-[15px] ${isDarkMode ? 'text-[#a1a1aa]' : 'text-gray-500'} mb-2`}>
                <Clock className="w-4 h-4 mr-2" />
                <span>Updated {caseItem.updated}</span>
              </div>
            </div>

            <Link
              href={`/casedetail-page/${caseItem.id}`}
              className={`w-full text-[13px] flex items-center justify-center gap-2 px-4 py-1.5 rounded-[15px] font-medium transition-colors duration-200
                ${isDarkMode 
                  ? 'text-white border border-[#27272a] hover:bg-[#27272a] hover:text-[#4f46e5]' 
                  : 'text-gray-900 border border-gray-300 hover:bg-blue-50 hover:text-[#4f46e5]'}
              `}
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        ))}

        {filteredCases.length === 0 && (
          <p className={`col-span-full text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No cases found.
          </p>
        )}
      </div>
    </div>

    {/* Modal */}
    <CaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}