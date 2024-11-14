"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AlertCircle, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/Layout";

interface Report {
  _id: string;
  userId: {
    name: string;
  };
  productId: string;
  productName: string;
  productDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  reports: Report[];
}

export default function AllFakeProductReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/admin/all-reports`);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data: ApiResponse = await response.json();
        if (data.success) {
          setReports(data.reports);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError("Error fetching reports. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Layout center={false}>
      {isLoading ? (
        <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
          <Loader className="size-6 animate-spin" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold my-2">Fake Product Reports</h1>
          <Card>
            <CardContent className="pt-3">
              {reports.length === 0 ? (
                <p className="text-center text-gray-500">
                  You haven't reported any fake products yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reported On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell className="font-medium">
                          {report.productName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {report.userId.name}
                        </TableCell>
                        <TableCell>{report.productDescription}</TableCell>
                        <TableCell>
                          {format(new Date(report.createdAt), "PPP")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
}
