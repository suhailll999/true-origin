import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, PackagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function MainPage() {
  return (
    <Layout>
      <div className="h-[100vh-4rem] flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full h-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Welcome to Our Anti-Counterfeiting Platform
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span>Verify Your Product</span>
                </CardTitle>
                <CardDescription>
                  Check the authenticity of your product using our
                  blockchain-based verification system.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>
                  Ensure your product is genuine by verifying its unique
                  identifier against our secure blockchain records.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/verify">Verify Now</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PackagePlus className="h-6 w-6 text-primary" />
                  <span>Register Your Product</span>
                </CardTitle>
                <CardDescription>
                  Add your product to our blockchain for secure authentication
                  and tracking.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>
                  Protect your brand and customers by registering your products
                  on our tamper-proof blockchain ledger.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/register">Register Product</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
