'use client';

import { X } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useState } from 'react';

export default function CaseModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Modal */}
      <div
        className={`relative w-full max-w-md h-full shadow-xl transform transition-transform duration-300
          ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'}
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-[#27272a]' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Create New Case
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-[10px] transition-colors ${
              isDarkMode
                ? 'hover:bg-[#27272a] text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto h-[calc(100%-70px)]">
          <div className="space-y-4">
            {/* Case Title */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Case Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter case title"
                className={`w-full px-3 py-2 rounded-[10px] border text-sm outline-none transition-colors
                  ${
                    isDarkMode
                      ? 'bg-[#0a0a0a] border-[#27272a] text-white placeholder-gray-500 focus:border-[#6366f1]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-600'
                  }`}
                required
              />
            </div>

            {/* Case Type */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Case Type
              </label>
              <select
                value={formData.caseType}
                onChange={(e) =>
                  setFormData({ ...formData, caseType: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-[10px] border text-sm outline-none transition-colors
                  ${
                    isDarkMode
                      ? 'bg-[#0a0a0a] border-[#27272a] text-white focus:border-[#6366f1]'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-600'
                  }`}
                required
              >
                <option value="">Select type</option>
                <option value="contract">Contract Review</option>
                <option value="property">Property Dispute</option>
                <option value="employment">Employment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter case description"
                rows="4"
                className={`w-full px-3 py-2 rounded-[10px] border text-sm outline-none transition-colors resize-none
                  ${
                    isDarkMode
                      ? 'bg-[#0a0a0a] border-[#27272a] text-white placeholder-gray-500 focus:border-[#6366f1]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-600'
                  }`}
                required
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors
                ${
                  isDarkMode
                    ? 'border border-[#27272a] text-gray-300 hover:bg-[#27272a]'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors
                ${
                  isDarkMode
                    ? 'bg-[#6366f1] text-white hover:bg-[#5558e3]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              Create Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
