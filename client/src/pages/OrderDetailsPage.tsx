"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

interface Product {
  product: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  products: Product[];
  totalPrice: number;
  userId: string;
  name: string;
  phoneNumber: string;
  pincode: string;
  address: string;
  deliveryStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const deliveryStatuses = [
  "not dispatched",
  "dispatched",
  "out for delivery",
  "delivered",
  "returned",
];

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/admin/order/${orderId}`);
        const data: any = await response.json();
        if (!response.ok) {
          setError(data.message)
        }
        setOrder(data);
      } catch (err) {
        setError("Error fetching order details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleDeliveryStatusChange = async (newStatus: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/update-order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      setOrder({ ...order, deliveryStatus: newStatus });

      toast({
        title: data.message,
        description: `Delivery status has been updated to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update delivery status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : order ? (
        <div className="container mx-auto px-4 py-8">
          <Link to={"/all-orders"}><Button
            variant="outline"
            className="mb-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button></Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Order Information
                  </h2>
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {format(new Date(order.createdAt), "PPpp")}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Select
                      value={order.deliveryStatus}
                      onValueChange={handleDeliveryStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Delivery Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge
                      variant={
                        order.paymentStatus === "paid"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Customer Information
                  </h2>
                  <p>
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phoneNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {order.pincode}
                  </p>
                </div>
              </div>
              <Separator className="my-6" />
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.product}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(product.quantity * product.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right">
                <p className="text-lg font-semibold">
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="size-full flex justify-center items-center">
          <span>No Order found with ID{orderId}</span>
        </div>
      )}
    </Layout>
  );
}
