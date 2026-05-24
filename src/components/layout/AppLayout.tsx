import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useApp } from "@/context/AppContext";

export function AppLayout() {
  const { currentUser, isLoading } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="relative min-h-screen grid place-items-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading workspace...</div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="relative min-h-screen flex w-full bg-background text-foreground">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
