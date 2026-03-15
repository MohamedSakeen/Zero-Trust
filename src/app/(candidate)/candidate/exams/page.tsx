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
import { Calendar, Clock, ShieldAlert, ShieldCheck, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";

export default function MyExamsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="My Exams" 
        description="View and manage your upcoming, active, and past examinations."
      />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 border-b border-slate-200 pb-2">Active & Upcoming</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Active Exam */}
          <Card className="border-blue-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Available Now</Badge>
                <div className="flex items-center text-sm text-slate-500">
                  <ShieldCheck className="h-4 w-4 mr-1 text-emerald-500" />
                  Proctored
                </div>
              </div>
              <CardTitle className="text-xl">Computer Science Entrance Exam 2026</CardTitle>
              <CardDescription>
                Core computer science concepts, algorithms, and data structures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>120 Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 col-span-2">
                  <FileText className="h-4 w-4" />
                  <span>50 Multiple Choice Questions</span>
                </div>
              </div>
              
              <div className="rounded-md bg-amber-50 p-3 border border-amber-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <span className="font-medium block">System Check Required</span>
                  You must complete the device and environment verification before starting this exam.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/candidate/verification">Verify System & Start</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Exam */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">Scheduled</Badge>
                <div className="flex items-center text-sm text-slate-500">
                  <ShieldCheck className="h-4 w-4 mr-1 text-emerald-500" />
                  Proctored
                </div>
              </div>
              <CardTitle className="text-xl">Advanced Mathematics 2026</CardTitle>
              <CardDescription>
                Calculus, linear algebra, and discrete mathematics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>Oct 20, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>90 Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 col-span-2">
                  <FileText className="h-4 w-4" />
                  <span>40 Multiple Choice Questions</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Available on Oct 20
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-semibold text-slate-900 border-b border-slate-200 pb-2">Completed</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Completed Exam */}
          <Card className="border-slate-200 shadow-sm bg-slate-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              </div>
              <CardTitle className="text-xl text-slate-700">General Physics Mock Exam</CardTitle>
              <CardDescription>
                Practice test for the physics entrance examination.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Sep 15, 2026</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <FileText className="h-4 w-4" />
                  <span>Score: 85/100</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="#">View Results</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
