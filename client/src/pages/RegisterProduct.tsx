'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
// import { toast } from "@/components/ui/use-toast"

// This is a placeholder function. In a real application, this would interact with the blockchain.
const registerProductOnBlockchain = async (productData: any) => {
  // Simulate blockchain interaction
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('Product registered on blockchain:', productData)
  return { success: true, transactionHash: '0x' + Math.random().toString(16).substr(2, 64) }
}

export default function RegisterProduct() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const productData = Object.fromEntries(formData)

    try {
      const result = await registerProductOnBlockchain(productData)
      if (result.success) {
        // toast({
        //   title: "Product Registered Successfully",
        //   description: `Transaction Hash: ${result.transactionHash}`,
        // })
      }
    } catch (error) {
    //   toast({
    //     title: "Registration Failed",
    //     description: "There was an error registering the product. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-screen mx-auto p-6">
        <Header/>
      <div className="max-w-2xl mx-auto">
      <h1 className=" text-3xl text-center font-bold mb-6">Register Product on Blockchain</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" name="productName" required />
        </div>
        <div>
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input id="manufacturer" name="manufacturer" required />
        </div>
        <div>
          <Label htmlFor="distributer">Distributer</Label>
          <Input id="distributer" name="distributer" required />
        </div>
        <div>
          <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
          <Input id="manufacturingDate" name="manufacturingDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="expiringDate">Expiring Date</Label>
          <Input id="expiringDate" name="expiringDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="productDescription">Product Description</Label>
          <Textarea id="productDescription" name="productDescription" />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register Product"}
        </Button>
      </form>
      </div>
      <Footer/>
    </div>
  )
}