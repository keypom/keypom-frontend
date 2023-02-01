import { Center, Flex, Heading, VStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { TicketIcon } from '@/common/components/Icons';

import { ClaimTicketDetails } from './ClaimTicketDetails';
import { ClaimTicketForm } from './ClaimTicketForm';

export const ClaimTicketFormFlow = () => {
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
            <ClaimTicketDetails
              imageSrc={'https://vaxxeddoggos.com/assets/doggos/1042.png'}
              ticketName="Maple Leafs vs New York Islanders"
            />
            <ClaimTicketForm />
          </Flex>
        </IconBox>
      </VStack>
    </Center>
  );
};
