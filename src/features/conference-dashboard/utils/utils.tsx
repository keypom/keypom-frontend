import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useSponsorDashboardParams = () => {
  const navigate = useNavigate();
  const { id: sponsorAccountId } = useParams();
  const { hash } = useLocation();

  let accountId = sponsorAccountId;
  let secretKey = hash ? hash.replace('#', '') : '';

  if (accountId && secretKey) {
    // Store in local storage
    localStorage.setItem('SPONSOR_ACCOUNT_ID', accountId);
    localStorage.setItem('SPONSOR_SECRET_KEY', secretKey);

    // Clear URL
    // navigate(`/dashboard/${sponsorAccountId}`, { replace: true });
    return {
      sponsorAccountId,
      secretKey,
    };
  }

  accountId = localStorage.getItem('EVENT_DROP_ID') || '';
  secretKey = localStorage.getItem('EVENT_SECRET_KEY') || '';

  if (!accountId || !secretKey) {
    console.error(
      'Navigating to home page. sponsor account or SecretKey are not found in the URL or local storage',
    );
    navigate('/');
  }

  return {
    sponsorAccountId,
    secretKey,
  };
};

