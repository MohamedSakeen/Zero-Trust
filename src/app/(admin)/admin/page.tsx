import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, AlertTriangle, ShieldCheck, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="Overview of examination platform metrics."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Candidates" 
          value="12,450" 
          description="+180 from last month" 
          icon={Users} 
        />
        <MetricCard 
          title="Active Exams" 
          value="4" 
          description="2 starting in 1 hour" 
          icon={FileText} 
        />
        <MetricCard 
          title="Suspicious Sessions" 
          value="24" 
          description="Requires SOC review" 
          icon={AlertTriangle} 
          iconColor="text-amber-500"
        />
        <MetricCard 
          title="System Health" 
          value="99.9%" 
          description="All services operational" 
          icon={ShieldCheck} 
          iconColor="text-emerald-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Candidate registrations and active exams by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Computer Science</h4>
                    <p className="text-sm text-slate-500">2 Active Exams</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">4,500</span>
                  <p className="text-sm text-slate-500">Candidates</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Mathematics</h4>
                    <p className="text-sm text-slate-500">1 Active Exam</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">3,200</span>
                  <p className="text-sm text-slate-500">Candidates</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Physics</h4>
                    <p className="text-sm text-slate-500">1 Active Exam</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">2,800</span>
                  <p className="text-sm text-slate-500">Candidates</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Engineering</h4>
                    <p className="text-sm text-slate-500">0 Active Exams</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">1,950</span>
                  <p className="text-sm text-slate-500">Candidates</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Scheduled for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-sm">
                    Computer Science Entrance
                  </p>
                  <p className="text-xs text-slate-500">Oct 15, 09:00 AM</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Computer Science</span>
                </div>
                <div className="text-xs font-medium bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded">
                  4,500 Enrolled
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-sm">Mathematics Advanced</p>
                  <p className="text-xs text-slate-500">Oct 16, 10:00 AM</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Mathematics</span>
                </div>
                <div className="text-xs font-medium bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded">
                  3,200 Enrolled
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-sm">Physics General</p>
                  <p className="text-xs text-slate-500">Oct 18, 02:00 PM</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Physics</span>
                </div>
                <div className="text-xs font-medium bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded">
                  2,800 Enrolled
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
