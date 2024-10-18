import { useUser } from '@/context/userContext';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const {user} = useUser();

  return user ? <Outlet/> : <Navigate to={'/sign-in'}/>;
}