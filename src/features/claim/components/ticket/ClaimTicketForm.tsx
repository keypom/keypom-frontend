import { Box, Button } from '@chakra-ui/react';

import { useClaimForm } from '../ClaimFormContext';

import { useClaimTicketFlow } from './ClaimTicketFlowContext';

export interface ClaimTicketFormFieldTypes {
  name: string;
  email: string;
}

interface ClaimTicketFormProps {}

export const ClaimTicketForm = ({}: ClaimTicketFormProps) => {
  const { onNext } = useClaimTicketFlow();

  const { handleClaim } = useClaimForm();
  // const { handleSubmit, control } = useFormContext<ClaimTicketFormFieldTypes>();

  const handleSubmitClick = async () => {
    // TODO: handle name/email validation and send email
    await handleClaim();
    onNext();
  };

  return (
    <Box
      style={{ width: '100%' }}
      // onSubmit={handleSubmit(handleSubmitClick)}
    >
      {/* <VStack mb="8" spacing="4" w="full">
        <NameField control={control} />
        <EmailField control={control} />
      </VStack> */}
      <Button type="submit" w="full" onClick={handleSubmitClick}>
        Show me my ticket
      </Button>
    </Box>
  );
};
