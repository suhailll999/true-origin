import { useUser } from "@/context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const { user } = useUser();
  return user ? (
    user.role === "admin" ? (
      <Outlet />
    ) : (
      <Navigate to={"/home"} />
    )
  ) : (
    <Navigate to={"/sign-in"} />
  );
};

export default AdminRoutes;
