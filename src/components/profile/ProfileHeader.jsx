import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { supabase } from "@/lib/supabaseClient";
function ProfileHeader() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const getInitials = () => {
    return user?.user_metadata?.full_name.split("")[0];
  };
  const signOut = () => {
    supabase.auth.signOut();
  };
  return (
    <div className="px-10">
      {" "}
      {/* Heading */}
      <div className="py-10">
        <h1 className="text-2xl ">Profile Settings</h1>
        <h2>Manage your account settings and preferences</h2>
      </div>
      {/* Card */}
      <div>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
          ${
            isDarkMode
              ? "bg-gray-800 text-[#4f46e5]"
              : "bg-indigo-100 text-[#4f46e5]"
          }
            `}
        >
          {getInitials()}
        </div>
        <button
          className="bg-red-500 p-2 rounded-full text-white"
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
