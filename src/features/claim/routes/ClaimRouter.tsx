import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { DROP_TYPE } from '@/constants/common';
import { checkClaimedDrop } from '@/utils/claimedDrops';
import { ErrorBox } from '@/components/ErrorBox';
import { useClaimParams } from '@/hooks/useClaimParams';

const ClaimPage = () => {
  const navigate = useNavigate();
  const { contractId, secretKey } = useClaimParams();
  const [searchParams] = useSearchParams();
  const searchParamsStr = searchParams.toString();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropClaimed, setIsDropClaimed] = useState(false);

  const getClaimInfo = async () => {
    try {
      const drop = await keypomInstance.getDropInfo({ secretKey });
      const type = await keypomInstance.getLinkdropType(drop, contractId, secretKey);

      switch (type) {
        case DROP_TYPE.TOKEN:
          navigate(`/claim/token/${contractId}?${searchParamsStr}#${secretKey}`);
          break;
        case DROP_TYPE.TICKET:
          navigate(`/claim/ticket/${contractId}?${searchParamsStr}#${secretKey}`);
          break;
        case DROP_TYPE.NFT:
          navigate(`/claim/nft/${contractId}?${searchParamsStr}#${secretKey}`);
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
