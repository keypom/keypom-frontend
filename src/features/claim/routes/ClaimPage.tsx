import { Box, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';

const ClaimPage = () => {
  const { contractId, secretKey } = useParams();
  const navigate = useNavigate();

  const process = async () => {
    await keypomInstance.getClaimDropType(contractId as string, secretKey as string);
  };

  useEffect(() => {
    if (contractId === undefined || secretKey === undefined) {
      navigate('/');
    }
    // eslint-disable-next-line
    process();
  }, []);

  return (
    <div>
      {contractId} {secretKey}
      <Box>
        <Spinner />
      </Box>
    </div>
  );
};

export default ClaimPage;
