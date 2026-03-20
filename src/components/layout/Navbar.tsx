"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass gradient-border">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-slate-50 relative group"
        >
          <div className="absolute -inset-3 bg-cyan-500/15 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative z-10 flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/25">
            <ShieldCheck className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="hidden md:inline-block relative z-10 text-base tracking-tight">
            Zero Trust Platform
          </span>
          <span className="md:hidden relative z-10">ZTP</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-3">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="hidden md:inline-flex text-slate-300 hover:text-white">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-lg">
              <Link href="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
