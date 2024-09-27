import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/sign-in" element={<LoginPage/>}/>
      <Route path="/sign-up" element={<SignUpPage/>}/>
    </Routes>
  )
}

export default App