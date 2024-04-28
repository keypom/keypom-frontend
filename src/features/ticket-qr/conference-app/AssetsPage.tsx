import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
  Progress,
  SimpleGrid,
  Spinner,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { CheckIcon, LockIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import { type EventDrop, type FunderEventMetadata } from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';

export interface ScavengerHunt {
  id: string;
  name: string;
  imageUrl: string;
  found: number;
  needed: number;
}

interface NFTData {
  nft: {
    image: string;
    name: string;
  };
  owned: boolean;
}

interface AssetsPageProps {
  accountId: string;
  dropInfo?: EventDrop;
  eventInfo?: FunderEventMetadata;
  isLoading: boolean;
}

const NFTCard = ({ nft, isOwned }) => {
  const cardStyle = {
    position: 'relative',
    w: '100%',
    h: '220px',
    p: '4',
    bg: isOwned ? 'gray.50' : 'gray.100', // Dull background for unowned
    boxShadow: isOwned ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : 'none', // Shadow for owned
    border: isOwned ? '2px solid' : 'none',
    borderColor: isOwned ? 'green.200' : 'none', // Vibrant border for owned
    borderRadius: 'md',
  };

  const lockIconStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'gray.500',
    w: '24px',
    h: '24px',
  };

  const imageContainerStyle = {
    position: 'relative',
    w: '100%', // Full width of the card
    h: '130px', // Fixed height for the image container
    mb: '2', // Margin bottom
  };

  return (
    <Box {...cardStyle}>
      <Flex {...imageContainerStyle}>
        <Image
          alt={nft.name}
          borderRadius="md"
          boxSize="full" // Use 'full' instead of specific pixel size for responsiveness
          filter={isOwned ? 'none' : 'blur(4px)'}
          objectFit="cover"
          src={`${CLOUDFLARE_IPFS}/${nft.image}`}
        />
        {!isOwned && <LockIcon {...lockIconStyle} />}
      </Flex>
      <Text
        bottom="2"
        color={isOwned ? 'black' : 'gray.500'}
        fontSize="sm"
        fontWeight="bold"
        textAlign="center"
      >
        {nft.name}
      </Text>
      {isOwned && <CheckIcon color="green.500" position="absolute" right="2" top="2" />}
      {isOwned && (
        <Badge borderRadius="4" colorScheme="blue" left="2" position="absolute" size="sm" top="2">
          Owned
        </Badge>
      )}
    </Box>
  );
};

const ScavengerCard = ({ scavenger }) => (
  <Box
    bg="white"
    borderRadius="md" // Smaller border radius for a "stamp" look
    boxShadow="md"
    maxW="120px" // Smaller maximum width
    p={2} // Less padding for a tighter card
  >
    <VStack align="stretch" spacing={2}>
      <Center>
        <Image
          alt={scavenger.name}
          borderRadius="md"
          boxSize="60px" // Smaller image size
          objectFit="contain"
          src={scavenger.imageUrl}
        />
      </Center>
      <VStack align="stretch" spacing={1}>
        <Text fontSize="xs" fontWeight="bold">
          {scavenger.name}
        </Text>
        <Progress hasStripe size="xs" value={(scavenger.found / scavenger.needed) * 100} />
        <Text fontSize="xs" p={1}>
          Found: {scavenger.found}/{scavenger.needed}
        </Text>
      </VStack>
    </VStack>
  </Box>
);
// Update the CollapsibleSection to accept a list of scavenger hunts and render them inside a Flex container
const CollapsibleSection = ({ title, itemList, index, emptyMessage }) => (
  <Accordion allowMultiple allowToggle defaultIndex={[0]} maxW="345px" w="100%">
    <AccordionItem border="none">
      <h2>
        <AccordionButton
          _expanded={{ bg: 'transparent', color: 'black' }} // Remove the blue background and white text on expanded
          _focus={{ boxShadow: 'none' }} // Remove focus styles
          _hover={{ bg: 'transparent' }} // Remove hover styles
        >
          <Box flex="1" textAlign="left">
            <Text
              color="#844AFF"
              fontFamily="denverBody"
              fontWeight="600"
              size={{ base: '2xl', md: '2xl' }}
            >
              {title}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} pos="relative">
        <Box
          className="hide-scrollbar"
          maxW="full" // Set maximum width to full to contain the flex box
          overflowX="auto"
          pb={3}
        >
          <Flex direction="row" gap="4">
            {itemList.length > 0 ? (
              itemList.map((item) => (
                <Box key={item.id} flex="none">
                  {' '}
                  {/* Flex "none" ensures it doesn't grow or shrink */}
                  <ScavengerCard scavenger={item} />
                </Box>
              ))
            ) : (
              // If there are no NFTs, show a message
              <Text>{emptyMessage}</Text>
            )}
          </Flex>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

