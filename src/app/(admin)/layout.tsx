import {
  ShieldCheck,
  LogOut,
  Users,
  LayoutDashboard,
  FileQuestion,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Exams",
      href: "/admin/exams/create",
      icon: <FileQuestion className="h-4 w-4" />,
    },
    {
      title: "Questions",
      href: "/admin/questions",
      icon: <FileQuestion className="h-4 w-4" />,
    },
    {
      title: "Results",
      href: "/admin/results",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    { title: "Candidates", href: "/admin/candidates", icon: <Users className="h-4 w-4" /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white text-slate-900">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span>ZTEP Admin Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-700">Admin User</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              asChild
            >
              <Link href="/admin-login">
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
          className="bg-white border-r border-slate-200"
        />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
