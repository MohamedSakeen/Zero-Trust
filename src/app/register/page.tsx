import Link from "next/link";
import { ShieldCheck, UserPlus } from "lucide-react";
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

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[500px] bg-indigo-600/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px]" />
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

      <main className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
        <Card className="w-full max-w-lg glass-card border-slate-700/30">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto mb-2 flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <UserPlus className="h-6 w-6 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-50">
              Candidate Registration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Register for the upcoming university entrance examination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID / Passport Number</Label>
              <Input id="nationalId" placeholder="A12345678" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/15 p-4 text-sm text-slate-400 mt-4">
              <p className="font-medium text-cyan-300 mb-1.5 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Identity Verification Required
              </p>
              <p className="leading-relaxed">
                After registration, you will need to complete a biometric
                identity verification step before you can access any
                examinations.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button className="w-full h-11 text-base rounded-xl" asChild>
              <Link href="/login">Submit Registration</Link>
            </Button>
            <div className="text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
