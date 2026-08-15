import { useState } from "react";
import type { ReactNode } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import FlashMessages from "./ui/FlashMessages";
import NavigationLoadingOverlay from "./ui/NavigationLoadingOverlay";
import PageTransition from "./ui/PageTransition";

type AppLayoutProps = {
  children: ReactNode;
  headerActions?: ReactNode;
};

export default function AppLayout({
  children,
  headerActions = null,
}: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 lg:h-screen lg:overflow-hidden">
      <FlashMessages />

      <div className="flex min-h-dvh lg:h-full lg:min-h-0">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
          <Header
            actions={headerActions}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />

          <NavigationLoadingOverlay />

          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 lg:p-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}