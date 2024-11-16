import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const stripePromise = loadStripe('pk_test_51QLHAuSJkaLKYIXLbJmOCXLLN543xUCNNZvraGi4MR5aqAencvG2qd4lZTqET5gLdsvtLQLdF90DCrZg0ctlpyfJ00kD9qGPl0');

// Form input fields and error types
interface FormData {
  name: string;
  phoneNumber: string;
  pincode: string;
  address: string;
}
interface FormErrors extends Partial<FormData> {}

// Custom hook to fetch clientSecret
const useFetchClientSecret = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/user/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else console.error('Failed to fetch clientSecret:', data);
      } catch (error) {
        console.error('Error fetching PaymentIntent:', error);
      }
    };

    fetchClientSecret();
  }, []);

  return clientSecret;
};

const CheckoutForm = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', phoneNumber: '', pincode: '', address: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const validateForm = (): boolean => {
    const { name, phoneNumber, pincode, address } = formData;
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';
    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = 'Invalid pincode';
    if (!address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific errors
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;
    if (!stripe || !elements) {
      setMessage('Stripe.js has not loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit order');

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: 'http://localhost:3000/complete' },
      });

      if (error) setMessage(error.message as string);
      else navigate('/complete');
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while submitting your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {['name', 'phoneNumber', 'pincode', 'address'].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                name={field}
                value={formData[field as keyof FormData]}
                onChange={handleChange}
                aria-invalid={!!errors[field as keyof FormErrors]}
              />
              {errors[field as keyof FormErrors] && (
                <p className="text-sm text-red-500">{errors[field as keyof FormErrors]}</p>
              )}
            </div>
          ))}
          <PaymentElement id="payment-element" />
          {message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Pay and Place Order'}
            <CreditCard className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default function CheckoutPage() {
  const clientSecret = useFetchClientSecret();

  if (!clientSecret) return <p>Loading...</p>;

  return (
    <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
