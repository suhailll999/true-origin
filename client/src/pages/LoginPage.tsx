import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        setIsSuccess(data.success);
        setMessage(data.message);
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setMessage(data.message);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <div className="bg-gray-100 overflow-x-hidden">
      <Header />
      <section className='w-screen h-[calc(100vh-4rem)] flex justify-center items-center'>
        <Card className=" mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-3'>
              <Button type="submit" className="w-full">
                Log In
              </Button>
              <span className="text-center">Don't have an account? <Link to={"/sign-up"} className="font-semibold text-blue-600">Sign Up</Link></span>
              {message && (
                <span className={`${isSuccess ? 'bg-green-600' : 'bg-red-600'} 'w-80 mx-auto px-8 py-4 rounded-lg shadow-lg'`}>{message}</span>
              )}
            </CardFooter>
          </form>
        </Card>
      </section>
    </div>
  )
}