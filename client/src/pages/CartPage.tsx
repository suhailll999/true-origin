"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";

interface Product {
  _id: string;
  productName: string;
  image: string;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

interface CartData {
  _id: string;
  user: string;
  products: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export default function CartPage() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("/api/user/cart");
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data: CartData = await response.json();
        setCartData(data);
      } catch (err) {
        setError("Error fetching cart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleQuantityChange = async (itemId: string, change: number) => {
    if (!cartData) return;

    const updatedProducts = cartData.products.map((item) => {
      if (item._id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    const updatedCartData = { ...cartData, products: updatedProducts };
    setCartData(updatedCartData);

    // Update the total price
    const newTotalPrice = updatedProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    updatedCartData.totalPrice = newTotalPrice;

    // API call to update cart on the server
    try {
      const response = await fetch(`/api/user/cart/${cartData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCartData),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
    } catch (err) {
      setError("Error updating cart data.");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!cartData) return;

    const updatedProducts = cartData.products.filter(
      (item) => item._id !== itemId
    );
    const updatedCartData = { ...cartData, products: updatedProducts };
    setCartData(updatedCartData);

    // Update the total price
    const newTotalPrice = updatedProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    updatedCartData.totalPrice = newTotalPrice;

    // API call to remove item from the cart on the server
    try {
      const response = await fetch(`/api/user/cart/${cartData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCartData),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
    } catch (err) {
      setError("Error removing item from cart.");
    }
  };

  const totalPrice = useMemo(
    () =>
      cartData?.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) ?? 0,
    [cartData?.products]
  );

  return (
    <Layout>
      {error ? (
        <div className="flex justify-center items-center h-screen text-red-500">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="size-8 animate-spin"/>
        </div>
      ) : (
        cartData?.products.length! > 0 ? (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {cartData?.products.map((item) => (
                  <Card key={item._id} className="mb-4">
                    <CardContent className="flex items-center p-4">
                      <img
                        src={item.product.image}
                        alt={item.product.productName}
                        className="h-24 object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">
                          {item.product.productName}
                        </h3>
                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item._id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item._id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between mb-4">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <Link to={"/checkout"}>
                      <Button className="w-full">Proceed to Checkout</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ): (
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl text-muted-foreground font-semibold">You Have No Items In Cart</h2>
            <Link className="mx-auto" to={"/products"}><Button>Browse Products</Button></Link>
          </div>
        )
      )}
    </Layout>
  );
}
