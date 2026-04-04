"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Sidebar, { MobileNav } from "@/components/Sidebar";
import { FullScreenLoader } from "@/components/Loader";
import NotificationToast from "@/components/NotificationToast";
import { Menu } from "lucide-react";
import { isReminderEnabled, isNotificationSupported, sendReminder } from "@/lib/notifications";
import { apiGetStats } from "@/lib/api";

const publicRoutes = ["/login", "/signup"];
const cleanRoutes = ["/onboarding"];

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = publicRoutes.includes(pathname);
  const isCleanRoute = cleanRoutes.includes(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, isLoading, isPublicRoute, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Daily reminder logic
  useEffect(() => {
    if (!user || !isNotificationSupported() || !isReminderEnabled()) return;

    const checkAndRemind = () => {
      const hour = new Date().getHours();
      if (hour >= 20) {
        apiGetStats()
          .then((stats) => {
            if (stats.streak === 0) {
              sendReminder();
            }
          })
          .catch(() => {});
      }
    };

    // Check after a short delay on load
    const timeout = setTimeout(checkAndRemind, 3000);
    return () => clearTimeout(timeout);
  }, [user]);

  if (isLoading) return <FullScreenLoader />;
  if (isPublicRoute) return <>{children}</>;
  if (!user) return <FullScreenLoader />;

  // Clean layout for onboarding (no sidebar/nav)
  if (isCleanRoute) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-[240px]">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <span className="text-bg-primary font-bold text-[10px]">M</span>
            </div>
            <span className="text-text-primary font-semibold text-sm">MoodMate</span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      <MobileNav />
      <NotificationToast />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
    </ThemeProvider>
  );
}
