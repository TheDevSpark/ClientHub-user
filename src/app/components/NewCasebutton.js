'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CaseModal from './CaseModal';
import { useTheme } from '../ThemeContext';

export default function NewCaseButton() {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* New Case Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-[15px] font-medium transition-colors duration-200 ${
          isDarkMode ? 'bg-[#6366f1] text-white hover:bg-[#5558e3]' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        <Plus className="w-4 h-4" /> New Case
      </button>

      {/* Modal Component */}
      <CaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
