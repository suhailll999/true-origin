"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { LoaderCircle } from "lucide-react";

interface Company {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: "pending" | "approved" | "rejected";
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/admin/all-companies");
      if (!response.ok) throw new Error("Failed to fetch companies");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Error",
        description: "Failed to fetch companies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyStatus = async (companyId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `/api/admin/update-company-account-status?companyId=${companyId}&status=${newStatus}`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) throw new Error("Failed to update company status");
      const data = await response.json();
      if (data.success) {
        setCompanies(
          companies.map((company) =>
            company._id === companyId
              ? {
                  ...company,
                  accountStatus: newStatus as
                    | "pending"
                    | "approved"
                    | "rejected",
                }
              : company
          )
        );
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        throw new Error(data.message || "Failed to update company status");
      }
    } catch (error) {
      console.error("Error updating company status:", error);
      toast({
        title: "Error",
        description: "Failed to update company status. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <Layout center={loading || false}>
      {loading ? (
        <LoaderCircle className="size-8 animate-spin" />
      ) : (
        <Card className="w-full max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.role}</TableCell>
                    <TableCell>{company.accountStatus}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          updateCompanyStatus(company._id, value)
                        }
                        defaultValue={company.accountStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
