import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useTicketClaimParams = () => {
  const navigate = useNavigate();
  const { id: dropId = '' } = useParams();
  const { hash } = useLocation();

  let secretKey = '';
  if (hash !== undefined) {
    secretKey = hash.replace('#', '');
  }

  if (dropId === undefined || dropId === '' || secretKey === undefined || secretKey === '') {
    console.error(
      'Navigating to home page. dropId or SecretKey are not found in the URL paramater',
    );
    navigate('/');
    return {
      dropId: '',
      secretKey: '',
    };
  }

  return {
    dropId,
    secretKey,
  };
};
