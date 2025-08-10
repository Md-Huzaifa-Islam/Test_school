"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Award,
  RefreshCw,
  FileText,
  Plus,
  Trash2,
  Database,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalCertificates: number;
  recentAssessments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalCertificates: 0,
    recentAssessments: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users count
      const usersResponse = await fetch("/api/debug/users");
      const usersData = await usersResponse.json();

      // Fetch questions count
      const questionsResponse = await fetch("/api/debug/questions");
      const questionsData = await questionsResponse.json();

      // Fetch certificates count
      const certificatesResponse = await fetch("/api/debug/certificates");
      const certificatesData = await certificatesResponse.json();

      setStats({
        totalUsers: usersData.data?.totalUsers || 0,
        totalQuestions: questionsData.data?.totalQuestions || 0,
        totalCertificates: certificatesData.data?.totalCertificates || 0,
        recentAssessments: 0, // We'll implement this later
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/seed-realistic-questions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        alert("Questions seeded successfully!");
        fetchDashboardData();
      } else {
        alert("Failed to seed questions: " + data.message);
      }
    } catch (error) {
      alert("Error seeding questions");
    } finally {
      setLoading(false);
    }
  };

  const clearQuestions = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all questions? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/clear-questions", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        alert("All questions cleared successfully!");
        fetchDashboardData();
      } else {
        alert("Failed to clear questions: " + data.message);
      }
    } catch (error) {
      alert("Error clearing questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your Test_School platform from here
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => fetchDashboardData()}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered students and supervisors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Available assessment questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground">Certificates issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Assessments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentAssessments}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Question Management */}
        <Card>
          <CardHeader>
            <CardTitle>Question Management</CardTitle>
            <CardDescription>
              Manage assessment questions and question pools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={seedQuestions}
              disabled={loading}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Seed Realistic Questions
            </Button>
            <Button
              onClick={clearQuestions}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Questions
            </Button>
            <Button
              onClick={() => window.open("/api/debug/questions", "_blank")}
              variant="outline"
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Questions Data
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Monitor and manage platform users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => window.open("/api/debug/users", "_blank")}
              variant="outline"
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
            <Button
              onClick={() => window.open("/api/debug/user-progress", "_blank")}
              variant="outline"
              className="w-full"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              User Progress
            </Button>
            <Button
              onClick={() => router.push("/admin/users")}
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        {/* System Management */}
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>
              Monitor and manage the assessment system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => window.open("/api/debug/certificates", "_blank")}
              variant="outline"
              className="w-full"
            >
              <Award className="h-4 w-4 mr-2" />
              View All Certificates
            </Button>
            <Button
              onClick={() => window.open("/api/health", "_blank")}
              variant="outline"
              className="w-full"
            >
              <Database className="h-4 w-4 mr-2" />
              System Health Check
            </Button>
            <Button
              onClick={fetchDashboardData}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system information and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">
                Database Status
              </span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-900">Questions Pool</span>
              <Badge className="bg-blue-100 text-blue-800">
                {stats.totalQuestions > 0 ? "Ready" : "Empty"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-900">
                Assessment System
              </span>
              <Badge className="bg-purple-100 text-purple-800">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
