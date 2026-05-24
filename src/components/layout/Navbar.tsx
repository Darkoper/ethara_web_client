import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Bell, Search, Menu, LogOut, ChevronRight, Check, SlidersHorizontal, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/Badges";
import { CommandPalette } from "@/components/CommandPalette";
import { formatDistanceToNow } from "date-fns";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, logout, switchRole, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;
  const segments = pathname.split("/").filter(Boolean);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/95">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button onClick={onMenuClick} className="lg:hidden grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden md:flex items-center gap-1.5 text-sm">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition">Ethara</Link>
            {segments.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span className={i === segments.length - 1 ? "font-medium capitalize" : "text-muted-foreground capitalize"}>{s.replace("-", " ")}</span>
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary transition w-64"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search anything…</span>
              <kbd className="rounded bg-background border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <button className="hidden md:grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button className="hidden md:grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary">
              <Share2 className="h-4 w-4" />
            </button>
            <button onClick={() => setPaletteOpen(true)} className="sm:hidden grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary"><Search className="h-4 w-4" /></button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-secondary">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-white px-1">{unread}</motion.span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass-strong">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-xs text-muted-foreground">{unread} new</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => markNotificationRead(n.id)} className="w-full text-left flex gap-3 px-3 py-2.5 hover:bg-secondary/60 transition">
                      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/40" : "bg-primary-glow"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{n.description}</div>
                        <div className="text-[10px] mt-1 text-muted-foreground/70">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-1.5 py-1 hover:bg-secondary transition">
                    <img src={currentUser.avatar} alt="" className="h-7 w-7 rounded-lg bg-background" />
                    <div className="hidden sm:flex flex-col items-start pr-2">
                      <span className="text-xs font-medium leading-none">{currentUser.name.split(" ")[0]}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 glass-strong">
                  <div className="p-3 flex items-center gap-3">
                    <img src={currentUser.avatar} alt="" className="h-10 w-10 rounded-xl bg-background" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{currentUser.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="px-3 pb-2"><RoleBadge role={currentUser.role} /></div>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Demo: Switch role</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => switchRole("admin")} className="flex items-center justify-between">Admin {currentUser.role === "admin" && <Check className="h-4 w-4" />}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchRole("member")} className="flex items-center justify-between">Member {currentUser.role === "member" && <Check className="h-4 w-4" />}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
