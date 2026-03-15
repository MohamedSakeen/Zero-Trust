import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, Shield, Laptop, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-[800px]">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-900">
                  Secure University Entrance Examination Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl pt-4">
                  A zero-trust architecture ensuring academic integrity through
                  continuous verification, secure browser environments, and
                  real-time monitoring.
                </p>
              </div>
              <div className="space-x-4 pt-6">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Candidate Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/register">Register for Exam</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 border-t border-slate-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                  <Shield className="h-6 w-6 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Zero Trust Security
                  </h3>
                  <p className="text-slate-500">
                    Continuous identity verification and behavioral analysis to
                    ensure the integrity of every session.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                  <Laptop className="h-6 w-6 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Device Posture Check
                  </h3>
                  <p className="text-slate-500">
                    Automated pre-exam environment validation to block
                    unauthorized applications and virtual machines.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                  <FileCheck className="h-6 w-6 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Proctored Delivery
                  </h3>
                  <p className="text-slate-500">
                    Secure question delivery with encrypted payloads and
                    real-time anomaly detection by our SOC team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-slate-200 py-6 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 Zero Trust University. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="#" className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/admin-login" className="hover:underline underline-offset-4">
              Admin Portal
            </Link>
            <Link href="/soc" className="hover:underline underline-offset-4">
              SOC Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
