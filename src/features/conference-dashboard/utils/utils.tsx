import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useSponsorDashboardParams = () => {
    const navigate = useNavigate();
    const { id: sponsorAccountId } = useParams();
    const { hash } = useLocation();
  
    let dropId = sponsorAccountId;
    let secretKey = hash ? hash.replace('#', '') : '';
  
    if (dropId && secretKey) {
      // Store in local storage
      localStorage.setItem('SPONSOR_ACCOUNT_ID', dropId);
      localStorage.setItem('SPONSOR_SECRET_KEY', secretKey);
  
      // Clear URL
      navigate(`/dashboard/${sponsorAccountId}`, { replace: true });
    } else {
      // Fallback to local storage
      dropId = localStorage.getItem('EVENT_DROP_ID') || '';
      secretKey = localStorage.getItem('EVENT_SECRET_KEY') || '';
    }
  
    if (!dropId || !secretKey) {
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
  