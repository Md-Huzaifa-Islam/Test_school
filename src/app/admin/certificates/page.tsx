"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  Search,
  RefreshCw,
  Download,
  Eye,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Certificate {
  _id: string;
  certificateNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  level: string;
  score: number;
  issuedDate: string;
  isApproved: boolean;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedDate?: string;
}

interface CertificateStats {
  totalCertificates: number;
  approvedCertificates: number;
  pendingCertificates: number;
  levelDistribution: { [key: string]: number };
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    totalCertificates: 0,
    approvedCertificates: 0,
    pendingCertificates: 0,
    levelDistribution: {},
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/debug/certificates");

      if (response.ok) {
        const data = await response.json();
        const certificatesList = data.data?.certificates || [];
        setCertificates(certificatesList);

        // Calculate stats
        const totalCertificates = certificatesList.length;
        const approvedCertificates = certificatesList.filter(
          (c: Certificate) => c.isApproved
        ).length;
        const pendingCertificates = totalCertificates - approvedCertificates;

        const levelDistribution: { [key: string]: number } = {};
        certificatesList.forEach((c: Certificate) => {
          levelDistribution[c.level] = (levelDistribution[c.level] || 0) + 1;
        });

        setStats({
          totalCertificates,
          approvedCertificates,
          pendingCertificates,
          levelDistribution,
        });
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveCertificate = async (certificateId: string) => {
    try {
      const response = await fetch(
        `/api/supervisor/approve-certificate/${certificateId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        alert("Certificate approved successfully!");
        fetchCertificates();
      } else {
        alert("Failed to approve certificate");
      }
    } catch (error) {
      alert("Error approving certificate");
    }
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelBadgeColor = (level: string) => {
    if (level.startsWith("A")) return "bg-green-100 text-green-800";
    if (level.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (level.startsWith("C")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600 mt-1">
            View and manage certificates in your platform
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={fetchCertificates}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Certificates
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.approvedCertificates}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCertificates > 0
                ? `${Math.round(
                    (stats.approvedCertificates / stats.totalCertificates) * 100
                  )}% approved`
                : "0% approved"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingCertificates}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                certificates.filter(
                  (cert) =>
                    new Date(cert.issuedDate).getMonth() ===
                    new Date().getMonth()
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">New certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.levelDistribution).map(([level, count]) => (
              <div
                key={level}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl font-bold">{count}</div>
                <Badge className={getLevelBadgeColor(level)}>{level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by certificate number, user name, email, or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Certificates ({filteredCertificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading certificates...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate #</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((certificate) => (
                  <TableRow key={certificate._id}>
                    <TableCell className="font-mono">
                      {certificate.certificateNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {certificate.user.firstName}{" "}
                          {certificate.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certificate.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelBadgeColor(certificate.level)}>
                        {certificate.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getScoreBadgeColor(certificate.score)}>
                        {certificate.score}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {certificate.isApproved ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-700">Approved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-700">Pending</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(certificate.issuedDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `/certificates/${certificate._id}`,
                              "_blank"
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `/api/users/certificates/${certificate._id}`,
                              "_blank"
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {!certificate.isApproved && (
                          <Button
                            size="sm"
                            onClick={() => approveCertificate(certificate._id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
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
