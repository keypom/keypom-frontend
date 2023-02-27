import { Box, Button, Center, Spinner, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getKeyInformation } from 'keypom-js';

import { useClaimParams } from '@/hooks/useClaimParams';

import { useClaimForm } from '../ClaimFormContext';

import { useClaimTicketFlow } from './ClaimTicketFlowContext';

export interface ClaimTicketFormFieldTypes {
  name: string;
  email: string;
}

export const ClaimTicketForm = () => {
  const { onNext } = useClaimTicketFlow();
  const { secretKey } = useClaimParams();
  const [isLoading, setIsLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimAttempted, setClaimAttempted] = useState(false);
  const { handleClaim } = useClaimForm();
  // const { handleSubmit, control } = useFormContext<ClaimTicketFormFieldTypes>();

  const claimTicket = async () => {
    try {
      await handleClaim();
    } catch (err) {
      setClaimError(err.message);
    }
  };

  const checkClaim = async () => {
    const keyInfo = await getKeyInformation({ secretKey });
    console.log('claiming', claimAttempted, keyInfo.cur_key_use);
    if (!claimAttempted && keyInfo.cur_key_use === 1) {
      // do not await since it will only prevent user from seeing QR code, we can always show error after
      claimTicket();
    }
    setClaimAttempted(true);
  };
  useEffect(() => {
    checkClaim();
  }, []);

  const handleSubmitClick = async () => {
    if (!claimAttempted) {
      setClaimError(`It looks like this ticket isn't valid.`);
      return;
    }

    const keyInfo = await getKeyInformation({ secretKey });
    if (!claimAttempted && keyInfo.cur_key_use === 1) {
      setIsLoading(true);
      // don't await and claimTicket will show error
      claimTicket().finally(() => {
        setIsLoading(false);
      });
    }

    // can show ticket and error message later
    onNext();
  };

  if (claimError) {
    return (
      <Box w="100%">
        <Text variant="error">{claimError}</Text>
      </Box>
    );
  }

  if (isLoading)
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
    );

  return (
    <Box
      style={{ width: '100%' }}
      // onSubmit={handleSubmit(handleSubmitClick)}
    >
      {/* <VStack mb="8" spacing="4" w="full">
        <NameField control={control} /> TODO: to be readded in future
        <EmailField control={control} />
      </VStack> */}
      <Button type="submit" w="full" onClick={handleSubmitClick}>
        Show my ticket!
      </Button>
    </Box>
  );
};
