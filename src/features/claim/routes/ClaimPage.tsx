import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { DROP_TYPE } from '@/constants/common';
import { checkClaimedDrop } from '@/utils/claimedDrops';
import { ErrorBox } from '@/components/ErrorBox';
import { useClaimParams } from '@/hooks/useClaimParams';

const ClaimPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropClaimed, setIsDropClaimed] = useState(false);

  const getClaimInfo = async () => {
    try {
      const type = await keypomInstance.getLinkdropType(contractId, secretKey);
      switch (type) {
        case DROP_TYPE.TOKEN:
          navigate(`/claim/token/${contractId}#${secretKey}`);
          break;
        case DROP_TYPE.TICKET:
          navigate(`/claim/ticket/${contractId}#${secretKey}`);
          break;
        case DROP_TYPE.NFT:
          navigate(`/claim/nft/${contractId}#${secretKey}`);
          break;
        default:
          throw new Error('This linkdrop is unsupported.');
      }
    } catch (err) {
      setError('Unable to claim. This drop may have been claimed before.');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId === '' || secretKey === '') {
      navigate('/');
    }

    const hasDropClaimedBefore = checkClaimedDrop(secretKey);
    if (hasDropClaimedBefore) {
      setIsDropClaimed(hasDropClaimedBefore);
      return;
    }

    // eslint-disable-next-line
    getClaimInfo();
  }, []);

  if (isDropClaimed) {
    return <ErrorBox message="This drop has been claimed." />;
  }

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
