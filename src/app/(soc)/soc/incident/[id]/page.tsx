import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldAlert,
  Video,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function IncidentDetailPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
          asChild
        >
          <Link href="/soc">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Incident INC-2026-002
            </h1>
            <Badge
              variant="outline"
              className="border-red-500 text-red-400 bg-red-500/10"
            >
              Critical
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-500 text-amber-400 bg-amber-500/10"
            >
              Investigating
            </Badge>
          </div>
          <p className="text-slate-400">
            Candidate: CAND-8120 | Exam: Computer Science 2026
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                Unauthorized Application Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                {/* Mock Video Player */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <Video className="h-12 w-12 mb-2 opacity-50" />
                  <p>Session Recording Playback</p>
                  <p className="text-xs mt-1">Timestamp: 10:28:45 AM</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/80 border-t border-slate-800 flex items-center px-4">
                  <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-slate-200">Event Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="text-slate-500 block mb-1">
                      Process Name
                    </span>
                    <span className="font-mono text-red-400">
                      TeamViewer.exe
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="text-slate-500 block mb-1">
                      Detection Method
                    </span>
                    <span className="text-slate-300">
                      Process Enumeration (Agent)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-950 p-4 rounded border border-slate-800 shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-200">
                        Session Started
                      </div>
                      <time className="font-mono text-xs text-slate-500">
                        09:00 AM
                      </time>
                    </div>
                    <div className="text-slate-400 text-sm">
                      Clean environment verified.
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-950 p-4 rounded border border-slate-800 shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-200">Focus Lost</div>
                      <time className="font-mono text-xs text-slate-500">
                        10:27 AM
                      </time>
                    </div>
                    <div className="text-slate-400 text-sm">
                      Exam window lost focus for 12 seconds.
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-red-900 bg-red-950 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-red-950/20 p-4 rounded border border-red-900/50 shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-red-400">
                        Process Detected
                      </div>
                      <time className="font-mono text-xs text-slate-500">
                        10:28 AM
                      </time>
                    </div>
                    <div className="text-slate-400 text-sm">
                      TeamViewer.exe started in background.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Terminate Session
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Send Warning to Candidate
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Request Live Video Feed
              </Button>
              <div className="pt-4 mt-4 border-t border-slate-800">
                <Button
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Mark as False Positive
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Candidate Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-slate-500 block">Name</span>
                <span className="text-slate-200">Jane Doe</span>
              </div>
              <div>
                <span className="text-slate-500 block">Candidate ID</span>
                <span className="font-mono text-slate-200">CAND-8120</span>
              </div>
              <div>
                <span className="text-slate-500 block">IP Address</span>
                <span className="font-mono text-slate-200">192.168.1.45</span>
              </div>
              <div>
                <span className="text-slate-500 block">Trust Score</span>
                <span className="text-red-400 font-bold">12 / 100</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
