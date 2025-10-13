"use client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

function page() {
  const { isDarkMode } = useTheme();

  return (
    <div className="mt-[5%]">
      <ProfileHeader />
    </div>
  );
}

export default page;
