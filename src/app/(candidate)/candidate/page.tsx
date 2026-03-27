import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Candidate Dashboard
        </h1>
        <p className="text-slate-500">
          Welcome back. Here are your upcoming examinations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 bg-slate-900 text-white">
          <CardHeader className="text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Upcoming Examination</CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Scheduled
              </Badge>
            </div>
            <CardDescription className="text-white">
              Computer Science Entrance Exam 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>October 15, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4" />
                <span>09:00 AM - 12:00 PM (UTC)</span>
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Pre-exam Requirements
              </h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Identity Verification Completed
                </li>
                <li className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  Device Posture Check Required
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="text-white">
            <Button className="w-full" asChild>
              <Link href="/candidate/verification">Start System Check</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-slate-900 text-white">
          <CardHeader className="text-white">
            <CardTitle className="text-white">Trust Score</CardTitle>
            <CardDescription className="text-white">Current session security posture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-white">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-amber-100">
              <div className="absolute inset-0 rounded-full border-8 border-amber-500 border-t-transparent border-r-transparent transform -rotate-45"></div>
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-900">75</span>
                <span className="text-sm text-slate-500 block">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-center text-slate-500 mt-6">
              Complete the device verification to achieve a trusted state for
              the exam.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
