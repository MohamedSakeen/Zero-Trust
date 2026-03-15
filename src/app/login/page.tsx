import Link from "next/link";
import { ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-slate-900"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Zero Trust Exam Platform</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the examination portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 underline-offset-4 hover:underline"
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
                className="font-mono text-center tracking-widest"
              />
              <p className="text-xs text-slate-500">
                Check your authenticator app or email for the 6-digit code.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" asChild>
              <Link href="/candidate">Verify & Sign In</Link>
            </Button>
            <div className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-slate-900 hover:underline"
              >
                Register here
              </Link>
            </div>
            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100 w-full">
              Staff member?{" "}
              <Link
                href="/admin-login"
                className="font-medium text-slate-900 hover:underline"
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
