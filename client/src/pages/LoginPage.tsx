import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useUser } from "@/context/userContext";

interface FormData {
  email: string;
  password: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
      setFormData({
        email: "",
        password: "",
      });
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        setIsSuccess(data.success);
        return;
      }

      setMessage(data.message);
      setIsSuccess(data.success);
      login(data.user);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Signin error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
};

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Welcome Back To True Orgin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms">I accept the terms and conditions</Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Log In
            </Button>
            <span className="text-center">
              Dont't have an account?{" "}
              <Link to={"/sign-up"} className="font-semibold text-blue-600">
                Sign Up
              </Link>
            </span>
            {message && (
              <div
                className={`${
                  isSuccess ? "text-green-600" : "text-red-600"
                } 'text-center font-semibold'`}
              >
                {message}
              </div>
            )}
          </CardFooter>
        </Card>
      </form>
    </Layout>
  );
}
