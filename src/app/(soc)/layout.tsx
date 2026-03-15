import {
  ShieldAlert,
  LogOut,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";

export default function SOCLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    {
      title: "Security Overview",
      href: "/soc",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: "Active Incidents",
      href: "/soc/incidents",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      title: "Threat Hunting",
      href: "/soc/threat-hunting",
      icon: <Search className="h-4 w-4" />,
    },
    {
      title: "Audit Logs",
      href: "/soc/audit-logs",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            href="/soc"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span>ZTEP Security Operations Center</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Analyst: S. Connor
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 container mx-auto">
        <Sidebar
          items={sidebarItems}
          className="bg-slate-950 border-r border-slate-800 text-slate-300"
        />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
