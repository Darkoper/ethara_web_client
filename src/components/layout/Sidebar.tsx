import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FolderKanban, ListChecks, Users, Calendar, BarChart3, Settings, ChevronLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { RoleBadge } from "@/components/Badges";
import { BrandLogo } from "@/components/BrandLogo";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/team", label: "Team", icon: Users },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: { collapsed: boolean; setCollapsed: (v: boolean) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const { currentUser } = useApp();
  const { pathname } = useLocation();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <BrandLogo className="h-8 w-8 rounded-lg shadow-none" iconClassName="h-4 w-4" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col">
              <span className="text-sm font-semibold leading-none text-white">Ethara</span>
              <span className="mt-1 text-[10px] text-sidebar-foreground/60">Workspace</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!collapsed && <div className="px-5 pb-2 text-[11px] font-medium text-sidebar-foreground/50">Menu</div>}
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item, i) => {
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          return (
            <motion.div key={item.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <NavLink
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-white"
                )}
              >
                {active && <motion.span layoutId="sb-active" className="absolute inset-0 -z-10 rounded-lg bg-primary/10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <item.icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary-glow")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/45 p-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-medium text-sidebar-foreground/60">Projects</div>
            <button className="grid h-7 w-7 place-items-center rounded-full border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-white">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-xs text-sidebar-foreground">
            <div className="truncate">Publications</div>
            <div className="truncate">Planning</div>
            <div className="truncate">Design Internal</div>
          </div>
        </div>
      )}

      {currentUser && !collapsed && (
        <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt="" className="h-9 w-9 rounded-full bg-secondary" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{currentUser.name}</div>
              <div className="truncate text-xs text-muted-foreground">{currentUser.title}</div>
            </div>
          </div>
          <div className="mt-2"><RoleBadge role={currentUser.role} /></div>
        </div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center mx-3 mb-3 h-8 rounded-lg border border-sidebar-border bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent transition"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 248 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="hidden lg:flex sticky top-0 h-screen flex-col border-r border-sidebar-border bg-sidebar z-30"
      >
        {content}
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-sidebar-border bg-sidebar lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
