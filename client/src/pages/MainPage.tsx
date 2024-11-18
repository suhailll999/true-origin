import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useUser } from "@/context/userContext";

export default function MainPage() {
  const { user } = useUser();

  // Default value for isApproved to prevent issues when user is undefined
  let isApproved = false;

  // Only companies can have an approval status, consumers are always considered approved
  if (user?.role === "company") {
    isApproved = user.accountStatus === "approved";
  }

  const isAdmin = user?.role === "admin";

  console.log(user)

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full h-full max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-8">Welcome to Our Anti-Counterfeiting Platform</h1>
          <div className="flex items-center justify-center h-3/4">
            {isApproved || isAdmin ? (
              <ProductRegistrationCard />
            ) : user?.role === "company" && user?.accountStatus === "pending" ? (
              <StatusMessage message="Your Account Is Pending" />
            ) : user?.accountStatus === "rejected" ? (
              <StatusMessage message="Your Account Is Rejected" />
            ) : (
              <ProductVerificationCard />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Reusable card components for cleaner conditional rendering
function ProductRegistrationCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PackagePlus className="h-6 w-6 text-primary" />
          <span>Register Your Product</span>
        </CardTitle>
        <CardDescription>
          Add your product to our blockchain for secure authentication and tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>Protect your brand and customers by registering your products on our tamper-proof blockchain ledger.</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/register">Register Product</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProductVerificationCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>Verify Your Product</span>
        </CardTitle>
        <CardDescription>
          Check the authenticity of your product using our blockchain-based verification system.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>Ensure your product is genuine by verifying its unique identifier against our secure blockchain records.</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/verify">Verify Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatusMessage({ message }: { message: string }) {
  return (
    <div className="">
      <h2 className="text-2xl font-semibold">{message}</h2>
      <p className="text-muted-foreground">For More Details Of Your Account Status, Contact <span className="text-blue-600 font-semibold">Admin</span></p>
    </div>
  );
}
