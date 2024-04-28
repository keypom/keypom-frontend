import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Heading,
  Image,
  Input,
  Skeleton,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { accountExists, getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';

interface WelcomePageProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  dropInfo?: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  secretKey: string;
}

export default function WelcomePage({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  isLoading,
  eventId,
  funderId,
  secretKey,
}: WelcomePageProps) {
  const [username, setUsername] = useState<string>('');
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
  const toast = useToast();

  const handleChangeUsername = (event) => {
    setIsValidUsername(true);
    const { value } = event.target;
    setUsername(value);
  };

  const handleBeginJourney = async () => {
    const isAvailable = await checkUsernameAvailable();
    if (!isAvailable) {
      setIsValidUsername(false);
      return;
    }

    const accountId = `${username}.${factoryAccount}`;
    try {
      setIsClaiming(true);
      await keypomInstance.claimEventTicket(
        secretKey,
        {
          new_account_id: accountId,
          new_public_key: getPubFromSecret(secretKey),
        },
        true,
      );
      setIsClaiming(false);
      window.location.reload();
    } catch (e) {
      setIsClaiming(false);
      toast({
        title: 'Error claiming ticket',
        description: 'Please contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(e);
    }
  };

  const checkUsernameAvailable = async () => {
    if (!username) {
      return false;
    }
    const accountId = `${username}.${factoryAccount}`;
    console.log('Checking username', accountId);
    const doesExist = await accountExists(accountId);
    console.log('Does exist', doesExist);
    if (doesExist) {
      setIsValidUsername(false);
      return false;
    }
    return true;
  };

  return (
    <VStack
      backgroundImage={
        eventInfo?.qrPage?.background && `${CLOUDFLARE_IPFS}/${eventInfo.qrPage.background}`
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="2"
      width="100vw"
    >
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Skeleton fadeDuration={1} isLoaded={!isLoading}>
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="500"
              paddingBottom="0"
              textAlign="center"
            >
              {isLoading ? (
                'Loading ticket...'
              ) : (
                <VStack>
                  <Heading
                    color={eventInfo?.qrPage?.title?.color}
                    fontFamily={eventInfo?.qrPage?.title?.fontFamily}
                    fontSize={{ base: '6xl', md: '8xl' }}
                    fontWeight="500"
                    textAlign="center"
                  >
                    Welcome
                  </Heading>
                </VStack>
              )}
            </Heading>
          </Skeleton>

          <IconBox
            bg={eventInfo?.qrPage?.content?.border || 'border.box'}
            icon={
              <Skeleton isLoaded={!isLoading}>
                {eventInfo?.qrPage?.boxIcon?.image ? (
                  <Image
                    height={{ base: '10', md: '12' }}
                    src={`${CLOUDFLARE_IPFS}/${eventInfo.qrPage.boxIcon.image}`}
                    width={{ base: '10', md: '12' }}
                  />
                ) : (
                  <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
                )}
              </Skeleton>
            }
            iconBg={eventInfo?.qrPage?.boxIcon?.bg || 'blue.100'}
            iconBorder={eventInfo?.qrPage?.boxIcon?.border || 'border.round'}
            maxW={{ base: '345px', md: '30rem' }}
            minW={{ base: '90vw', md: '345px' }}
            p="0"
            pb="0"
            w="90vh"
          >
            <Box h="full">
              <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
                {isLoading ? (
                  <Skeleton height="200px" width="full" />
                ) : (
                  <Flex
                    align="center"
                    flexDir="column"
                    p={{ base: '3', md: '8' }}
                    pt={{ base: '10', md: '16' }}
                  >
                    <Text
                      color="#844AFF"
                      fontFamily="denverBody"
                      fontWeight="600"
                      size={{ base: '2xl', md: '2xl' }}
                      textAlign="center"
                    >
                      ETH Denver 2025
                    </Text>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontWeight="400"
                      mb="5"
                      size={{ base: 'md', md: 'lg' }}
                      textAlign="center"
                    >
                      To get started, enter a username.
                    </Text>
                    <FormControl isInvalid={!isValidUsername} mb="5">
                      <Input
                        backgroundColor="white"
                        border="1px solid"
                        borderColor={!isValidUsername ? 'red.500' : '#844AFF'}
                        borderRadius="12px"
                        color="black"
                        fontFamily="denverBody"
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="400"
                        height={{ base: '38px', md: '48px' }}
                        id="username"
                        placeholder="Username"
                        px="6"
                        sx={{
                          '::placeholder': {
                            color: 'black', // Placeholder text color
                          },
                        }}
                        value={username}
                        onBlur={checkUsernameAvailable}
                        onChange={handleChangeUsername}
                      />
                      <FormErrorMessage>Username is invalid or already taken.</FormErrorMessage>
                    </FormControl>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontWeight="400"
                      mb="3"
                      size={{ base: 'lg', md: 'xl' }}
                      textAlign="center"
                    >
                      Your ticket comes with{' '}
                      <Text
                        as="span"
                        color="black"
                        fontWeight="400"
                        size={{ base: 'lg', md: 'xl' }}
                      >
                        250 $PORK
                      </Text>
                    </Text>
                    <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                      <Image
                        alt={`Event image for ${eventInfo?.name}`}
                        borderRadius="12px"
                        height="140px"
                        mb="2"
                        objectFit="contain"
                        src={`${CLOUDFLARE_IPFS}/${ticketInfo?.media}`}
                      />
                    </Skeleton>
                    <Heading
                      color="black"
                      fontFamily={eventInfo?.qrPage?.title?.fontFamily}
                      fontSize={{ base: '4xl', md: '4xl' }}
                      fontWeight="500"
                      textAlign="center"
                    >
                      SPORKWHALE VIP
                    </Heading>
                  </Flex>
                )}
              </BoxWithShape>
              <Flex
                align="center"
                bg="gray.50"
                borderBottomRadius="8xl"
                flexDir="column"
                pb="6"
                pt="2"
                px="6"
              >
                <Text
                  color="#844AFF"
                  fontFamily="denverBody"
                  fontWeight="600"
                  size={{ base: 'xl', md: '2xl' }}
                  textAlign="center"
                >
                  $PORK Details
                </Text>
                {/* Start of the grid for Spork Details */}
                <Grid
                  gap={6} // Space between grid items
                  py={2} // Padding on the top and bottom
                  templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                  width="full" // Full width of the parent container
                >
                  {/* Left column for earning methods */}
                  <Box>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontSize="lg"
                      fontWeight="500"
                      mb={0}
                      textAlign="left"
                    >
                      Earn By:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="left">
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Attending Talks
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Visiting Booths
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Scavenger Hunts
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Sponsor Quizzes
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Airdrops
                      </Text>
                    </VStack>
                  </Box>

                  {/* Right column for spending methods */}
                  <Box>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontSize="lg"
                      fontWeight="500"
                      mb={0}
                      textAlign="right"
                    >
                      Spend On:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="right">
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Food
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Merch
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Raffles
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        NFTs
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Discounts
                      </Text>
                    </VStack>
                  </Box>
                </Grid>
                <Button
                  backgroundColor={eventInfo?.qrPage?.content?.sellButton?.bg}
                  color={eventInfo?.qrPage?.content?.sellButton?.color}
                  fontFamily={eventInfo?.qrPage?.content?.sellButton?.fontFamily}
                  fontSize={eventInfo?.qrPage?.content?.sellButton?.fontSize}
                  fontWeight={eventInfo?.qrPage?.content?.sellButton?.fontWeight}
                  h={eventInfo?.qrPage?.content?.sellButton?.h}
                  isDisabled={!isValidUsername}
                  isLoading={isClaiming}
                  sx={eventInfo?.qrPage?.content?.sellButton?.sx}
                  variant="outline"
                  w="full"
                  onClick={handleBeginJourney}
                >
                  BEGIN JOURNEY
                </Button>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </VStack>
  );
}
