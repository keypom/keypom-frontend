import { useEffect, type PropsWithChildren } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      console.error('Unauthenticated page access.');
      navigate(redirectPath);
    }
  }, [isLoggedIn]);

  return isUndefined(children) ? <Outlet /> : <>{children}</>;
};
