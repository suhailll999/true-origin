"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode } from "lucide-react"
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function VerificationPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Verify Product Authenticity</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="serialNumber" className="sr-only">Product Serial Number</Label>
              <div className="flex space-x-2">
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter serial number"
                  required
                  className="flex-grow"
                />
                <Button type="button" variant="outline" className="w-12 px-0">
                  <QrCode className="h-4 w-4" />
                  <span className="sr-only">Scan QR Code</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Product"}
            </Button>
          </form>
        </div>
      </main>
      <Footer/>
    </div>
  )
}