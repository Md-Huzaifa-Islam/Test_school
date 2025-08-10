"use client";

import React from "react";
import withAuth from "@/components/hoc/withAuth";

/**
 * Simple Assessment Page Component for testing
 */
function AssessmentPageSimple(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Assessments</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">Assessment system is loading...</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AssessmentPageSimple);
