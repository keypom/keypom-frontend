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
import eventHelperInstance, { ExtClaimedDrop, ExtDropData } from '@/lib/event';
import { ScavengerCard } from '@/components/ScavengerHunt';
import { BoxWithShape } from '@/components/BoxWithShape';
import { IconBox } from '@/components/IconBox';
import { BackIcon } from '@/components/BackIcon';
import { TOKEN_FACTORY_CONTRACT } from '@/constants/common';

interface ScavengerHunt {
  id: string;
  name: string;
  image: string;
  found: string[];
  scavenger_ids: string[];
}

const ScavengerHuntsPage: React.FC = () => {
  const { accountId, eventInfo, isLoading, onSelectTab } = useConferenceContext();
  const [scavengerHunts, setScavengerHunts] = useState<ScavengerHunt[]>([]);
  const [isScavengerLoading, setIsScavengerLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    const getScavengerHunts = async () => {
      try {
        setIsScavengerLoading(true);

        // Fetch owned and unowned scavenger hunts
        const ownedDrops: ExtClaimedDrop[] = await eventHelperInstance.viewCall({
          contractId: TOKEN_FACTORY_CONTRACT,
          methodName: 'get_claimed_scavengers_for_account',
          args: { account_id: accountId },
        });

        const unownedDrops: ExtDropData[] = await eventHelperInstance.getCachedScavengerHunts();

        // Create a map of owned drops by drop_id
        const ownedDropMap = new Map<string, ExtClaimedDrop>(
          ownedDrops.map((drop) => [drop.drop_id, drop])
        );

        // Combine owned and unowned scavenger hunts
        const combinedScavengerHunts = unownedDrops.map((unownedDrop): ScavengerHunt => {
          const ownedDrop = ownedDropMap.get(unownedDrop.drop_id);
          const foundScavengerIds = ownedDrop?.found_scavenger_ids || [];
          const scavengerIds = unownedDrop.scavenger_hunt || [];

          return {
            id: unownedDrop.drop_id,
            name: unownedDrop.name,
            image: unownedDrop.image,
            found: foundScavengerIds,
            scavenger_ids: scavengerIds,
          };
        });

        setScavengerHunts(combinedScavengerHunts);
      } catch (error) {
        console.error('Error fetching scavenger hunts:', error);
      } finally {
        setIsScavengerLoading(false);
      }
    };

    getScavengerHunts();
  }, [accountId]);

  if (isLoading || isScavengerLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  const completedScavengers = scavengerHunts.filter(
    (scav) => scav.found.length > 0 && scav.found.length >= scav.scavenger_ids.length
  );
  const liveScavengers = scavengerHunts.filter(
    (scav) => scav.found.length > 0 && scav.found.length < scav.scavenger_ids.length
  );
  const notFoundScavengers = scavengerHunts.filter(
    (scav) => scav.found.length === 0
  );

  const progressValue =
    scavengerHunts.length > 0
      ? (completedScavengers.length / scavengerHunts.length) * 100
      : 0;

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
          bg="border.box"
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
                <>
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
                  <Flex flexDir="column" px="6" py="4" w="full">
                    <Box flex="1" textAlign="left">
                      <Heading
                        color="event.h1"
                        fontFamily="heading"
                        fontSize="2xl"
                        fontWeight="600"
                        textAlign="center"
                      >
                        Not Found ({notFoundScavengers.length})
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
                  {completedScavengers.length > 0 && (
                    <Flex flexDir="column" px="6" py="4" w="full">
                      <Box flex="1" textAlign="left">
                        <Heading
                          color="event.h1"
                          fontFamily="heading"
                          fontSize="2xl"
                          fontWeight="600"
                          textAlign="center"
                        >
                          Completed ({completedScavengers.length})
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
                        {completedScavengers.map((scavenger) => (
                          <ScavengerCard key={scavenger.id} scavenger={scavenger} />
                        ))}
                      </SimpleGrid>
                    </Flex>
                  )}
                </>
              )}
            </BoxWithShape>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default ScavengerHuntsPage;