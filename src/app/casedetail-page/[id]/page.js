"use client";
// app/casedetail-page/[id]/page.jsx
import { useEffect, useState, use } from "react"; // Added 'use' import
import { toast } from "react-hot-toast";

// Import components (assuming these paths are now correct)
import { BackButton } from "@/components/Backbutton";
import { CaseHeader } from "@/components/CaseHeader";
import { CaseProgress } from "@/components/ProgressBar";
import { CaseInformation } from "@/components/CaseInformation";
import { CaseUpdates } from "@/components/CaseUpdate";
import { Documents } from "@/components/Documents";
import { HelpSection } from "@/components/HelpSection";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabaseClient";

export default function Page({ params }) {
  const { isDarkMode } = useTheme();

  // RESTORED: Using the 'use' hook to unwrap params
  // This is required to resolve the future Promise issue mentioned in the Next.js warning.
  const { id } = use(params);

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [caseItem, setCaseItem] = useState(null);
  const getCurrentCase = async () => {
    // 1. Start loading
    setLoading(true);

    // 2. Fetch data, using the 'id' extracted via use(params)
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("case_id", id) // Use 'id'
      .single();

    // 3. Handle result
    if (error) {
      toast.error(error.message);
      setCaseData(null);
    } else {
     setCaseData(data);
  setCaseItem(data); 
    }

    // 4. End loading
    setLoading(false);
  };

  useEffect(() => {
    // Only run if the case ID is available
    if (id) {
      getCurrentCase();
    }
  }, [id]); // Dependency array includes 'id'

  // --- Loading State UI ---
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-700"
        } text-lg font-semibold`}
      >
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading Case Details...
      </div>
    );
  }

  // --- Case Not Found/Error UI ---
  if (!caseData) {
    return (
      <div
        className={`p-6 flex items-center justify-center min-h-screen text-red-500 font-bold ${
          isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
        }`}
      >
        Case "{id}" not found or an error occurred.
      </div>
    );
  }

  // Destructure data for clean usage in components
  const {
    name,
    case_id,
    status,
    type,
    description,
    created_at,
    /* Add other expected fields */
  } = caseData;

  // --- Main Render ---
  return (
    <div
      className={`min-h-screen px-4 sm:px-15 py-7 transition-colors duration-200 ${
        isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-8xl mx-auto">
        <BackButton />
        <CaseHeader title={name} caseId={case_id} status={status} />
        {/* Desktop: 2 columns, Mobile/Tablet: 1 column */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5 mt-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <CaseInformation
                caseType={type}
                status={status}
                createdDate={created_at}
                lastUpdated={created_at}
                description={description}
              />
            </div>

            <div>
           {caseItem ? (
  <CaseUpdates caseId={caseItem.case_id} />
) : (
  <p>Loading case details...</p>
)}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Documents case_id={case_id} />
            </div>

            <div>
              <HelpSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
