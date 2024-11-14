import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

const Header = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  // Handle case where UserContext might be undefined
  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }
  const { user, logout } = userContext;

  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
      });
      if (res.ok) {
        logout();
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const consumerItems = [
    {
      title: "All Products",
      url: "/products",
    },
    {
      title: "My Reports",
      url: "/my-reports",
    },
    {
      title: "Orders",
      url: "/my-orders",
    },
    {
      title: "Cart",
      url: "/cart",
    },
  ];

  const companyItems = [
    {
      title: "Our Products",
      url: "/all-products",
    },
  ];

  const adminItems = [
    {
      title: "All Orders",
      url: "/all-orders",
    },
    {
      title: "All Reports",
      url: "/all-reports",
    },
  ];

  const items =
    user?.role === "admin"
      ? adminItems
      : user?.role === "company"
      ? companyItems
      : consumerItems;

  return (
    <header
      className={`w-full h-16 px-4 sm:px-6 lg:px-8 ${
        isDark ? "text-white" : "text-black"
      } bg-transparent z-20 relative`}
    >
      <div className="container mx-auto h-full flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold">
          True Origin
        </Link>
        <nav className="hidden md:flex gap-10">
          <Link to="/home" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
          {user &&
            items.map(({ title, url }) => (
              <Link key={title} className="text-sm font-medium hover:underline" to={url}>
                {title}
              </Link>
            ))}
        </nav>
        {user ? (
          <div className="flex w-1/3 justify-between items-center">
            <p>
              Welcome <span className="font-semibold text-blue-600">{user.name}</span>
            </p>
            <span className="capitalize px-2 rounded-md bg-blue-600 text-white">
              {user.role}
            </span>
            <Button
              variant={`${isDark ? "secondary" : "default"}`}
              onClick={() => handleLogOut()}
              className={isDark ? "bg-white text-black" : "bg-black text-white"}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant={`${isDark ? "secondary" : "default"}`}>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
