import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="w-full border-b border-slate-200 bg-slate-900 text-white">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span>ZTEP Admin Portal</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-slate-200">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Admin Authentication</CardTitle>
            <CardDescription className="text-slate-500">
              Authorized personnel only. Sign in to manage exams and candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Staff Email</Label>
              <Input id="email" type="email" placeholder="admin@university.edu" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="token">Security Token (2FA)</Label>
              <Input id="token" type="text" placeholder="Enter 6-digit token" required className="font-mono tracking-widest" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" asChild>
              <Link href="/admin">Access Admin Portal</Link>
            </Button>
            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100 w-full">
              Are you a candidate?{" "}
              <Link href="/login" className="font-medium text-slate-900 hover:underline">
                Candidate Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
