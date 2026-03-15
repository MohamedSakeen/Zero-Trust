"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Flag,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock questions
const questions = [
  {
    id: 1,
    text: "Which of the following sorting algorithms has the best average-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"],
  },
  {
    id: 2,
    text: "In object-oriented programming, what concept allows a class to inherit properties and methods from another class?",
    options: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"],
  },
  {
    id: 3,
    text: "What does ACID stand for in the context of database transactions?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Completeness, Integrity, Dependability",
      "Allocation, Concurrency, Indexing, Deletion",
      "Association, Correlation, Integration, Distribution",
    ],
  },
  {
    id: 4,
    text: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: ["Queue", "Tree", "Stack", "Graph"],
  },
  {
    id: 5,
    text: "What is the primary purpose of a DNS (Domain Name System)?",
    options: [
      "To encrypt web traffic",
      "To translate domain names to IP addresses",
      "To host website files",
      "To block malicious websites",
    ],
  },
];

export default function ExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/candidate/success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const toggleReviewMark = () => {
    setReviewMarked({
      ...reviewMarked,
      [currentQuestion]: !reviewMarked[currentQuestion]
    });
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  if (showConfirmSubmit) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Submit Exam?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 mb-6">
              Are you sure you want to submit? You have answered {answeredCount} out of {questions.length} questions.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => router.push("/candidate/success")}
              >
                Yes, Submit Exam
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowConfirmSubmit(false)}
              >
                Return to Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Exam Header */}
      <div className="flex flex-col bg-white border border-slate-200 rounded-lg mb-4 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-md">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Computer Science Entrance Exam 2026
              </h2>
              <p className="text-xs text-slate-500">Secure Session Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 hidden sm:flex"
            >
              <Link href="/candidate/warning">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Test Warning UI
              </Link>
            </Button>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-md font-mono text-lg font-medium text-slate-900">
              <Clock className="h-5 w-5 text-slate-500" />
              <span className={timeLeft < 300 ? "text-red-600" : ""}>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Sidebar - Question Nav */}
        <Card className="w-64 flex-shrink-0 flex flex-col hidden md:flex">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-sm flex justify-between items-center">
              <span>Question Navigator</span>
              <span className="text-xs font-normal text-slate-500">{answeredCount}/{questions.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = currentQuestion === idx;
                const isMarked = reviewMarked[idx];
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`relative h-10 rounded-md text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-slate-900 text-white"
                        : isAnswered
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {idx + 1}
                    {isMarked && (
                      <div className="absolute -top-1 -right-1">
                        <Flag className="h-3 w-3 text-amber-500 fill-amber-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-50 border border-slate-200" /> Unanswered
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-3 w-3 text-amber-500 fill-amber-500" /> Marked for Review
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center - Question Area */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleReviewMark}
                className={reviewMarked[currentQuestion] ? "text-amber-600 bg-amber-50" : "text-slate-500"}
              >
                <Flag className={`h-4 w-4 mr-2 ${reviewMarked[currentQuestion] ? "fill-amber-600" : ""}`} />
                {reviewMarked[currentQuestion] ? "Marked for Review" : "Mark for Review"}
              </Button>
            </div>
            <CardTitle className="text-xl leading-relaxed mt-2">
              {questions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => {
                const isSelected = answers[currentQuestion] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-blue-600" : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <span className={`font-medium ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                        {option}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(questions.length - 1, prev + 1),
                  )
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Exam
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
