"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Clock, CheckCircle, AlertCircle, Send, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

interface Question {
  _id: string;
  question: string;
  options: string[];
  competency: string;
  level: string;
  category: string;
}

interface Assessment {
  _id: string;
  step: number;
  status: string;
  timeLimit: number;
  startedAt?: string;
  levels: string[];
  remainingTime?: number;
}

interface Answer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

interface ExamInterfaceProps {
  assessmentId?: string;
}

export default function ExamInterface({
  assessmentId: propAssessmentId,
}: ExamInterfaceProps = {}) {
  const router = useRouter();
  const params = useParams();
  const assessmentId = propAssessmentId || (params.id as string);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  // Early return if no assessment ID
  if (!assessmentId || assessmentId === "undefined") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Assessment
          </h2>
          <p className="text-gray-600 mb-4">
            Assessment ID is missing or invalid
          </p>
          <button
            onClick={() => router.push("/assessments")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  // Fetch assessment and questions
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.get(`/assessments/${assessmentId}`);
        const data = response.data.data;

        setAssessment(data.assessment);
        setQuestions(data.questions);

        if (data.assessment.status === "in_progress") {
          setStarted(true);
          // Calculate remaining time
          const startTime = new Date(data.assessment.startedAt).getTime();
          const now = new Date().getTime();
          const elapsed = Math.floor((now - startTime) / 1000);
          const remaining = Math.max(
            0,
            data.assessment.timeLimit * 60 - elapsed
          );
          setTimeRemaining(remaining);
        } else {
          setTimeRemaining(data.assessment.timeLimit * 60);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching assessment:", error);
        toast.error("Failed to load assessment");
        router.push("/assessments");
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId, router]);

  // Timer countdown
  useEffect(() => {
    if (started && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started, timeRemaining]);

  const startAssessment = async () => {
    try {
      setLoading(true);
      await api.post(`/assessments/${assessmentId}`, { action: "start" });
      setStarted(true);
      toast.success("Assessment started! Good luck!");
    } catch (error) {
      console.error("Error starting assessment:", error);
      toast.error("Failed to start assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      // Prepare answers in the required format
      const submissionAnswers: Answer[] = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] ?? 0,
        timeSpent: 0,
      }));

      const response = await api.post(`/assessments/${assessmentId}/submit`, {
        answers: submissionAnswers,
      });

      const result = response.data.data;

      // Check if user achieved a level or got a certificate
      const passed = result.achievedLevel || result.certificateLevel;
      const canProceed = result.canProceedToNext;

      if (passed) {
        if (result.certificateLevel) {
          toast.success(
            `🎉 Congratulations! You achieved ${result.certificateLevel} level certification!`
          );
        } else if (result.achievedLevel) {
          toast.success(
            `🎯 Great job! You reached ${result.achievedLevel} level!`
          );
        }

        if (canProceed) {
          toast.success(`✨ You can now proceed to the next assessment step!`);
        }
      } else {
        toast.error(
          `📚 Keep practicing! Score: ${result.percentage}% (Need 25% minimum)`
        );
      }

      // Redirect to results page or assessments page
      router.push(`/assessments?completed=${assessmentId}`);
    } catch (error: any) {
      console.error("Error submitting assessment:", error);

      // Check if it's already completed
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already completed")
      ) {
        toast.success("Assessment already completed successfully!");
        router.push(`/assessments?completed=${assessmentId}`);
      } else {
        toast.error("Failed to submit assessment. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!started && assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assessment Step {assessment.step}
            </h1>
            <p className="text-gray-600">
              You're about to take a {assessment.timeLimit}-minute assessment
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Questions:</span>
              <span className="text-gray-900">{questions.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Time Limit:</span>
              <span className="text-gray-900">
                {assessment.timeLimit} minutes
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Competencies:</span>
              <span className="text-gray-900">
                {assessment.levels?.join(", ") || "N/A"}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">
                  Important Instructions
                </h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>
                    • You have {assessment.timeLimit} minutes to complete all
                    questions
                  </li>
                  <li>• You cannot pause the timer once started</li>
                  <li>• Make sure you have a stable internet connection</li>
                  <li>• Answer all questions before the time runs out</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/assessments")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back to Assessments
            </button>
            <button
              onClick={startAssessment}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Assessment Step {assessment?.step}
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-500" />
                <span
                  className={`font-mono text-lg font-bold ${
                    timeRemaining < 300 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                Progress: {Math.round(getProgressPercentage())}%
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentQuestion && (
            <>
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {currentQuestion.competency}
                  </span>
                  <span className="text-sm text-gray-500">
                    Level: {currentQuestion.level}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion._id, index)
                    }
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion._id] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-4 flex-shrink-0 ${
                          answers[currentQuestion._id] === index
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion._id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1)
                    )
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>

                {/* Question pagination - only show if we have a reasonable number of questions */}
                {questions.length <= 10 && (
                  <div className="flex space-x-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          index === currentQuestionIndex
                            ? "bg-blue-600 text-white shadow-md"
                            : answers[questions[index]._id] !== undefined
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* For larger question sets, show a progress indicator */}
                {questions.length > 10 && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((currentQuestionIndex + 1) / questions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length === 0}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? "Submitting..." : "Submit Assessment"}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(questions.length - 1, currentQuestionIndex + 1)
                      )
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
