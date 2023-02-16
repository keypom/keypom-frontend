import { Box, Button, Center, Spinner } from '@chakra-ui/react';
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

  const { handleClaim } = useClaimForm();
  // const { handleSubmit, control } = useFormContext<ClaimTicketFormFieldTypes>();

  const handleSubmitClick = async () => {
    setIsLoading(true);
    await handleClaim();
    setIsLoading(false);
    onNext();
  };

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
