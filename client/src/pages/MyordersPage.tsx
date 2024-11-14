import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { AlertCircle, Loader, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";

interface Product {
  _id: string;
  productName: string;
  image: string;
  price: number;
}

interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  products: OrderItem[];
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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/user/my-orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Error fetching orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : orders.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <h2 className="text-2xl font-bold mb-4">
            You haven't placed any orders yet
          </h2>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="space-y-8">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <CardTitle>Order #{order._id}</CardTitle>
                  <CardDescription>
                    Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.products.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4">
                        <img
                          src={item.product.image}
                          alt={item.product.productName}
                          className="w-20 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold">
                            {item.product.productName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} | Price: ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Price:</span>
                    <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Delivery Status:</span>
                      <Badge
                        className="capitalize"
                        variant={
                          order.deliveryStatus === "delivered"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.deliveryStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Payment Status:</span>
                      <Badge
                        className="capitalize"
                        variant={
                          order.paymentStatus === "paid" ? "default" : "destructive"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-2">
                    <h4 className="font-semibold">Shipping Address:</h4>
                    <p className="text-sm">
                      {order.name}
                      <br />
                      {order.address}
                      <br />
                      Pincode: {order.pincode}
                      <br />
                      Phone: {order.phoneNumber}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
