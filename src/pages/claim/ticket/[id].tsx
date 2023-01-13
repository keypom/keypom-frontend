import { Box, Center, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { TicketIcon } from '@/common/components/Icons';
import { BoxWithShape } from '@/common/components/BoxWithShape';

import { ClaimFormContextProvider } from '@/modules/claim/ClaimFormContext';
import { QrDetails } from '@/modules/claim/ticket/[id]/QrDetails';
import { NftGift } from '@/modules/claim/ticket/[id]/NftGift';
import { TokenGift } from '@/modules/claim/ticket/[id]/TokenGift';

const YourTicketPage = () => {
  const router = useRouter();
  const giftId = router.query['id'];

  const isNftGif = parseInt(giftId as string) % 2 === 0;

  const handleDownloadQr = () => {
    return null;
  };

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Page detailing all your ticket."
        name="Your ticket"
      />
      <ClaimFormContextProvider>
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
              minW={{ base: 'inherit', md: '345px' }}
              p="0"
              pb="0"
              w={{ base: '345px', md: '30rem' }}
            >
              <BoxWithShape bg="white" borderTopRadius="8xl" w="full ">
                <QrDetails
                  qrSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                  ticketName="Maple Leafs vs New York Islanders"
                  onClick={handleDownloadQr}
                />
              </BoxWithShape>
              <Flex
                align="center"
                bg="gray.50"
                borderBottomRadius="8xl"
                flexDir="column"
                px="6"
                py="8"
              >
                <Text
                  color="gray.800"
                  fontSize="lg"
                  fontWeight="500"
                  lineHeight="28px"
                  mb="5"
                  textAlign="center"
                >
                  Attendance gifts
                </Text>

                {isNftGif ? (
                  <NftGift
                    giftName="Vaxxed Doggos POAP"
                    imageSrc="https://vaxxeddoggos.com/assets/doggos/1042.png"
                  />
                ) : (
                  <TokenGift
                    tokenList={[
                      { coin: 'ETH', value: 1.2 },
                      { coin: 'HERE', value: 13.8 },
                      { coin: 'NEAR', value: 923.7 },
                    ]}
                  />
                )}

                <Text
                  color="gray.600"
                  fontSize={{ base: 'sm', md: 'base' }}
                  lineHeight={{ base: '20px', md: '24px' }}
                  mb="6"
                  textAlign="center"
                >
                  Return here after checking into the event to claim.
                </Text>
              </Flex>
            </IconBox>
          </VStack>
        </Center>
      </ClaimFormContextProvider>
    </Box>
  );
};

export default YourTicketPage;
