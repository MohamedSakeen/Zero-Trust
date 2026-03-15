import { AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WarningPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full border-amber-200 shadow-md">
        <CardHeader className="bg-amber-50 border-b border-amber-100 rounded-t-lg pb-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-center text-amber-900 text-xl">
            Security Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-slate-700 text-center">
            We detected a potential security violation during your exam session.
          </p>

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-slate-500 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-slate-900 block">
                  Event Detected:
                </span>
                <span className="text-sm text-slate-600">
                  Focus lost / Switching applications
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 text-center">
            Please remain on the exam screen. Further violations may result in
            automatic termination of your exam session. This incident has been
            logged.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button asChild className="w-full">
            <Link href="/candidate/exam">Acknowledge & Return to Exam</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
