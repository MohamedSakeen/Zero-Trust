"use client";

import { useState, useRef, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Select } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Upload, FileUp, FilterX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

const initialQuestions = [
  {
    id: "Q-1001",
    text: "Which of the following sorting algorithms...",
    subject: "Computer Science",
    difficulty: "Medium",
    status: "Active",
  },
  {
    id: "Q-1002",
    text: "In object-oriented programming, what concept...",
    subject: "Computer Science",
    difficulty: "Easy",
    status: "Active",
  },
  {
    id: "Q-1003",
    text: "What does ACID stand for in the context...",
    subject: "Database Systems",
    difficulty: "Hard",
    status: "Draft",
  },
  {
    id: "Q-1004",
    text: "Which data structure uses LIFO...",
    subject: "Data Structures",
    difficulty: "Easy",
    status: "Active",
  },
  {
    id: "Q-1005",
    text: "What is the primary purpose of a DNS...",
    subject: "Networking",
    difficulty: "Medium",
    status: "Archived",
  },
];

export default function QuestionManagementPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate parsing and uploading CSV
    setTimeout(() => {
      const newQuestions = [
        {
          id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
          text: "What is the time complexity of binary search?",
          subject: "Computer Science",
          difficulty: "Easy",
          status: "Active",
        },
        {
          id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
          text: "Explain the difference between TCP and UDP.",
          subject: "Networking",
          difficulty: "Medium",
          status: "Draft",
        }
      ];
      
      setQuestions([...newQuestions, ...questions]);
      setIsUploading(false);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      alert(`Successfully imported ${newQuestions.length} questions from ${file.name}`);
    }, 1500);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSubjectFilter("all");
    setDifficultyFilter("all");
    setStatusFilter("all");
  };

  // Extract unique subjects for the filter dropdown
  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(questions.map(q => q.subject));
    return Array.from(uniqueSubjects).sort();
  }, [questions]);

  // Apply filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || q.subject === subjectFilter;
      const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === "all" || q.status === statusFilter;

      return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus;
    });
  }, [questions, searchQuery, subjectFilter, difficultyFilter, statusFilter]);

  const hasActiveFilters = searchQuery !== "" || subjectFilter !== "all" || difficultyFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Question Bank" 
        description="Manage examination questions and categories."
      >
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            title="File"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                Uploading...
              </span>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                Import CSV
              </>
            )}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <CardTitle>All Questions</CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500 h-8">
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="Search questions or ID..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </Select>
              
              <Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Select>
              
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Question Text</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No questions found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.id}</TableCell>
                    <TableCell className="max-w-md truncate">{q.text}</TableCell>
                    <TableCell>{q.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          q.difficulty === "Easy"
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                            : q.difficulty === "Medium"
                              ? "text-amber-600 border-amber-200 bg-amber-50"
                              : "text-red-600 border-red-200 bg-red-50"
                        }
                      >
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          q.status === "Active"
                            ? "success"
                            : q.status === "Draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
