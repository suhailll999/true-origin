"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/userContext";

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
            This product has been verified as authentic in our
            anti-counterfeiting system.
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
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productReport, setProductReport] = useState({
    productName: "",
    productDescription: "",
  });
  const { toast } = useToast();
  const {user} = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/product/${serialNumber}`);
      const data = await res.json();

      if (!data.success) {
        if (data.statusCode === 404) {
          toast({
            title: data.message || "Product is not found in our database",
            description: "Report this product to us!",
            variant: "destructive",
          });
          setOpen(true);
          return;
        }

        toast({
          title: "Error",
          description: data?.message || "Failed to fetch product data",
          variant: "destructive",
        });
        setProductData(null);
        return;
      }

      setProductData(data.product);
      toast({
        title: "Success",
        description: data.message || "Product verified as authentic",
        variant: "default",
      });
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setProductData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    const userData = {
      ...productReport,
      userId: user?._id, 
      productId: serialNumber
    }
    try {
      const res = await fetch("/api/user/report-product", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!data.success) {
        toast({
          title: "Failed to submit your report!",
          description: data.message || "Please try again",
        });
        return;
      }
      toast({
        title: "Thanks for submitting your report",
        description: data.message || "Thank you",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProductReport((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Layout center={false}>
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
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl">
              Report This Product
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="name" className="col-span-2">
                Product Name
              </Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={productReport.productName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                className="max-h-24"
                maxLength={100}
                id="productDescription"
                value={productReport.productDescription}
                onChange={handleChange}
                placeholder="Describe about this product!"
              />
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2">
            <DialogClose>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={() => handleReportSubmit()}>Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
