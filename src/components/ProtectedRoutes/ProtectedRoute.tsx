import { useEffect, type PropsWithChildren } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute = ({
  redirectPath = '/',
  children,
}: PropsWithChildren<ProtectedRouteProps>) => {
  const { isLoggedIn } = useAuthWalletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // eslint-disable-next-line no-console
      console.error('Unauthenticated page access.');
      navigate(redirectPath);
    }
  }, [isLoggedIn]);

  return children === undefined ? <Outlet /> : <>{children}</>;
};
