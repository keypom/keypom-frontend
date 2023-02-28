import { useEffect } from 'react';
import { Center, Flex, Heading, Text, VStack } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { DROP_TYPE } from '@/constants/common';

import { useClaimForm } from '../ClaimFormContext';

import { QrDetails } from './[id]/QrDetails';
import { NftGift } from './[id]/NftGift';
import { TokenGift } from './[id]/TokenGift';

export const ClaimTicketSummaryFlow = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { nftImage, title, qrValue, giftType, tokens } = useClaimForm();

  return (
    <Center>
      {/** the additional gap is to accommodate for the absolute roundIcon size */}
      <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
        {/** Prompt text */}
        <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="500" textAlign="center">
          Your ticket
        </Heading>

        {/** Your ticket component */}
        <IconBox
          icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
          maxW={{ base: '345px', md: '30rem' }}
          minW={{ base: 'inherit', md: '345px' }}
          p="0"
          pb="0"
        >
          <BoxWithShape bg="white" borderTopRadius="8xl" w="full ">
            <QrDetails qrValue={qrValue} ticketName={title} />
          </BoxWithShape>
          <Flex align="center" bg="gray.50" borderBottomRadius="8xl" flexDir="column" px="6" py="8">
            <Text color="gray.800" fontWeight="500" mb="5" size="lg" textAlign="center">
              Attendance gifts
            </Text>

            {giftType === DROP_TYPE.NFT ? (
              <NftGift giftName={title} imageSrc={nftImage} />
            ) : (
              <TokenGift tokenList={tokens} />
            )}

            <Text color="gray.600" mb="6" size={{ base: 'sm', md: 'base' }} textAlign="center">
              Return here after checking into the event to claim.
            </Text>
          </Flex>
        </IconBox>
      </VStack>
    </Center>
  );
};
