import {
  ShieldCheck,
  LogOut,
  User,
  LayoutDashboard,
  FileText,
  AlertTriangle,
  History
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/candidate",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "My Exams",
      href: "/candidate/exams",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "History",
      href: "/candidate/history",
      icon: <History className="h-4 w-4" />,
    },
    {
      title: "System Check",
      href: "/candidate/verification",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            href="/candidate"
            className="flex items-center gap-2 font-semibold text-slate-900"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Zero Trust Exam Platform</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <User className="h-4 w-4" />
              <span>John Doe (CAND-8492)</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 container mx-auto">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
