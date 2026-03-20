import Link from "next/link";
import { ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <header className="w-full glass gradient-border relative z-10">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-slate-50"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/25">
              <ShieldCheck className="h-4.5 w-4.5 text-white" />
            </div>
            <span>Zero Trust Exam Platform</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md glass-card border-slate-700/30">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto mb-2 flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <Fingerprint className="h-6 w-6 text-cyan-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-50">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the examination portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-cyan-400/70 hover:text-cyan-300 underline-offset-4 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                required
                className="font-mono text-center tracking-[0.35em] text-lg"
              />
              <p className="text-xs text-slate-500">
                Check your authenticator app or email for the 6-digit code.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button className="w-full h-11 text-base rounded-xl" asChild>
              <Link href="/candidate">Verify & Sign In</Link>
            </Button>
            <div className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Register here
              </Link>
            </div>
            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-700/40 w-full">
              Staff member?{" "}
              <Link
                href="/admin-login"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
