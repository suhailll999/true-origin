import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const isDark = theme === "dark";

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
        <nav className="hidden md:flex w-1/5 justify-around">
          <Link to="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className={isDark ? "bg-white text-black" : "bg-black text-white"}>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
