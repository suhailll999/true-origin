import { useContext, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { UserContext } from '@/context/userContext';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  // Handle case where UserContext might be undefined
  if (!userContext) {
    throw new Error('useContext must be used within a UserProvider');
  }

  const { login } = userContext;


  const companyLogin = async () => {
    try {
      setMessage('');

      const response = await fetch('/api/auth/company/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setIsSuccess(data.success);
        throw new Error(`Signin failed: ${response.statusText}`);
      }

      const data = await response.json();
      setMessage(data.message);
      setIsSuccess(data.success);
      login(data.user);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Signin error:', error);
    }
  }

  const consumerLogin = async () => {
    try {
      setMessage('');

      const response = await fetch('/api/auth/user/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setIsSuccess(data.success);
        throw new Error(`Signin failed: ${response.statusText}`);
      }

      const data = await response.json();
      setMessage(data.message);
      setIsSuccess(data.success);
      login(data.user);
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Signin error:', error);
    }
  }

  return (
    <Layout>
      <h2 className='text-2xl font-semibold mb-3'>Welcome Back To True Orgin</h2>
      <Tabs defaultValue="company" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="consumer">Consumer</TabsTrigger>
        </TabsList>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Log In To Your True Orgin Account</CardTitle>
              <CardDescription>
                Log In to your true orgin company account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="email">Company  Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms">We accept the terms and conditions</Label>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
              <Button onClick={() => companyLogin()} className="w-full">
                Log In
              </Button>
              <span className="text-center">Dont't have an account? <Link to={"/sign-up"} className="font-semibold text-blue-600">Sign Up</Link></span>
              {message && (
                <div className={`${isSuccess ? 'text-green-600' : 'text-red-600'} 'text-center font-semibold'`}>{message}</div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="consumer">
          <Card>
            <CardHeader>
              <CardTitle>Log In To Your True Orgin Account</CardTitle>
              <CardDescription>
                Log In to your true orgin consumer account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms">I accept the terms and conditions</Label>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
              <Button onClick={() => consumerLogin()} className="w-full">
                Log In
              </Button>
              <span className="text-center">Dont't have an account? <Link to={"/sign-up"} className="font-semibold text-blue-600">Sign Up</Link></span>
              {message && (
                <div className={`${isSuccess ? 'text-green-600' : 'text-red-600'} 'text-center font-semibold'`}>{message}</div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
