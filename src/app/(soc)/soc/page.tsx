"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, ShieldAlert, Activity, Eye } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "09:00", incidents: 2 },
  { time: "09:15", incidents: 5 },
  { time: "09:30", incidents: 3 },
  { time: "09:45", incidents: 12 },
  { time: "10:00", incidents: 8 },
  { time: "10:15", incidents: 4 },
  { time: "10:30", incidents: 2 },
];

const incidents = [
  {
    id: "INC-2026-001",
    candidate: "CAND-8494",
    type: "Multiple Faces Detected",
    severity: "High",
    time: "10:32 AM",
    status: "Open",
  },
  {
    id: "INC-2026-002",
    candidate: "CAND-8120",
    type: "Unauthorized Application (TeamViewer)",
    severity: "Critical",
    time: "10:28 AM",
    status: "Investigating",
  },
  {
    id: "INC-2026-003",
    candidate: "CAND-9011",
    type: "Focus Lost > 30s",
    severity: "Medium",
    time: "10:15 AM",
    status: "Resolved",
  },
  {
    id: "INC-2026-004",
    candidate: "CAND-7742",
    type: "Audio Anomaly (Voices)",
    severity: "High",
    time: "09:55 AM",
    status: "Open",
  },
];

export default function SOCDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Security Overview
          </h1>
          <p className="text-slate-400">
            Real-time monitoring of examination sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          >
            System Normal
          </Badge>
          <Badge
            variant="outline"
            className="bg-slate-800 text-slate-300 border-slate-700"
          >
            Active Sessions: 1,420
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Critical Alerts
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">3</div>
            <p className="text-xs text-slate-400">Requires immediate action</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Warnings
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">12</div>
            <p className="text-xs text-slate-400">
              Currently under investigation
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Events / Min
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">45</div>
            <p className="text-xs text-slate-400">Telemetry ingestion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-slate-100">Incident Volume</CardTitle>
            <CardDescription className="text-slate-400">
              Security events detected over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "6px",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#ef4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-slate-100">Recent Incidents</CardTitle>
            <CardDescription className="text-slate-400">
              Latest flagged events requiring review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">ID</TableHead>
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Severity</TableHead>
                  <TableHead className="text-right text-slate-400">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow
                    key={inc.id}
                    className="border-slate-800 hover:bg-slate-800/50"
                  >
                    <TableCell className="font-mono text-xs text-slate-300">
                      {inc.id}
                    </TableCell>
                    <TableCell className="text-sm">{inc.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          inc.severity === "Critical"
                            ? "border-red-500 text-red-400"
                            : inc.severity === "High"
                              ? "border-orange-500 text-orange-400"
                              : "border-amber-500 text-amber-400"
                        }
                      >
                        {inc.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                        asChild
                      >
                        <Link href={`/soc/incident/${inc.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
