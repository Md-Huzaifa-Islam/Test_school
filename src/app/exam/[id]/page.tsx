"use client";

import React from "react";
import ExamInterface from "@/components/pages/ExamInterface";
import withAuth from "@/components/hoc/withAuth";
import { useParams } from "next/navigation";

/**
 * Exam page for taking assessments
 * Protected route that requires authentication
 */
function ExamPage(): React.JSX.Element {
  const params = useParams();
  const assessmentId = params.id as string;

  return <ExamInterface assessmentId={assessmentId} />;
}

export default withAuth(ExamPage);
