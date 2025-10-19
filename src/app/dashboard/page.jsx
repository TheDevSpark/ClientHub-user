"use client";
import { useTheme } from "@/context/ThemeContext";
import CaseCards from "@/components/CaseCard";
import React from "react";
import Link from "next/link";

function page(cases) {
  const { isDarkMode } = useTheme();
  return (
    <>
      <div
        className={` ${
          isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
        }  px-4 sm:px-15 py-7`}
      >
        <h1
          className={`text-2xl font-[500] mb-1 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          My Cases
        </h1>
        <p
          className={`${
            isDarkMode ? "text-[#a1a1aa]" : "text-gray-600"
          } text-[15px] mb-6`}
        >
          Track your cases and view updates.
        </p>
        <div
          className={`min-h-[90%] ${
            isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
          }  transition-colors duration-200`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4 sm:gap-6  md:gap-3">
            <div
              className={`${
                isDarkMode
                  ? "bg-[#18181b] border border-[#27272a]"
                  : "bg-white border border-gray-200"
              }  px-5 py-4 rounded-[15px]`}
            >
              <h3
                className={`text-[15px] font-[400] ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                } mb-2`}
              >
                Total Cases
              </h3>
              <p
                className={`text-xl font-[500] ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mt-6`}
              >
                2
              </p>
            </div>

            <div
              className={`${
                isDarkMode
                  ? "bg-[#18181b] border border-[#27272a]"
                  : "bg-white border border-gray-200"
              }  px-5 py-4 rounded-[15px]`}
            >
              <h3
                className={`text-[15px] font-[400] ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                } `}
              >
                Active Cases
              </h3>
              <p
                className={`text-xl font-[500] ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mt-6`}
              >
                1
              </p>
            </div>

            <div
              className={`${
                isDarkMode
                  ? "bg-[#18181b] border border-[#27272a]"
                  : "bg-white border border-gray-200"
              }  px-5 py-4 rounded-[15px]`}
            >
              <h3
                className={`text-[15px] font-[400] ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-gray-500"
                } `}
              >
                Completed
              </h3>
              <p
                className={`text-xl font-[500] ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mt-6`}
              >
                1
              </p>
            </div>
          </div>

          <CaseCards cases={cases} limit={3} />
        </div>
        <div className="ml-5">
          <Link
            href="/case"
            className={`flex items-center justify-center -mt-10 px-9 py-2 rounded-[15px] font-medium transition-colors duration-200 ${
              isDarkMode
                ? "bg-[#6366f1] text-white hover:bg-[#5558e3]"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } mt-6`}
          >
            See More
          </Link>
        </div>
      </div>
    </>
  );
}

export default page;
