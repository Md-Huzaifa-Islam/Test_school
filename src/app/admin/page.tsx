"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, ArrowRight, Home } from "lucide-react";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in as admin
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        // Simple token check - in production, you'd want to verify the token
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        if (payload.role === "admin") {
          router.push("/admin/dashboard");
        }
      } catch (error) {
        // Invalid token, continue to show login options
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 p-4 bg-slate-100 rounded-full w-fit">
            <Shield className="h-12 w-12 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Test School Admin
          </h1>
          <p className="text-slate-600">
            Administrative access to the Test School platform
          </p>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <Link
            href="/admin/login"
            className="w-full flex items-center justify-between p-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center">
              <Lock className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Admin Login</div>
                <div className="text-sm text-slate-300">
                  Access admin dashboard
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="border-t pt-4">
            <div className="text-sm text-slate-600 mb-3">
              <strong>Default Admin Credentials:</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded text-sm font-mono">
              <div>Email: huzaifaswe@gmail.com</div>
              <div>Password: 111111qQ$</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
