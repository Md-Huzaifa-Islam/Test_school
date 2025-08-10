"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Award,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  UserCog,
  Database,
  Shield,
} from "lucide-react";

/**
 * Admin sidebar component with admin-specific navigation
 * Provides navigation for admin dashboard and management features
 */
export default function AdminSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    // Check if user is admin by checking localStorage or making API call
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // You might want to decode JWT or make API call to verify admin status
          setAdminData({
            name: "Administrator",
            email: "admin@testschool.com",
          });
        }
      } catch (error) {
        console.error("Failed to verify admin status:", error);
      }
    };

    checkAdminStatus();
  }, []);

  const adminNavigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
      current: pathname === "/admin/dashboard",
      description: "Overview and analytics",
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      current: pathname === "/admin/users",
      description: "Manage students and supervisors",
    },
    {
      name: "Question Bank",
      href: "/admin/questions",
      icon: FileText,
      current: pathname === "/admin/questions",
      description: "Manage assessment questions",
    },
    {
      name: "Certificates",
      href: "/admin/certificates",
      icon: Award,
      current: pathname === "/admin/certificates",
      description: "View and manage certificates",
    },
  ];

  const quickActions = [
    {
      name: "Add Questions",
      icon: Plus,
      action: () => router.push("/admin/questions"),
      color: "text-green-600 hover:text-green-700",
    },
    {
      name: "Seed Database",
      icon: RefreshCw,
      action: async () => {
        try {
          const response = await fetch("/api/admin/seed-realistic-questions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          if (response.ok) {
            alert("Database seeded successfully!");
          }
        } catch (error) {
          alert("Failed to seed database");
        }
      },
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      name: "System Health",
      icon: Shield,
      action: () => window.open("/api/health", "_blank"),
      color: "text-purple-600 hover:text-purple-700",
    },
  ];

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to admin login page
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-white shadow-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-orange-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-red-100">Test_School</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-red-100 p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Admin Info */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <UserCog className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {adminData?.name || "Administrator"}
                </p>
                <p className="text-xs text-gray-500">
                  {adminData?.email || "System Admin"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              {adminNavigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-start p-3 rounded-lg font-medium transition-all duration-200 ${
                      item.current
                        ? "bg-red-50 text-red-700 shadow-sm border border-red-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent
                      className={`flex-shrink-0 h-5 w-5 mr-3 mt-0.5 ${
                        item.current
                          ? "text-red-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <div>
                      <div className="text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={action.name}
                      onClick={action.action}
                      className={`w-full flex items-center p-3 text-left rounded-lg font-medium transition-colors hover:bg-gray-50 ${action.color}`}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <span className="text-sm">{action.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 text-left rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
