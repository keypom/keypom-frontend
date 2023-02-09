import { type PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isUndefined } from 'lodash';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute = ({
  redirectPath = '/',
  children,
}: PropsWithChildren<ProtectedRouteProps>) => {
  const { isLoggedIn } = useAuthWalletContext();

  if (!isLoggedIn) {
    return <Navigate replace to={redirectPath} />;
  }

  return isUndefined(children) ? <Outlet /> : <>{children}</>;
};
