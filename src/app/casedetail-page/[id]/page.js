"use client";
// app/casedetail-page/[id]/page.jsx
import { BackButton } from "@/app/components/Backbutton";
import { CaseHeader } from "@/app/components/CaseHeader";
import { CaseProgress } from "@/app/components/ProgressBar";
import { CaseInformation } from "@/app/components/CaseInformation";
import { CaseUpdates } from "@/app/components/CaseUpdate";
import { Documents } from "@/app/components/Documents";
import { HelpSection } from "@/app/components/HelpSection";
import { cases } from "@/app/utils/CaseData";
import { useTheme } from "@/app/ThemeContext";

export default function Page({ params }) {
  const { isDarkMode } = useTheme(); 
  const caseId = params.id; // "0001" or "0002"
  const caseData = cases[caseId];

  if (!caseData) {
    return <div className="p-6 text-red-500">Case not found!</div>;
  }

  return (
    <div
      className={`min-h-screen px-4 sm:px-15 py-7 transition-colors duration-200 ${
        isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-8xl mx-auto">
        <BackButton />
        <CaseHeader
          title={caseData.title}
          caseId={caseData.caseId}
          status={caseData.status}
        />
        <CaseProgress
          percentage={caseData.progress}
          message={caseData.progressMessage}
        />

        {/* Desktop: 2 columns, Mobile/Tablet: 1 column */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5">
          {/* Left Column */}
          <div className="space-y-6">
            <div
             
            >
              <CaseInformation
                caseType={caseData.caseType}
                status={caseData.status}
                createdDate={caseData.createdDate}
                lastUpdated={caseData.lastUpdated}
                description={caseData.description}
              />
            </div>

            <div
            
            >
              <CaseUpdates updates={caseData.updates} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div
            
            >
              <Documents documents={caseData.documents} />
            </div>

            <div
          
            >
              <HelpSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
