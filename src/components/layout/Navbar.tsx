import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-900"
        >
          <ShieldCheck className="h-5 w-5 text-slate-900" />
          <span className="hidden md:inline-block">
            Zero Trust Exam Platform
          </span>
          <span className="md:hidden">ZTEP</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="hidden md:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
