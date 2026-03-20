import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[600px] h-[500px] bg-indigo-600/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <header className="w-full glass gradient-border relative z-10">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-50">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="h-4.5 w-4.5 text-white" />
            </div>
            <span>ZTEP Admin Portal</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md glass-card border-slate-700/30">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto mb-2 flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Lock className="h-6 w-6 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-50">Admin Authentication</CardTitle>
            <CardDescription className="text-slate-400">
              Authorized personnel only. Sign in to manage exams and candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Staff Email</Label>
              <Input id="email" type="email" placeholder="admin@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="token">Security Token (2FA)</Label>
              <Input id="token" type="text" placeholder="000000" required className="font-mono text-center tracking-[0.35em] text-lg" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button className="w-full h-11 text-base rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] border border-indigo-400/50" asChild>
              <Link href="/admin">Access Admin Portal</Link>
            </Button>
            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-700/40 w-full">
              Are you a candidate?{" "}
              <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Candidate Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
