import { Link } from "react-router-dom"

const Header = () => {
  return (
    <div className="w-screen h-16 px-10 bg-black/30 flex items-center justify-between">
        <span className="text-2xl font-semibold">True Orgin</span>
        <div className="flex w-1/4 items-center justify-around">
        <Link to={"/sign-in"}>Sign In</Link>
        <Link to={"/sign-up"}>Sign Up</Link>
        </div>
    </div>
  )
}

export default Header