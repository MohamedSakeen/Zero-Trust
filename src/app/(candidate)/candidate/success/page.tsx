"use client";

import { CheckCircle2, FileText, Download, LogOut } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  const confirmationId = "CS2026-A8F9B2C4";
  const timestamp = "October 15, 2026, 11:45:22 AM";

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Submission Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <p className="text-slate-600 text-center">
            Your examination has been securely submitted and cryptographically
            signed.
          </p>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-sm text-slate-500">Exam</span>
              <span className="text-sm font-medium text-slate-900">
                Computer Science 2026
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-sm text-slate-500">Confirmation ID</span>
              <span className="text-sm font-mono font-medium text-slate-900">
                {confirmationId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Timestamp</span>
              <span className="text-sm font-medium text-slate-900">
                {timestamp}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2 pb-6">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/candidate">
              <LogOut className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
