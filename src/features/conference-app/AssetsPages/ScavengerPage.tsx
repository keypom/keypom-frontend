import { useEffect, useState } from 'react';
import {
  Box,
  Tooltip,
  Center,
  Flex,
  Heading,
  Skeleton,
  Text,
  VStack,
  SimpleGrid,
  Divider,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import keypomInstance from '@/lib/keypom';
import { ScavengerCard } from '@/components/ScavengerHunt';
import { BoxWithShape } from '@/components/BoxWithShape';
import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BackIcon } from '@/components/BackIcon';

interface ScavengerHunt {
  id: string;
  name: string;
  image: string;
  found: string[];
  scavenger_ids: string[];
}

const ScavengerHuntsPage: React.FC = () => {
  const { accountId, eventInfo, dropInfo, isLoading, onSelectTab, factoryAccount } =
    useConferenceContext();
  const [scavengerHunts, setScavengerHunts] = useState<ScavengerHunt[]>([]);

  useEffect(() => {
    if (!accountId) return;

    const getScavengerHunts = async () => {
      const scavs: ScavengerHunt[] = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_scavengers_for_account',
        args: { account_id: accountId },
      });
      setScavengerHunts(scavs);
    };

    getScavengerHunts();
  }, [accountId, dropInfo]);

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  const liveScavengers = scavengerHunts.filter((scav) => scav.found.length > 0);
  const completedScavengers = scavengerHunts.filter(
    (scav) => scav.found.length >= scav.scavenger_ids.length,
  );
  const notFoundScavengers = scavengerHunts.filter((scav) => scav.found.length === 0);

  const progressValue =
    scavengerHunts.length > 0 ? (completedScavengers.length / scavengerHunts.length) * 100 : 0;

  return (
    <Center h="78vh">
      <VStack
        gap={{ base: '16px', md: '24px', lg: '32px' }}
        overflowY="auto"
        pt="14"
        spacing="4"
        w={{ base: '90vw', md: '90%', lg: '80%' }}
      >
        <IconBox
          bg={'border.consensus'}
          icon={
            <Skeleton isLoaded={!isLoading}>
                <CircularProgress
                  color="event.h1"
                  size="60px"
                  thickness="12px"
                  trackColor="gray.200"
                  value={progressValue}
                >
                  <CircularProgressLabel
                    color="event.h1"
                    fontFamily="heading"
                    fontSize="lg"
                    fontWeight="500"
                  >
                    {Math.round(progressValue)}%
                  </CircularProgressLabel>
                </CircularProgress>
            </Skeleton>
          }
          iconBg={'event.iconBg'}
          iconBorder={'event.iconBorder'}
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="full"
        >
          <Box h="calc(78vh - 10vh)" overflowY="auto">
            <BackIcon eventInfo={eventInfo} onSelectTab={onSelectTab} />
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '3', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '6', md: '8' }}
                >
                  <Tooltip
                    label={`You have completed ${completedScavengers.length} of ${scavengerHunts.length} scavenger hunts`}
                  >
                    <Text
                      color="event.h3"
                      fontFamily="heading"
                      fontSize="sm"
                      fontWeight="400"
                      textAlign="center"
                    >
                      {completedScavengers.length} of {scavengerHunts.length} Completed
                    </Text>
                  </Tooltip>
                  <Divider my="2" />
                  <Box flex="1" textAlign="left" width="100%">
                    <Heading
                      color="event.h1"
                      fontFamily="heading"
                      fontSize="2xl"
                      fontWeight="600"
                      textAlign="center"
                    >
                      Active ({liveScavengers.length})
                    </Heading>
                  </Box>
                  {liveScavengers.length > 0 ? (
                    <SimpleGrid
                      columns={{ base: 2, md: 3, lg: 4 }}
                      justifyContent="center"
                      justifyItems="center"
                      px={{ base: 2, md: 4, lg: 6 }}
                      spacing={4}
                      width="100%"
                    >
                      {liveScavengers.map((scavenger) => (
                        <ScavengerCard key={scavenger.id} scavenger={scavenger} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center pt="0">
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="400"
                        textAlign="center"
                      >
                        No active scavenger hunts found.
                      </Text>
                    </Center>
                  )}
                </Flex>
              )}
            </BoxWithShape>
            <Flex flexDir="column" px="6" py="4" w="full">
              <Box flex="1" textAlign="left">
                <Heading
                  color="event.h1"
                  fontFamily="heading"
                  fontSize="2xl"
                  fontWeight="600"
                  textAlign="center"
                >
                  Not Started ({notFoundScavengers.length})
                </Heading>
              </Box>
              <SimpleGrid
                columns={{ base: 2, md: 3, lg: 4 }}
                justifyContent="center"
                justifyItems="center"
                px={{ base: 2, md: 4, lg: 6 }}
                spacing={4}
                width="100%"
              >
                {notFoundScavengers.map((scavenger) => (
                  <ScavengerCard key={scavenger.id} scavenger={scavenger} />
                ))}
              </SimpleGrid>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default ScavengerHuntsPage;
