'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Layout from '@/components/Layout'
import { useToast } from '@/hooks/use-toast'

export default function RegisterProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
  
    const formData = new FormData(event.currentTarget);
    const productData = {
      productName: formData.get("productName") as string,
      manufacturer: formData.get("manufacturer") as string,
      distributer: formData.get("distributer") as string,
      manufacturingDate: formData.get("manufacturingDate") as string,
      expiringDate: formData.get("expiringDate") as string,
      description: formData.get("productDescription") as string,
    };
  
    try {
      const response = await fetch("/api/company/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to register product");
      }

      console.log("Product registered:", result);
  
      toast({
        title: "Success",
        description: "Product registered successfully!",
        variant: "default",
      });


    } catch (error: any) {
      console.error("Error:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to register product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-6">Register Product on Blockchain</h1>
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
            <Input id="expiringDate" name="expiringDate" type="date" />
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
    </Layout>
  );
}
