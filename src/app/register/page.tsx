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

export default function RegisterPage() {
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
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Candidate Registration
            </CardTitle>
            <CardDescription>
              Register for the upcoming university entrance examination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div className="rounded-md bg-slate-100 p-4 text-sm text-slate-600 mt-4">
              <p className="font-medium text-slate-900 mb-1">
                Identity Verification Required
              </p>
              <p>
                After registration, you will need to complete a biometric
                identity verification step before you can access any
                examinations.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" asChild>
              <Link href="/login">Submit Registration</Link>
            </Button>
            <div className="text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-medium text-slate-900 hover:underline"
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
