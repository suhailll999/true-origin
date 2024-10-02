import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from '@/hooks/use-toast'

export default function Footer() {
  const [feedback, setFeedback] = useState('')

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the feedback to your server
    console.log('Feedback submitted:', feedback)
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    })
    setFeedback('')
  }

  return (
    <footer className="bg-transparent px-5 py-8 w-full">
      <div className="container mx-auto grid gap-8 md:grid-cols-4">
        <div className="flex flex-col">
          <Link to="/" className="text-2xl font-semibold mb-2">True Origin</Link>
          <p className="text-sm text-gray-600">Ensuring authenticity through blockchain technology</p>
        </div>
        <div className="flex flex-col ">
          <h3 className="font-semibold mb-2 text-center ">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="text-sm hover:underline">Landing Page</Link>
            <Link to="/home" className="text-sm hover:underline">Home</Link>
            <Link to="/signin" className="text-sm hover:underline">Sign In</Link>
            <Link to="/signup" className="text-sm hover:underline">Sign Up</Link>
          </nav>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2 text-center">Feedback</h3>
          <form onSubmit={handleSubmitFeedback} className="flex flex-col space-y-2">
            <Input
              type="text"
              placeholder="Your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="text-sm"
              required
            />
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2 text-center">Connect With Us</h3>
          <div className="flex justify-around">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} True Origin. All rights reserved.
      </div>
    </footer>
  )
}