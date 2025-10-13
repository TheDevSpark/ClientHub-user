// components/BottomNav.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, FileText, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/case", label: "My Cases", icon: Briefcase },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/profile", label: "Profile", icon: User },
  ];
  if (!user) return null;

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${
        isDarkMode
          ? "bg-[#18181b] border-[#27272a]"
          : "bg-white border-gray-200"
      } border-t`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? `${isDarkMode ? "text-[#6366f1]" : "text-indigo-600"}`
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
