import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { DROP_TYPE } from '@/constants/common';

const ClaimPage = () => {
  const { contractId = '', secretKey = '' } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getClaimInfo = async () => {
    try {
      const type = await keypomInstance.getLinkdropType(contractId, secretKey);
      switch (type) {
        case DROP_TYPE.TOKEN:
          navigate(`/claim/token/${secretKey}`);
          break;
        case DROP_TYPE.TICKET:
          navigate(`/claim/ticket/${contractId}/${secretKey}`);
          break;
        case DROP_TYPE.NFT:
          navigate(`/claim/nft/${contractId}/${secretKey}`);
          break;
        default:
          throw new Error('This linkdrop is unsupported.');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId === '' || secretKey === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    getClaimInfo();
  }, []);

  return (
    <Center h={{ base: '300px', md: '500px' }}>
      {loading && (
        <Box>
          <Spinner size="xl" />
        </Box>
      )}
      {error !== null && <Text variant="error">{error}</Text>}
    </Center>
  );
};

export default ClaimPage;
