import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

interface Product {
  _id: string;
  productName: string;
  manufacturer: {
    name: string;
  };
  distributer: string;
  manufacturingDate: string;
  expiringDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/company/all-products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching products");
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/company/delete-product/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="w-full h-full flex items-center justify-center">
        {products.length > 0 ? (
          <Card className="w-full max-w-4xl mx-auto my-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Distributer</TableHead>
                    <TableHead>Manufacturing Date</TableHead>
                    <TableHead>Expiring Date</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Link to={`/product/${product._id}`}>
                          {product.productName}
                        </Link>
                      </TableCell>
                      <TableCell>{product.manufacturer.name}</TableCell>
                      <TableCell>{product.distributer}</TableCell>
                      <TableCell>
                        {new Date(
                          product.manufacturingDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {product.expiringDate
                          ? new Date(product.expiringDate).toLocaleDateString()
                          : "No Expiration"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={"destructive"}
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3 items-center">
            <p className="text-2xl text-muted-foreground font-semibold">You have no products yet</p>
            <Link to={"/register"} className="inline-flex hover:underline transition-transform"><ArrowLeft/>Register Your Product</Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
