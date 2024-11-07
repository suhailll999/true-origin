"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductData {
  distributer: string;
  manufacturer: {
    name: string;
  };
  manufacturingDate: string;
  expiryDate?: string;
  productName: string;
  _id: string;
}

function ProductDetails({ product }: { product: ProductData }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{product.productName}</CardTitle>
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2" />
            <span className="font-semibold">Authentic Product</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-green-600">
            You have a genuine product
          </h2>
          <p className="text-sm text-gray-500">
            This product has been verified as authentic in our anti-counterfeiting system.
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-500">Manufacturer</dt>
            <dd>{product.manufacturer.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Distributer</dt>
            <dd>{product.distributer}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Manufacturing Date</dt>
            <dd>{new Date(product.manufacturingDate).toLocaleDateString()}</dd>
          </div>
          {product.expiryDate && (
            <div>
              <dt className="font-medium text-gray-500">Expiry Date</dt>
              <dd>{new Date(product.expiryDate).toLocaleDateString()}</dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-gray-500">Product ID</dt>
            <dd>{product._id}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

export default function VerificationPage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/product/${serialNumber}`);
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: data?.message || "Failed to fetch product data",
          variant: "destructive"
        });
        setProductData(null);
        return;
      }
      setProductData(data);
      toast({
        title: "Success",
        description: "Product verified as authentic",
        variant: "default"
      });
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setProductData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Verify Product Authenticity
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="serialNumber" className="sr-only">
                Product Serial Number
              </Label>
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
          {productData && <ProductDetails product={productData} />}
        </div>
      </div>
    </Layout>
  );
}