const AssetsPage = ({ dropInfo, eventInfo, accountId, isLoading }: AssetsPageProps) => {
  const [liveScavengers, setLiveScavengers] = useState<ScavengerHunt[]>([]);
  const [nfts, setNFTs] = useState<NFTData[]>([]);
  const [showUnowned, setShowUnowned] = useState(true); // State to show/hide unowned NFTs

  useEffect(() => {
    if (accountId.length === 0) return;

    const getScavengerHunts = async () => {
      const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
      const scavs: Record<string, string[]> = await keypomInstance.viewCall({
        contractId: factoryAccount, // Replace with actual factory account ID
        methodName: 'get_scavengers_for_account',
        args: { account_id: accountId }, // Use accountId directly
      });

      // Convert each entry into a promise to fetch the additional data
      const scavengerHuntPromises = Object.entries(scavs).map(async ([id, found]) => {
        const scavDropInfo = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'get_drop_information',
          args: { drop_id: id },
        });

        return {
          id,
          name: scavDropInfo.name, // Assuming these fields are returned correctly
          imageUrl: `${CLOUDFLARE_IPFS}/${scavDropInfo.image as string}`,
          found: found.length,
          needed: scavDropInfo.scavenger_ids.length,
        };
      });

      // Resolve all promises and set the state
      Promise.all(scavengerHuntPromises)
        .then((hunts) => {
          setLiveScavengers(hunts);
        })
        .catch((error) => {
          console.error('Error fetching scavenger hunts:', error);
          // Handle the error state appropriately here
        });
    };

    getScavengerHunts();
  }, [accountId]); // Dependencies must include everything that's used within the effect and might change

  useEffect(() => {
    if (accountId.length === 0) return;

    const getNFTs = async () => {
      const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
      const nftDrops = await keypomInstance.viewCall({
        contractId: factoryAccount, // Replace with actual factory account ID
        methodName: 'get_nfts_for_account',
        args: { account_id: accountId }, // Use accountId directly
      });
      console.log('NFT Drops', nftDrops);

      // Assuming nftDrops is an array of objects with an is_owned property
      // Sort the array so that owned NFTs come first
      let sortedNFTDrops = nftDrops.sort((a, b) => {
        return b.is_owned - a.is_owned; // This will sort owned NFTs to the beginning
      });

      if (!showUnowned) {
        sortedNFTDrops = sortedNFTDrops.filter((nft) => nft.is_owned);
      }

      const parsedNFTs = sortedNFTDrops.map((nftData) => {
        return {
          nft: nftData.nft,
          owned: nftData.is_owned,
        };
      });

      setNFTs(parsedNFTs);
    };

    getNFTs();
  }, [accountId, showUnowned]);

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  return (
    <Center>
      <VStack
        gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}
        maxW="1200px"
        p={4}
        pb="96px"
        width="full"
      >
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
                  ASSETS
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
          maxW="345px"
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="90vh"
        >
          <Box h="full" overflowY="auto">
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
                  {/* Collapsible section for Scavenger Hunts */}
                  <CollapsibleSection
                    emptyMessage="You have no active scavenger hunts."
                    index={0}
                    itemList={liveScavengers}
                    title={`Scavenger Hunts`}
                  />
                </Flex>
              )}
            </BoxWithShape>
            <Flex align="center" bg="gray.50" borderRadius="8xl" direction="column" p="6">
              <Box
                mb="2" // Margin bottom to separate from the toggle
                textAlign="center"
                w="full" // Making the heading take the full width
              >
                <Text
                  color="#844AFF"
                  fontFamily="denverBody"
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight="600"
                >
                  Unlockables
                </Text>
              </Box>
              <HStack justifyContent="center" mb="2" w="full">
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500">
                  Show Unowned
                </Text>
                <ToggleSwitch
                  handleToggle={() => {
                    setShowUnowned(!showUnowned);
                  }}
                  toggle={showUnowned}
                />
              </HStack>
              {isLoading ? (
                <Spinner size="xl" />
              ) : nfts.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} mt="4" spacing={4} w="full">
                  {nfts.map((nft) => (
                    <NFTCard key={nft.nft.name} isOwned={nft.owned} nft={nft.nft} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500" mt="4">
                  You haven't received any NFTs yet.
                </Text>
              )}
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default AssetsPage;
