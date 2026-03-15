"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Calendar, Clock, FileText, Database, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";

export default function CreateExamPage() {
  const [isPreview, setIsPreview] = useState(false);
  const [examData, setExamData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    duration: "120",
    questionBank: "",
    questionCount: "50"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setExamData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
    if ((id === "date" || id === "time") && errors.datetime) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.datetime;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!examData.name.trim()) {
      newErrors.name = "Exam name is required.";
    }

    // Validate duration
    const duration = parseInt(examData.duration);
    if (isNaN(duration) || duration <= 0) {
      newErrors.duration = "Duration must be a positive number.";
    }

    // Validate date and time
    if (!examData.date || !examData.time) {
      newErrors.datetime = "Date and time are required.";
    } else {
      const selectedDateTime = new Date(`${examData.date}T${examData.time}`);
      if (selectedDateTime <= new Date()) {
        newErrors.datetime = "Date and time must be in the future.";
      }
    }

    // Validate number of questions
    const questionCount = parseInt(examData.questionCount);
    if (isNaN(questionCount) || questionCount <= 0) {
      newErrors.questionCount = "Number of questions must be a positive number.";
    } else if (examData.questionBank) {
      const bankLimits: Record<string, number> = {
        "cs-core": 250,
        "math-adv": 180,
        "physics-gen": 200,
        "logic-reasoning": 150,
      };
      const limit = bankLimits[examData.questionBank];
      if (limit && questionCount > limit) {
        newErrors.questionCount = `Cannot exceed ${limit} questions for this bank.`;
      }
    } else {
      newErrors.questionBank = "Please select a question bank.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      alert("Exam saved successfully!");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <PageHeader 
            title="Create New Exam" 
            description="Configure a new examination session and select question banks."
          />
        </div>
        <Button 
          variant={isPreview ? "default" : "outline"} 
          onClick={() => setIsPreview(!isPreview)}
          className={isPreview ? "bg-slate-900 text-white" : ""}
        >
          {isPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {isPreview ? "Edit Mode" : "Preview"}
        </Button>
      </div>

      {!isPreview ? (
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>
              Enter the primary information for this examination.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>Exam Name</Label>
                <div className="relative">
                  <FileText className={`absolute left-2.5 top-2.5 h-4 w-4 ${errors.name ? "text-red-500" : "text-slate-500"}`} />
                  <Input 
                    id="name" 
                    placeholder="e.g., Computer Science Entrance 2026" 
                    className={`pl-9 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                    value={examData.name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide any additional instructions or details about this exam..." 
                  className="resize-none"
                  value={examData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className={errors.datetime ? "text-red-500" : ""}>Date</Label>
                  <div className="relative">
                    <Calendar className={`absolute left-2.5 top-2.5 h-4 w-4 ${errors.datetime ? "text-red-500" : "text-slate-500"}`} />
                    <Input 
                      id="date" 
                      type="date" 
                      className={`pl-9 ${errors.datetime ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                      value={examData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className={errors.datetime ? "text-red-500" : ""}>Start Time</Label>
                  <div className="relative">
                    <Clock className={`absolute left-2.5 top-2.5 h-4 w-4 ${errors.datetime ? "text-red-500" : "text-slate-500"}`} />
                    <Input 
                      id="time" 
                      type="time" 
                      className={`pl-9 ${errors.datetime ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                      value={examData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className={errors.duration ? "text-red-500" : ""}>Duration (Minutes)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="120" 
                    min="1" 
                    className={errors.duration ? "border-red-500 focus-visible:ring-red-500" : ""}
                    value={examData.duration}
                    onChange={handleInputChange}
                  />
                  {errors.duration && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.duration}</p>}
                </div>
              </div>
              {errors.datetime && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.datetime}</p>}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Content Configuration</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionBank" className={errors.questionBank ? "text-red-500" : ""}>Question Bank Selection</Label>
                  <div className="relative">
                    <Database className={`absolute left-2.5 top-2.5 h-4 w-4 ${errors.questionBank ? "text-red-500" : "text-slate-500"}`} />
                    <Select 
                      id="questionBank" 
                      className={`pl-9 ${errors.questionBank ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                      value={examData.questionBank}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select a question bank...</option>
                      <option value="cs-core">Computer Science Core (250 questions)</option>
                      <option value="math-adv">Advanced Mathematics (180 questions)</option>
                      <option value="physics-gen">General Physics (200 questions)</option>
                      <option value="logic-reasoning">Logic & Reasoning (150 questions)</option>
                    </Select>
                  </div>
                  {errors.questionBank ? (
                    <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.questionBank}</p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">
                      Questions will be randomly drawn from the selected bank for each candidate.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionCount" className={errors.questionCount ? "text-red-500" : ""}>Number of Questions to Deliver</Label>
                  <Input 
                    id="questionCount" 
                    type="number" 
                    placeholder="50" 
                    min="1" 
                    className={errors.questionCount ? "border-red-500 focus-visible:ring-red-500" : ""}
                    value={examData.questionCount}
                    onChange={handleInputChange}
                  />
                  {errors.questionCount && <p className="text-sm text-red-500 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />{errors.questionCount}</p>}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Button variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Exam
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Candidate Preview Mode</h4>
              <p className="text-sm text-blue-600 mt-1">This is how the exam details will appear to candidates on their dashboard before they start the exam.</p>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
                <div className="flex items-center text-sm text-slate-500">
                  <ShieldCheck className="h-4 w-4 mr-1 text-emerald-500" />
                  Proctored Session
                </div>
              </div>
              <CardTitle className="text-2xl">{examData.name || "Untitled Exam"}</CardTitle>
              <CardDescription className="text-base mt-2">
                {examData.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Date
                  </p>
                  <p className="font-medium text-slate-900">{examData.date || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Start Time
                  </p>
                  <p className="font-medium text-slate-900">{examData.time || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Duration
                  </p>
                  <p className="font-medium text-slate-900">{examData.duration} Minutes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Questions
                  </p>
                  <p className="font-medium text-slate-900">{examData.questionCount} Multiple Choice</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                System verification is required before starting.
              </p>
              <Button disabled>Start Exam</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
