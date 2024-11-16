import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Info, ShoppingCart, LoaderCircle } from "lucide-react";
import Layout from "@/components/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  productName: string;
  manufacturer: string;
  distributer: string;
  manufacturingDate: string;
  description: string;
  expiringDate: string | null;
  createdAt: string;
  updatedAt: string;
  image: string;
  price: string;
}

export default function UserProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/user/products");
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

  // const handleProductClick = (productId: string) => {
  //   navigate(`/product/${productId}`);
  // };


  const addToCart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const userData = {
        productId: formData.get("productId"),
        quantity: formData.get("quantity"),
      };

      const res = await fetch("/api/user/add-to-cart", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ ...userData }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Failed to add product to cart!",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Product added successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="size-full flex justify-center items-center">
            <LoaderCircle className="size-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="size-full flex justify-center items-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          products && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="py-4">
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center justify-center w-[250px] h-[350px] mx-auto">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xl font-semibold text-center">
                      {product.productName}
                    </p>
                    <p className="text-xl">₹{product.price}</p>
                  </CardContent>
                  <CardFooter>
                    <form
                      className="flex justify-between w-10/12 mx-auto"
                      onSubmit={addToCart}
                    >
                      <Select name="quantity" defaultValue="1">
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="Quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name="productId"
                        value={product._id}
                      />
                      <Button className="w-1/3" type="submit" variant="default">
                        <ShoppingCart className="mr-2" /> Add to cart
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
