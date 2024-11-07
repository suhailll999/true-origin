import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import VerificationPage from "./pages/VerificationPage";
import MainPage from "./pages/MainPage";
import RegisterProduct from "./pages/RegisterProduct";
import AboutPage from "./pages/AboutPage";
import { UserProvider } from "./context/userContext";
import { Toaster } from "./components/ui/toaster";
import PrivateRoute from "./components/PrivateRoute";
import CompanyRoute from "./components/CompanyRoute";
import AllProductsPage from "./pages/AllProductsPage";
import SingleProduct from "./pages/SingleProductPage";
import UserProducts from "./pages/AllProducts";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyordersPage";
import AdminRoutes from "./components/AdminRoute";

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route element={<AdminRoutes/>}>
          <Route path="all-orders" element={<h1>All Orders</h1>}/>
        </Route>
        <Route element={<CompanyRoute/>}>
          <Route path="/all-products" element={<AllProductsPage/>}/>
          <Route path="/product/:id?" element={<SingleProduct/>}/>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<MainPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/register" element={<RegisterProduct />} />
          <Route path="/products" element={<UserProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Toaster />
    </UserProvider>
  );
};

export default App;
