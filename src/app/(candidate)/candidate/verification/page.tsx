"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";


const checks = [
  { id: "browser", label: "Browser Integrity Check" },
  { id: "network", label: "Network Security Analysis" },
  { id: "device", label: "Camera & Microphone Access" },
  { id: "vm", label: "Virtual Machine Detection" },
  { id: "screen", label: "Screen Sharing Status" },
];


export default function VerificationPage() {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper functions to collect data for each check
  const getBrowserPayload = () => ({
    userAgent: navigator.userAgent,
    devtoolsOpen: false, // Optionally implement detection
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });
  const getNetworkPayload = () => ({
    isVPN: false, // Optionally implement detection
    location: "unknown", // Optionally use geolocation
    expectedLocation: "unknown",
  });
  const getDevicePayload = async () => {
    let camera = "denied";
    let microphone = "denied";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (stream.getVideoTracks().length > 0) camera = "granted";
      if (stream.getAudioTracks().length > 0) microphone = "granted";
      stream.getTracks().forEach((track) => track.stop());
    } catch (e) {}
    return { camera, microphone };
  };
  const getVmPayload = () => ({
    platform: navigator.platform,
  });
  const getScreenPayload = () => ({
    focused: document.hasFocus(),
    tabSwitches: 0, // Optionally implement tab switch tracking
  });

  // Helper to get JWT from localStorage
  const getToken = () =>
    (typeof window !== 'undefined' && localStorage.getItem('accessToken')) || '';

  const checkFunctions = [
    async () => {
      // Browser check
      const res = await fetch("/api/security/browser-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(getBrowserPayload()),
      });
      return res.json();
    },
    async () => {
      // Network check
      const res = await fetch("/api/security/network-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(getNetworkPayload()),
      });
      return res.json();
    },
    async () => {
      // Device check
      const payload = await getDevicePayload();
      const res = await fetch("/api/security/device-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    async () => {
      // VM check
      const res = await fetch("/api/security/vm-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(getVmPayload()),
      });
      return res.json();
    },
    async () => {
      // Screen check
      const res = await fetch("/api/security/screen-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(getScreenPayload()),
      });
      return res.json();
    },
  ];

  const runChecks = async () => {
    setStatus("running");
    setError(null);
    setCurrentCheck(0);
    for (let i = 0; i < checkFunctions.length; i++) {
      setCurrentCheck(i);
      try {
        const result = await checkFunctions[i]();
        if (!result.success) {
          setStatus("failed");
          setError(result.reason || result.error || "Check failed");
          return;
        }
      } catch (e: any) {
        setStatus("failed");
        setError(e.message || "Check failed");
        return;
      }
    }
    setStatus("success");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Device Verification
        </h1>
        <p className="text-slate-500">
          Establishing a zero-trust environment for your examination.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Posture Check</CardTitle>
          <CardDescription>
            We need to verify your device meets the security requirements before
            you can begin the exam.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {checks.map((check, index) => {
              const isPending =
                status === "idle" ||
                (status === "running" && index > currentCheck);
              const isRunning = status === "running" && index === currentCheck;
              const isComplete =
                status === "success" ||
                (status === "running" && index < currentCheck);

              return (
                <div
                  key={check.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-slate-100 bg-slate-50/50"
                >
                  {isPending && <Circle className="h-5 w-5 text-slate-300" />}
                  {isRunning && (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                  {isComplete && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}

                  <span
                    className={`text-sm font-medium ${isPending ? "text-slate-400" : "text-slate-700"}`}
                  >
                    {check.label}
                  </span>
                </div>
              );
            })}
          </div>

          {status === "success" && (
            <div className="rounded-md bg-emerald-50 p-4 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-900">
                  Verification Complete
                </h4>
                <p className="text-sm text-emerald-700 mt-1">
                  Your device meets all security requirements. A secure session
                  has been established.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
          <Button variant="outline" asChild>
            <Link href="/candidate">Cancel</Link>
          </Button>
          {status === "idle" && (
            <Button onClick={runChecks}>Start Verification</Button>
          )}
          {status === "running" && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </Button>
          )}
          {status === "success" && (
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Link href="/candidate/exam">Proceed to Exam</Link>
            </Button>
          )}
          {status === "failed" && (
            <div className="text-red-600 text-sm font-medium mt-2">{error}</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
