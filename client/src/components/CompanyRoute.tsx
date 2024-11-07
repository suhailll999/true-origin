import { useUser } from "@/context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const CompanyRoute = () => {
  const { user } = useUser();
  return user ? (
    user.role === "company" ? (
      <Outlet />
    ) : (
      <Navigate to={"/home"} />
    )
  ) : (
    <Navigate to={"/sign-in"} />
  );
};

export default CompanyRoute;
