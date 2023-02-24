import { Center, Flex, Heading, Spinner, VStack } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { ErrorBox } from '@/components/ErrorBox';

import { useClaimForm } from '../ClaimFormContext';

import { ClaimTicketDetails } from './ClaimTicketDetails';
import { ClaimTicketForm } from './ClaimTicketForm';

export const ClaimTicketFormFlow = () => {
  const { claimInfoError, isClaimInfoLoading } = useClaimForm();

  if (claimInfoError) {
    return <ErrorBox message={claimInfoError} />;
  }

  if (isClaimInfoLoading) {
    return (
      <Center h={{ base: '300px', md: '500px' }}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Center>
      {/** the additional gap is to accommodate for the absolute roundIcon size */}
      <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
        {/** Prompt text */}
        <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="500" textAlign="center">
          Claim your ticket
        </Heading>

        {/** Claim ticket component */}
        <IconBox
          icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
          maxW={{ base: '345px', md: '30rem' }}
          minW={{ base: 'inherit', md: '345px' }}
          p="0"
          pb="0"
        >
          <Flex
            align="center"
            flexDir="column"
            p={{ base: '6', md: '8' }}
            pt={{ base: '12', md: '16' }}
          >
            <ClaimTicketDetails />
            <ClaimTicketForm />
          </Flex>
        </IconBox>
      </VStack>
    </Center>
  );
};
