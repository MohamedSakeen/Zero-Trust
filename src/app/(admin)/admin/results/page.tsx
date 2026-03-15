import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";

const results = [
  {
    id: "CAND-8492",
    name: "John Doe",
    exam: "Computer Science 2026",
    score: 92,
    status: "Verified",
    date: "Oct 15, 2026",
  },
  {
    id: "CAND-8493",
    name: "Jane Smith",
    exam: "Computer Science 2026",
    score: 88,
    status: "Verified",
    date: "Oct 15, 2026",
  },
  {
    id: "CAND-8494",
    name: "Alice Johnson",
    exam: "Computer Science 2026",
    score: 75,
    status: "Under Review",
    date: "Oct 15, 2026",
  },
  {
    id: "CAND-8495",
    name: "Bob Williams",
    exam: "Computer Science 2026",
    score: 95,
    status: "Verified",
    date: "Oct 15, 2026",
  },
  {
    id: "CAND-8496",
    name: "Charlie Brown",
    exam: "Computer Science 2026",
    score: 0,
    status: "Invalidated",
    date: "Oct 15, 2026",
  },
];

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Examination Results
          </h1>
          <p className="text-slate-500">
            View and export candidate scores and verification status.
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input placeholder="Search candidates..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {r.id}
                  </TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.exam}</TableCell>
                  <TableCell className="text-slate-500">{r.date}</TableCell>
                  <TableCell className="font-semibold">{r.score}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "Verified"
                          ? "success"
                          : r.status === "Under Review"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {r.status}
                    </Badge>
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
