import { Box, Button, Center, Spinner, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { useClaimForm } from '../ClaimFormContext';

import { useClaimTicketFlow } from './ClaimTicketFlowContext';

export interface ClaimTicketFormFieldTypes {
  name: string;
  email: string;
}

export const ClaimTicketForm = () => {
  const { onNext } = useClaimTicketFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [claimError, setClaimError] = useState('');
  const { handleClaim } = useClaimForm();
  // const { handleSubmit, control } = useFormContext<ClaimTicketFormFieldTypes>();

  const handleSubmitClick = async () => {
    setIsLoading(true);
    try {
      await handleClaim();
    } catch (err) {
      setClaimError(err.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    onNext();
  };

  if (claimError) {
    return (
      <Box w="100%">
        <Text variant="error">{claimError}</Text>
      </Box>
    );
  }

  return (
    <Box
      style={{ width: '100%' }}
      // onSubmit={handleSubmit(handleSubmitClick)}
    >
      {/* <VStack mb="8" spacing="4" w="full">
        <NameField control={control} /> TODO: to be readded in future
        <EmailField control={control} />
      </VStack> */}
      {isLoading ? (
        <Center>
          <Spinner size="lg" />
        </Center>
      ) : (
        <Button type="submit" w="full" onClick={handleSubmitClick}>
          Show me my ticket
        </Button>
      )}
    </Box>
  );
};
