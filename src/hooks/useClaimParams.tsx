import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useClaimParams = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { contractId } = useParams<{ contractId: string }>();

  let secretKey = '';
  if (hash !== undefined) {
    secretKey = hash.replace('#', '');
  }

  if (
    contractId === undefined ||
    contractId === '' ||
    secretKey === undefined ||
    secretKey === ''
  ) {
    console.error(
      'Navigating to home page. ContractId or SecretKey are not found in the URL paramater',
    );
    navigate('/');
    return {
      contractId: '',
      secretKey: '',
    };
  }

  // TODO: add validation for contract and secret key in case if the order is wrong

  return {
    contractId,
    secretKey,
  };
};
