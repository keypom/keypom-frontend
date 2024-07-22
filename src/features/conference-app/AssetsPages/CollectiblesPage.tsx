import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { CheckIcon, LockIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import keypomInstance from '@/lib/keypom';
import { useConferenceContext } from '@/contexts/ConferenceContext';
import { BackIcon } from '@/components/BackIcon';

interface NFTData {
  nft: NFTMetadata;
  owned: boolean;
}

interface NFTMetadata {
  image: string;
  name: string;
}

interface NFTCardProps {
  nft: NFTMetadata;
  isOwned: boolean;
}

const CollectiblesPage: React.FC = () => {
  const { accountId, factoryAccount, eventInfo, dropInfo, isLoading, onSelectTab } =
    useConferenceContext();
  const [nfts, setNFTs] = useState<NFTData[]>([]);

  useEffect(() => {
    if (!accountId) return;

    const getNFTs = async () => {
      const nftDrops = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_nfts_for_account',
        args: { account_id: accountId },
      });

      const sortedNFTDrops = nftDrops.sort((a, b) => b.is_owned - a.is_owned);

      const parsedNFTs = sortedNFTDrops.map((nftData) => ({
        nft: nftData.nft,
        owned: nftData.is_owned,
      }));

      setNFTs(parsedNFTs);
    };

    getNFTs();
  }, [accountId, dropInfo]);

  const NFTCard: React.FC<NFTCardProps> = ({ nft, isOwned }: NFTCardProps) => {
    const cardStyle = {
      position: 'relative' as const,
      w: '100%',
      h: '220px',
      p: '4',
      bg: isOwned ? 'gray.50' : 'gray.100',
      boxShadow: isOwned ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      border: isOwned ? '2px solid' : 'none',
      borderColor: isOwned ? 'green.200' : 'none',
      borderRadius: 'md' as const,
    };

    const lockIconStyle = {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'gray.500',
      w: '24px',
      h: '24px',
    };

    const imageContainerStyle = {
      position: 'relative' as const,
      w: '100%',
      h: '130px',
      mb: '2',
    };

    return (
      <Box {...cardStyle}>
        <Flex {...imageContainerStyle}>
          <Image
            alt={nft.name}
            borderRadius="md"
            boxSize="full"
            filter={isOwned ? 'none' : 'blur(4px)'}
            objectFit="cover"
            src={`/assets/demos/consensus/${nft.image}`}
          />
          {!isOwned && <LockIcon {...lockIconStyle} />}
        </Flex>
        <Text
          color="event.h3"
          fontFamily="heading"
          fontSize="sm"
          fontWeight="400"
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

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  const ownedNFTs = nfts.filter((nft) => nft.owned);
  const unownedNFTs = nfts.filter((nft) => !nft.owned);
  const progressValue = nfts.length > 0 ? (ownedNFTs.length / nfts.length) * 100 : 0;

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
          bg='border.box'
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
                  h="full"
                  pb={{ base: '2', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <Tooltip label={`You have ${ownedNFTs.length} of ${nfts.length} collectibles`}>
                    <Text
                      color="event.h3"
                      fontFamily="heading"
                      fontSize="sm"
                      fontWeight="400"
                      textAlign="center"
                    >
                      {ownedNFTs.length} of {nfts.length} Found
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
                      Found ({ownedNFTs.length})
                    </Heading>
                  </Box>
                  {ownedNFTs.length > 0 ? (
                    <SimpleGrid
                      columns={{ base: 2, md: 3, lg: 4 }}
                      justifyContent="center"
                      justifyItems="center"
                      px={{ base: 2, md: 4, lg: 6 }}
                      spacing={4}
                      width="100%"
                    >
                      {ownedNFTs.map((nft) => (
                        <NFTCard key={nft.nft.name} isOwned={nft.owned} nft={nft.nft} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="400"
                        textAlign="center"
                      >
                        You haven't found any collectibles yet.
                      </Text>
                    </Center>
                  )}
                </Flex>
              )}
            </BoxWithShape>

            <Flex flexDir="column" justifyContent="space-between" px="6" py="4" w="full">
              <Box flex="1" textAlign="left">
                <Heading
                  color="event.h1"
                  fontFamily="heading"
                  fontSize="2xl"
                  fontWeight="600"
                  textAlign="center"
                >
                  Not Found ({unownedNFTs.length})
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
                {unownedNFTs.map((nft) => (
                  <NFTCard key={nft.nft.name} isOwned={nft.owned} nft={nft.nft} />
                ))}
              </SimpleGrid>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default CollectiblesPage;
