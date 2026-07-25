import type { ReactNode } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import FlashMessages from "./ui/FlashMessages";
import NavigationLoadingOverlay from "./ui/NavigationLoadingOverlay";
import PageTransition from "./ui/PageTransition";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <FlashMessages />

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <NavigationLoadingOverlay />

          <main className="flex-1 overflow-x-hidden p-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}