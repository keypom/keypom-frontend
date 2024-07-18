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
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import { accountExists, getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';

const sizeConfig = {
  img: {
    base: { borderRadius: '8px', h: '80px' },
    md: { borderRadius: '12px', h: '100px' },
    lg: { borderRadius: '16px', h: '120px' },
  },
  font: {
    base: {
      h1: '24px',
      h2: '20px',
      h3: '16px',
      button: '16px',
    },
    md: {
      h1: '28px',
      h2: '22px',
      h3: '18px',
      button: '18px',
    },
    lg: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      button: '20px',
    },
  },
};

const getFontSize = (isLargerThan768, isLargerThan1024) => {
  if (isLargerThan1024) return sizeConfig.font.lg;
  if (isLargerThan768) return sizeConfig.font.md;
  return sizeConfig.font.base;
};

const getImgSize = (isLargerThan768, isLargerThan1024) => {
  if (isLargerThan1024) return sizeConfig.img.lg;
  if (isLargerThan768) return sizeConfig.img.md;
  return sizeConfig.img.base;
};

interface WelcomePageProps {
  eventInfo: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  dropInfo?: EventDrop;
  ticker: string;
  tokensToClaim: string;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  factoryAccount: string;
  secretKey: string;
}

const accountAddressPatternNoSubaccount = /^([a-z\d]+[-_])*[a-z\d]+$/;

export default function WelcomePage({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  isLoading,
  factoryAccount,
  eventId,
  funderId,
  ticker,
  tokensToClaim,
  secretKey,
}: WelcomePageProps) {
  const [username, setUsername] = useState<string>('');
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const toast = useToast();

  const [isLargerThan768] = useMediaQuery('(min-height: 768px)');
  const [isLargerThan1024] = useMediaQuery('(min-height: 1024px)');

  const fontSize = getFontSize(isLargerThan768, isLargerThan1024);
  const imgSize = getImgSize(isLargerThan768, isLargerThan1024);

  const handleChangeUsername = (event) => {
    const userInput = event.target.value.toLowerCase();

    if (userInput.length !== 0) {
      const isValid = accountAddressPatternNoSubaccount.test(userInput);
      setIsValidUsername(isValid);
    } else {
      setIsValidUsername(true);
    }

    setUsername(userInput);
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
    try {
      const accountId = `${username}.${factoryAccount}`;
      console.log('Checking username', accountId);
      const doesExist = await accountExists(accountId);
      console.log('Does exist', doesExist);
      if (doesExist) {
        setIsValidUsername(false);
        return false;
      }

      return true;
    } catch (e) {
      setIsValidUsername(false);
      return false;
    }
  };

  return (
    <Flex
      backgroundImage={`assets/demos/consensus/background.png`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      direction="column"
      h="100vh"
      width="100vw"
    >
      <Box flex="1" overflowY="auto" pt="3">
        <Center maxH="100vh">
          <VStack
            gap={{ base: '16px', md: '24px', lg: '32px' }}
            h="100%"
            overflowY="auto"
            pt="10"
            spacing="4"
            w={{ base: '90vw', md: '90%', lg: '80%' }}
          >
            <IconBox
              bg={'border.consensus'}
              h="full"
              icon={
                <Skeleton isLoaded={!isLoading}>
                  <Image
                    borderRadius="full"
                    height={{ base: '14', md: '12' }}
                    src={`/assets/demos/consensus/consensus_logo.png`}
                    width={{ base: '20', md: '12' }}
                  />
                </Skeleton>
              }
              iconBg={'event.iconBg'}
              iconBorder={'event.iconBorder'}
              minW={{ base: '90vw', md: '345px' }}
              p="0"
              pb="0"
              w="full"
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
                      px="6"
                    >
                      <Text
                        color='event.h1'
                        fontFamily="heading"
                        fontSize="2xl"
                        fontWeight="600"
                        textAlign="center"
                      >
                        Welcome
                      </Text>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="400"
                        mb="5"
                        textAlign="center"
                      >
                        To get started, enter a username.
                      </Text>
                      <FormControl isInvalid={!isValidUsername} mb="5">
                        <Input
                          backgroundColor="white"
                          border="1px solid"
                          borderColor={!isValidUsername ? 'red.500' : 'event.h1'}
                          borderRadius="12px"
                          color="black"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
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
                        color="event.h3"
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="400"
                        mb="3"
                        textAlign="center"
                      >
                        Your ticket comes with{' '}
                        <Text
                          as="span"
                          color="black"
                          fontWeight="400"
                          size={{ base: 'lg', md: 'xl' }}
                        >
                          {tokensToClaim} ${ticker}
                        </Text>
                      </Text>
                      <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                        <Image
                          alt={`Event image for ${eventInfo?.name}`}
                          borderRadius={imgSize.borderRadius}
                          height={imgSize.h}
                          mb="2"
                          objectFit="contain"
                          src={`/assets/demos/consensus/${ticketInfo?.media}`}
                        />
                      </Skeleton>
                      <Heading
                        color="black"
                        fontFamily="title"
                        fontSize={fontSize.h1}
                        textAlign="center"
                      >
                        {ticketInfo?.title}
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
                    color='event.h1'
                    fontFamily="heading"
                    fontSize={fontSize.h1}
                    fontWeight="600"
                    textAlign="center"
                  >
                    ${ticker} Details
                  </Text>
                  {/* Start of the grid for Spork Details */}
                  <Grid
                    gap={6} // Space between grid items
                    py={4} // Padding on the top and bottom
                    templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                    width="full" // Full width of the parent container
                  >
                    {/* Left column for earning methods */}
                    <Box>
                      <Text
                        color="event.h2"
                        fontFamily="heading"
                        fontSize={fontSize.h2}
                        fontWeight="500"
                        mb={0}
                        textAlign="left"
                      >
                        Earn By:
                      </Text>
                      <VStack align="stretch" spacing={1} textAlign="left">
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Attending Talks
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Visiting Booths
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Scavenger Hunts
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Quizzes
                        </Text>
                      </VStack>
                    </Box>

                    {/* Right column for spending methods */}
                    <Box>
                      <Text
                        color="event.h2"
                        fontFamily="heading"
                        fontSize={fontSize.h2}
                        fontWeight="400"
                        mb={0}
                        textAlign="right"
                      >
                        Spend On:
                      </Text>
                      <VStack align="stretch" spacing={1} textAlign="right">
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Food
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Merch
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          Raffles
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize={fontSize.h3}
                          fontWeight="400"
                        >
                          NFTs
                        </Text>
                      </VStack>
                    </Box>
                  </Grid>
                  <Button
                    backgroundColor="event.button.primary.bg"
                    color="event.button.primary.color"
                    fontFamily="heading"
                    fontSize={fontSize.button}
                    fontWeight="500"
                    h="48px"
                    isDisabled={!isValidUsername}
                    isLoading={isClaiming}
                    sx={{
                      "_hover": {
                          "backgroundColor": "event.button.primary.hover"
                      }
                  }}
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
      </Box>
    </Flex>
  );
}
