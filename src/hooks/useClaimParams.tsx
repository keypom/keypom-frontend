import { useNavigate, useParams } from 'react-router-dom';

export const useClaimParams = () => {
  const navigate = useNavigate();
  const { contractIdSecretKey } = useParams<{ contractIdSecretKey: string }>();
  const param = contractIdSecretKey?.split('#');
  if (
    param === undefined ||
    param?.length !== 2 ||
    param[0] === undefined ||
    param[1] === undefined ||
    param[0] === '' ||
    param[1] === ''
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
    contractId: param[0],
    secretKey: param[1],
  };
};
