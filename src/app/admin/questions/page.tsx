"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Database,
} from "lucide-react";

interface Question {
  _id: string;
  competency: string;
  level: string;
  step: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  createdAt: string;
}

interface QuestionStats {
  totalQuestions: number;
  step1Questions: number;
  step2Questions: number;
  step3Questions: number;
  competencyCount: { [key: string]: number };
}

interface NewQuestion {
  competency: string;
  level: string;
  step: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    step1Questions: 0,
    step2Questions: 0,
    step3Questions: 0,
    competencyCount: {},
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
    competency: "",
    level: "",
    step: 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  const competencies = [
    "Grammar",
    "Vocabulary",
    "Reading",
    "Listening",
    "Speaking",
    "Writing",
    "Pronunciation",
    "Fluency",
    "Comprehension",
    "Translation",
    "Literature",
    "Business English",
    "Academic English",
    "Conversational English",
    "Technical English",
    "Medical English",
    "Legal English",
    "Travel English",
    "Cultural Understanding",
    "Idioms",
    "Phrasal Verbs",
    "Tenses",
  ];

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/questions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const questionsList = data.data?.questions || [];
        setQuestions(questionsList);

        // Use stats from API if available, otherwise calculate locally
        if (data.data?.stats) {
          setStats(data.data.stats);
        } else {
          // Fallback to local calculation
          const totalQuestions = questionsList.length;
          const step1Questions = questionsList.filter(
            (q: Question) => q.step === 1
          ).length;
          const step2Questions = questionsList.filter(
            (q: Question) => q.step === 2
          ).length;
          const step3Questions = questionsList.filter(
            (q: Question) => q.step === 3
          ).length;

          const competencyCount: { [key: string]: number } = {};
          questionsList.forEach((q: Question) => {
            competencyCount[q.competency] =
              (competencyCount[q.competency] || 0) + 1;
          });

          setStats({
            totalQuestions,
            step1Questions,
            step2Questions,
            step3Questions,
            competencyCount,
          });
        }
      } else {
        console.error("Failed to fetch questions:", response.status);
        const errorData = await response.json();
        alert(
          "Failed to fetch questions: " +
            (errorData.message || "Please make sure you're logged in as admin.")
        );
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      alert("Error fetching questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        alert("Question added successfully!");
        setShowAddForm(false);
        setNewQuestion({
          competency: "",
          level: "",
          step: 1,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        });
        fetchQuestions();
      } else {
        const errorData = await response.json();
        alert(
          "Failed to add question: " + (errorData.message || "Unknown error")
        );
      }
    } catch (error) {
      alert("Error adding question");
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const response = await fetch(`/api/supervisor/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        alert("Question deleted successfully!");
        fetchQuestions();
      } else {
        alert("Failed to delete question");
      }
    } catch (error) {
      alert("Error deleting question");
    }
  };

  const seedQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/seed-realistic-questions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        alert("Questions seeded successfully!");
        fetchQuestions();
      } else {
        alert("Failed to seed questions");
      }
    } catch (error) {
      alert("Error seeding questions");
    } finally {
      setLoading(false);
    }
  };

  const clearAllQuestions = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear ALL questions? This cannot be undone!"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/clear-questions", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        alert("All questions cleared successfully!");
        fetchQuestions();
      } else {
        alert("Failed to clear questions");
      }
    } catch (error) {
      alert("Error clearing questions");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(
    (question) =>
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.competency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStepBadgeColor = (step: number) => {
    switch (step) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      case 3:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelBadgeColor = (level: string) => {
    if (level.startsWith("A")) return "bg-green-100 text-green-800";
    if (level.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (level.startsWith("C")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-1">
            Manage assessment questions and question pools
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={fetchQuestions} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Step 1 (A1-A2)
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">Beginner</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.step1Questions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Step 2 (B1-B2)
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.step2Questions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Step 3 (C1-C2)
            </CardTitle>
            <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.step3Questions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Database Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button onClick={seedQuestions} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Seed Realistic Questions
          </Button>
          <Button
            variant="destructive"
            onClick={clearAllQuestions}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Questions
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/api/debug/questions", "_blank")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Raw Data
          </Button>
        </CardContent>
      </Card>

      {/* Add Question Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Competency</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newQuestion.competency}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      competency: e.target.value,
                    })
                  }
                >
                  <option value="">Select Competency</option>
                  {competencies.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Level</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newQuestion.level}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, level: e.target.value })
                  }
                >
                  <option value="">Select Level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Step</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newQuestion.step}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      step: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={1}>Step 1 (A1-A2)</option>
                  <option value={2}>Step 2 (B1-B2)</option>
                  <option value={3}>Step 3 (C1-C2)</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Question</Label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                placeholder="Enter the question..."
              />
            </div>

            <div>
              <Label>Options</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <span className="w-8 text-center">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.correctAnswer === index}
                    onChange={() =>
                      setNewQuestion({ ...newQuestion, correctAnswer: index })
                    }
                  />
                </div>
              ))}
            </div>

            <div>
              <Label>Explanation (Optional)</Label>
              <textarea
                className="w-full p-2 border rounded"
                rows={2}
                value={newQuestion.explanation}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    explanation: e.target.value,
                  })
                }
                placeholder="Explain the correct answer..."
              />
            </div>

            <div className="flex space-x-4">
              <Button onClick={addQuestion}>Add Question</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by question, competency, or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading questions...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Competency</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question._id}>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={question.question}>
                        {question.question.length > 100
                          ? question.question.substring(0, 100) + "..."
                          : question.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="border border-gray-300">
                        {question.competency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelBadgeColor(question.level)}>
                        {question.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStepBadgeColor(question.step)}>
                        Step {question.step}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {question.options[question.correctAnswer]
                        ? `${String.fromCharCode(
                            65 + question.correctAnswer
                          )}: ${question.options[
                            question.correctAnswer
                          ].substring(0, 30)}...`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteQuestion(question._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
