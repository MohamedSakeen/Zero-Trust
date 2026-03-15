import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Eye, CheckCircle2, XCircle } from "lucide-react";

const mockHistory = [
  {
    id: "EXM-2026-001",
    name: "General Physics Mock Exam",
    date: "Sep 15, 2026",
    score: 85,
    total: 100,
    status: "Passed",
  },
  {
    id: "EXM-2026-002",
    name: "Calculus Fundamentals",
    date: "Aug 22, 2026",
    score: 92,
    total: 100,
    status: "Passed",
  },
  {
    id: "EXM-2026-003",
    name: "Introduction to Programming",
    date: "Jul 10, 2026",
    score: 65,
    total: 100,
    status: "Failed",
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Exam History" 
        description="Review your past examination records and scores."
      />

      <Card>
        <CardHeader>
          <CardTitle>Previous Tests</CardTitle>
          <CardDescription>A complete record of all your completed exams.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam ID</TableHead>
                <TableHead>Exam Name</TableHead>
                <TableHead>Date Taken</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistory.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium font-mono text-xs text-slate-500">{exam.id}</TableCell>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell className="text-slate-500">{exam.date}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{exam.score}</span>
                    <span className="text-slate-500 text-sm"> / {exam.total}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={exam.status === "Passed" ? "success" : "destructive"} className="flex w-fit items-center gap-1">
                      {exam.status === "Passed" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
