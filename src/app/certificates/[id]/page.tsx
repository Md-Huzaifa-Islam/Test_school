import CertificateView from "@/components/pages/CertificateView";
import React from "react";

interface CertificatePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Individual certificate view page
 */
export default async function CertificatePage({
  params,
}: CertificatePageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  return <CertificateView certificateId={id} />;
}
