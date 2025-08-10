"use client";

import React from "react";
import withAuth from "@/components/hoc/withAuth";
import Dashboard from "@/components/pages/Dashboard";

/**
 * Dashboard page component
 * Protected route that requires authentication
 */
function DashboardPage(): React.JSX.Element {
  return <Dashboard />;
}

export default withAuth(DashboardPage);
