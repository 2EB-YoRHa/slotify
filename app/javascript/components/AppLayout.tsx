import type { ReactNode } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import FlashMessages from "./ui/FlashMessages";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <FlashMessages />

      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
