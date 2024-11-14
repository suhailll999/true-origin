"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

interface Product {
  _id: string;
  productName: string;
  manufacturer: {
    name: string;
  };
  distributer: string;
  manufacturingDate: string;
  description: string;
  price: string | number;
  expiringDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SingleProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/company/product/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching the product");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || "Product not found"}</p>
      </div>
    );
  }

  return (
    <Layout>
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {product.productName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Manufacturer:</h3>
              <p>{product.manufacturer.name}</p>
            </div>
            {product.price && (
              <div>
                <h3 className="font-semibold">Price:</h3>
                <p>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price as number)}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Distributer:</h3>
              <p>{product.distributer}</p>
            </div>
            <div>
              <h3 className="font-semibold">Manufacturing Date:</h3>
              <p>{new Date(product.manufacturingDate).toLocaleDateString()}</p>
            </div>
            {product.expiringDate && (
              <div>
                <h3 className="font-semibold">Expiring Date:</h3>
                <p>{new Date(product.expiringDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Description:</h3>
            <p>{product.description}</p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Link className="inline-flex" to={"/all-products"}>
            <ArrowLeft /> All Products
          </Link>
        </CardFooter>
      </Card>
    </Layout>
  );
}
