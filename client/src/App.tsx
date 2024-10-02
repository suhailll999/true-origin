import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"
import VerificationPage from "./pages/VerificationPage"
import MainPage from "./pages/MainPage"
import RegisterProduct from "./pages/RegisterProduct"
import AboutPage from "./pages/AboutPage"
import { UserProvider } from "./context/userContext"
import { Toaster } from "./components/ui/toaster"

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/register" element={<RegisterProduct />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Toaster />
    </UserProvider>
  )
}

export default App;