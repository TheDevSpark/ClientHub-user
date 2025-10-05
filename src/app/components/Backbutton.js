'use client';

import { ArrowLeft, Calendar, Download, Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import Link from "next/link";
import { useTheme } from '../ThemeContext';

// Back Button Component
export function BackButton() {
  const { isDarkMode } = useTheme();
  return (
<>

   <Link
      href="/"
      className={`flex items-center gap-2 px-3 py-1.5 mb-4 rounded-[15px] w-fit transition-colors duration-200
        ${isDarkMode 
          ? "text-gray-300 hover:text-indigo-300 hover:bg-blue-900/40  " 
          : "text-gray-900 hover:text-indigo-600 hover:bg-blue-50  "
        }`}
    >

  <ArrowLeft className="w-4 h-4" />
  <span className="text-sm font-medium">Back to My Cases</span>
</Link>

  
    </>
  );
}
