"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AlertCircle, Loader, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/context/userContext";
import Layout from "@/components/Layout";

interface Report {
  _id: string;
  userId: string;
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

export default function MyFakeProductReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/user/my-reports`);
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
        <div className="h-screen w-screen flex items-center justify-center">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : reports && reports.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold my-2">
            My Fake Product Reports
          </h1>
          <Card>
            <CardContent className="pt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
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
                      <TableCell>{report.productDescription}</TableCell>
                      <TableCell>
                        {format(new Date(report.createdAt), "PPP")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center size-full">
          <p className="text-center text-muted-foreground font-semibold">
            You haven't reported any fake products yet.
          </p>
        </div>
      )}
    </Layout>
  );
}
